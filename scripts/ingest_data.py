from __future__ import annotations

import json
import shutil
import sqlite3
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
INPUT_ROOT = ROOT / "data" / "inputs"
VECTOR_INPUT_ROOT = INPUT_ROOT / "vectors"
RASTER_INPUT_ROOT = INPUT_ROOT / "rasters"
CONFIG_PATH = INPUT_ROOT / "catalog.json"
REPORT_ROOT = ROOT / "data" / "reports"

PROCESSED_ROOT = ROOT / "public" / "data" / "processed"
VECTOR_OUTPUT_ROOT = PROCESSED_ROOT / "vectors"
RASTER_OUTPUT_ROOT = PROCESSED_ROOT / "rasters"
CATALOG_OUTPUT_PATH = PROCESSED_ROOT / "catalog.json"
REPORT_OUTPUT_PATH = REPORT_ROOT / "ingestion-report.json"

VECTOR_EXTENSIONS = {".gpkg", ".geojson", ".json", ".fgb", ".pmtiles"}
RASTER_EXTENSIONS = {".tif", ".tiff", ".vrt", ".img", ".asc"}

DEFAULT_VECTOR_FEATURE_THRESHOLD = 15000
DEFAULT_VECTOR_SIZE_THRESHOLD_BYTES = 20_000_000
DEFAULT_VECTOR_LAYER_THRESHOLD = 3

OGR2OGR = shutil.which("ogr2ogr")
OGRINFO = shutil.which("ogrinfo")
GDAL_TRANSLATE = shutil.which("gdal_translate")
PMTILES_WRITE_AVAILABLE: bool | None = None


@dataclass
class LayerSummary:
    name: str
    geometry_type: str
    feature_count: int


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def relative_posix(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def slugify(value: str) -> str:
    safe = []
    for character in value.lower():
        if character.isalnum():
            safe.append(character)
        elif safe and safe[-1] != "-":
            safe.append("-")
    return "".join(safe).strip("-") or "dataset"


def ensure_dirs() -> None:
    for path in [
        INPUT_ROOT,
        VECTOR_INPUT_ROOT,
        RASTER_INPUT_ROOT,
        REPORT_ROOT,
        VECTOR_OUTPUT_ROOT,
        RASTER_OUTPUT_ROOT,
    ]:
        path.mkdir(parents=True, exist_ok=True)


def read_config() -> dict[str, Any]:
    if not CONFIG_PATH.exists():
        return {"defaults": {}, "datasets": {}}
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def run_command(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=True, capture_output=True, text=True)


def quote_identifier(value: str) -> str:
    return '"' + value.replace('"', '""') + '"'


def inspect_gpkg(path: Path) -> list[LayerSummary]:
    layers: list[LayerSummary] = []
    connection = sqlite3.connect(path)
    try:
        rows = connection.execute(
            """
            SELECT
              c.table_name,
              COALESCE(gc.geometry_type_name, 'Unknown') AS geometry_type
            FROM gpkg_contents AS c
            LEFT JOIN gpkg_geometry_columns AS gc
              ON c.table_name = gc.table_name
            WHERE c.data_type = 'features'
            ORDER BY c.table_name
            """
        ).fetchall()
        for table_name, geometry_type in rows:
            feature_count = connection.execute(
                f"SELECT COUNT(*) FROM {quote_identifier(table_name)}"
            ).fetchone()[0]
            layers.append(
                LayerSummary(
                    name=table_name,
                    geometry_type=geometry_type,
                    feature_count=int(feature_count),
                )
            )
    finally:
        connection.close()
    return layers


def inspect_vector(path: Path) -> list[LayerSummary]:
    if path.suffix.lower() == ".gpkg":
        return inspect_gpkg(path)

    return [
        LayerSummary(
            name=path.stem,
            geometry_type="Unknown",
            feature_count=0,
        )
    ]


def can_write_pmtiles() -> bool:
    global PMTILES_WRITE_AVAILABLE

    if PMTILES_WRITE_AVAILABLE is not None:
        return PMTILES_WRITE_AVAILABLE
    if not OGRINFO:
        PMTILES_WRITE_AVAILABLE = False
        return PMTILES_WRITE_AVAILABLE
    try:
        result = run_command([OGRINFO, "--formats"])
    except subprocess.CalledProcessError:
        PMTILES_WRITE_AVAILABLE = False
        return PMTILES_WRITE_AVAILABLE

    for line in result.stdout.splitlines():
        if line.strip().startswith("PMTiles"):
            PMTILES_WRITE_AVAILABLE = "(rw" in line
            return PMTILES_WRITE_AVAILABLE
    PMTILES_WRITE_AVAILABLE = False
    return PMTILES_WRITE_AVAILABLE


def dataset_override(config: dict[str, Any], path: Path) -> dict[str, Any]:
    datasets = config.get("datasets", {})
    return datasets.get(path.name, datasets.get(path.stem, {}))


def choose_vector_strategy(
    path: Path,
    layers: list[LayerSummary],
    defaults: dict[str, Any],
    override: dict[str, Any],
) -> dict[str, Any]:
    feature_threshold = int(
        override.get(
            "vectorFeatureThreshold",
            defaults.get("vectorFeatureThreshold", DEFAULT_VECTOR_FEATURE_THRESHOLD),
        )
    )
    size_threshold = int(
        override.get(
            "vectorSizeThresholdBytes",
            defaults.get("vectorSizeThresholdBytes", DEFAULT_VECTOR_SIZE_THRESHOLD_BYTES),
        )
    )
    layer_threshold = int(
        override.get(
            "vectorLayerThreshold",
            defaults.get("vectorLayerThreshold", DEFAULT_VECTOR_LAYER_THRESHOLD),
        )
    )

    total_features = sum(layer.feature_count for layer in layers)
    layer_count = len(layers)
    file_size = path.stat().st_size

    simple = (
        total_features <= feature_threshold
        and file_size <= size_threshold
        and layer_count <= layer_threshold
    )

    requested_format = override.get("forceVectorFormat")
    if requested_format:
        preferred = str(requested_format)
    else:
        preferred = "geojson" if simple else "pmtiles"

    actual = preferred
    fallback_reason = None

    if preferred == "pmtiles" and not can_write_pmtiles():
        actual = "geojson"
        fallback_reason = (
            "PMTiles writing is not available in the local toolchain. "
            "GeoJSON was produced as a fallback."
        )

    return {
        "preferredFormat": preferred,
        "actualFormat": actual,
        "totalFeatures": total_features,
        "layerCount": layer_count,
        "fileSizeBytes": file_size,
        "fallbackReason": fallback_reason,
    }


def export_geojson_layers(
    input_path: Path,
    output_dir: Path,
    layers: list[LayerSummary],
    override: dict[str, Any],
) -> list[str]:
    if not OGR2OGR:
        raise RuntimeError("ogr2ogr is required for vector ingestion but was not found in PATH.")

    output_dir.mkdir(parents=True, exist_ok=True)
    outputs: list[str] = []
    selected_layers = override.get("layers")

    for layer in layers:
        if selected_layers and layer.name not in selected_layers:
            continue
        layer_slug = slugify(layer.name)
        output_path = output_dir / f"{layer_slug}.geojson"
        command = [
            OGR2OGR or "ogr2ogr",
            "-overwrite",
            "-f",
            "GeoJSON",
            str(output_path),
            str(input_path),
        ]
        if input_path.suffix.lower() == ".gpkg":
            command.append(layer.name)
        command.extend(["-lco", "RFC7946=YES", "-t_srs", "EPSG:4326"])
        run_command(command)
        outputs.append(relative_posix(output_path))

    return outputs


def ingest_vector(path: Path, config: dict[str, Any]) -> dict[str, Any]:
    override = dataset_override(config, path)
    slug = slugify(str(override.get("slug", path.stem)))
    output_dir = VECTOR_OUTPUT_ROOT / slug
    layers = inspect_vector(path)
    strategy = choose_vector_strategy(path, layers, config.get("defaults", {}), override)

    if path.suffix.lower() == ".pmtiles":
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / path.name
        shutil.copy2(path, output_path)
        outputs = [relative_posix(output_path)]
        strategy["actualFormat"] = "pmtiles"
        strategy["preferredFormat"] = "pmtiles"
        strategy["fallbackReason"] = None
    elif path.suffix.lower() in {".geojson", ".json", ".fgb"}:
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / path.name
        shutil.copy2(path, output_path)
        outputs = [relative_posix(output_path)]
    else:
        outputs = export_geojson_layers(path, output_dir, layers, override)

    return {
        "kind": "vector",
        "input": relative_posix(path),
        "slug": slug,
        "sourceFormat": path.suffix.lower().lstrip("."),
        "preferredWebFormat": strategy["preferredFormat"],
        "actualWebFormat": strategy["actualFormat"],
        "fallbackReason": strategy["fallbackReason"],
        "fileSizeBytes": strategy["fileSizeBytes"],
        "layerCount": strategy["layerCount"],
        "totalFeatures": strategy["totalFeatures"],
        "layers": [
            {
                "name": layer.name,
                "geometryType": layer.geometry_type,
                "featureCount": layer.feature_count,
            }
            for layer in layers
        ],
        "outputs": outputs,
    }


def ingest_raster(path: Path, config: dict[str, Any]) -> dict[str, Any]:
    override = dataset_override(config, path)
    slug = slugify(str(override.get("slug", path.stem)))
    output_dir = RASTER_OUTPUT_ROOT / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    if GDAL_TRANSLATE:
        output_path = output_dir / f"{slug}.tif"
        run_command(
            [
                GDAL_TRANSLATE,
                "-of",
                "COG",
                "-co",
                "COMPRESS=DEFLATE",
                str(path),
                str(output_path),
            ]
        )
        actual_format = "cog"
        fallback_reason = None
        outputs = [relative_posix(output_path)]
    else:
        output_path = output_dir / path.name
        shutil.copy2(path, output_path)
        actual_format = "raw-copy"
        fallback_reason = (
            "Raster conversion tools are not available in the local PATH. "
            "The source raster was copied into processed outputs and cataloged for later conversion."
        )
        outputs = [relative_posix(output_path)]

    return {
        "kind": "raster",
        "input": relative_posix(path),
        "slug": slug,
        "sourceFormat": path.suffix.lower().lstrip("."),
        "preferredWebFormat": "cog",
        "actualWebFormat": actual_format,
        "fallbackReason": fallback_reason,
        "fileSizeBytes": path.stat().st_size,
        "outputs": outputs,
    }


def gather_inputs(folder: Path, extensions: set[str]) -> list[Path]:
    return sorted(
        [
            path
            for path in folder.rglob("*")
            if path.is_file() and path.suffix.lower() in extensions
        ]
    )


def main() -> None:
    ensure_dirs()
    config = read_config()
    vectors = gather_inputs(VECTOR_INPUT_ROOT, VECTOR_EXTENSIONS)
    rasters = gather_inputs(RASTER_INPUT_ROOT, RASTER_EXTENSIONS)

    vector_entries = [ingest_vector(path, config) for path in vectors]
    raster_entries = [ingest_raster(path, config) for path in rasters]

    catalog = {
        "generatedAt": utc_now(),
        "inputsRoot": relative_posix(INPUT_ROOT),
        "toolchain": {
            "ogr2ogr": bool(OGR2OGR),
            "ogrinfo": bool(OGRINFO),
            "gdalTranslate": bool(GDAL_TRANSLATE),
            "pmtilesWriteAvailable": can_write_pmtiles(),
        },
        "vectors": vector_entries,
        "rasters": raster_entries,
    }

    PROCESSED_ROOT.mkdir(parents=True, exist_ok=True)
    REPORT_ROOT.mkdir(parents=True, exist_ok=True)
    CATALOG_OUTPUT_PATH.write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    REPORT_OUTPUT_PATH.write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    print(
        "Ingestion complete. "
        f"Vectors: {len(vector_entries)}. Rasters: {len(raster_entries)}. "
        f"Catalog: {CATALOG_OUTPUT_PATH.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
