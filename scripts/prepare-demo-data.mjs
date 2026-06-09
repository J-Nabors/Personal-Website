import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawDir = path.join(root, "public", "data", "raw");
const processedDir = path.join(root, "public", "data", "processed");
const manifestPath = path.join(processedDir, "manifest.json");

for (const dir of [rawDir, processedDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const fullPath = path.join(directory, entry.name);
      const stats = fs.statSync(fullPath);

      return {
        name: entry.name,
        bytes: stats.size,
        updatedAt: stats.mtime.toISOString(),
      };
    });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  message:
    "This helper prepares the static-data directories and writes a simple manifest of raw and processed files. Replace it with geopackage, PMTiles, or raster processing scripts when your local GIS toolchain is ready.",
  rawFiles: listFiles(rawDir),
  processedFiles: listFiles(processedDir).filter((file) => file.name !== "manifest.json"),
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Prepared data directories and wrote ${path.relative(root, manifestPath)}.`);
