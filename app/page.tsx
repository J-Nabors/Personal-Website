import { Header } from "@/components/site/Header";
import { ProjectCard } from "@/components/site/ProjectCard";
import { TemplateCard } from "@/components/site/TemplateCard";
import { flagshipProject, templateCategories, templateConfigs, upcomingProjects } from "@/lib/templates";

export default function HomePage() {
  return (
    <main className="shell page">
      <Header />

      <section className="panel" style={{ padding: 20 }}>
        <div className="eyebrow">Working Draft</div>
        <h2 style={{ margin: "12px 0 10px", fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}>
          Gallery-first structure with a flagship case study
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 900 }}>
          The site starts with a broad gallery of reusable templates, then grows into project pages.
          Japan zoning and land value is treated as the flagship example, and extent analytics use a
          manual trigger so heavier summaries stay legible.
        </p>
      </section>

      <section className="two-column">
        <div className="panel" style={{ padding: 20 }}>
          <div className="eyebrow">Flagship</div>
          <h2 style={{ margin: "12px 0 10px" }}>{flagshipProject.title}</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{flagshipProject.intro}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {flagshipProject.callouts.map((callout) => (
              <span key={callout} className="chip">
                {callout}
              </span>
            ))}
          </div>
        </div>
        <div className="panel" style={{ padding: 20 }}>
          <div className="eyebrow">Included</div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <div>27 runnable templates</div>
            <div>Shared MapLibre component system</div>
            <div>Static placeholder data and preprocessing hooks</div>
            <div>Desktop-first, mobile-safe layouts</div>
          </div>
        </div>
      </section>

      <section className="grid" style={{ gap: 16 }}>
        <div>
          <div className="eyebrow">Projects</div>
          <h2 style={{ margin: "10px 0 0" }}>Project shells</h2>
        </div>
        <div className="auto-grid">
          <ProjectCard project={flagshipProject} />
          {upcomingProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {templateCategories.map((category) => {
        const templates = templateConfigs.filter((config) => config.category === category.key);
        return (
          <section key={category.key} className="grid" style={{ gap: 16 }}>
            <div>
              <div className="eyebrow">Templates</div>
              <h2 style={{ margin: "10px 0 0" }}>{category.label}</h2>
            </div>
            <div className="auto-grid">
              {templates.map((config) => (
                <TemplateCard key={config.slug} config={config} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
