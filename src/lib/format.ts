const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const inr0 = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const int = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const fmtUsd = (n: number) => usd0.format(Math.round(n));
export const fmtInt = (n: number) => int.format(Math.round(n));
export const fmtPct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;

export function fmtMoney(n: number, currency: { code: "USD" | "INR"; rate: number }) {
  return currency.code === "INR" ? inr0.format(Math.round(n * currency.rate)) : usd0.format(Math.round(n));
}

/** Compact $ for band labels, e.g. 250000 -> $250K, 1500000 -> $1.5M */
export function fmtK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export function bandLabel(min: number, max: number | null | undefined, unit: "usd" | "count" = "usd") {
  const f = unit === "usd" ? fmtK : (n: number) => fmtInt(n);
  if (max == null) return `${f(min)}+`;
  return `${f(min)} – ${f(max)}`;
}
