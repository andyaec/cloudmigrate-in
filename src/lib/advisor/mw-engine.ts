import { isEmergingMarket, missingCredentials, mwData, mwMarket } from "@/lib/incentives/data";
import type { CspLever, Market, MwFamily, MwProgramme, SegmentId, Sector, SizeBand } from "@/lib/incentives/types";
import type { Check } from "./azure-engine";

export type Competitor = "google-workspace" | "crowdstrike" | "proofpoint" | "sentinelone" | "salesforce" | "sap" | "genesys";

export interface MwProfile {
  segment: SegmentId;
  sector: Sector;
  country: string;
  creds: string[];
  // existing estate
  m365Seats: number;
  o365Seats: number;
  intuneCoveragePct: number;
  copilotSeats: number;
  copilotMau: number;
  w11IntuneSeats: number;
  intuneMauPct: number;
  me35Seats: number;
  oe3EmsSeats: number;
  fy26SecurityWorkshops: number;
  // planned CSP purchases
  newMe3Seats: number;
  newBpSeats: number;
  newW365Seats: number;
  newMe5Seats: number;
  newDpSeats: number;
  newBpDpSeats: number;
  d365Acv: number;
  // competitor seats being transitioned
  competitorSeats: Record<Competitor, number>;
  // usage accelerators
  eaNonUnified: boolean;
  renewalDue: boolean;
  dsPau: number;
  dsMpu: number;
  xdrPau: number;
  xdrMpu: number;
}

export const defaultProfile: MwProfile = {
  segment: "majors",
  sector: "commercial",
  country: "India",
  creds: [],
  m365Seats: 0,
  o365Seats: 0,
  intuneCoveragePct: 0,
  copilotSeats: 0,
  copilotMau: 0,
  w11IntuneSeats: 0,
  intuneMauPct: 0,
  me35Seats: 0,
  oe3EmsSeats: 0,
  fy26SecurityWorkshops: 0,
  newMe3Seats: 0,
  newBpSeats: 0,
  newW365Seats: 0,
  newMe5Seats: 0,
  newDpSeats: 0,
  newBpDpSeats: 0,
  d365Acv: 0,
  competitorSeats: { "google-workspace": 0, crowdstrike: 0, proofpoint: 0, sentinelone: 0, salesforce: 0, sap: 0, genesys: 0 },
  eaNonUnified: false,
  renewalDue: false,
  dsPau: 0,
  dsMpu: 0,
  xdrPau: 0,
  xdrMpu: 0,
};

export const competitorLabels: Record<Competitor, string> = {
  "google-workspace": "Google Workspace",
  crowdstrike: "CrowdStrike",
  proofpoint: "Proofpoint",
  sentinelone: "SentinelOne",
  salesforce: "Salesforce",
  sap: "SAP",
  genesys: "Genesys",
};

export interface MwEvaluation {
  programme: MwProgramme;
  status: "eligible" | "conditional" | "ineligible";
  market: Market;
  size?: SizeBand;
  payout: number;
  metricValue: number;
  checks: Check[];
  hints: string[];
  pairedWith?: string;
}

function metric(profile: MwProfile, key: string): number {
  switch (key) {
    case "mpuWhitespaceDs":
      return Math.max(0, profile.dsPau - profile.dsMpu);
    case "mpuWhitespaceXdr":
      return Math.max(0, profile.xdrPau - profile.xdrMpu);
    case "copilotMauGap":
      return Math.max(0, profile.copilotSeats - profile.copilotMau);
    case "competitorSeatsReduced":
      return 0;
    default:
      return Number((profile as unknown as Record<string, number>)[key] ?? 0);
  }
}

function competitorReduced(p: MwProgramme, profile: MwProfile) {
  return Math.max(0, ...(p.competitors ?? []).map((c) => profile.competitorSeats[c as Competitor] ?? 0));
}

function eduNfp(profile: MwProfile) {
  return profile.sector === "education" || profile.sector === "nonprofit" || profile.segment === "smb-edu" || profile.segment === "smb-nfp";
}

/** Highest size whose thresholds are met, honouring EDU / NFP size exclusions. */
function sizeFor(p: MwProgramme, profile: MwProfile): SizeBand | undefined {
  const v = metric(profile, p.sizing!.metric);
  const v2 = p.sizing!.metric2 ? metric(profile, p.sizing!.metric2) : Infinity;
  let chosen: SizeBand | undefined;
  for (const s of p.sizes ?? []) {
    if (p.customer.excludeEduNfpSizes?.includes(s.size) && eduNfp(profile)) continue;
    if (v >= s.min && (s.min2 == null || v2 >= s.min2)) chosen = s;
  }
  return chosen;
}

export function evaluateMw(p: MwProgramme, profile: MwProfile, all?: Map<string, MwEvaluation>): MwEvaluation {
  const market = mwMarket(profile.country);
  const creds = new Set(profile.creds);
  const checks: Check[] = [];
  const hints: string[] = [];

  const missing = missingCredentials(p.partner, creds);
  checks.push(missing.length ? { state: "fail", label: `Partner credential missing — ${missing.join("; ")}` } : { state: "pass", label: p.partner.text[0] });

  if (p.customer.excludeStrategic) {
    checks.push(profile.segment === "strategic" ? { state: "fail", label: "Strategic 500 customers are ineligible" } : { state: "pass", label: "Not a Strategic 500 customer" });
  }
  if (p.customer.excludeEduNfp) {
    checks.push(eduNfp(profile) ? { state: "fail", label: "EDU and Non-profit customers are excluded" } : { state: "pass", label: "Commercial / government customer" });
  }

  // Programme-specific gates
  if (p.id === "me3-epoc") {
    checks.push(profile.intuneCoveragePct <= 50 ? { state: "pass", label: `Intune coverage ${profile.intuneCoveragePct}% (≤ 50%)` } : { state: "fail", label: `Intune coverage ${profile.intuneCoveragePct}% — must be ≤ 50%` });
  }
  if (p.id === "w365-epoc") {
    checks.push(profile.intuneMauPct >= 40 ? { state: "pass", label: `Intune MAU ÷ PAU ${profile.intuneMauPct}% (≥ 40%)` } : { state: "fail", label: `Intune MAU ÷ PAU ${profile.intuneMauPct}% — needs ≥ 40%` });
  }
  if (p.id.startsWith("sec-epoc")) {
    checks.push(profile.fy26SecurityWorkshops >= 3 ? { state: "fail", label: `${profile.fy26SecurityWorkshops} security workshops claimed in FY26 — tenant is excluded from FY27 presales` } : { state: "pass", label: "Fewer than 3 security workshops claimed on this tenant in FY26" });
  }
  if (p.customer.usage) {
    const pau = p.id === "sec-ua-ds" ? profile.dsPau : profile.xdrPau;
    const mpu = p.id === "sec-ua-ds" ? profile.dsMpu : profile.xdrMpu;
    const pct = pau > 0 ? (mpu / pau) * 100 : 0;
    checks.push(pau > 0 && pct < p.customer.usage.maxPct ? { state: "pass", label: `${p.customer.usage.workload} usage ${pct.toFixed(0)}% of PAU (< ${p.customer.usage.maxPct}%)` } : { state: "fail", label: `${p.customer.usage.workload} usage must be below ${p.customer.usage.maxPct}% MPU of PAU (now ${pct.toFixed(0)}%)` });
    checks.push(profile.eaNonUnified ? { state: "pass", label: "EA customer without Unified Support, commercial E5" } : { state: "fail", label: "Must be a non-Unified-Support EA customer with commercial E5" });
    checks.push(profile.renewalDue ? { state: "pass", label: "Renewal due in FY27 or FY28" } : { state: "fail", label: "Renewal must fall in FY27 or FY28" });
  }

  let size = p.sizes ? sizeFor(p, profile) : undefined;
  let pairedWith: string | undefined;

  if (p.kind === "bonus" && p.requires?.length) {
    const da = all?.get(p.requires[0]);
    const reduced = competitorReduced(p, profile);
    const comps = (p.competitors ?? []).map((c) => competitorLabels[c as Competitor]).join(" / ");
    if (!da || da.status === "ineligible" || !da.size) {
      checks.push({ state: "fail", label: `Requires a completed ${da?.programme.short ?? "Deployment Accelerator"} on the tenant first` });
      size = undefined;
    } else {
      // The bonus must match the DA size. Find the best pairing at or below the DA's size.
      const daIdx = da.programme.sizes!.findIndex((s) => s.size === da.size!.size);
      let bestPair: { s: SizeBand; total: number } | undefined;
      for (const s of p.sizes ?? []) {
        const di = da.programme.sizes!.findIndex((x) => x.size === s.size);
        if (di < 0 || di > daIdx) continue;
        if (reduced < (s.reduce ?? 0)) continue;
        const total = (s.payout[market] ?? 0) + (da.programme.sizes![di].payout[market] ?? 0);
        if (!bestPair || total > bestPair.total) bestPair = { s, total };
      }
      const daAlone = da.size.payout[market] ?? 0;
      const needAtDaSize = p.sizes?.find((s) => s.size === da.size!.size)?.reduce ?? 0;
      if (bestPair && bestPair.s.size !== da.size.size && bestPair.total <= daAlone) {
        // Downsizing the accelerator to pair the bonus would earn less than the accelerator alone.
        checks.push({
          state: "fail",
          label: `Pairing at ${bestPair.s.size} pays $${bestPair.total.toLocaleString()} in total — less than the ${da.size.size} Deployment Accelerator alone ($${daAlone.toLocaleString()}). Transition ${needAtDaSize.toLocaleString()}+ ${comps} seats to unlock the ${da.size.size} bonus.`,
        });
        size = undefined;
      } else if (bestPair) {
        size = bestPair.s;
        pairedWith = bestPair.s.size;
        checks.push({ state: "pass", label: `${reduced.toLocaleString()} ${comps} seats transitioned (≥ ${bestPair.s.reduce} for ${bestPair.s.size})` });
        if (bestPair.s.size !== da.size.size) hints.push(`Nominate the Deployment Accelerator at ${bestPair.s.size} (not ${da.size.size}) so the conversion bonus can pair — combined payout is higher.`);
      } else {
        const need = p.sizes?.find((s) => s.size === da.size!.size)?.reduce ?? p.sizes?.[0].reduce ?? 0;
        checks.push({ state: "fail", label: `Transition at least ${need.toLocaleString()} ${comps} seats (50% of the band minimum) — currently ${reduced.toLocaleString()}` });
        size = undefined;
      }
      checks.push({ state: "warn", label: "Claim no sooner than 30 days after the Deployment Accelerator POE is approved; same partner and same size" });
    }
  } else if (p.sizes) {
    const v = metric(profile, p.sizing!.metric);
    checks.push(size ? { state: "pass", label: `Sized ${size.size}` } : { state: "fail", label: `Below the ${p.sizes[0].size} threshold (${p.sizes[0].min.toLocaleString()}${p.sizing?.metric === "d365Acv" ? " USD ACV" : ""}) — current ${v.toLocaleString()}` });
    if (size) {
      const idx = p.sizes.indexOf(size);
      const next = p.sizes[idx + 1];
      if (next && !(p.customer.excludeEduNfpSizes?.includes(next.size) && eduNfp(profile))) {
        const gap = next.min - v;
        const delta = (next.payout[market] ?? 0) - (size.payout[market] ?? 0);
        if (gap > 0 && gap <= Math.max(100, next.min * 0.3)) hints.push(`${gap.toLocaleString()} more ${p.sizing?.metric === "d365Acv" ? "USD of ACV" : "seats"} reaches ${next.size} (+$${delta.toLocaleString()}).`);
      }
    }
    if (p.customer.cspNewSeats) checks.push({ state: "warn", label: "Seats must be net-new paid adds via CSP annual / 3-year term; like-for-like renewals and EA→CSP moves don't count" });
  }

  const hasFail = checks.some((c) => c.state === "fail");
  const status = hasFail ? "ineligible" : checks.some((c) => c.state === "warn") ? "conditional" : "eligible";
  return {
    programme: p,
    status,
    market,
    size: hasFail ? undefined : size,
    payout: hasFail || !size ? 0 : size.payout[market] ?? 0,
    metricValue: p.sizing ? metric(profile, p.sizing.metric) : 0,
    checks,
    hints,
    pairedWith,
  };
}

export function evaluateFamily(profile: MwProfile, family?: MwFamily) {
  const map = new Map<string, MwEvaluation>();
  const progs = mwData.programmes.filter((p) => p.id !== "cop-cowork");
  for (const p of progs.filter((p) => p.kind !== "bonus")) map.set(p.id, evaluateMw(p, profile));
  for (const p of progs.filter((p) => p.kind === "bonus")) map.set(p.id, evaluateMw(p, profile, map));
  // When a DA is paired down for a bonus, reflect the DA at the paired size
  for (const ev of map.values()) {
    if (ev.programme.kind === "bonus" && ev.pairedWith && ev.status !== "ineligible") {
      const da = map.get(ev.programme.requires![0]);
      if (da?.size && da.size.size !== ev.pairedWith) {
        const s = da.programme.sizes!.find((x) => x.size === ev.pairedWith);
        if (s) map.set(da.programme.id, { ...da, size: s, payout: s.payout[da.market] ?? 0, hints: [...da.hints, `Nominated at ${s.size} to pair with ${ev.programme.short}.`] });
      }
    }
  }
  const list = [...map.values()];
  return family ? list.filter((e) => e.programme.family === family) : list;
}

/* ---------- Copilot Cowork CSP activation ---------- */
export interface CoworkInput {
  baseMau: number;
  baseConsumption: number;
  m3Mau: number;
  m3Consumption: number;
  cspLed: boolean;
}

export function coworkCalc(input: CoworkInput, profile: MwProfile) {
  const prog = mwData.programmes.find((p) => p.id === "cop-cowork")!;
  const c = prog.calc!;
  const checks: Check[] = [];
  const creds = new Set(profile.creds);
  const missing = missingCredentials(prog.partner, creds);
  checks.push(missing.length ? { state: "fail", label: `Needs CSP authorisation — ${missing.join("; ")}` } : { state: "pass", label: "CSP authorised partner" });
  const sp = ["sp-modern-work", "sp-bizapps", "sp-infra", "sp-data-ai", "sp-dai"].some((x) => creds.has(x)) || (creds.has("csp-indirect") && creds.has("cap-25"));
  checks.push(sp ? { state: "pass", label: "Qualifying Solutions Partner designation (or 25 capability points for indirect)" } : { state: "fail", label: "Needs a Modern Work / Business Apps / Azure Solutions Partner designation (indirect: or 25 capability points)" });
  checks.push(profile.segment !== "strategic" ? { state: "pass", label: "Not Strategic 500" } : { state: "fail", label: "Strategic 500 excluded" });
  const baseOk = input.baseMau < c.activationMau && input.baseConsumption < c.activationConsumption;
  checks.push(baseOk ? { state: "pass", label: `August 2026 baseline below ${c.activationMau} MAU and $${c.activationConsumption.toLocaleString()}` } : { state: "fail", label: "Customer was already above the activation thresholds in August 2026" });
  checks.push(input.cspLed ? { state: "pass", label: "≥ 50% of Copilot licences and Cowork consumption transacted via CSP" } : { state: "fail", label: "Customer must be CSP-led (≥ 50% on both measures)" });
  const actOk = input.m3Mau >= c.activationMau && input.m3Consumption >= c.activationConsumption;
  checks.push(actOk ? { state: "pass", label: `Month-3: ${input.m3Mau} MAU and $${input.m3Consumption.toLocaleString()} consumption clear the thresholds` } : { state: "fail", label: `Month-3 must show ≥ ${c.activationMau} MAU and ≥ $${c.activationConsumption.toLocaleString()} consumption` });
  checks.push({ state: "warn", label: "You must be TPOR for both the Copilot licences and the Azure subscription carrying Cowork in Month 1 and Month 3" });

  const incMau = Math.max(0, input.m3Mau - input.baseMau);
  const consMau = Math.floor(Math.max(0, input.m3Consumption - input.baseConsumption) / c.ratePerMau);
  const qualified = Math.min(incMau, consMau, c.maxUnits);
  let payout = Math.min(qualified * c.ratePerMau, c.maxPayout);
  const failed = checks.some((x) => x.state === "fail");
  if (failed || payout < c.minPayout) payout = failed ? 0 : payout;
  return { checks, incMau, consMau, qualified, payout, failed, belowMin: !failed && payout > 0 && payout < c.minPayout };
}

/* ---------- Biz Apps Presales Advisor (CPOR) ---------- */
export interface CporLine {
  id: string;
  hwm: number;
  current: number;
}

export function cporCalc(lines: CporLine[], seg: "ENT" | "SMC", licensing: "ea" | "csp", creds: string[]) {
  const rates = mwData.cpor.rates;
  const rows = lines.map((l) => {
    const r = rates.find((x) => x.id === l.id)!;
    const inc = Math.max(0, l.current - l.hwm);
    return { label: r.label, unit: r.unit, inc, rate: r[seg], earn: inc * r[seg] };
  });
  const blockers: string[] = [];
  if (licensing === "csp") blockers.push("CSP transactions are not eligible — CSP D365 earns through the D365 CSP incentive instead.");
  if (!creds.includes("sp-bizapps")) blockers.push("Requires Solutions Partner for Business Applications.");
  return { rows, total: blockers.length ? 0 : rows.reduce((a, r) => a + r.earn, 0), blockers };
}

/* ---------- CSP transactional (M365 / D365) ---------- */
export interface CspRevenueInput {
  type: "direct" | "indirect";
  m365: { core: number; t2: number; t1: number; pstn: number; priorYearTenant: number; currentYearTenant: number; businessStandard: number };
  d365: { core: number; t2: number; t1: number; priorYearTenant: number; currentYearTenant: number; growthEligible: number };
  cocp: boolean;
}

function leverEarn(l: CspLever, base: number) {
  const raw = base * l.rate;
  return l.cap ? Math.min(raw, l.cap) : raw;
}

export function cspMwCalc(input: CspRevenueInput, country: string) {
  const m = mwData.csp.m365[input.type];
  const d = mwData.csp.d365[input.type];
  const em = isEmergingMarket(country);
  const rows: { area: string; label: string; base: number; rate: number; earn: number }[] = [];
  const mGrowthBase = Math.min(Math.max(0, input.m365.currentYearTenant - input.m365.priorYearTenant), input.m365.t1 + input.m365.t2);
  for (const l of m) {
    let base = 0;
    if (l.id === "core") base = input.m365.core;
    if (l.id === "t2") base = input.m365.t2;
    if (l.id === "t1") base = input.m365.t1;
    if (l.id === "pstn") base = input.m365.pstn;
    if (l.id === "growth") base = mGrowthBase;
    let earn = leverEarn(l, base);
    if (input.cocp && (l.id === "core" || l.id === "t1" || l.id === "t2")) earn = 0;
    rows.push({ area: "Microsoft 365", label: l.label, base, rate: l.rate, earn });
  }
  if (em && input.m365.businessStandard > 0) {
    const rate = mwData.csp.m365.emergingMarketBusinessStandard[input.type];
    const growthShare = Math.min(input.m365.businessStandard, Math.max(0, input.m365.currentYearTenant - input.m365.priorYearTenant - mGrowthBase));
    rows.push({ area: "Microsoft 365", label: "Business Standard growth (emerging-market rate)", base: growthShare, rate, earn: growthShare * rate });
  }
  const dGrowthBase = Math.min(Math.max(0, input.d365.currentYearTenant - input.d365.priorYearTenant), input.d365.growthEligible);
  for (const l of d) {
    let base = 0;
    if (l.id === "core") base = input.d365.core;
    if (l.id === "t2") base = input.d365.t2;
    if (l.id === "t1") base = input.d365.t1;
    if (l.id === "growth") base = dGrowthBase;
    let earn = leverEarn(l, base);
    if (input.cocp && (l.id === "core" || l.id === "t1" || l.id === "t2")) earn = 0;
    rows.push({ area: "Dynamics 365", label: l.label, base, rate: l.rate, earn });
  }
  return { rows, total: rows.reduce((a, r) => a + r.earn, 0), emerging: em };
}
