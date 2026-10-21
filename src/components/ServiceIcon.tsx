import type { ServiceSlug } from "@/content/site";

const paths: Record<ServiceSlug, React.ReactNode> = {
  sales: (
    <>
      <path d="M6 30V14M14 30V8M22 30V18M30 30V11" />
      <path d="M4 30h28" />
      <path d="M5 11l9-6 8 7 9-6" strokeDasharray="2 2" />
    </>
  ),
  assessment: (
    <>
      <circle cx="15" cy="15" r="9" />
      <path d="M22 22l9 9" />
      <path d="M11 15h8M15 11v8" />
    </>
  ),
  migration: (
    <>
      <rect x="3" y="9" width="11" height="18" rx="1" />
      <path d="M6 14h5M6 18h5M6 22h5" />
      <path d="M17 18h11" />
      <path d="M24 13l5 5-5 5" />
      <path d="M28 8a5 5 0 0 1 4 7" strokeDasharray="2 2" />
    </>
  ),
  "managed-services": (
    <>
      <circle cx="18" cy="18" r="5" />
      <path d="M18 3v5M18 28v5M3 18h5M28 18h5M7.4 7.4l3.5 3.5M25.1 25.1l3.5 3.5M7.4 28.6l3.5-3.5M25.1 10.9l3.5-3.5" />
    </>
  ),
  "security-assessment": (
    <>
      <path d="M18 3l12 5v9c0 8-5.5 13-12 16-6.5-3-12-8-12-16V8z" />
      <path d="M12.5 18l4 4 7-8" />
    </>
  ),
  poc: (
    <>
      <path d="M13 4h10M15 4v9L6 29a2 2 0 0 0 1.8 3h20.4a2 2 0 0 0 1.8-3L21 13V4" />
      <path d="M10 23h16" strokeDasharray="2 2" />
    </>
  ),
};

export function ServiceIcon({ slug, className }: { slug: ServiceSlug; className?: string }) {
  return (
    <svg className={className ?? "icon"} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[slug]}
    </svg>
  );
}
