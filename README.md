# Urban Science Portfolio Draft

This repository is a plain, code-readable working draft for a personal website focused on interactive maps and urban analytics. It uses `Next.js`, `TypeScript`, `MapLibre`, static data files, `Recharts`, and an explicit ingestion workflow rooted at `data/inputs/`.

## Included in this scaffold

- A clean homepage with deeper project, template, and docs sections one click away
- 27 reusable map and analysis templates
- A flagship Japan zoning and land value project shell
- Config-driven page generation for templates and project pages
- Placeholder JSON datasets
- A dataset ingestion pipeline for vector and raster inputs
- Static export support for GitHub Pages-style deployment

## Recommended data approach

- Small vector layers: `GeoJSON`
- Larger vector layers: `PMTiles`
- Raster projects: web tiles or later `COG`-based workflows
- Time-series metadata: yearly JSON tables

## Suggested next steps

1. Run `npm run dev`
2. Drop real datasets into `data/inputs/vectors/` or `data/inputs/rasters/`
3. Run `npm run ingest-data`
4. Point project pages at the generated files in `public/data/processed/`
5. Build the static site with `npm run build` and deploy the generated `out/` folder if you use GitHub Pages

## Notes

- Basemap options currently include OpenStreetMap, Carto Positron, and an Esri satellite raster style.
- Transit overlays are included as a placeholder toggle so you can add your own layer later.
- Extent analytics use a manual action button rather than running continuously.
- Filter, time, synced-view, and extent-analysis state are wired through the shared template system.
- Vector ingestion is real and uses local `ogr2ogr` tooling. Raster ingestion is also wired in, but final raster conversion depends on whether raster GDAL executables are available on the machine.
- The app is configured with static export in `next.config.js`, so all template and project routes are pre-rendered at build time.
- If you deploy to a GitHub Pages project subpath, build with `NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build`.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run ingest-data` are intended to be part of the normal maintenance workflow.
