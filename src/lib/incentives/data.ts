import azureJson from "@/data/incentives/azure.json";
import mwJson from "@/data/incentives/modern-work.json";
import marketsJson from "@/data/incentives/markets.json";
import metaJson from "@/data/incentives/meta.json";
import credentialsJson from "@/data/incentives/credentials.json";
import catalogJson from "@/data/catalog/azure-services.json";
import type {
  AzureData,
  AzureService,
  CredentialGroup,
  Market,
  MwData,
  PartnerRule,
  SegmentId,
  Sector,
} from "./types";

export const azureData = azureJson as unknown as AzureData;
export const mwData = mwJson as unknown as MwData;
export const meta = metaJson;
export const credentialGroups = credentialsJson.groups as CredentialGroup[];
export const azureServices = catalogJson.services as AzureService[];
export const azureCategories = catalogJson.categories as string[];
export const countries = marketsJson.countries as string[];

const credentialLabels = new Map(credentialGroups.flatMap((g) => g.items.map((i) => [i.id, i.label] as const)));
export const credentialLabel = (id: string) => credentialLabels.get(id) ?? id;

export function azureMarket(country: string): Market {
  return marketsJson.azure.A.includes(country) ? "A" : "B";
}

export function mwMarket(country: string): Market {
  if (marketsJson.mw.A.includes(country)) return "A";
  if (marketsJson.mw.B.includes(country)) return "B";
  return "C";
}

export function isEmergingMarket(country: string) {
  return marketsJson.emergingMarkets.includes(country);
}

export const segments: { id: SegmentId; label: string; group: string }[] = [
  { id: "strategic", label: "Strategic (Strategic 500)", group: "Enterprise" },
  { id: "majors", label: "Majors (Enterprise Commercial / Public Sector)", group: "Enterprise" },
  { id: "smc-corporate", label: "SMC – Corporate", group: "SMC" },
  { id: "smb-commercial", label: "SMB – Commercial", group: "SMB" },
  { id: "smb-government", label: "SMB – Government", group: "SMB" },
  { id: "smb-edu", label: "SMB – EDU (MS Elevate)", group: "SMB" },
  { id: "smb-nfp", label: "SMB – Nonprofit (MS Elevate)", group: "SMB" },
  { id: "smb-default", label: "SMB – Default", group: "SMB" },
  { id: "smb-undefined", label: "SMB – Undefined", group: "SMB" },
];

export const sectors: { id: Sector; label: string }[] = [
  { id: "commercial", label: "Commercial" },
  { id: "government", label: "Government / Public sector" },
  { id: "education", label: "Education" },
  { id: "nonprofit", label: "Non-profit" },
];

export function segmentLabel(id: string) {
  return segments.find((s) => s.id === id)?.label ?? id;
}

/** Returns which partner requirements are missing; empty array means eligible. */
export function missingCredentials(rule: PartnerRule, creds: Set<string>): string[] {
  const missing: string[] = [];
  if (rule.anyOf && rule.anyOf.length && !rule.anyOf.some((c) => creds.has(c))) {
    missing.push(`one of: ${rule.anyOf.map(credentialLabel).join(" · ")}`);
  }
  for (const c of rule.allOf ?? []) {
    if (!creds.has(c)) missing.push(credentialLabel(c));
  }
  if (rule.minOf) {
    const held = rule.minOf.of.filter((c) => creds.has(c)).length;
    if (held < rule.minOf.n) missing.push(`${rule.minOf.n} of: ${rule.minOf.of.map(credentialLabel).join(" · ")} (you hold ${held})`);
  }
  return missing;
}

export function sourceLabel(src: { doc: string; pages: number[] }) {
  const doc = src.doc === "cpi" ? "Partner Incentives Guide" : "FY27 MCI summary";
  const pages = src.pages.length > 1 ? `pp. ${src.pages[0]}–${src.pages[src.pages.length - 1]}` : `p. ${src.pages[0]}`;
  return `${doc}, ${pages}`;
}
