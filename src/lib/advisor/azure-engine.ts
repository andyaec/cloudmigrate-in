import { azureData, azureMarket, azureServices, missingCredentials, mwMarket } from "@/lib/incentives/data";
import type { AzureProgramme, Market, SegmentId, SizeBand } from "@/lib/incentives/types";

export type Scenario =
  | "new-migration"
  | "expand"
  | "subscription-move"
  | "tenant-change"
  | "partner-change"
  | "sdc-solution";

export type Licensing = "csp-direct" | "csp-indirect" | "ea-indirect" | "ea-direct" | "mca-e" | "payg";

export type SourcePlatform =
  | "onprem"
  | "aws-rds"
  | "aws-aurora"
  | "gcp-cloudsql"
  | "gcp-bigquery"
  | "aws-other"
  | "gcp-other"
  | "other-cloud";

export interface ServiceLine {
  id: string;
  monthly: number;
}

export interface AzureDeal {
  scenario: Scenario;
  segment: SegmentId;
  validTenant: boolean;
  propensityList: boolean;
  country: string;
  creds: string[];
  lines: ServiceLine[];
  baselineMonthly: number;
  movedMonthly: number;
  sourcePlatforms: SourcePlatform[];
  sapType: "native" | "rise" | "grow";
  sapAcv: number;
  credits: boolean;
  licensing: Licensing;
  cocpReplacesAll: boolean;
  priorYearTenantAcr: number;
  isSdc: boolean;
  isSiForSdc: boolean;
  mbs: number;
  agentMau: number;
}

export const defaultDeal: AzureDeal = {
  scenario: "new-migration",
  segment: "majors",
  validTenant: true,
  propensityList: false,
  country: "India",
  creds: [],
  lines: [],
  baselineMonthly: 0,
  movedMonthly: 0,
  sourcePlatforms: ["onprem"],
  sapType: "native",
  sapAcv: 0,
  credits: false,
  licensing: "ea-indirect",
  cocpReplacesAll: false,
  priorYearTenantAcr: 0,
  isSdc: false,
  isSiForSdc: false,
  mbs: 0,
  agentMau: 0,
};

const serviceById = new Map(azureServices.map((s) => [s.id, s]));

export interface DealTotals {
  grossAnnual: number;
  movedAnnual: number;
  incrementalAnnual: number;
  baselineAnnual: number;
  projectedTenantAnnual: number;
  factor: number;
  byTag: Record<string, number>;
}

/** Annualised incremental ACR per tag, after removing consumption that is only being moved. */
export function computeTotals(deal: AzureDeal): DealTotals {
  const gross = deal.lines.reduce((a, l) => a + Math.max(0, l.monthly || 0), 0) * 12;
  const moved = Math.min(Math.max(0, deal.movedMonthly || 0) * 12, gross);
  const incremental = gross - moved;
  const factor = gross > 0 ? incremental / gross : 0;
  const byTag: Record<string, number> = {};
  for (const l of deal.lines) {
    const svc = serviceById.get(l.id);
    if (!svc) continue;
    const v = Math.max(0, l.monthly || 0) * 12 * factor;
    for (const t of svc.t) byTag[t] = (byTag[t] ?? 0) + v;
  }
  const baselineAnnual = Math.max(0, deal.baselineMonthly || 0) * 12;
  return {
    grossAnnual: gross,
    movedAnnual: moved,
    incrementalAnnual: incremental,
    baselineAnnual,
    projectedTenantAnnual: baselineAnnual + incremental,
    factor,
    byTag,
  };
}

/** Sum of incremental ACR for lines whose service carries any of the tags (each line counted once). */
export function sumForTags(deal: AzureDeal, totals: DealTotals, tags: string[]): number {
  if (tags.includes("*")) return totals.incrementalAnnual;
  let sum = 0;
  for (const l of deal.lines) {
    const svc = serviceById.get(l.id);
    if (!svc) continue;
    if (svc.t.some((t) => tags.includes(t))) sum += Math.max(0, l.monthly || 0) * 12 * totals.factor;
  }
  return sum;
}

function hasAnyTag(deal: AzureDeal, tags: string[]) {
  if (tags.includes("*")) return deal.lines.some((l) => l.monthly > 0);
  return deal.lines.some((l) => l.monthly > 0 && serviceById.get(l.id)?.t.some((t) => tags.includes(t)));
}

function qualifiesFor(s: SizeBand, value: number, alt = false) {
  const lo = alt ? s.altMin ?? s.min : s.min;
  return s.minInclusive || alt ? value >= lo : value > lo;
}

export function pickSize(sizes: SizeBand[], value: number, alt = false): SizeBand | undefined {
  let chosen: SizeBand | undefined;
  for (const s of sizes) if (qualifiesFor(s, value, alt)) chosen = s;
  return chosen;
}

export function payoutFor(s: SizeBand | undefined, market: Market) {
  if (!s) return 0;
  return s.payout[market] ?? s.payout.B;
}

export type CheckState = "pass" | "fail" | "warn";
export interface Check {
  state: CheckState;
  label: string;
}

export interface Evaluation {
  programme: AzureProgramme;
  status: "eligible" | "conditional" | "ineligible";
  market: Market;
  basis: number;
  basisLabel: string;
  size?: SizeBand;
  payout: number;
  stage2: number;
  workload?: { value: number; share: number; min: number; label: string };
  checks: Check[];
  hints: string[];
}

function marketFor(p: AzureProgramme, country: string): Market {
  return p.markets === "ABC" ? mwMarket(country) : azureMarket(country);
}

export function evaluateProgramme(
  p: AzureProgramme,
  deal: AzureDeal,
  totals: DealTotals,
  linked?: Evaluation,
): Evaluation {
  const creds = new Set(deal.creds);
  const market = marketFor(p, deal.country);
  const checks: Check[] = [];
  const hints: string[] = [];
  const rule = p.rule;

  const missing = missingCredentials(p.partner, creds);
  checks.push(
    missing.length
      ? { state: "fail", label: `Partner credential missing — ${missing.join("; ")}` }
      : { state: "pass", label: p.partner.text[0] },
  );

  const segOk = p.customer.segments.includes("*") || p.customer.segments.includes(deal.segment);
  checks.push(
    segOk
      ? { state: "pass", label: "Customer segment is eligible" }
      : { state: "fail", label: `Customer segment not eligible — ${p.customer.text[p.customer.text.length > 1 ? 1 : 0]}` },
  );

  if (p.lane !== "marketplace") {
    checks.push(
      deal.validTenant
        ? { state: "pass", label: "Valid customer tenant / TPID detected" }
        : { state: "fail", label: "Customer needs a valid tenant detected by Microsoft systems" },
    );
  }

  if (p.customer.propensityList) {
    checks.push(
      deal.propensityList
        ? { state: "pass", label: "Customer is on the GTM propensity list" }
        : { state: "warn", label: "Confirm the customer is on the GTM pre-published propensity list — off-list nominations are rejected" },
    );
  }

  if (rule.requiresFlag) {
    const ok = rule.requiresFlag === "isSdc" ? deal.isSdc : deal.isSiForSdc;
    checks.push(
      ok
        ? { state: "pass", label: rule.requiresFlag === "isSdc" ? "Partner is the SDC selling its own Azure solution" : "SI-led delivery of an SDC solution (Stage 0 intake)" }
        : { state: "fail", label: rule.requiresFlag === "isSdc" ? "Only for Software Development Companies moving customers onto their own Azure solution" : "Only for SI partners delivering an SDC's solution" },
    );
  }

  // Linked bonus (conversion bonus)
  if (rule.linked) {
    const linkedOk = linked && linked.status !== "ineligible" && linked.size;
    checks.push(
      linkedOk
        ? { state: "pass", label: `Linked to a qualifying ${linked!.programme.short} engagement (${linked!.size!.size})` }
        : { state: "fail", label: "Requires a qualifying, completed Databases engagement of the same size" },
    );
    const srcOk = deal.sourcePlatforms.some((s) => rule.sourcePlatforms?.includes(s));
    checks.push(
      srcOk
        ? { state: "pass", label: "Source is AWS RDS / Aurora or Google Cloud SQL / BigQuery" }
        : { state: "fail", label: "Source database must be AWS RDS / Aurora (SQL, PostgreSQL), Google Cloud SQL or BigQuery" },
    );
    const size = linkedOk ? p.sizes.find((s) => s.size === linked!.size!.size) : undefined;
    const status = checks.some((c) => c.state === "fail") ? "ineligible" : checks.some((c) => c.state === "warn") ? "conditional" : "eligible";
    return {
      programme: p,
      status,
      market,
      basis: linked?.basis ?? 0,
      basisLabel: p.sizing.label,
      size: status === "ineligible" ? undefined : size,
      payout: status === "ineligible" ? 0 : payoutFor(size, market),
      stage2: 0,
      checks,
      hints,
    };
  }

  // Sizing basis
  let basis = 0;
  let alt = false;
  if (rule.metricInput) {
    basis = rule.metricInput === "mbs" ? deal.mbs : deal.agentMau;
  } else {
    const anchorOk = hasAnyTag(deal, rule.anchor ?? ["*"]);
    checks.push(
      anchorOk
        ? { state: "pass", label: `Includes qualifying services` }
        : { state: "fail", label: `No qualifying services selected — needs: ${p.qualifying}` },
    );
    basis = sumForTags(deal, totals, rule.scope ?? ["*"]);
    if (p.sizing.alt === "sapAcv" && (deal.sapType === "rise" || deal.sapType === "grow")) {
      basis = deal.sapAcv;
      alt = true;
    }
  }

  const size = pickSize(p.sizes, basis, alt);
  const floor = alt ? p.sizes[0].altMin ?? p.sizes[0].min : p.sizes[0].min;
  checks.push(
    size
      ? { state: "pass", label: `Sized ${size.size} on ${alt ? "first-year SAP ACV" : rule.metricInput === "agentMau" ? "Agent MAU" : rule.metricInput === "mbs" ? "Marketplace Billed Sales" : "incremental ACR"}` }
      : { state: "fail", label: `Below the minimum band (${rule.metricInput === "agentMau" ? floor.toLocaleString() + " MAU" : "$" + floor.toLocaleString()})` },
  );

  let workload: Evaluation["workload"];
  if (rule.workload && size) {
    const value = sumForTags(deal, totals, rule.workload.tags);
    const share = basis > 0 ? value / basis : 0;
    const min = size.workloadMin ?? 0;
    workload = { value, share, min, label: rule.workload.label };
    const shareOk = share >= rule.workload.minShare - 1e-9;
    const minOk = value >= min;
    if (rule.workload.minShare > 0) {
      checks.push(
        shareOk
          ? { state: "pass", label: `${rule.workload.label} = ${(share * 100).toFixed(0)}% of project ACR (≥ ${(rule.workload.minShare * 100).toFixed(0)}% required)` }
          : { state: "fail", label: `${rule.workload.label} = ${(share * 100).toFixed(0)}% of project ACR — needs ≥ ${(rule.workload.minShare * 100).toFixed(0)}%` },
      );
      if (!shareOk) {
        const need = (rule.workload.minShare * basis - value) / (1 - rule.workload.minShare);
        if (need > 0) hints.push(`Add ~$${Math.ceil(need).toLocaleString()} of annual ${rule.workload.label} ACR to clear the ${(rule.workload.minShare * 100).toFixed(0)}% nomination threshold.`);
      }
    }
    checks.push(
      minOk
        ? { state: "pass", label: `${rule.workload.label} ACR $${Math.round(value).toLocaleString()} meets the ${size.size} minimum of $${min.toLocaleString()}` }
        : { state: "fail", label: `${rule.workload.label} ACR $${Math.round(value).toLocaleString()} is below the ${size.size} minimum of $${min.toLocaleString()}` },
    );
  }

  if (p.lane === "post-sales" && deal.credits) {
    checks.push({ state: "warn", label: "Azure credits / ACO / sponsorship must be consumed before incremental ACR counts — performance risk" });
  }
  if (size?.flag) checks.push({ state: "warn", label: size.flag });

  // Caution when the estimate only just clears the band floor (a shortfall counts against the success rate)
  if (size && !alt && p.sizes.indexOf(size) > 0 && basis < size.min * 1.05) {
    hints.push(`Only ${(((basis - size.min) / size.min) * 100).toFixed(1)}% above the ${size.size} floor. Microsoft advises sizing down near a band edge — a claim that misses its minimum counts against your post-sales success rate.`);
  }

  // Upsell hint: next band
  if (size && !rule.workload) {
    const idx = p.sizes.indexOf(size);
    const next = p.sizes[idx + 1];
    if (next && !alt) {
      const gap = next.min - basis + (next.minInclusive ? 0 : 1);
      const delta = payoutFor(next, market) - payoutFor(size, market);
      if (gap > 0 && gap <= Math.max(25000, basis * 0.35) && delta > 0) {
        hints.push(`$${Math.ceil(gap).toLocaleString()} more annual ACR moves this to ${next.size} (+$${delta.toLocaleString()}). Size conservatively — Microsoft advises sizing down near a band edge.`);
      }
    }
  }

  const hasFail = checks.some((c) => c.state === "fail");
  const status = hasFail ? "ineligible" : checks.some((c) => c.state === "warn") ? "conditional" : "eligible";
  return {
    programme: p,
    status,
    market,
    basis,
    basisLabel: p.sizing.label,
    size,
    payout: hasFail ? 0 : payoutFor(size, market),
    stage2: hasFail || !size?.stage2 ? 0 : size.stage2[market] ?? size.stage2.B,
    workload,
    checks,
    hints,
  };
}

export interface CspEstimate {
  rows: { label: string; base: number; rate: number; earn: number }[];
  baseTotal: number;
  growthTotal: number;
  total: number;
  notes: string[];
  eligible: boolean;
  missing: string[];
}

export function cspEstimate(deal: AzureDeal, totals: DealTotals): CspEstimate | null {
  if (deal.licensing !== "csp-direct" && deal.licensing !== "csp-indirect") return null;
  const csp = azureData.csp;
  const creds = new Set(deal.creds);
  const direct = deal.licensing === "csp-direct";
  const missing: string[] = [];
  if (!creds.has(direct ? "csp-direct" : "csp-indirect")) missing.push(direct ? "CSP Direct Bill authorisation" : "CSP Indirect Reseller authorisation");
  const hasSp = ["sp-infra", "sp-data-ai", "sp-dai"].some((c) => creds.has(c));
  if (!hasSp && !(!direct && creds.has("cap-25"))) missing.push(direct ? "Azure Solutions Partner designation" : "Azure Solutions Partner designation or 25 capability points");
  if (!creds.has(direct ? "rev-1m" : "rev-25k")) missing.push(direct ? "$1M TTM CSP revenue" : "$25K TTM CSP revenue");

  const notes: string[] = [];
  const transacted = totals.incrementalAnnual + totals.movedAnnual;
  let baseEarn = Math.min(transacted * 0.03, csp.caps.base);
  if (deal.cocpReplacesAll) {
    baseEarn = 0;
    notes.push("Change of Channel Partner: replacing the entire incumbent partner set removes Core-rate earnings for 12 months.");
  }
  // Growth only on genuinely incremental ACR at tenant level
  const tenantGrowth = Math.max(0, totals.projectedTenantAnnual - Math.max(0, deal.priorYearTenantAcr));
  const growth = Math.min(totals.incrementalAnnual, tenantGrowth);
  const inc = totals.incrementalAnnual || 1;
  const t3 = sumForTags(deal, totals, ["t3"]);
  const t2 = sumForTags(deal, totals, ["t2"]);
  const t1 = Math.max(0, totals.incrementalAnnual - t3 - t2);
  const g3 = (growth * t3) / inc;
  const g2 = (growth * t2) / inc;
  const g1 = (growth * t1) / inc;
  const growthRaw = g3 * 0.12 + g2 * 0.1 + g1 * 0.07;
  const growthEarn = Math.min(growthRaw, csp.caps.growth);
  if (totals.movedAnnual > 0) notes.push("Consumption that is only moved (subscription / tenant / partner change) is treated as Shift and excluded from growth.");
  if (deal.priorYearTenantAcr <= 0 && deal.baselineMonthly > 0) notes.push("Enter the tenant's prior-year ACR for an accurate YoY growth figure; the estimate uses projected tenant ACR minus prior year.");

  const rows = [
    { label: "Consumption + RI / Savings Plan (3%, $150K cap)", base: transacted, rate: 0.03, earn: baseEarn },
    { label: "Growth Accelerator – Tier 3 (12%)", base: g3, rate: 0.12, earn: (g3 * 0.12 * growthEarn) / (growthRaw || 1) },
    { label: "Growth Accelerator – Tier 2 (10%)", base: g2, rate: 0.1, earn: (g2 * 0.1 * growthEarn) / (growthRaw || 1) },
    { label: "Growth Accelerator – Tier 1 (7%)", base: g1, rate: 0.07, earn: (g1 * 0.07 * growthEarn) / (growthRaw || 1) },
  ];
  return { rows, baseTotal: baseEarn, growthTotal: growthEarn, total: baseEarn + growthEarn, notes, eligible: missing.length === 0, missing };
}

export function eaEstimate(deal: AzureDeal, totals: DealTotals) {
  if (deal.licensing !== "ea-indirect") return null;
  const e = azureData.enterprise;
  const creds = new Set(deal.creds);
  const acr = totals.incrementalAnnual + totals.movedAnnual;
  return {
    acr,
    earn: Math.min(acr * e.rate, e.capPerEnrollment),
    eligible: creds.has("lsp"),
    term: e.term,
  };
}

export interface Plan {
  totals: DealTotals;
  all: Evaluation[];
  pre?: Evaluation;
  post?: Evaluation;
  bonuses: Evaluation[];
  security: Evaluation[];
  marketplace: Evaluation[];
  guaranteed: number;
  conditional: number;
  csp: CspEstimate | null;
  ea: ReturnType<typeof eaEstimate>;
  warnings: string[];
}

const best = (evs: Evaluation[]) =>
  evs
    .filter((e) => e.status !== "ineligible")
    .sort((a, b) => b.payout + b.stage2 - (a.payout + a.stage2))[0];

export function buildPlan(deal: AzureDeal): Plan {
  const totals = computeTotals(deal);
  const progs = azureData.programmes;
  const evals = new Map<string, Evaluation>();
  for (const p of progs.filter((p) => !p.rule.linked)) evals.set(p.id, evaluateProgramme(p, deal, totals));
  for (const p of progs.filter((p) => p.rule.linked)) evals.set(p.id, evaluateProgramme(p, deal, totals, evals.get(p.rule.linked!)));
  const all = progs.map((p) => evals.get(p.id)!);

  const pre = best(all.filter((e) => e.programme.lane === "pre-sales"));
  const post = best(all.filter((e) => e.programme.lane === "post-sales" && !e.programme.kind));
  const bonuses = post
    ? all.filter((e) => e.programme.kind === "bonus" && e.programme.rule.linked === post.programme.id && e.status !== "ineligible")
    : [];
  const security = all.filter((e) => e.programme.lane === "two-stage" && e.status !== "ineligible");
  const marketplace = all.filter((e) => e.programme.lane === "marketplace" && e.status !== "ineligible");

  const warnings: string[] = [];
  if (deal.credits) warnings.push("Azure credits, ACO and sponsorships reduce reportable incremental ACR until fully consumed — size conservatively.");
  if (post && security.length && post.programme.id.includes("core-sec"))
    warnings.push("Core M&M with MDC/Sentinel already funds the security consumption in this project. Only run a Sentinel / Defender for Cloud Deployment Accelerator for genuinely separate scope — duplicate funding is recovered.");
  if (deal.scenario === "subscription-move" || deal.scenario === "tenant-change" || deal.scenario === "partner-change") {
    if (totals.movedAnnual === 0 && deal.lines.length)
      warnings.push("This scenario usually moves existing consumption. Enter it under ‘moved consumption’ so only genuinely new ACR is counted — baseline = last 3 months × 12.");
  }
  if (deal.segment === "strategic") warnings.push("Strategic accounts are excluded from all Partner Nominated Azure offers and Security accelerators; Marketplace engagements remain open.");

  const guaranteed =
    (pre?.payout ?? 0) +
    (post?.payout ?? 0) +
    bonuses.reduce((a, b) => a + b.payout, 0) +
    security.reduce((a, s) => a + s.payout, 0) +
    marketplace.reduce((a, m) => a + m.payout, 0);
  const conditional = security.reduce((a, s) => a + s.stage2, 0);

  return {
    totals,
    all,
    pre,
    post,
    bonuses,
    security,
    marketplace,
    guaranteed,
    conditional,
    csp: cspEstimate(deal, totals),
    ea: eaEstimate(deal, totals),
    warnings,
  };
}

/* ---------- Compliance calculators ---------- */

export function ratioCheck(pre: number, postApproved: number, postInProgress: number) {
  const r = azureData.performance.ratio;
  const points = postApproved * r.approvedPoint + postInProgress * r.inProgressPoint;
  const allowed = points * r.maxPrePerPost;
  const compliant = pre <= allowed;
  const shortfall = compliant ? 0 : Math.ceil((pre / r.maxPrePerPost - points) / r.approvedPoint);
  return { points, allowed, compliant, headroom: Math.max(0, Math.floor(allowed - pre)), shortfall };
}

export function incrementalCheck(baseline3: [number, number, number], actualToDate: number, projectedRemainder: number, minimum: number) {
  const avg = (baseline3[0] + baseline3[1] + baseline3[2]) / 3;
  const baseline = avg * 12;
  const fullYear = actualToDate + projectedRemainder;
  const incremental = fullYear - baseline;
  return { avg, baseline, fullYear, incremental, pass: incremental >= minimum };
}

export function successRate(passing: number, measured: number) {
  const rate = measured > 0 ? passing / measured : 1;
  return { rate, compliant: rate >= azureData.performance.successRate.partnerNominated };
}
