import { Header } from "@/components/site/Header";

export default function DataWorkflowPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="panel" style={{ padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div className="eyebrow">Data Workflow</div>
          <h1 style={{ margin: "12px 0 8px" }}>Static-file workflow for map-ready uploads</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 920 }}>
            The site is built around static files that you prepare locally, then ingest into the repo.
            The canonical ingestion point is `data/inputs/`, and processed artifacts are written into
            `public/data/processed/` so the website can use them directly. Windows `.lnk` shortcuts are
            supported, including shortcut-driven inputs stored in `public/data/inputs/`.
          </p>
        </div>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Recommended defaults</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>`GeoPackage {"->"} GeoJSON` for smaller or simpler vector data.</div>
            <div>`GeoPackage {"->"} PMTiles` as the preferred target for larger vector data when the local toolchain supports writing PMTiles.</div>
            <div>Rasters prefer COG-style output when `gdal_translate` is available, and otherwise stay cataloged as copied source rasters pending conversion.</div>
            <div>Year-based JSON tables for charts and time slider metadata.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Repo folders</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>`data/inputs/vectors/` for GeoPackages and other vector inputs.</div>
            <div>`data/inputs/rasters/` for raster inputs such as GeoTIFFs.</div>
            <div>`public/data/inputs/` as an additional intake folder for direct files or Windows shortcut links.</div>
            <div>`data/inputs/catalog.json` for ingestion overrides.</div>
            <div>`public/data/processed/` for generated map-ready outputs and catalogs.</div>
            <div>`public/data/demo/` for lightweight placeholder data included with this scaffold.</div>
            <div>`data/reports/` for machine-readable ingestion reports.</div>
            <div>`scripts/` for local preprocessing and ingestion helpers.</div>
            <div>`out/` for the static export you can deploy to GitHub Pages after `npm run build`.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Ingestion commands</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>Run `npm run ingest-data` after dropping datasets or `.lnk` shortcuts into `data/inputs/` or `public/data/inputs/`.</div>
            <div>Review `public/data/processed/catalog.json` to see output paths, complexity decisions, and toolchain fallbacks.</div>
            <div>The workflow currently uses local GDAL vector tools directly. Raster conversion is automatic only when raster conversion executables are available on the machine.</div>
          </div>
        </section>
      </section>
    </main>
  );
}
