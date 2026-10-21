import type { CloudContent } from "../types";

export const googleCloud: CloudContent = {
  sales: {
    headline: "Google Cloud commercials that follow the data",
    lede:
      "Google Cloud's pricing levers are different from the other hyperscalers — sustained-use discounts happen automatically, committed-use discounts come in resource and spend-based flavours, and Marketplace purchases can retire commitments. We design the deal around where your data and AI spend will actually grow.",
    sections: [
      {
        h: "Billing and contracting in India",
        p: [
          "Indian customers are billed in rupees by Google's Indian entity with GST, either directly or through a reseller partner that consolidates sub-accounts. Billing account hierarchy and project-to-cost-centre mapping are decided here — fixing them later is painful.",
        ],
      },
      {
        h: "Commitments with flexibility",
        p: [
          "Resource-based committed-use discounts lock vCPU and memory in a region; spend-based (flexible) CUDs commit to an hourly spend across eligible compute and services. BigQuery editions offer capacity commitments; Cloud SQL and AlloyDB have their own CUDs. We stage them after right-sizing, and model sustained-use discounts so you don't commit to what you'd get anyway.",
        ],
      },
      {
        h: "Funding the migration",
        p: [
          "Google's Rapid Migration and Modernization Program (RaMP) bundles assessment, planning and migration support, typically with credits tied to a committed migration plan. Marketplace private offers for ISV software can draw down an existing commit. We prepare the evidence pack and the commercial timeline so funding is approved before migration starts, not after.",
        ],
      },
    ],
    deliverables: [
      "Billing account and project hierarchy design",
      "TCO with CUD (resource / flexible) and BigQuery capacity scenarios",
      "RaMP funding and credit plan",
      "Marketplace private-offer procurement path",
      "Labels taxonomy, budgets and billing export to BigQuery",
      "Commit-agreement negotiation brief",
    ],
    approach: [
      { phase: "Baseline", when: "Week 1", detail: "Contracts, licences, current cloud spend, data-growth forecast." },
      { phase: "Model", when: "Week 2–3", detail: "Migration Center TCO, CUD ladder, analytics capacity sizing." },
      { phase: "Fund", when: "Week 3", detail: "RaMP application and credit schedule with the Google account team." },
      { phase: "Contract", when: "Week 4", detail: "Direct vs reseller, commit agreement, support tier." },
      { phase: "Govern", when: "Ongoing", detail: "FinOps reviews from the billing export, CUD utilisation, Recommender actions." },
    ],
    tooling: ["Google Cloud Pricing Calculator", "Migration Center TCO", "Cloud Billing reports", "Billing export to BigQuery", "Committed use discounts", "Active Assist Recommender", "FinOps hub", "Google Cloud Marketplace"],
    targets: [
      { m: "≥ 70%", l: "of steady-state compute under CUDs within a quarter of migration" },
      { m: "100%", l: "of projects labelled to a cost centre" },
      { m: "Weekly", l: "anomaly review from the billing export" },
    ],
    pitfalls: [
      "Buying resource CUDs for VM families you will move to GKE Autopilot.",
      "Ignoring BigQuery on-demand scan costs in the business case.",
      "Inter-region egress designed into the architecture by accident.",
    ],
    artefacts: ["commercial-checklist", "assessment-workbook"],
  },

  assessment: {
    headline: "Google Cloud assessment with Migration Center",
    lede:
      "Migration Center gives us discovery, performance collection, TCO and target recommendations in one place. We add the human part — owner interviews, dependency validation and an honest view of what should move, change or stay.",
    sections: [
      {
        h: "Discovery and right-sizing",
        p: [
          "The Migration Center discovery client collects inventory and utilisation from vSphere and physical hosts; imports from CMDB exports fill the gaps. We use at least two weeks of performance data and size to Compute Engine machine families — including custom shapes where they save real money.",
        ],
      },
      {
        h: "Where Google Cloud earns its place",
        p: [
          "Data warehouses moving to BigQuery, Hadoop and Spark to Dataproc or serverless Spark, analytics and ML to Vertex AI, containerised estates to GKE, PostgreSQL and Oracle-compatible workloads to AlloyDB. VMware estates can relocate to Google Cloud VMware Engine to buy time for modernisation.",
        ],
      },
      {
        h: "A plan, not a spreadsheet",
        p: [
          "Every application leaves with a disposition, a target pattern, an owner and a wave. The business case shows run-rate, migration cost and RaMP funding as separate lines.",
        ],
      },
    ],
    deliverables: [
      "Migration Center discovery and TCO reports",
      "Application portfolio with disposition and owner",
      "Target architecture on Cloud Foundation Fabric",
      "Data-platform assessment for BigQuery / Dataproc / Vertex AI",
      "Wave plan and RaMP-ready business case",
      "Risk and assumption register",
    ],
    approach: [
      { phase: "Mobilise", when: "Week 1", detail: "Scope, access, discovery client, data-handling agreement." },
      { phase: "Discover", when: "Week 1–4", detail: "Inventory, performance, database and data-warehouse profiling, interviews." },
      { phase: "Analyse", when: "Week 3–5", detail: "Right-sizing, dependency groups, dispositions, BigQuery Migration Service assessment." },
      { phase: "Plan", when: "Week 5–6", detail: "Landing zone, waves, tooling and team." },
      { phase: "Decide", when: "Week 6", detail: "Business case and executive decision." },
    ],
    tooling: ["Migration Center", "Migration Center discovery client", "BigQuery Migration Service (assessment)", "Database Migration Service assessments", "Google Cloud Architecture Framework", "Pricing Calculator"],
    targets: [
      { m: "≥ 14 days", l: "of utilisation data per server" },
      { m: "100%", l: "of data warehouses with a query-cost model" },
      { m: "± 15%", l: "business-case accuracy at 12 months" },
    ],
    pitfalls: [
      "Lifting Hadoop clusters as VMs instead of re-platforming to Dataproc or BigQuery.",
      "Underestimating egress from on-premises during long data migrations.",
    ],
    artefacts: ["assessment-workbook", "pre-checklist"],
  },

  migration: {
    headline: "Migration to Google Cloud — foundation, factory, finish",
    lede:
      "We build the organisation, folders, shared VPC and security perimeter with Cloud Foundation Fabric, then migrate in waves with Migrate to Virtual Machines, Database Migration Service and BigQuery Migration Service.",
    sections: [
      {
        h: "Foundation",
        p: [
          "Resource hierarchy with folders per environment and business unit; organisation policies (resource location restricted to Mumbai and Delhi, no external IPs by default, uniform bucket access); Shared VPC hub with Cloud Interconnect or HA VPN; Cloud DNS forwarding; Cloud Identity federated to your IdP; centralised logging sinks.",
        ],
      },
      {
        h: "Migration engines",
        p: [
          "Migrate to Virtual Machines replicates vSphere, AWS and Azure VMs with test clones and short cutovers. Database Migration Service handles MySQL, PostgreSQL and SQL Server homogeneously and Oracle to PostgreSQL / AlloyDB with conversion workspaces. Teradata, Redshift and other warehouses move to BigQuery with BigQuery Migration Service's SQL translation. Bulk files move with Storage Transfer Service or Transfer Appliance.",
        ],
      },
      {
        h: "VMware and containers",
        p: [
          "Google Cloud VMware Engine relocates vSphere workloads with HCX when the exit date is close; Migrate to Containers can lift suitable VMs into GKE when the team is ready to run containers properly.",
        ],
      },
    ],
    deliverables: [
      "Cloud Foundation Fabric landing zone",
      "Migration handbook and wave runbooks",
      "VM, database and data-warehouse migrations",
      "Validation and reconciliation evidence",
      "Rollback rehearsals and cutover sign-offs",
      "Decommission and handover",
    ],
    approach: [
      { phase: "Foundation", when: "Week 1–4", detail: "Hierarchy, policies, networking, identity, logging, security perimeter." },
      { phase: "Pilot", when: "Week 4–6", detail: "Prove Migrate to VMs, DMS and runbooks on low-risk apps." },
      { phase: "Waves", when: "Two-week cadence", detail: "Replicate, test clone, UAT, cutover, hypercare." },
      { phase: "Data track", when: "Parallel", detail: "Warehouse translation, data loads, query validation, dashboard repointing." },
      { phase: "Exit", when: "Final weeks", detail: "Decommission, CUDs, handover." },
    ],
    tooling: ["Cloud Foundation Fabric", "Migrate to Virtual Machines", "Database Migration Service", "BigQuery Migration Service", "Storage Transfer Service", "Transfer Appliance", "Google Cloud VMware Engine", "Migrate to Containers", "Terraform", "Cloud Interconnect"],
    targets: [
      { m: "100%", l: "of waves with test-clone validation before cutover" },
      { m: "100%", l: "of migrated warehouse queries validated for result parity" },
      { m: "≤ 4 h", l: "downtime target for tier-2 applications" },
    ],
    pitfalls: [
      "Organisation policies applied after projects are populated.",
      "Shared VPC IP ranges too small for GKE growth.",
      "Translated SQL accepted without result-set comparison.",
    ],
    artefacts: ["handbook", "pre-checklist", "cutover-runbook", "post-checklist"],
  },

  "managed-services": {
    headline: "Google Cloud operations and SRE",
    lede:
      "Google wrote the book on site reliability engineering; we run your estate the same way — SLOs, error budgets, automation and blameless reviews — with a 24×7 team in India.",
    sections: [
      {
        h: "Observability and SLOs",
        p: [
          "Cloud Monitoring and Logging with SLOs defined per service, Managed Service for Prometheus for GKE, uptime checks and log-based metrics. Alerts are tied to burn-rate, not to every CPU spike.",
        ],
      },
      {
        h: "Patching, backup and DR",
        p: [
          "VM Manager OS patch management, Backup and DR Service for VMs and databases, cross-region snapshots, and DR drills scheduled in the service calendar rather than remembered after an outage.",
        ],
      },
      {
        h: "Cost and posture as operating metrics",
        p: [
          "Recommender actions reviewed weekly, CUD utilisation monthly, Security Command Center findings triaged by severity, and Organization Policy drift alerts.",
        ],
      },
    ],
    deliverables: ["Runbook, RACI and SLA matrix", "SLO catalogue and dashboards", "24×7 incident and problem management", "Patch, backup and DR calendar", "Monthly service and FinOps review", "Quarterly Architecture Framework review"],
    approach: [
      { phase: "Transition", when: "Week 1–4", detail: "Access, monitoring, SLO definition, runbook validation." },
      { phase: "Operate", when: "Ongoing", detail: "Incidents, changes, patching, backup, capacity, cost." },
      { phase: "Improve", when: "Quarterly", detail: "Toil reduction, modernisation, reliability reviews." },
    ],
    tooling: ["Cloud Monitoring", "Cloud Logging", "Managed Service for Prometheus", "VM Manager", "Backup and DR Service", "Security Command Center", "Active Assist Recommender", "Cloud Deploy", "Terraform"],
    targets: [
      { m: "15 min", l: "P1 response 24×7" },
      { m: "99.9%+", l: "SLO attainment for tier-1 services" },
      { m: "Monthly", l: "restore test for tier-1 backups" },
    ],
    pitfalls: ["Alerting on symptoms nobody can act on.", "Snapshots in the same region as the outage."],
    artefacts: ["runbook-raci", "post-checklist"],
  },

  "security-assessment": {
    headline: "Google Cloud security assessment",
    lede:
      "We review your organisation against the CIS Google Cloud Foundations Benchmark and Google's security foundations blueprint, focusing on the controls that stop real attacks: identity, perimeter, data and detection.",
    sections: [
      {
        h: "Organisation and identity",
        p: [
          "Organisation policies, IAM role grants at org / folder / project level, service-account keys and impersonation, Workload Identity Federation, and super-admin hygiene in Cloud Identity.",
        ],
      },
      {
        h: "Perimeter and data",
        p: [
          "VPC Service Controls around sensitive projects, firewall policies, Cloud Armor on public endpoints, CMEK with Cloud KMS, Sensitive Data Protection scans for personal data, and bucket-level access.",
        ],
      },
      {
        h: "Detection and Indian obligations",
        p: [
          "Security Command Center coverage and findings, audit-log retention, Google Security Operations readiness — and mapping to DPDP safeguards and CERT-In's six-hour reporting and 180-day in-country log retention.",
        ],
      },
    ],
    deliverables: ["CIS GCP scorecard", "IAM and service-account risk review", "VPC Service Controls design review", "DPDP / CERT-In gap analysis", "Prioritised remediation roadmap", "Executive summary"],
    approach: [
      { phase: "Scope", when: "Days 1–2", detail: "Org, folders, crown-jewel projects, read-only access." },
      { phase: "Collect", when: "Days 3–7", detail: "SCC, policy analyser, IAM recommender, asset inventory." },
      { phase: "Analyse", when: "Days 8–12", detail: "Attack paths and control mapping." },
      { phase: "Report", when: "Days 13–15", detail: "Findings and roadmap." },
    ],
    tooling: ["Security Command Center", "Policy Analyzer", "IAM Recommender", "Cloud Asset Inventory", "VPC Service Controls", "Cloud Armor", "Cloud KMS", "Sensitive Data Protection", "Google Security Operations"],
    targets: [
      { m: "0", l: "user-managed service-account keys older than 90 days" },
      { m: "100%", l: "of sensitive projects inside a service perimeter" },
      { m: "180 days", l: "audit logs retained in India" },
    ],
    pitfalls: ["Primitive Owner / Editor roles granted at folder level.", "Default compute service account with Editor on every project."],
    artefacts: ["security-checklist"],
  },

  poc: {
    headline: "Google Cloud POCs for data and AI",
    lede:
      "Where Google Cloud shines — BigQuery, Vertex AI and Gemini, AlloyDB, GKE — we prove value fast with measured success criteria and a costed path to production.",
    sections: [
      {
        h: "Typical POCs",
        p: [
          "A BigQuery POC replaying a month of real warehouse queries with cost and performance comparison; a Gemini-on-Vertex AI assistant grounded on your documents with evaluation metrics; AlloyDB for a PostgreSQL workload needing analytical speed; GKE Autopilot for a containerised service with SLOs.",
        ],
      },
      {
        h: "Guardrails",
        p: ["Each POC runs in its own project under a sandbox folder with budgets, organisation policies and VPC Service Controls where data is sensitive."],
      },
    ],
    deliverables: ["POC charter", "Sandbox project with guardrails", "Working POC and metrics", "Production architecture and cost", "Go / no-go"],
    approach: [
      { phase: "Frame", when: "Week 1", detail: "Hypothesis, criteria, data." },
      { phase: "Build", when: "Week 2–4", detail: "Minimum architecture." },
      { phase: "Prove", when: "Week 4–5", detail: "Measured tests." },
      { phase: "Decide", when: "Week 6", detail: "Read-out." },
    ],
    tooling: ["BigQuery", "Vertex AI", "Gemini models", "Vertex AI Search", "AlloyDB", "GKE Autopilot", "Cloud Run", "Looker"],
    targets: [
      { m: "≤ 6 weeks", l: "to decision" },
      { m: "100%", l: "criteria measured" },
      { m: "1", l: "costed production plan" },
    ],
    artefacts: ["poc-charter"],
  },
};
