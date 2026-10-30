import type { Metadata } from "next";
import Link from "next/link";
import artefacts from "@/data/artefacts.json";
import { clouds } from "@/content/site";

export const metadata: Metadata = {
  title: "Templates & checklists",
  description: "Free migration handbooks, pre- and post-migration checklists, assessment workbooks, cutover runbooks, security checklists, RACI and POC charters for AWS, Azure, Google Cloud, JioCloud and OCI.",
};

type Entry = { title: string; type: string; description: string; href: string; bytes: number };
const ORDER = ["handbook", "assessment-workbook", "pre-checklist", "cutover-runbook", "post-checklist", "runbook-raci", "security-checklist", "poc-charter", "commercial-checklist"];

export default function ResourcesPage() {
  const data = artefacts.clouds as Record<string, Record<string, Entry>>;
  const titles = new Map<string, Entry>();
  for (const c of Object.values(data)) for (const [k, v] of Object.entries(c)) if (!titles.has(k)) titles.set(k, v);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> / <span>Resources</span>
          </div>
          <h1>Templates we actually use on engagements.</h1>
          <p className="lede">
            Editable Excel and Word files, tailored per cloud with that platform's tooling, landing-zone standards and Indian compliance notes. Use them freely; tell us if you
            improve one.
          </p>
        </div>
      </section>
      <div className="wrap section" style={{ paddingTop: 40 }}>
        <div className="table-scroll">
          <table className="res-table">
            <thead>
              <tr>
                <th style={{ minWidth: 240 }}>Template</th>
                {clouds.map((c) => (
                  <th key={c.slug} style={{ textAlign: "center" }}>
                    <img src={c.logo} alt={c.name} style={{ height: 22, width: "auto", display: "block", margin: "0 auto 4px" }} />
                    {c.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDER.filter((k) => titles.has(k)).map((k) => {
                const t = titles.get(k)!;
                return (
                  <tr key={k}>
                    <td>
                      <strong>{t.title}</strong>
                      <div className="small muted">{t.description}</div>
                    </td>
                    {clouds.map((c) => {
                      const e = data[c.slug]?.[k];
                      return (
                        <td key={c.slug} style={{ textAlign: "center", verticalAlign: "middle" }}>
                          {e ? (
                            <a href={e.href} download className={`ftype ${e.type}`} style={{ display: "inline-block", padding: "6px 10px", textDecoration: "none" }}>
                              {e.type.toUpperCase()}
                            </a>
                          ) : k === "commercial-checklist" && c.slug === "azure" ? (
                            <Link prefetch={false} href="/clouds/azure/sales" className="small">
                              Funding Advisor
                            </Link>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: 20 }}>
          Generated {artefacts.generated} · {artefacts.version}. Templates are provided as-is for planning; validate vendor programme terms and service availability before relying on them.
        </p>
      </div>
    </>
  );
}
