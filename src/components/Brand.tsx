import Link from "next/link";

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="5" fill="currentColor" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="none" stroke="var(--paper)" strokeWidth="2.2" />
      <rect x="14.5" y="14.5" width="11" height="11" rx="1.5" fill="var(--accent)" />
      <path d="M12 21.5h4" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="CloudMigrate home">
      <BrandMark />
      <span className="brand-word">
        CloudMigrate<i>.in</i>
      </span>
    </Link>
  );
}
