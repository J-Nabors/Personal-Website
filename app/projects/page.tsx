import { Header } from "@/components/site/Header";
import { ProjectCard } from "@/components/site/ProjectCard";
import { flagshipProject, upcomingProjects } from "@/lib/templates";

export default function ProjectsIndexPage() {
  const projects = [flagshipProject, ...upcomingProjects];

  return (
    <main className="shell page">
      <Header />
      <section className="soft-panel" style={{ padding: 24 }}>
        <div className="eyebrow">Projects</div>
        <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
          Project pages built from reusable analytical map patterns
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65, maxWidth: 920 }}>
          These pages are the portfolio-facing layer of the site. Each project can draw from the shared
          map/template system while keeping its own narrative, datasets, and analytical emphasis.
        </p>
      </section>

      <section className="auto-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </main>
  );
}
