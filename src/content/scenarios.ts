import type { Scenario } from "@/lib/advisor/azure-engine";

export const scenarios: { id: Scenario; title: string; short: string; guidance: string[] }[] = [
  {
    id: "new-migration",
    title: "Customer is migrating to Azure",
    short: "On-premises, VMware, SAP or another cloud moving to Azure.",
    guidance: [
      "Lead with a funded Assessment + POV (Majors and SMC-Corporate) or the SMB pre-sales engagement, then nominate one post-sales engagement for the delivery.",
      "If the source databases are AWS RDS / Aurora or Google Cloud SQL / BigQuery, a Databases engagement unlocks the Conversion Bonus on top.",
      "Capture customer consent early and record Azure Subscription IDs — incremental ACR is tracked for 12 months from claim submission.",
      "Estimate with the Azure Pricing Calculator and size conservatively; Microsoft advises sizing down near a band edge.",
    ],
  },
  {
    id: "expand",
    title: "Existing Azure customer adding workloads",
    short: "New AI, data, security or app workloads on a tenant that already consumes Azure.",
    guidance: [
      "Only incremental ACR counts: baseline = average of the last 3 full months before consent × 12; incremental = projected 12-month ACR − baseline.",
      "Nominate one engagement per project. Splitting one project into several claims is treated as fragmentation and can suspend the partner.",
      "Azure credits, ACO and sponsorships must be consumed before incremental ACR is recognised — check the customer's credit position first.",
      "Security workloads (Sentinel / Defender for Cloud) can run as separate two-stage accelerators when they are genuinely separate scope.",
    ],
  },
  {
    id: "subscription-move",
    title: "Changing subscriptions or licensing route",
    short: "EA → CSP, PAYG → CSP, EA → MCA-E, or consolidating subscriptions.",
    guidance: [
      "Moving existing consumption to new subscriptions does not create incremental ACR — enter it as ‘moved consumption’ so the advisor excludes it.",
      "List the new Subscription IDs on the Engagement Details document; Microsoft tracks ACR at subscription / TPID level.",
      "EA → CSP: Change of Channel Partner applies only if EA monthly revenue drops significantly AND a new CSP partner is introduced — and then only to the new partner.",
      "In CSP, growth accelerators pay on year-over-year tenant growth; revenue that only shifted channels is classified ‘Shift’, not growth.",
      "Re-link your Partner ID (Partner Admin Link) on every new subscription you manage.",
    ],
  },
  {
    id: "tenant-change",
    title: "Tenant consolidation or new tenant",
    short: "M&A, divestment, re-organisation or moving workloads between Entra tenants.",
    guidance: [
      "Claim limits are per Tenant ID + TPID (+ T-shirt size and Partner Location ID from 1 Aug 2026). A new tenant must be detected as valid by Microsoft before nomination.",
      "Security two-stage accelerators allow one approved claim per tenant per fiscal year and one concurrent claim — check whether the receiving tenant already used it.",
      "Consumption that simply moves between tenants is Shift, not growth — enter it as moved consumption.",
      "CSP growth is measured per tenant and solution area; the new tenant's prior-year baseline includes all revenue Microsoft can attribute to it.",
    ],
  },
  {
    id: "partner-change",
    title: "Customer is changing partner to us",
    short: "Becoming the CSP, LSP, CPOR or delivery partner for an existing Azure customer.",
    guidance: [
      "Change of Channel Partner (COCP): if you replace the customer's entire CSP partner set, Core and Strategic accelerator earnings are not paid for 12 months.",
      "It is not COCP if at least one existing CSP partner (including the distributor or indirect reseller) stays associated, or for mergers, authorisation changes or partner off-boarding (support ticket needed).",
      "In-flight Partner Nominated claims stay with the nominating partner. Security nominations are locked — no re-nomination by another partner during the programme term.",
      "You can nominate new, incremental projects — but Microsoft will not fund the same or substantially similar work twice (duplicate-funding rule).",
      "Link your Partner ID (PAL) on the subscriptions you manage; for Dynamics 365 under EA, claim CPOR within 120 days of the transaction.",
    ],
  },
  {
    id: "sdc-solution",
    title: "ISV / SDC moving customers onto its Azure solution",
    short: "Software Development Company (or SI on its behalf) onboarding end-customers to an Azure-hosted product.",
    guidance: [
      "Frontier Accelerate for Marketplace has no earning caps; it needs a Certified Software Designation (Azure, Security or Industry AI).",
      "SI-led engagements need a Stage 0 intake form; the High-Value Migration band (> $500K ACR) needs Stage 0 approval before claiming.",
      "AI Build & Publish pays the SDC itself for publishing an AI-infused SaaS offer (sized by Marketplace Billed Sales) or a Copilot Agent Store agent (sized by Agent 365 MAU).",
      "Keep the 2:1 pre- to post-sales ratio — at least half of claims must be post-sales.",
    ],
  },
];
