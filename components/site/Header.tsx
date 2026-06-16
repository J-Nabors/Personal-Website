import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      {/* Keep navigation plain and text-first so the site reads like an editable document set. */}
      <div className="header-stack">
        <div style={{ display: "grid", gap: 4 }}>
          <Link href="/" className="site-title">
            John Hendrik Nabors
          </Link>
          <span className="site-subtitle">Maps, urban analysis, and geospatial research</span>
        </div>
        <nav className="simple-link-list" aria-label="Site navigation">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/docs">Docs</Link>
        </nav>
      </div>
    </header>
  );
}
