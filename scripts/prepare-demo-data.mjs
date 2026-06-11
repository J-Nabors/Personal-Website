import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawDir = path.join(root, "data", "inputs");
const processedDir = path.join(root, "public", "data", "processed");
const manifestPath = path.join(processedDir, "manifest.json");

for (const dir of [rawDir, processedDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listFiles(directory, baseDirectory = directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return listFiles(fullPath, baseDirectory);
      }

      const stats = fs.statSync(fullPath);

      return {
        name: path.relative(baseDirectory, fullPath),
        bytes: stats.size,
        updatedAt: stats.mtime.toISOString(),
      };
    });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  message:
    "This helper prepares the data ingestion directories and writes a simple manifest of input and processed files. Replace it with geopackage, PMTiles, or raster processing scripts when your local GIS toolchain is ready.",
  inputFiles: listFiles(rawDir),
  processedFiles: listFiles(processedDir).filter((file) => file.name !== "manifest.json"),
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Prepared data directories and wrote ${path.relative(root, manifestPath)}.`);
