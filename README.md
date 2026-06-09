# Urban Science Portfolio Draft

This repository is a plain, code-readable working draft for a personal website focused on interactive maps and urban analytics. It uses `Next.js`, `TypeScript`, `MapLibre`, static data files, and `Recharts`.

## Included in this scaffold

- A gallery-first homepage with 27 reusable templates
- A flagship Japan zoning and land value project shell
- Config-driven page generation for templates and project pages
- Placeholder JSON datasets
- A lightweight local data-prep placeholder script
- Static export support for GitHub Pages-style deployment

## Recommended data approach

- Small vector layers: `GeoJSON`
- Larger vector layers: `PMTiles`
- Raster projects: web tiles or later `COG`-based workflows
- Time-series metadata: yearly JSON tables

## Suggested next steps

1. Run `npm run dev`
2. Replace placeholder data in `public/data/demo/`
3. Add real project-specific files under `public/data/raw/` and `public/data/processed/`
4. Extend `scripts/` with your local preprocessing commands
5. Build the static site with `npm run build` and deploy the generated `out/` folder if you use GitHub Pages

## Notes

- Basemap options currently include OpenStreetMap, Carto Positron, and an Esri satellite raster style.
- Transit overlays are included as a placeholder toggle so you can add your own layer later.
- Extent analytics use a manual action button rather than running continuously.
- Filter, time, synced-view, and extent-analysis state are wired through the shared template system.
- The current preprocessing layer is still lightweight: it prepares folders and placeholder manifests, but real `GeoPackage -> GeoJSON/PMTiles` and raster tiling steps still need local GIS tooling.
- The app is configured with static export in `next.config.js`, so all template and project routes are pre-rendered at build time.
- If you deploy to a GitHub Pages project subpath, build with `NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build`.
- `npm run lint`, `npm run typecheck`, and `npm run build` all pass on the current scaffold.
