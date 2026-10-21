import Link from "next/link";
import { clouds, services } from "@/content/site";
import { Brand } from "./Brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Brand />
        <nav className="nav" aria-label="Primary">
          <details>
            <summary>Clouds</summary>
            <div className="menu">
              {clouds.map((c) => (
                <Link key={c.slug} href={`/clouds/${c.slug}`}>
                  <img src={c.logo} alt="" />
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </details>
          <details>
            <summary>Services</summary>
            <div className="menu">
              {services.map((s) => (
                <Link key={s.slug} href={`/services#${s.slug}`}>
                  <span className="mono small" style={{ color: "var(--accent)" }}>{s.n}</span>
                  <span>{s.title}</span>
                </Link>
              ))}
            </div>
          </details>
          <Link href="/clouds/azure/sales">Azure Funding Advisor</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/contact" className="btn small">
            Talk to an architect
          </Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open menu">Menu</summary>
          <div className="mobile-menu">
            {clouds.map((c) => (
              <Link key={c.slug} href={`/clouds/${c.slug}`}>
                <img src={c.logo} alt="" />
                {c.name}
              </Link>
            ))}
            <Link href="/services">All services</Link>
            <Link href="/clouds/azure/sales">Azure Funding Advisor</Link>
            <Link href="/resources">Resources & templates</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
