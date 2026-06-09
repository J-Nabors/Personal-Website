import Link from "next/link";

export function Header() {
  return (
    <header className="panel" style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="eyebrow">Urban Science Portfolio</div>
          <h1 style={{ margin: "12px 0 6px", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1 }}>
            MapLibre Template Gallery
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", maxWidth: 820, lineHeight: 1.55 }}>
            A code-readable working draft for interactive project pages, built around reusable map,
            chart, and analysis components.
          </p>
        </div>
        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button secondary" href="/">
            Gallery
          </Link>
          <Link className="button secondary" href="/projects/japan-zoning-land-value">
            Flagship Project
          </Link>
          <Link className="button secondary" href="/docs/component-system">
            Component System
          </Link>
          <Link className="button secondary" href="/docs/data-workflow">
            Data Workflow
          </Link>
        </nav>
      </div>
    </header>
  );
}
