# Data Inputs

This folder is the ingestion point for datasets used by the website.

## Structure

- `data/inputs/vectors/`
  Place GeoPackages and other vector sources here.
- `data/inputs/rasters/`
  Place GeoTIFFs and other raster sources here.
- `data/inputs/catalog.json`
  Optional overrides for slugs, layer selection, and format preferences.

## Workflow

1. Drop source files into `vectors/` or `rasters/`.
2. Windows `.lnk` shortcuts are also supported in `vectors/` and `rasters/`.
3. `public/data/inputs/` is also scanned so you can keep shortcut-based inputs there.
4. Run `npm run ingest-data`.
5. Review `public/data/processed/catalog.json`.
6. Point templates or project pages at the processed outputs you want to use.

## Notes

- Small vector datasets are exported as GeoJSON.
- Larger vector datasets prefer PMTiles, but the current local toolchain cannot write PMTiles directly, so large inputs will fall back to GeoJSON and record that fallback in the catalog.
- Rasters prefer COG output when `gdal_translate` is available. If it is not available, the source raster is copied into processed outputs and marked for later conversion.
