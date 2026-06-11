import { Header } from "@/components/site/Header";
import { TemplateCard } from "@/components/site/TemplateCard";
import { templateCategories, templateConfigs } from "@/lib/templates";

export default function TemplatesIndexPage() {
  return (
    <main className="shell page">
      <Header />
      <section className="soft-panel" style={{ padding: 24 }}>
        <div className="eyebrow">Template Gallery</div>
        <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
          Reusable MapLibre layouts for urban science project pages
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65, maxWidth: 920 }}>
          The templates live off the homepage so the front page can stay clear and readable. This gallery
          is the working library of choropleths, time sliders, synced maps, density views, inspection
          pages, and current-extent analytics.
        </p>
      </section>

      {templateCategories.map((category) => {
        const templates = templateConfigs.filter((config) => config.category === category.key);
        return (
          <section key={category.key} className="section-stack">
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
