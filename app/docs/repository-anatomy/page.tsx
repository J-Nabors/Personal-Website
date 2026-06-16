import { Header } from "@/components/site/Header";

export default function RepositoryAnatomyPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="panel" style={{ padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div className="eyebrow">Repository Anatomy</div>
          <h1 style={{ margin: "12px 0 8px" }}>How the repository is organized for manual editing</h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 920 }}>
            This page mirrors the markdown guide in `docs/repository-anatomy.md`. It explains which
            files matter most, what each major folder is for, and where to start when you want to edit
            the site by hand.
          </p>
        </div>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Start here</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>`app/page.tsx` for the homepage content.</div>
            <div>`components/site/Header.tsx` for navigation and site identity.</div>
            <div>`app/globals.css` for typography, spacing, colors, and shared layout classes.</div>
            <div>`docs/project-spec.md` for the durable statement of project goals.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Key folders</strong>
          <div className="meta-list" style={{ marginTop: 12 }}>
            <div>`app/` contains the actual routes you see in the browser.</div>
            <div>`components/` contains reusable UI pieces, with `site/`, `template/`, and `map/` split by purpose.</div>
            <div>`lib/` stores shared configuration and lightweight helper data.</div>
            <div>`data/` and `public/data/` store inputs, generated outputs, and reports.</div>
          </div>
        </section>

        <section className="panel" style={{ padding: 18, background: "var(--bg-panel-strong)" }}>
          <strong>Editing rule</strong>
          <p style={{ margin: "12px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
            When a simple direct edit and a more abstract refactor would both solve the problem, prefer
            the direct edit unless the duplication is already becoming hard to understand.
          </p>
        </section>
      </section>
    </main>
  );
}
