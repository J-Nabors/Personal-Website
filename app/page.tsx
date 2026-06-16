import { Header } from "@/components/site/Header";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell page">
      <Header />
      <section className="home-column">
        <div className="eyebrow">John Hendrik Nabors</div>

        {/* Keep the homepage readable as one narrative column instead of a dashboard. */}
        <section className="simple-section">
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(2.5rem, 7vw, 4.6rem)", lineHeight: 0.98 }}>
            I build maps and data analysis tools for understanding cities.
          </h1>
          <p className="body-copy">
            I am a data analyst with a background in GIS, urban dynamics, and data visualization. My
            work sits between mapping, urban policy, and interactive storytelling, with a focus on
            transportation, land use, and how people move through city space.
          </p>
          <p className="body-copy">
            I studied Computer Science at NYU Shanghai, with additional work in sustainable urban
            environments and Chinese language. Across research and independent projects, I have worked
            with zoning, passenger flow, walkability, land value, satellite imagery, and large spatial
            datasets across Japan, China, and the United States.
          </p>
        </section>

        <section className="simple-section">
          <h2 style={{ margin: "0 0 12px", fontSize: "1.15rem" }}>What I believe</h2>
          <p className="body-copy">
            I believe urban analysis should be clear, grounded, and accessible. Good maps should help
            people understand complicated systems without hiding the logic behind them. Good technical
            work should stay close to the real questions people ask about housing, mobility, growth,
            and everyday life in cities.
          </p>
        </section>

        <section className="simple-section">
          <h2 style={{ margin: "0 0 12px", fontSize: "1.15rem" }}>Current directions</h2>
          <div className="simple-list">
            <div>Japanese railway urbanism, zoning, land value, and station-area analysis.</div>
            <div>Building volume and passenger flow relationships in major Chinese cities.</div>
            <div>Urban heat, satellite imagery, and spatial research workflows.</div>
            <div>Map interfaces that stay legible enough to teach from and easy enough to maintain.</div>
          </div>
        </section>

        {/* The front page only offers a few clear paths deeper into the site. */}
        <section className="simple-section">
          <h2 style={{ margin: "0 0 12px", fontSize: "1.15rem" }}>Pages</h2>
          <nav className="simple-link-list" aria-label="Primary site links">
            <Link href="/projects">Projects</Link>
            <Link href="/projects/japan-zoning-land-value">Flagship project</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/docs/project-spec">Project specification</Link>
            <Link href="/docs/repository-anatomy">Repository anatomy</Link>
          </nav>
        </section>
      </section>
    </main>
  );
}
