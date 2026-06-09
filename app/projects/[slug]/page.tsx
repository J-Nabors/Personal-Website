import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { TemplateCard } from "@/components/site/TemplateCard";
import { TemplateShell } from "@/components/template/TemplateShell";
import { flagshipProject, templateConfigs, upcomingProjects } from "@/lib/templates";

const allProjects = [flagshipProject, ...upcomingProjects];

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((entry) => entry.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Urban Science Portfolio`,
    description: project.subtitle,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  const heroTemplate = templateConfigs.find((entry) => entry.slug === project.heroTemplateSlug);
  const supportingTemplates = templateConfigs.filter((entry) =>
    project.supportingTemplateSlugs.includes(entry.slug),
  );

  if (!heroTemplate) notFound();

  return (
    <main className="shell page">
      <Header />
      <section className="panel" style={{ padding: 20 }}>
        <div className="eyebrow">Project Page</div>
        <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>{project.title}</h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 920 }}>{project.intro}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {project.callouts.map((callout) => (
            <span key={callout} className="chip">
              {callout}
            </span>
          ))}
        </div>
      </section>

      <TemplateShell key={heroTemplate.slug} config={heroTemplate} />

      <section className="grid" style={{ gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow">Supporting Views</div>
            <h3 style={{ margin: "10px 0 0" }}>Related templates for this project</h3>
          </div>
          <Link className="button secondary" href="/">
            Back to gallery
          </Link>
        </div>
        <div className="auto-grid">
          {supportingTemplates.map((template) => (
            <TemplateCard key={template.slug} config={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
