import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <Link href="/" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            Urban Science Portfolio
          </Link>
          <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
            Transportation, land use, urban science, and interactive mapping
          </span>
        </div>
        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="button secondary" href="/">
            Home
          </Link>
          <Link className="button secondary" href="/projects">
            Projects
          </Link>
          <Link className="button secondary" href="/templates">
            Templates
          </Link>
          <Link className="button secondary" href="/docs">
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
