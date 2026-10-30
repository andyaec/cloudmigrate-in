import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FundingAdvisor } from "@/components/advisor/FundingAdvisor";
import { ArtefactList } from "@/components/ArtefactList";
import { ServiceNav } from "@/components/ServiceNav";
import { cloudContent } from "@/content/clouds";
import { cloudBySlug, clouds, serviceBySlug, services } from "@/content/site";

export function generateStaticParams() {
  return clouds.flatMap((c) => services.map((s) => ({ cloud: c.slug, service: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ cloud: string; service: string }> }): Promise<Metadata> {
  const { cloud, service } = await params;
  const c = cloudBySlug(cloud);
  const s = serviceBySlug(service);
  if (!c || !s) return {};
  if (c.slug === "azure" && s.slug === "sales") {
    return {
      title: "Azure Partner Funding Advisor (FY27)",
      description: "Find the Microsoft FY27 partner programmes that fund an Azure migration, subscription, tenant or partner change — plus Modern Work, Copilot, Security and Dynamics 365 seat calculators.",
      robots: { index: false, follow: false },
    };
  }
  const sc = cloudContent[c.slug][s.slug];
  return { title: `${s.title} — ${c.name}`, description: sc?.lede };
}

export default async function ServicePage({ params }: { params: Promise<{ cloud: string; service: string }> }) {
  const { cloud, service } = await params;
  const c = cloudBySlug(cloud);
  const s = serviceBySlug(service);
  if (!c || !s) notFound();

  if (c.slug === "azure" && s.slug === "sales") {
    return (
      <div style={{ ["--cloud" as string]: c.color }}>
        <section className="page-head" style={{ paddingBottom: 24 }}>
          <div className="wrap">
            <div className="crumbs">
              <Link href="/">Home</Link> / <Link href="/clouds/azure">Azure</Link> / <span>Sales</span>
            </div>
            <div className="cloud-rule" />
            <h1 style={{ maxWidth: "24ch" }}>Azure Partner Funding Advisor</h1>
            <p className="lede">
              For Azure sellers: describe the deal — migration, new workloads, a subscription or tenant move, or a change of partner — pick the Azure services from the full
              catalogue, and see which Microsoft FY27 programmes can fund it, at what size, and what proof of execution you'll need.
            </p>
            <p className="small muted" style={{ margin: "12px 0 0" }}>
              Sales team access · <a href="/api/advisor-logout">Sign out</a>
            </p>
          </div>
        </section>
        <div className="wrap">
          <ServiceNav cloud={c.slug} active="sales" />
        </div>
        <FundingAdvisor />
      </div>
    );
  }

  const sc = cloudContent[c.slug][s.slug];
  if (!sc) notFound();
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <div style={{ ["--cloud" as string]: c.color }}>
      <section className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> / <Link href={`/clouds/${c.slug}`}>{c.short}</Link> / <span>{s.title}</span>
          </div>
          <div className="cloud-head">
            <div>
              <p className="label" style={{ marginBottom: 14 }}>
                <b>{s.n}</b> &nbsp;{s.title} · {c.name}
              </p>
              <h1>{sc.headline}</h1>
              <p className="lede">{sc.lede}</p>
            </div>
            <img className="vendor-logo" src={c.logo} alt={`${c.name} logo`} />
          </div>
        </div>
      </section>
      <div className="wrap">
        <ServiceNav cloud={c.slug} active={s.slug} />
        <div className="article">
          <article className="prose">
            {sc.sections.map((sec) => (
              <section key={sec.h}>
                <h2>{sec.h}</h2>
                {sec.p.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}

            <h2>What you get</h2>
            <ul className="checklist">
              {sc.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <h2>How we run it</h2>
            <ol className="phases">
              {sc.approach.map((a) => (
                <li key={a.phase}>
                  <h4>
                    {a.phase}
                    {a.when && <span className="when">{a.when}</span>}
                  </h4>
                  <p>{a.detail}</p>
                </li>
              ))}
            </ol>

            {sc.targets && (
              <>
                <h2>Targets we hold ourselves to</h2>
                <div className="kpis">
                  {sc.targets.map((t) => (
                    <div key={t.l}>
                      <div className="m">{t.m}</div>
                      <div className="l">{t.l}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2>{c.short} tooling we use</h2>
            <ul className="chips">
              {sc.tooling.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            {sc.pitfalls && (
              <>
                <h2>What we see go wrong</h2>
                <ul className="warnlist">
                  {sc.pitfalls.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <aside>
            <div className="aside-sticky">
              <div className="aside-card">
                <h4>Templates for this service</h4>
                <ArtefactList cloud={c.slug} keys={sc.artefacts} />
              </div>
              {c.slug === "azure" && (
                <div className="aside-card" style={{ background: "var(--night)", borderColor: "var(--night)", color: "#e7e4dc" }}>
                  <h4 style={{ color: "#8d938f" }}>Microsoft funding</h4>
                  <p className="small" style={{ color: "#c4c7c2" }}>
                    Check which FY27 Frontier Accelerate programme can fund this engagement before you scope it.
                  </p>
                  <Link prefetch={false} href="/clouds/azure/sales" className="btn small" style={{ background: "var(--paper)", color: "var(--ink)" }}>
                    Open Funding Advisor
                  </Link>
                </div>
              )}
              <div className="aside-card">
                <h4>Other {c.short} services</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {others.map((o) => (
                    <li key={o.slug} style={{ padding: "6px 0", borderTop: "1px solid var(--rule)" }}>
                      <Link href={`/clouds/${c.slug}/${o.slug}`} prefetch={c.slug === "azure" && o.slug === "sales" ? false : undefined}>
                        <span className="mono tiny" style={{ color: "var(--accent)", marginRight: 8 }}>
                          {o.n}
                        </span>
                        {c.slug === "azure" && o.slug === "sales" ? "Sales · Funding Advisor" : o.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aside-card">
                <h4>Next step</h4>
                <p className="small">A 45-minute working session with a {c.short} architect — bring your inventory, leave with a plan outline.</p>
                <Link href="/contact" className="btn small">
                  Book a session
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
