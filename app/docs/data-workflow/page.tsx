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
            The site is built around static files that you prepare locally, then upload with the app.
            Small vectors can ship as GeoJSON, larger vectors should move toward PMTiles, and raster
            projects should eventually use COGs or pregenerated raster tiles.
          </p>
        </div>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Recommended defaults</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>`GeoPackage {"->"} GeoJSON` for small demos and readable first passes.</div>
            <div>`GeoPackage {"->"} PMTiles` for bigger production-grade polygon or point layers.</div>
            <div>Raster preprocessing into web tiles later for land cover, population, or intensity surfaces.</div>
            <div>Year-based JSON tables for charts and time slider metadata.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Repo folders</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>`public/data/raw/` for files you drop in from your PC.</div>
            <div>`public/data/processed/` for converted map-ready outputs.</div>
            <div>`public/data/demo/` for lightweight placeholder data included with this scaffold.</div>
            <div>`scripts/` for local preprocessing helpers and examples.</div>
            <div>`out/` for the static export you can deploy to GitHub Pages after `npm run build`.</div>
          </div>
        </section>
      </section>
    </main>
  );
}
