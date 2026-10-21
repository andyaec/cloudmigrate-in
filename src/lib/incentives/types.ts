export type Market = "A" | "B" | "C";
export type Payout = { A: number; B: number; C?: number };

export type SegmentId =
  | "strategic"
  | "majors"
  | "smc-corporate"
  | "smb-commercial"
  | "smb-government"
  | "smb-edu"
  | "smb-nfp"
  | "smb-default"
  | "smb-undefined";

export type Sector = "commercial" | "government" | "education" | "nonprofit";

export interface SourceRef {
  doc: "cpi" | "mci";
  pages: number[];
}

export interface PartnerRule {
  anyOf?: string[];
  allOf?: string[];
  minOf?: { of: string[]; n: number };
  text: string[];
}

export interface SizeBand {
  size: string;
  min: number;
  max?: number | null;
  minInclusive?: boolean;
  min2?: number;
  reduce?: number;
  altMin?: number;
  altMax?: number | null;
  workloadMin?: number;
  payout: Payout;
  stage2?: Payout;
  hours?: number;
  durationDays?: number;
  perf?: string;
  perfMin?: number;
  target?: number;
  flag?: string;
}

export type AzureLane = "pre-sales" | "post-sales" | "two-stage" | "marketplace";

export interface AzureRule {
  anchor?: string[];
  scope?: string[];
  workload?: { tags: string[]; minShare: number; label: string };
  linked?: string;
  sourcePlatforms?: string[];
  requiresFlag?: "isSdc" | "isSiForSdc";
  metricInput?: "mbs" | "agentMau";
}

export interface AzureProgramme {
  id: string;
  lane: AzureLane;
  track: "specialized" | "smb" | "security" | "sdc" | "si-led" | "build-publish";
  kind?: "bonus";
  requires?: string[];
  name: string;
  short: string;
  summary: string;
  qualifying: string;
  earningType: string;
  markets: "AB" | "ABC";
  partner: PartnerRule;
  customer: { segments: string[]; text: string[]; propensityList?: boolean };
  sizing: { metric: string; label: string; alt?: string };
  sizes: SizeBand[];
  rule: AzureRule;
  poe: string[];
  controls: string[];
  notes?: string[];
  source: SourceRef;
}

export interface CspLever {
  id: string;
  label: string;
  rate: number;
  cap?: number | null;
  capGroup?: string;
}

export interface AzureData {
  programmes: AzureProgramme[];
  csp: {
    id: string;
    name: string;
    term: string;
    earningType: string;
    association: string;
    eligibility: { direct: string[]; indirect: string[] };
    levers: CspLever[];
    caps: Record<string, number>;
    rules: string[];
    source: SourceRef;
  };
  cocp: { title: string; rules: string[]; source: SourceRef };
  enterprise: {
    id: string;
    name: string;
    term: string;
    rate: number;
    capPerEnrollment: number;
    eligibility: string[];
    rules: string[];
    source: SourceRef;
  };
  performance: {
    ratio: { maxPrePerPost: number; approvedPoint: number; inProgressPoint: number; noticeDays: number };
    successRate: { partnerNominated: number; marketplaceMonitor: number; deckHeadline: number };
    baseline: string;
    grace: string;
    credits: string;
    source: SourceRef;
  };
}

export type MwFamily = "copilot" | "productivity" | "security" | "bizapps";
export type MwLane = "envisioning" | "deployment" | "conversion" | "usage" | "activation";

export interface MwProgramme {
  id: string;
  family: MwFamily;
  lane: MwLane;
  kind?: "bonus";
  requires?: string[];
  competitors?: string[];
  name: string;
  short: string;
  summary: string;
  earningType: string;
  term?: string;
  partner: PartnerRule;
  customer: {
    excludeStrategic?: boolean;
    excludeEduNfp?: boolean;
    excludeEduNfpSizes?: string[];
    cspNewSeats?: boolean;
    usage?: { maxPct: number; workload: string };
    text: string[];
  };
  sizing?: { metric: string; metric2?: string; label: string };
  sizes?: SizeBand[];
  calc?: {
    ratePerMau: number;
    maxUnits: number;
    maxPayout: number;
    minPayout: number;
    activationMau: number;
    activationConsumption: number;
  };
  poe: string[];
  controls: string[];
  toolkit?: string;
  source: SourceRef;
}

export interface CporRate {
  id: string;
  label: string;
  unit: "seat" | "bundle";
  ENT: number;
  SMC: number;
}

export interface MwData {
  programmes: MwProgramme[];
  cpor: {
    id: string;
    name: string;
    short: string;
    term: string;
    summary: string;
    eligibility: string[];
    rates: CporRate[];
    rules: string[];
    source: SourceRef;
  };
  csp: {
    term: string;
    earningType: string;
    m365: {
      direct: CspLever[];
      indirect: CspLever[];
      eligibility: { direct: string[]; indirect: string[] };
      emergingMarketBusinessStandard: { direct: number; indirect: number; note: string };
    };
    d365: { direct: CspLever[]; indirect: CspLever[]; eligibility: { direct: string[]; indirect: string[] } };
    growthRules: string[];
    source: SourceRef;
  };
  performance: { portfolioRate: number; milestones: string[]; notes: string[]; source: SourceRef };
}

export interface AzureService {
  id: string;
  n: string;
  c: string;
  t: string[];
  a: string;
}

export interface CredentialGroup {
  id: string;
  label: string;
  items: { id: string; label: string }[];
}
