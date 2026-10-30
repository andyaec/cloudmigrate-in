import type { Metadata } from "next";
import Link from "next/link";
import { ServiceIcon } from "@/components/ServiceIcon";
import { cloudContent } from "@/content/clouds";
import { clouds, services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Sales and commercials, assessment, migration, delivery and managed services, security assessment and proofs of concept across AWS, Azure, Google Cloud, JioCloud and OCI.",
};

const essays: Record<string, string> = {
  sales:
    "Cloud cost is decided in the contract as much as in the architecture. We decide who bills, what to commit and when, and which vendor programmes pay for the move — then make sure the evidence those programmes need is produced as a by-product of delivery.",
  assessment:
    "An assessment is only as good as its data. We collect at least two weeks of utilisation, validate every dependency with an application owner, and leave each application with a written 7R decision, a target pattern, a wave and a business case line.",
  migration:
    "Foundation first, then a factory. Landing zones are deployed as code with guardrails before any workload lands; every wave follows the same rehearsed runbook with a rollback owner and a deadline.",
  "managed-services":
    "We run what we build — 24×7 from India — under one RACI with clear SLAs, and we treat cost and security posture as operating metrics reviewed every month, not annual surprises.",
  "security-assessment":
    "Benchmarks tell you what to check; regulators tell you what you'll be asked to prove. We assess against vendor benchmarks and CIS, and map every finding to DPDP, CERT-In and sector rules.",
  poc: "A POC answers one business question with evidence inside a fixed time box. Success criteria are written before code, and every POC ends with a go / no-go and a costed production path.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> / <span>Services</span>
          </div>
          <h1>Six service lines. Five clouds. One team.</h1>
          <p className="lede">Each service runs the same way on every cloud we support — with that cloud's native tooling, landing-zone model and funding programmes.</p>
        </div>
      </section>
      <div className="wrap">
        {services.map((s) => (
          <section key={s.slug} id={s.slug} className="section" style={{ scrollMarginTop: 80 }}>
            <div className="section-head">
              <div>
                <p className="label">
                  <b>{s.n}</b> &nbsp;{s.short}
                </p>
                <ServiceIcon slug={s.slug} className="icon" />
              </div>
              <div>
                <h2>{s.title}</h2>
                <p>{essays[s.slug]}</p>
              </div>
            </div>
            <div className="grid-3">
              {clouds.map((c) => {
                const sc = cloudContent[c.slug][s.slug];
                const advisor = c.slug === "azure" && s.slug === "sales";
                return (
                  <Link key={c.slug} href={`/clouds/${c.slug}/${s.slug}`} prefetch={advisor ? false : undefined} className="tile cloud-tile" style={{ ["--cloud" as string]: c.color, minHeight: 0 }}>
                    <div className="tile-top">
                      <img className="vendor-logo" src={c.logo} alt="" style={{ height: 26 }} />
                      <span className="label">{c.short}</span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem" }}>{advisor ? "Azure Partner Funding Advisor" : sc?.headline}</h3>
                    <span className="tile-go">{advisor ? "Open the advisor →" : "Read →"}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
