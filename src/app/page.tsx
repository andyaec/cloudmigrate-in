import Link from "next/link";
import { HeroFigure } from "@/components/HeroFigure";
import { ServiceIcon } from "@/components/ServiceIcon";
import { clouds, services } from "@/content/site";
import artefacts from "@/data/artefacts.json";

const capabilityNotes: Record<string, string> = {
  sales: "licensing · commits · funding",
  assessment: "discovery · 7R · TCO",
  migration: "landing zones · waves · cutover",
  "managed-services": "24×7 · SRE · FinOps",
  "security-assessment": "CIS · DPDP · CERT-In",
  poc: "criteria · guardrails · decision",
};

export default function Home() {
  const artefactCount = Object.values(artefacts.clouds).reduce((a, c) => a + Object.keys(c).length, 0);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="label" style={{ marginBottom: 18 }}>
              <b>§ 00</b> &nbsp;Multi-cloud practice · India
            </p>
            <h1>
              Everything cloud. <em>One accountable team.</em>
            </h1>
            <p className="lede">
              We handle anything and everything cloud — sales and commercials, assessment, migration, delivery and managed services, security assessment and proofs of
              concept — across AWS, Azure, Google Cloud, JioCloud and OCI. One plan, one RACI, one team answerable for the outcome.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn accent">
                Plan a migration
              </Link>
              <Link href="/clouds/azure/sales" className="btn ghost">
                Open the Azure Funding Advisor
              </Link>
            </div>
            <ol className="capability-index">
              {services.map((s) => (
                <li key={s.slug}>
                  <span className="n">{s.n}</span>
                  <Link href={`/services#${s.slug}`} className="t" style={{ textDecoration: "none" }}>
                    {s.title}
                  </Link>
                  <span className="d mono">{capabilityNotes[s.slug]}</span>
                </li>
              ))}
            </ol>
          </div>
          <HeroFigure />
        </div>
      </section>

      <div className="wrap">
        <div className="logo-strip">
          <span className="label">Platforms we deliver on</span>
          {clouds.map((c) => (
            <Link key={c.slug} href={`/clouds/${c.slug}`} title={c.name}>
              <img src={c.logo} alt={c.name} />
            </Link>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="label">
              <b>§ 01</b> &nbsp;Clouds
            </p>
            <div>
              <h2>Five clouds. Each run the way it was designed to be run.</h2>
              <p>
                We don't flatten every platform into the same template. Each practice uses that vendor's landing-zone model, migration tooling and funding programmes —
                and every service line below exists on every cloud.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {clouds.map((c) => (
              <Link key={c.slug} href={`/clouds/${c.slug}`} className="tile cloud-tile" style={{ ["--cloud" as string]: c.color }}>
                <div className="tile-top">
                  <img className="vendor-logo" src={c.logo} alt="" />
                  <span className="label">{c.short}</span>
                </div>
                <h3>{c.name}</h3>
                <p>{c.tagline}</p>
                <span className="tile-go">Sales · Assessment · Migration · Managed · Security · POC →</span>
              </Link>
            ))}
            <Link href="/clouds/azure/sales" className="tile" style={{ background: "var(--night)", color: "#f3f0e8" }}>
              <div className="tile-top">
                <span className="label" style={{ color: "#8d938f" }}>
                  Tool
                </span>
                <span className="mono tiny" style={{ color: "var(--accent)" }}>
                  FY27
                </span>
              </div>
              <h3 style={{ color: "#f6f3ec" }}>Azure Partner Funding Advisor</h3>
              <p style={{ color: "#c4c7c2" }}>
                Pick the customer's Azure services from 190+ options and see which Microsoft programmes fund the deal — pre-sales, post-sales, Sentinel / MDC two-stage,
                Marketplace, plus Copilot, ME3 / ME5, Windows 365 and Dynamics 365 seat calculators.
              </p>
              <span className="tile-go">Open the advisor →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="label">
              <b>§ 02</b> &nbsp;Services
            </p>
            <div>
              <h2>The whole lifecycle — not just the move.</h2>
              <p>Most programmes fail at the seams between sales, architecture and operations. We own all of them, so nothing falls between contracts.</p>
            </div>
          </div>
          <div className="grid-3">
            {services.map((s) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="tile">
                <div className="tile-top">
                  <ServiceIcon slug={s.slug} />
                  <span className="mono tiny muted">{s.n}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <span className="tile-go">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band-dark">
        <div className="wrap">
          <div className="section-head">
            <p className="label">
              <b>§ 03</b> &nbsp;How we work
            </p>
            <div>
              <h2>Measured, rehearsed, handed over.</h2>
              <p>The same five steps on every cloud. Each ends in a document someone signs — which is why our programmes finish.</p>
            </div>
          </div>
          <ol className="steps">
            <li>
              <h4>Qualify & fund</h4>
              <p>Commercial route, commitments and vendor funding agreed before work starts.</p>
            </li>
            <li>
              <h4>Assess</h4>
              <p>Two weeks of telemetry minimum, owner-validated dependencies, a 7R decision per app.</p>
            </li>
            <li>
              <h4>Build the foundation</h4>
              <p>Landing zone as code: identity, network, guardrails, logging and backup — then a pilot wave.</p>
            </li>
            <li>
              <h4>Migrate in waves</h4>
              <p>Same runbook every wave, rehearsed cutovers, rollback owners, evidence captured as we go.</p>
            </li>
            <li>
              <h4>Operate & optimise</h4>
              <p>24×7 operations, security posture and FinOps under one RACI and clear SLAs.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="label">
              <b>§ 04</b> &nbsp;Templates
            </p>
            <div>
              <h2>{artefactCount} working templates, free to download.</h2>
              <p>
                Migration handbooks, pre- and post-migration checklists, assessment workbooks with 7R scoring and TCO, cutover runbooks, security checklists mapped to DPDP
                and CERT-In, RACI and SLA matrices, POC charters — tailored for each cloud.
              </p>
              <p style={{ marginTop: 20 }}>
                <Link href="/resources" className="btn">
                  Browse the template library
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
