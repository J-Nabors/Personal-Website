import { Header } from "@/components/site/Header";
import { ProjectCard } from "@/components/site/ProjectCard";
import Link from "next/link";
import { flagshipProject, upcomingProjects } from "@/lib/templates";

export default function HomePage() {
  const featuredProjects = [flagshipProject, ...upcomingProjects];

  return (
    <main className="shell page">
      <Header />

      <section className="hero">
        <div className="eyebrow">Personal Website Draft</div>
        <div className="hero-grid">
          <div className="section-stack">
            <div>
              <h1 style={{ margin: "0 0 14px", fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 0.95 }}>
                Interactive maps and urban analysis for transportation, land use, and city-scale data.
              </h1>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7, fontSize: "1.04rem", maxWidth: 820 }}>
                I build geospatial analysis tools and map-driven stories from vector and raster datasets:
                zoning, land value, station-area analytics, urban form, passenger flow, land-use intensity,
                and historical infrastructure change. This site is meant to hold both polished case studies
                and the reusable analytical interfaces behind them.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="button" href="/projects/japan-zoning-land-value">
                Open Flagship Project
              </Link>
              <Link className="button secondary" href="/projects">
                Browse Projects
              </Link>
              <Link className="button secondary" href="/templates">
                Browse Templates
              </Link>
            </div>
          </div>
          <aside className="soft-panel" style={{ padding: 20 }}>
            <div className="eyebrow">Focus</div>
            <div className="meta-list" style={{ marginTop: 14 }}>
              <div>Interactive Japanese zoning and land value mapping with station-distance analytics.</div>
              <div>Zoning capacity and neighborhood analysis in Chicago.</div>
              <div>Scaling relationships between building volume and passenger flow in major Chinese cities.</div>
              <div>Urban mirror workflows with current-extent analytics.</div>
              <div>Historical OSM and renewable energy growth over time.</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="two-column">
        <div className="soft-panel" style={{ padding: 20 }}>
          <div className="eyebrow">What I Do</div>
          <h2 style={{ margin: "12px 0 10px" }}>Build map-driven analytical stories from spatial datasets</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65 }}>
            The structure of this site is designed around static deployment, heavy preprocessing, and
            reusable map interfaces. Projects can stay simple when a single layer is enough, or expand
            into multi-view pages with synced maps, charts, feature inspection, and current-window summaries.
          </p>
        </div>
        <div className="soft-panel" style={{ padding: 20 }}>
          <div className="eyebrow">Architecture</div>
          <div className="meta-list" style={{ marginTop: 14 }}>
            <div>Next.js + TypeScript + MapLibre + Recharts.</div>
            <div>Static-file data pipeline with `data/inputs` as the ingestion point.</div>
            <div>Templates, docs, and project pages moved off the homepage for clarity and speed.</div>
          </div>
        </div>
      </section>

      <section className="section-stack">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow">Projects</div>
            <h2 style={{ margin: "10px 0 0" }}>Selected project directions</h2>
          </div>
          <Link className="button secondary" href="/projects">
            View All Projects
          </Link>
        </div>
        <div className="auto-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="soft-panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow">Explore Further</div>
            <h2 style={{ margin: "12px 0 8px" }}>Templates, data workflow, and project specifications live one click deeper</h2>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65, maxWidth: 820 }}>
              The homepage stays focused on who you are and what work the site contains. The reusable
              template gallery, ingestion workflow, and internal project requirements are all documented
              elsewhere in the site so future work can stay organized without crowding the front page.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="button secondary" href="/templates">
              Template Gallery
            </Link>
            <Link className="button secondary" href="/docs">
              Documentation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
