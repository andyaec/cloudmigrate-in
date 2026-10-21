import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a CloudMigrate architect about AWS, Azure, Google Cloud, JioCloud or OCI — sales, assessment, migration, managed services, security or a POC.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link> / <span>Contact</span>
          </div>
          <h1>Talk to an architect, not a form.</h1>
          <p className="lede">Tell us what you're moving, where, and by when. We reply within one business day with a suggested first working session.</p>
        </div>
      </section>
      <div className="wrap article">
        <ContactForm email={site.email} />
        <aside>
          <div className="aside-card">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div className="aside-card">
            <h4>What helps us prepare</h4>
            <ul className="small">
              <li>Approximate number of servers, databases and applications</li>
              <li>Target cloud(s) — or that you want help choosing</li>
              <li>Deadlines: DC exit, hardware refresh, licence renewal, audit</li>
              <li>Regulators that apply (RBI, SEBI, IRDAI, government)</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
