import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtefactList } from "@/components/ArtefactList";
import { ServiceIcon } from "@/components/ServiceIcon";
import { ServiceNav } from "@/components/ServiceNav";
import { cloudContent } from "@/content/clouds";
import { cloudBySlug, clouds, services } from "@/content/site";

export function generateStaticParams() {
  return clouds.map((c) => ({ cloud: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ cloud: string }> }): Promise<Metadata> {
  const { cloud } = await params;
  const c = cloudBySlug(cloud);
  if (!c) return {};
  return { title: `${c.name} services`, description: `${c.tagline} ${c.intro}` };
}

export default async function CloudPage({ params }: { params: Promise<{ cloud: string }> }) {
  const { cloud } = await params;
  const c = cloudBySlug(cloud);
  if (!c) notFound();
  const content = cloudContent[c.slug];

  return (
    <div style={{ ["--cloud" as string]: c.color }}>
      <section className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> / <span>Clouds</span> / <span>{c.short}</span>
          </div>
          <div className="cloud-head">
            <div>
              <div className="cloud-rule" />
              <h1>{c.name}</h1>
              <p className="lede">{c.intro}</p>
            </div>
            <img className="vendor-logo" src={c.logo} alt={`${c.name} logo`} />
          </div>
          <div className="facts">
            {c.facts.map((f) => (
              <div key={f.k}>
                <div className="k">{f.k}</div>
                <div className="v">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="wrap">
        <ServiceNav cloud={c.slug} />
      </div>

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="grid-3">
            {services.map((s) => {
              const sc = content[s.slug];
              const isAdvisor = c.slug === "azure" && s.slug === "sales";
              return (
                <Link key={s.slug} href={`/clouds/${c.slug}/${s.slug}`} prefetch={isAdvisor ? false : undefined} className="tile cloud-tile">
                  <div className="tile-top">
                    <ServiceIcon slug={s.slug} />
                    <span className="mono tiny muted">
                      {s.n} · {s.short}
                    </span>
                  </div>
                  <h3>{isAdvisor ? "Azure Partner Funding Advisor" : sc?.headline ?? s.title}</h3>
                  <p>
                    {isAdvisor
                      ? "Interactive FY27 guide for sellers: select Azure services and deal facts to see which Microsoft programmes fund the migration, subscription, tenant or partner change — plus Modern Work, Security and BizApps seat calculators."
                      : sc?.lede ?? s.blurb}
                  </p>
                  <span className="tile-go">{isAdvisor ? "Open the advisor →" : "Read the approach →"}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="label">
              <b>Templates</b> &nbsp;{c.short}
            </p>
            <div>
              <h2>Download the {c.short} toolkit</h2>
              <p>Editable Excel and Word templates, pre-filled with {c.short}-specific tooling and standards.</p>
              <div className="aside-card" style={{ marginTop: 24, maxWidth: 720 }}>
                <ArtefactList cloud={c.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
