export const site = {
  name: "CloudMigrate",
  domain: "cloudmigrate.in",
  url: "https://cloudmigrate.in",
  email: "hello@cloudmigrate.in",
  tagline: "Everything cloud. One accountable team.",
  description:
    "CloudMigrate handles everything cloud — sales and commercials, assessment, migration, delivery and managed services, security assessment and proofs of concept — across AWS, Microsoft Azure, Google Cloud, JioCloud and Oracle Cloud Infrastructure.",
};

export type ServiceSlug = "sales" | "assessment" | "migration" | "managed-services" | "security-assessment" | "poc";

export interface ServiceMeta {
  slug: ServiceSlug;
  n: string;
  title: string;
  short: string;
  blurb: string;
}

export const services: ServiceMeta[] = [
  {
    slug: "sales",
    n: "01",
    title: "Sales & Commercials",
    short: "Sales",
    blurb: "Licensing, commit structures, marketplace and vendor funding — so the commercial model is as engineered as the architecture.",
  },
  {
    slug: "assessment",
    n: "02",
    title: "Assessment",
    short: "Assessment",
    blurb: "Discovery, dependency mapping, TCO and a wave plan you can defend to a CFO — built from telemetry, not spreadsheets of guesses.",
  },
  {
    slug: "migration",
    n: "03",
    title: "Migration",
    short: "Migration",
    blurb: "Landing zones, factory-model waves, rehearsed cutovers and rollback plans for servers, databases, SAP, VMware and desktops.",
  },
  {
    slug: "managed-services",
    n: "04",
    title: "Delivery & Managed Services",
    short: "Managed Services",
    blurb: "24×7 operations, SRE, patching, backup, FinOps and continuous optimisation under clear SLAs and a single RACI.",
  },
  {
    slug: "security-assessment",
    n: "05",
    title: "Security Assessment",
    short: "Security Assessment",
    blurb: "Posture, identity, data and threat reviews mapped to CIS, vendor benchmarks and India's DPDP and CERT-In obligations.",
  },
  {
    slug: "poc",
    n: "06",
    title: "Proofs of Concept",
    short: "POCs",
    blurb: "Time-boxed POCs and pilots with written success criteria, production-grade guardrails and an honest go / no-go.",
  },
];

export type CloudSlug = "aws" | "azure" | "google-cloud" | "jiocloud" | "oci";

export interface CloudMeta {
  slug: CloudSlug;
  name: string;
  short: string;
  logo: string;
  color: string;
  tagline: string;
  intro: string;
  facts: { k: string; v: string }[];
}

export const clouds: CloudMeta[] = [
  {
    slug: "aws",
    name: "Amazon Web Services",
    short: "AWS",
    logo: "/logos/aws.svg",
    color: "var(--c-aws)",
    tagline: "The broadest service catalogue, run with discipline.",
    intro:
      "AWS rewards teams that treat accounts, guardrails and automation as the product. We build multi-account foundations with Control Tower, migrate at factory pace with Application Migration Service and DMS, and keep the estate honest with Savings Plans, Graviton and Well-Architected reviews.",
    facts: [
      { k: "India regions", v: "Mumbai · Hyderabad" },
      { k: "Foundation", v: "Control Tower + Organizations" },
      { k: "Migration engine", v: "MGN · DMS · Migration Hub" },
      { k: "Funding", v: "MAP assess / mobilise / migrate" },
    ],
  },
  {
    slug: "azure",
    name: "Microsoft Azure",
    short: "Azure",
    logo: "/logos/azure.svg",
    color: "var(--c-azure)",
    tagline: "Where the Microsoft estate — and its licences — already lives.",
    intro:
      "Most Indian enterprises already run on Windows Server, SQL Server and Microsoft 365. Azure turns that into leverage: Azure Hybrid Benefit, ESUs, Entra ID and Defender carry straight across. We land workloads on Cloud Adoption Framework landing zones and make Microsoft's FY27 partner investments work for the customer.",
    facts: [
      { k: "India regions", v: "Central · South · West · Jio-Azure" },
      { k: "Foundation", v: "CAF Azure Landing Zones" },
      { k: "Migration engine", v: "Azure Migrate · DMS · ASR" },
      { k: "Funding", v: "Frontier Accelerate (FY27)" },
    ],
  },
  {
    slug: "google-cloud",
    name: "Google Cloud",
    short: "Google Cloud",
    logo: "/logos/google-cloud.svg",
    color: "var(--c-gcp)",
    tagline: "Data, analytics and AI first — with a clean network model.",
    intro:
      "Google Cloud is at its best when data gravity and AI are the reason to move. We pair BigQuery, Vertex AI and GKE with a Cloud Foundation Fabric landing zone, use Migration Center for evidence-based planning, and fund it through RaMP and committed-use structures.",
    facts: [
      { k: "India regions", v: "Mumbai · Delhi" },
      { k: "Foundation", v: "Cloud Foundation Fabric" },
      { k: "Migration engine", v: "Migration Center · Migrate to VMs · DMS" },
      { k: "Funding", v: "RaMP · CUDs · Marketplace" },
    ],
  },
  {
    slug: "jiocloud",
    name: "JioCloud",
    short: "JioCloud",
    logo: "/logos/jiocloud.svg",
    color: "var(--c-jio)",
    tagline: "Sovereign-by-default cloud on India's largest network.",
    intro:
      "For regulated Indian workloads — BFSI, government, healthcare, telecom — Jio's cloud and its Azure-powered data centres in India give in-country residency, rupee billing and proximity to a nationwide 5G and fibre backbone. We design for DPDP Act, CERT-In and sector-regulator obligations from the first diagram.",
    facts: [
      { k: "Residency", v: "In-country, India" },
      { k: "Billing", v: "INR · GST invoicing" },
      { k: "Network", v: "Jio fibre, MPLS & 5G edge" },
      { k: "Compliance", v: "DPDP · CERT-In · RBI / SEBI / IRDAI" },
    ],
  },
  {
    slug: "oci",
    name: "Oracle Cloud Infrastructure",
    short: "OCI",
    logo: "/logos/oracle.svg",
    color: "var(--c-oci)",
    tagline: "The natural home for Oracle databases and E-Business estates.",
    intro:
      "When the crown jewels are Oracle Database, Exadata, E-Business Suite or JD Edwards, OCI removes licensing friction and performance risk. We migrate with Zero Downtime Migration and GoldenGate, land on the OCI CIS Landing Zone, and use Universal Credits, BYOL and Support Rewards to make the economics land.",
    facts: [
      { k: "India regions", v: "Mumbai · Hyderabad" },
      { k: "Foundation", v: "OCI CIS Landing Zone" },
      { k: "Migration engine", v: "ZDM · GoldenGate · Cloud Migrations" },
      { k: "Funding", v: "Oracle Cloud Lift · Support Rewards" },
    ],
  },
];

export const cloudBySlug = (slug: string) => clouds.find((c) => c.slug === slug);
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
