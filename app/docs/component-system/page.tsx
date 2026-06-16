import { Header } from "@/components/site/Header";

export default function ComponentSystemPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="panel" style={{ padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div className="eyebrow">Component System</div>
          <h1 style={{ margin: "12px 0 8px" }}>How the reusable template system is organized</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 920 }}>
            The scaffold keeps most variation in configuration rather than hardcoded pages. That makes
            it easier to add new map projects later without rewriting the same layout and control code.
            Even here, simplicity matters more than abstraction for its own sake.
          </p>
        </div>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Core files</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>`lib/templates.ts` stores the template registry and project shells.</div>
            <div>`components/template/TemplateShell.tsx` assembles map, charts, filters, notes, and inspection panels.</div>
            <div>`components/map/MapPanel.tsx` owns the MapLibre instance, basemap switcher, transit toggle, and manual extent-analysis button.</div>
            <div>`lib/basemaps.ts` defines the selectable basemap styles.</div>
            <div>`app/page.tsx` is intentionally much simpler than the project pages and is meant to stay easy to hand-edit.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Best way to add a new page later</strong>
          <div style={{ display: "grid", gap: 10, marginTop: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            <div>Add a new entry to `templateConfigs` with a new `slug`, `category`, and `datasetKey`.</div>
            <div>Turn layout features on or off with flags like `hasTimeSlider`, `hasFilterPanel`, or `hasExtentAnalysis`.</div>
            <div>Point the map to a real uploaded dataset by replacing the demo collection or extending `lib/demo-data.ts` into a fuller data registry.</div>
            <div>Create a project page by composing one hero template and several supporting template slugs.</div>
          </div>
        </section>
      </section>
    </main>
  );
}
