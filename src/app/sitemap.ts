import type { MetadataRoute } from "next";
import { clouds, services, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = ["", "/services", "/resources", "/contact", ...clouds.map((c) => `/clouds/${c.slug}`)];
  for (const c of clouds) for (const s of services) if (!(c.slug === "azure" && s.slug === "sales")) urls.push(`/clouds/${c.slug}/${s.slug}`);
  return urls.map((u) => ({ url: `${site.url}${u}`, lastModified: now }));
}
