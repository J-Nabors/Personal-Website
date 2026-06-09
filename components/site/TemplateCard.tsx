import Link from "next/link";
import type { TemplateConfig } from "@/types/templates";

export function TemplateCard({ config }: { config: TemplateConfig }) {
  return (
    <Link
      href={`/templates/${config.slug}`}
      className="panel"
      style={{
        display: "grid",
        gap: 14,
        padding: 18,
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <div className="eyebrow">{config.category}</div>
        <span className="chip">{config.location}</span>
      </div>
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem" }}>{config.title}</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{config.summary}</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {config.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
