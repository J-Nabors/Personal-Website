import Link from "next/link";
import type { ProjectConfig } from "@/types/templates";

export function ProjectCard({ project }: { project: ProjectConfig }) {
  return (
    <Link href={`/projects/${project.slug}`} className="panel card-link">
      <div className="eyebrow">Project</div>
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>{project.title}</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{project.subtitle}</p>
      </div>
      <span className="chip">{project.location}</span>
    </Link>
  );
}
