import Link from "next/link";
import { clouds, services, site } from "@/content/site";
import { Brand } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p style={{ marginTop: 16, maxWidth: 360 }}>
              Sales, assessment, migration, managed services, security assessment and proofs of concept across five clouds — from one accountable team in India.
            </p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div>
            <h4>Clouds</h4>
            <ul>
              {clouds.map((c) => (
                <li key={c.slug}>
                  <Link href={`/clouds/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Tools</h4>
            <ul>
              <li>
                <Link prefetch={false} href="/clouds/azure/sales">Azure Funding Advisor</Link>
              </li>
              <li>
                <Link href="/resources">Templates & checklists</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} CloudMigrate · {site.domain}</span>
          <span>
            AWS, Microsoft Azure, Google Cloud, Jio and Oracle names and logos are trademarks of their respective owners and are used to identify the platforms we work with.
          </span>
        </div>
      </div>
    </footer>
  );
}
