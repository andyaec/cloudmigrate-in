import type { CloudContent } from "../types";

export const oci: CloudContent = {
  sales: {
    headline: "OCI commercials built around your Oracle estate",
    lede:
      "Oracle customers carry licences, support contracts and audit history into every cloud conversation. On OCI those become assets: BYOL, Support Rewards and Universal Credits can change the economics more than any discount. We build the commercial case from your entitlements up.",
    sections: [
      {
        h: "Universal Credits and BYOL",
        p: [
          "Pay-as-you-go for exploration, Annual Universal Credits once consumption is predictable — usable across OCI services rather than tied to one SKU. Database and middleware BYOL rates let existing processor licences and support carry over; licence-included rates suit workloads without spare entitlements. We model both per database, not per estate.",
        ],
      },
      {
        h: "Oracle Support Rewards",
        p: [
          "Every dollar spent on OCI earns rewards that can be applied against on-premises technology support invoices — at a higher rate for Unlimited License Agreement customers. For estates with large support bills this is often the single biggest number in the business case.",
        ],
      },
      {
        h: "Help that is already paid for",
        p: [
          "Oracle Cloud Lift Services provide Oracle engineering support for eligible migrations at no additional cost. We plan around it, and position OCI Dedicated Region or Oracle Database@Azure / @AWS / @Google Cloud where sovereignty or an existing hyperscaler commitment makes more sense than moving everything.",
        ],
      },
    ],
    deliverables: [
      "Licence and support entitlement position (processor, NUP, ULA)",
      "BYOL vs licence-included model per database and middleware tier",
      "Universal Credits commitment proposal",
      "Support Rewards projection against support renewals",
      "Cloud Lift engagement request",
      "Multicloud option paper (Database@Azure / AWS / Google Cloud)",
    ],
    approach: [
      { phase: "Entitlements", when: "Week 1", detail: "CSI numbers, licence metrics, ULA status, support renewal dates." },
      { phase: "Model", when: "Week 2", detail: "OCI cost estimator, BYOL vs LI, Exadata vs Autonomous vs VM DB." },
      { phase: "Fund", when: "Week 3", detail: "Cloud Lift request, Support Rewards forecast, credit offers." },
      { phase: "Contract", when: "Week 4", detail: "Universal Credits order, payment schedule, support tier." },
    ],
    tooling: ["OCI Cost Estimator", "OCI Cost Analysis & Budgets", "Oracle Support Rewards dashboard", "AWR / Statspack for sizing", "Licence entitlement analysis"],
    targets: [
      { m: "100%", l: "of databases with a BYOL vs LI decision" },
      { m: "Annual", l: "Support Rewards applied against support renewal" },
      { m: "0", l: "unlicensed processors after migration" },
    ],
    pitfalls: [
      "Over-allocating OCPUs and breaching processor licence counts.",
      "Committing Universal Credits before Exadata vs Autonomous is decided.",
      "Forgetting Support Rewards timing relative to the support renewal date.",
    ],
    artefacts: ["commercial-checklist", "assessment-workbook"],
  },

  assessment: {
    headline: "Oracle-aware assessment for OCI",
    lede:
      "Generic discovery tools see Oracle databases as VMs with large disks. We assess them as Oracle — workload profile, features in use, RAC and Data Guard topology, licence position and upgrade path — and choose between Exadata, Autonomous Database and VM DB Systems on evidence.",
    sections: [
      {
        h: "Database deep-dive",
        p: [
          "AWR reports across peak periods for CPU, IO and memory sizing; feature and option usage for licence compliance; the Cloud Premigration Advisor Tool for compatibility with Autonomous Database; character set, version and platform endianness for the migration method.",
        ],
      },
      {
        h: "Applications and middleware",
        p: [
          "E-Business Suite, JD Edwards, PeopleSoft, Siebel and WebLogic estates have proven OCI patterns; custom applications are assessed for rehost on Compute or modernisation onto OKE. VMware estates can relocate to Oracle Cloud VMware Solution while the database moves to Exadata alongside.",
        ],
      },
      {
        h: "The decision",
        p: [
          "For every database: target service, migration method (Zero Downtime Migration physical or logical, Data Pump, RMAN, GoldenGate), downtime budget and licence model. For every application: disposition, wave and owner.",
        ],
      },
    ],
    deliverables: [
      "Oracle database inventory with AWR-based sizing",
      "Feature / option usage and licence compliance view",
      "Target service decision per database (Exadata / ADB / VM DB)",
      "Application dispositions and wave plan",
      "OCI landing-zone design",
      "Business case with BYOL and Support Rewards",
    ],
    approach: [
      { phase: "Collect", when: "Week 1–3", detail: "AWR, CPAT, inventory, licence data, application interviews." },
      { phase: "Analyse", when: "Week 3–4", detail: "Sizing, compatibility, migration method per database." },
      { phase: "Design", when: "Week 4–5", detail: "Landing zone, network, DR with Data Guard." },
      { phase: "Decide", when: "Week 6", detail: "Business case and executive read-out." },
    ],
    tooling: ["AWR / ASH reports", "Cloud Premigration Advisor Tool (CPAT)", "Oracle Cloud Migrations (VM discovery)", "OCI Cloud Advisor", "OCI Cost Estimator"],
    targets: [
      { m: "100%", l: "of Oracle databases with peak-period AWR evidence" },
      { m: "100%", l: "of databases with a chosen migration method and downtime budget" },
      { m: "± 15%", l: "business-case accuracy at 12 months" },
    ],
    pitfalls: ["Sizing Exadata from average load instead of month-end peaks.", "Missing option usage that triggers licence exposure."],
    artefacts: ["assessment-workbook", "pre-checklist"],
  },

  migration: {
    headline: "Migration to OCI with Zero Downtime Migration and GoldenGate",
    lede:
      "Oracle databases are where downtime and data-loss risk concentrate, so we migrate them with Oracle's own tooling — physical or logical ZDM, Data Guard and GoldenGate — on an OCI CIS Landing Zone built before anything moves.",
    sections: [
      {
        h: "Landing zone",
        p: [
          "OCI Landing Zone aligned to the CIS OCI Foundations Benchmark: compartments per environment, IAM identity domains federated to your IdP, policies, Cloud Guard and Security Zones, a hub VCN with Network Firewall, FastConnect to your data centre, and Logging and Audit retained in the Mumbai or Hyderabad region.",
        ],
      },
      {
        h: "Database migration",
        p: [
          "Zero Downtime Migration orchestrates physical (Data Guard-based) or logical (Data Pump + GoldenGate) migrations to Exadata Database Service, Base Database Service or Autonomous Database; OCI Database Migration provides a managed path for logical moves. GoldenGate handles near-zero-downtime cross-version and cross-platform migrations and can keep a fallback replica in sync.",
        ],
      },
      {
        h: "Applications and VMware",
        p: [
          "E-Business Suite moves with EBS Cloud Manager patterns; VMware estates relocate to Oracle Cloud VMware Solution with full vSphere control; other VMs move with Oracle Cloud Migrations. Applications are re-pointed with connection strings managed centrally, not edited by hand on cutover night.",
        ],
      },
    ],
    deliverables: [
      "OCI CIS Landing Zone",
      "Migration handbook and database runbooks",
      "ZDM / GoldenGate migrations with fallback",
      "EBS / JDE / OCVS migrations as scoped",
      "Data validation reports (row counts, checksums, application tests)",
      "Hypercare and handover",
    ],
    approach: [
      { phase: "Foundation", when: "Week 1–4", detail: "Landing zone, FastConnect, identity, security services." },
      { phase: "Pilot", when: "Week 4–6", detail: "One non-production database end-to-end with ZDM." },
      { phase: "Waves", when: "Per downtime window", detail: "Replicate, validate, switchover, fallback ready." },
      { phase: "Exit", when: "Final weeks", detail: "Decommission, licence true-up, handover." },
    ],
    tooling: ["OCI Landing Zone", "Zero Downtime Migration", "OCI Database Migration", "Oracle GoldenGate", "Data Guard", "Data Pump / RMAN", "Oracle Cloud Migrations", "Oracle Cloud VMware Solution", "EBS Cloud Manager", "FastConnect", "Terraform / Resource Manager"],
    targets: [
      { m: "≤ 15 min", l: "database switchover with physical ZDM / Data Guard" },
      { m: "100%", l: "of cutovers with a synced fallback" },
      { m: "0", l: "data-loss incidents" },
    ],
    pitfalls: ["Character-set conversion discovered during the cutover.", "Network latency between app and DB tiers split across sites."],
    artefacts: ["handbook", "pre-checklist", "cutover-runbook", "post-checklist"],
  },

  "managed-services": {
    headline: "OCI managed services with DBA depth",
    lede:
      "Running OCI well means running Oracle Database well. Our service pairs platform operations with experienced DBAs who handle patching, performance, Data Guard and backup — with Autonomous Database taking the toil where it fits.",
    sections: [
      {
        h: "Platform",
        p: [
          "OCI Monitoring and Logging Analytics, OS Management Hub for patching, Fleet Application Management for application stacks, Cloud Guard problems as a working backlog, and budgets with alerts per compartment.",
        ],
      },
      {
        h: "Database",
        p: [
          "Quarterly patching via Fleet Patching and Provisioning or Exadata-managed patching, Data Guard switchover drills, automatic backups to Object Storage with Recovery Service where available, Ops Insights for capacity and SQL performance, and Data Safe for user and activity auditing.",
        ],
      },
    ],
    deliverables: ["Runbook, RACI and SLA matrix", "DBA services and patch calendar", "Data Guard DR drills", "Monthly service, capacity and cost review", "Security posture via Cloud Guard and Data Safe"],
    approach: [
      { phase: "Transition", when: "Week 1–4", detail: "Access, monitoring, DBA handover, runbook validation." },
      { phase: "Operate", when: "Ongoing", detail: "Incidents, patching, backup, performance, cost." },
      { phase: "Improve", when: "Quarterly", detail: "Autonomous adoption, consolidation, licence optimisation." },
    ],
    tooling: ["OCI Monitoring", "Logging Analytics", "OS Management Hub", "Fleet Application Management", "Ops Insights", "Database Management", "Data Safe", "Cloud Guard", "Autonomous Recovery Service"],
    targets: [
      { m: "15 min", l: "P1 response 24×7" },
      { m: "Quarterly", l: "database patch and Data Guard switchover drill" },
      { m: "100%", l: "of databases audited by Data Safe" },
    ],
    pitfalls: ["Backups never restored to a point in time.", "Patching application tiers without database coordination."],
    artefacts: ["runbook-raci", "post-checklist"],
  },

  "security-assessment": {
    headline: "OCI security assessment",
    lede:
      "We assess tenancies against the CIS OCI Foundations Benchmark and Oracle's security best practices, with particular depth on database security — because that is where the sensitive data usually sits.",
    sections: [
      {
        h: "Tenancy controls",
        p: [
          "Identity domains, MFA, policies and dynamic groups, compartment design, Cloud Guard detectors and responders, Security Zones, Vulnerability Scanning, Vault and customer-managed keys, network security groups, WAF and Bastion usage.",
        ],
      },
      {
        h: "Database security",
        p: [
          "Data Safe security and user assessments, sensitive-data discovery and masking for non-production, activity auditing, Database Vault where privileged-user controls are mandated, TDE and key management.",
        ],
      },
      {
        h: "Indian obligations",
        p: ["DPDP safeguards and breach readiness, CERT-In six-hour reporting and 180-day in-country log retention, and sector-regulator requirements."],
      },
    ],
    deliverables: ["CIS OCI scorecard", "Data Safe assessment summary", "Regulatory gap register", "Remediation roadmap", "Executive summary"],
    approach: [
      { phase: "Scope", when: "Days 1–2", detail: "Tenancy, compartments, databases, read-only access." },
      { phase: "Collect", when: "Days 3–8", detail: "Cloud Guard, CIS scripts, Data Safe assessments." },
      { phase: "Report", when: "Days 9–12", detail: "Findings and roadmap." },
    ],
    tooling: ["Cloud Guard", "Security Zones", "Vulnerability Scanning Service", "OCI Vault", "Data Safe", "CIS OCI compliance checking script", "OCI Audit"],
    targets: [
      { m: "100%", l: "of users with MFA" },
      { m: "100%", l: "of production databases assessed in Data Safe" },
      { m: "0", l: "critical findings beyond 30 days" },
    ],
    pitfalls: ["Production data copied unmasked to test.", "Over-broad 'manage all-resources' policies."],
    artefacts: ["security-checklist"],
  },

  poc: {
    headline: "OCI POCs that settle the database question",
    lede:
      "The most valuable OCI POC replays your real database workload on the target and measures it. We also run POCs on Autonomous Database, HeatWave and OCI Generative AI where the use case fits.",
    sections: [
      {
        h: "Workload replay, not synthetic benchmarks",
        p: [
          "Capture production workload with Database Replay, run it on Exadata or Autonomous Database, and compare response times with SQL Performance Analyzer. The result is evidence for sizing and licence decisions.",
        ],
      },
      {
        h: "Other POCs",
        p: ["Autonomous Database for self-managing OLTP or analytics; HeatWave MySQL for in-database analytics; OCI Generative AI and AI Vector Search in Oracle Database 23ai for retrieval over enterprise data."],
      },
    ],
    deliverables: ["POC charter", "Workload capture and replay results", "Sizing and licence recommendation", "Production plan", "Go / no-go"],
    approach: [
      { phase: "Frame", when: "Week 1", detail: "Criteria and workload capture plan." },
      { phase: "Capture", when: "Week 1–2", detail: "Production workload capture." },
      { phase: "Replay", when: "Week 3–4", detail: "Target replay and analysis." },
      { phase: "Decide", when: "Week 5", detail: "Read-out." },
    ],
    tooling: ["Database Replay", "SQL Performance Analyzer", "Exadata Database Service", "Autonomous Database", "HeatWave", "OCI Generative AI", "AI Vector Search"],
    targets: [
      { m: "≤ 5 weeks", l: "to decision" },
      { m: "Real", l: "production workload replayed" },
      { m: "1", l: "evidence-based sizing" },
    ],
    artefacts: ["poc-charter"],
  },
};
