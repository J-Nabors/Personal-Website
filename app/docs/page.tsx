import Link from "next/link";
import { Header } from "@/components/site/Header";

const docLinks = [
  {
    href: "/docs/project-spec",
    title: "Project Requirements",
    summary: "The durable specification page that captures the goals, constraints, and simplicity rules for the site.",
  },
  {
    href: "/docs/data-workflow",
    title: "Data Workflow",
    summary: "How datasets enter the repo, how ingestion works, and where processed outputs belong.",
  },
  {
    href: "/docs/component-system",
    title: "Component System",
    summary: "How template config, map panels, charts, filters, and project pages fit together.",
  },
  {
    href: "/docs/repository-anatomy",
    title: "Repository Anatomy",
    summary: "A file-by-file guide to the folders you are most likely to edit when working manually.",
  },
];

export default function DocsIndexPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="soft-panel" style={{ padding: 24 }}>
        <div className="eyebrow">Documentation</div>
        <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
          Internal reference pages for future development
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65, maxWidth: 920 }}>
          This section exists both for you and for future agent passes. It keeps the project&apos;s
          requirements, architecture, and editing guidance in one place so the codebase stays easy to
          understand and modify by hand.
        </p>
      </section>

      <section className="auto-grid">
        {docLinks.map((doc) => (
          <Link key={doc.href} href={doc.href} className="panel card-link">
            <div className="eyebrow">Docs</div>
            <div>
              <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>{doc.title}</h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{doc.summary}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
