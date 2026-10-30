import Link from "next/link";
import { services, type CloudSlug, type ServiceSlug } from "@/content/site";

export function ServiceNav({ cloud, active }: { cloud: CloudSlug; active?: ServiceSlug }) {
  return (
    <nav className="svc-nav" aria-label="Services for this cloud">
      <Link href={`/clouds/${cloud}`} aria-current={!active ? "page" : undefined}>
        Overview
      </Link>
      {services.map((s) => (
        <Link key={s.slug} href={`/clouds/${cloud}/${s.slug}`} prefetch={cloud === "azure" && s.slug === "sales" ? false : undefined} aria-current={active === s.slug ? "page" : undefined}>
          <span className="num">{s.n}</span>
          {cloud === "azure" && s.slug === "sales" ? "Sales · Funding Advisor" : s.short}
        </Link>
      ))}
    </nav>
  );
}
