import { Header } from "@/components/site/Header";

export default function ProjectSpecPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="panel" style={{ padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div className="eyebrow">Project Requirements</div>
          <h1 style={{ margin: "12px 0 8px" }}>Durable specification for this website project</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 920 }}>
            This page is meant to capture the project brief in a stable, internal form. It is written
            for both the site owner and future agent passes, and it should be treated as a source of
            context when extending the repository.
          </p>
        </div>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Primary intent</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>The site is a personal portfolio of interactive geospatial projects.</div>
            <div>It should stay code-readable, modular, and simple enough to extend without heavy abstraction.</div>
            <div>Simplicity is a hard requirement: the repository should favor plain files, direct data flow, and minimal styling complexity.</div>
            <div>The homepage should be a single-column personal introduction with simple links, while deeper structural material should live behind one click.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Project focus areas</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>Transportation, land use, and urban science at city scale.</div>
            <div>Interactive Japanese zoning and land value mapping with station-distance analytics.</div>
            <div>Chicago neighborhood zoning capacity analysis.</div>
            <div>Scaling relationships between building volume and passenger flow in major Chinese cities.</div>
            <div>Urban mirror workflows driven by the current map window.</div>
            <div>Historical OSM and renewable energy growth in China.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Template and interaction requirements</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>Provide many reusable templates with multiple variants for choropleths, time sliders, before/after views, filter panels, extent analytics, feature inspection, synced maps, and density or hexbin views.</div>
            <div>The Japanese zoning and land value project is the flagship example.</div>
            <div>Station-distance ring analytics are especially important.</div>
            <div>Extent analytics should be activated manually rather than recomputed continuously.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Data and preprocessing requirements</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>Source vectors will usually arrive as GeoPackages.</div>
            <div>Rasters may represent land cover, population, or land-use intensity.</div>
            <div>Time-series datasets should be organized by year.</div>
            <div>`data/inputs/` should act as the ingestion point for future datasets.</div>
            <div>The ingestion workflow should convert simple vector data to GeoJSON and prefer PMTiles for larger data when the toolchain supports it.</div>
            <div>Rasters should be ingested through the same pipeline family, with metadata and output manifests even when extra tooling is needed for final web conversion.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Mapping and deployment constraints</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>Maps should support OpenStreetMap, CartoDB Positron, and satellite basemaps.</div>
            <div>Google Maps should be ignored for now.</div>
            <div>Every map should expose a transit toggle, even if the final transit overlay is still a placeholder.</div>
            <div>The stack should be Next.js + React + TypeScript + MapLibre, with static deployment compatibility for GitHub Pages and Vercel.</div>
            <div>Performance matters, especially on the homepage and during general scrolling.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Companion repo files</strong>
          <p style={{ margin: "12px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
            A markdown copy of this brief also lives at `docs/project-spec.md`, and a repository guide
            lives at `docs/repository-anatomy.md`, so future agents and future manual editing passes can
            discover the context directly from the repository.
          </p>
        </section>
      </section>
    </main>
  );
}
