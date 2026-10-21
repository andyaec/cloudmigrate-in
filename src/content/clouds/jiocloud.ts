import type { CloudContent } from "../types";

export const jiocloud: CloudContent = {
  sales: {
    headline: "JioCloud commercials for Indian enterprises",
    lede:
      "JioCloud's appeal is as much commercial as technical: rupee contracts with GST input credit, in-country residency, and the option to bundle compute with Jio connectivity. We structure the deal so the sovereignty story and the cost story reinforce each other.",
    sections: [
      {
        h: "What you are actually buying",
        p: [
          "Jio's enterprise cloud spans its own infrastructure services and the Azure-powered data centres built with Microsoft in India. The first commercial decision is which catalogue each workload lands on — it decides tooling, SLAs, support model and how consumption is billed. We map that per workload rather than assuming one answer.",
        ],
      },
      {
        h: "Bundling connectivity and cloud",
        p: [
          "Many Indian enterprises already buy MPLS, internet leased lines or SD-WAN from Jio. Aligning cloud commitments with connectivity renewals often unlocks better terms and simpler private connectivity into the cloud. We bring both contracts to the same table.",
        ],
      },
      {
        h: "Public-sector and regulated buyers",
        p: [
          "Government buyers typically require MeitY-empanelled cloud services and procurement through GeM or a sanctioned tender; BFSI buyers need contractual audit and access rights for the regulator. We confirm empanelment and compliance status for the specific service and region before bid submission — never after award.",
        ],
      },
    ],
    deliverables: [
      "Workload-to-catalogue mapping (Jio infrastructure vs Jio-Azure)",
      "INR TCO with GST treatment and commitment options",
      "Connectivity and cloud bundle proposal",
      "Regulatory clause checklist for the contract (audit, exit, residency)",
      "Empanelment and procurement-route confirmation for public sector",
      "Commercial governance and chargeback model",
    ],
    approach: [
      { phase: "Qualify", when: "Week 1", detail: "Workloads, regulators, residency needs, existing Jio relationships." },
      { phase: "Model", when: "Week 2", detail: "INR TCO, commitment scenarios, network costs." },
      { phase: "Structure", when: "Week 3", detail: "Contract clauses, SLAs, exit and data-return terms." },
      { phase: "Close", when: "Week 4", detail: "Procurement route, approvals, onboarding." },
    ],
    tooling: ["Jio enterprise cloud catalogue & pricing", "Azure Pricing Calculator (for Jio-Azure regions)", "Our INR TCO model", "Connectivity design tools"],
    targets: [
      { m: "100%", l: "of contracts with explicit residency, audit and exit clauses" },
      { m: "INR", l: "single-currency TCO with GST treatment shown" },
      { m: "Pre-bid", l: "empanelment checks for every public-sector deal" },
    ],
    pitfalls: [
      "Assuming every Jio-hosted service carries the same certifications and empanelment.",
      "Signing without a data-return and exit clause the regulator will accept.",
      "Leaving connectivity out of the cloud TCO.",
    ],
    artefacts: ["commercial-checklist", "assessment-workbook"],
  },

  assessment: {
    headline: "Sovereignty-first assessment for JioCloud",
    lede:
      "For workloads heading to JioCloud the technical assessment is only half the job. We classify data, map each application to the regulations that govern it, and design the target so residency and auditability are properties of the architecture.",
    sections: [
      {
        h: "Regulatory mapping",
        p: [
          "The Digital Personal Data Protection Act 2023 and its Rules; CERT-In's 2022 directions on incident reporting and log retention; RBI's directions on IT outsourcing and cyber resilience for regulated entities; SEBI's cloud framework for market intermediaries; IRDAI's information and cyber security guidelines; and sector rules for health and telecom data. Each application gets the obligations that actually apply to it.",
        ],
      },
      {
        h: "Technical discovery",
        p: [
          "Inventory and utilisation collection, dependency mapping, database profiling and network-latency measurements to users across India. Where the target is Jio's Azure-powered cloud we use Azure Migrate; for Jio infrastructure services we use vendor-neutral discovery and agent-based collection.",
        ],
      },
      {
        h: "Designing for residency",
        p: [
          "Key management in-country with customer-controlled keys, backups and DR inside India, logs retained locally for at least 180 days, and support access that is logged and approved. The assessment proves each of these on paper before migration proves them in practice.",
        ],
      },
    ],
    deliverables: [
      "Data classification and regulatory applicability matrix",
      "Application inventory, dependencies and dispositions",
      "Residency-by-design target architecture",
      "Network latency and connectivity plan",
      "Wave plan and INR business case",
      "Regulator-ready assessment summary",
    ],
    approach: [
      { phase: "Classify", when: "Week 1–2", detail: "Data types, regulators, residency and retention requirements." },
      { phase: "Discover", when: "Week 1–4", detail: "Inventory, utilisation, dependencies, databases." },
      { phase: "Design", when: "Week 4–5", detail: "Target architecture, keys, logging, DR in India." },
      { phase: "Plan", when: "Week 5–6", detail: "Waves, tooling, business case, regulator summary." },
    ],
    tooling: ["Azure Migrate (Jio-Azure targets)", "Agent-based discovery and dependency mapping", "Database profiling scripts", "Network latency probes", "Our regulatory applicability matrix"],
    targets: [
      { m: "100%", l: "of datasets classified before design sign-off" },
      { m: "0", l: "personal-data flows leaving India without a documented basis" },
      { m: "180 days", l: "log retention in-country by design" },
    ],
    pitfalls: [
      "Backups or DR quietly replicated outside India.",
      "Support tooling (RMM, SaaS monitoring) exporting logs offshore.",
      "Treating DPDP as a privacy-policy update rather than an engineering requirement.",
    ],
    artefacts: ["assessment-workbook", "pre-checklist"],
  },

  migration: {
    headline: "Migrating to JioCloud without crossing the border",
    lede:
      "Every byte stays in India — during replication, in transit and in backup. We migrate with tooling appropriate to the target catalogue and keep a regulator-grade evidence trail for every wave.",
    sections: [
      {
        h: "Landing zone with sovereignty controls",
        p: [
          "Segregated environments, network segmentation, customer-managed keys stored in-country, centralised logging with 180-day local retention, privileged-access workflows and NTP synchronised to Indian time sources as CERT-In expects.",
        ],
      },
      {
        h: "Choosing the migration path",
        p: [
          "For Jio's Azure-powered regions we use Azure Migrate, Site Recovery and Database Migration Service. For Jio infrastructure services we use agent-based block replication for servers and database-native replication — Oracle Data Guard, SQL Server log shipping or availability groups, PostgreSQL logical replication, MySQL replication — for near-zero-downtime cutovers. Bulk data moves over private connectivity on Jio's network.",
        ],
      },
      {
        h: "Evidence as a deliverable",
        p: [
          "Chain-of-custody for data, reconciliation reports, cutover sign-offs and residency attestations are produced per wave, so the audit file is complete the day the migration finishes.",
        ],
      },
    ],
    deliverables: [
      "Sovereign landing zone",
      "Migration handbook and wave runbooks",
      "Server and database migrations with reconciliation",
      "Private connectivity over Jio network",
      "Residency and chain-of-custody evidence",
      "Hypercare and handover",
    ],
    approach: [
      { phase: "Foundation", when: "Week 1–4", detail: "Landing zone, keys, logging, connectivity, access workflows." },
      { phase: "Pilot", when: "Week 4–6", detail: "Prove replication, cutover and evidence capture." },
      { phase: "Waves", when: "Two-week cadence", detail: "Replicate, test, cut over, reconcile, attest." },
      { phase: "Exit", when: "Final weeks", detail: "Decommission with certified data destruction, handover." },
    ],
    tooling: ["Azure Migrate / Site Recovery (Jio-Azure)", "Agent-based block replication", "Oracle Data Guard / GoldenGate", "SQL Server log shipping & AGs", "PostgreSQL logical replication", "rsync / rclone over private links", "Terraform"],
    targets: [
      { m: "0", l: "data copies outside India during migration" },
      { m: "100%", l: "of waves with reconciliation and residency attestation" },
      { m: "≤ 4 h", l: "tier-2 downtime target" },
    ],
    pitfalls: [
      "Using SaaS migration tools that stage data offshore.",
      "Certified destruction of source media forgotten in the exit plan.",
    ],
    artefacts: ["handbook", "pre-checklist", "cutover-runbook", "post-checklist"],
  },

  "managed-services": {
    headline: "In-country managed services for JioCloud",
    lede:
      "Operations, security monitoring and support delivered from India, by people in India, with logs that never leave India. That is what regulated customers on JioCloud are buying — so it is what we run.",
    sections: [
      {
        h: "Run the estate",
        p: [
          "24×7 monitoring, incident and change management, patching, backup and DR drills, capacity planning and cost reporting in INR — with tooling deployed in-country rather than offshore SaaS consoles.",
        ],
      },
      {
        h: "Run the obligations",
        p: [
          "A CERT-In incident-reporting runbook that can meet the six-hour clock, DPDP breach-notification workflow, periodic access reviews, and audit-evidence packs for RBI, SEBI or IRDAI inspections.",
        ],
      },
    ],
    deliverables: ["Runbook, RACI and SLA matrix", "In-country SOC and NOC services", "CERT-In and DPDP incident workflows", "Patch, backup and DR calendar", "Monthly service and compliance report", "Audit evidence packs"],
    approach: [
      { phase: "Transition", when: "Week 1–4", detail: "Access, tooling in-country, runbook validation." },
      { phase: "Operate", when: "Ongoing", detail: "Incidents, change, patching, backup, security monitoring." },
      { phase: "Assure", when: "Quarterly", detail: "Access reviews, DR drills, audit evidence." },
    ],
    tooling: ["In-country monitoring stack", "Azure Monitor / Sentinel (Jio-Azure)", "Open-source observability (Prometheus, Grafana, OpenSearch)", "Backup with immutable copies in India", "ITSM with regulator reporting templates"],
    targets: [
      { m: "6 h", l: "CERT-In reportable-incident notification capability" },
      { m: "Quarterly", l: "DR drill with documented RTO / RPO" },
      { m: "100%", l: "of privileged sessions recorded and reviewed" },
    ],
    pitfalls: ["Offshore follow-the-sun support with access to production data.", "DR drills that never fail over the database."],
    artefacts: ["runbook-raci", "post-checklist"],
  },

  "security-assessment": {
    headline: "Security assessment aligned to Indian regulation",
    lede:
      "We assess JioCloud-hosted estates against CIS Controls v8, ISO/IEC 27001:2022 and the Cloud Security Alliance CCM — and, most importantly, against the Indian rules your auditors and regulators will actually test.",
    sections: [
      {
        h: "Controls we test",
        p: [
          "Identity and privileged access, network segmentation and exposure, encryption and key custody, vulnerability and patch management, logging and monitoring, backup integrity, third-party and support access, and incident response.",
        ],
      },
      {
        h: "Regulatory lens",
        p: [
          "DPDP safeguards and breach notification; CERT-In reporting timelines, log retention and time synchronisation; RBI cyber-resilience and outsourcing expectations; SEBI cloud framework requirements for market intermediaries; IRDAI guidelines for insurers. Findings are tagged to the regulation they affect.",
        ],
      },
    ],
    deliverables: ["Control scorecard (CIS v8 / ISO 27001 / CSA CCM)", "Indian regulatory gap register", "Penetration-test scope recommendation", "Remediation roadmap", "Board-level summary"],
    approach: [
      { phase: "Scope", when: "Days 1–3", detail: "Systems, data, regulators, evidence sources." },
      { phase: "Assess", when: "Days 4–12", detail: "Configuration review, interviews, evidence sampling." },
      { phase: "Report", when: "Days 13–15", detail: "Findings, regulatory mapping, roadmap." },
    ],
    tooling: ["CIS-CAT and configuration scanners", "Vulnerability scanning", "Microsoft Defender for Cloud (Jio-Azure)", "Log-retention verification scripts", "Our regulatory control library"],
    targets: [
      { m: "100%", l: "of findings mapped to a control and a regulation" },
      { m: "0", l: "critical findings open beyond 30 days" },
      { m: "180 days", l: "in-country log retention verified" },
    ],
    pitfalls: ["Evidence that exists but can't be produced within the regulator's deadline."],
    artefacts: ["security-checklist"],
  },

  poc: {
    headline: "JioCloud POCs for sovereign and edge workloads",
    lede:
      "POCs on JioCloud usually answer one of three questions: can this regulated workload run here compliantly, does low latency to Indian users change the experience, and can AI run on Indian data without it leaving the country?",
    sections: [
      {
        h: "Typical POCs",
        p: [
          "A regulated core-banking or claims workload running end-to-end in-country with customer-managed keys; latency-sensitive apps tested from multiple Indian cities over Jio's network and 5G; Indic-language AI assistants on in-country infrastructure with evaluation on real customer queries.",
        ],
      },
      {
        h: "Success criteria",
        p: ["Compliance evidence produced, latency and throughput thresholds met, cost per transaction modelled in INR, and a clear production plan."],
      },
    ],
    deliverables: ["POC charter", "In-country sandbox", "Results against criteria", "Compliance evidence sample", "Production plan in INR"],
    approach: [
      { phase: "Frame", when: "Week 1", detail: "Question, criteria, data, regulator view." },
      { phase: "Build", when: "Week 2–4", detail: "Minimum compliant architecture." },
      { phase: "Prove", when: "Week 4–5", detail: "Latency, load, compliance tests." },
      { phase: "Decide", when: "Week 6", detail: "Read-out." },
    ],
    tooling: ["JioCloud compute & storage", "Jio-Azure AI services", "Kubernetes", "Load and latency testing from Indian PoPs"],
    targets: [
      { m: "≤ 6 weeks", l: "to decision" },
      { m: "100%", l: "of data processed in India" },
      { m: "INR", l: "cost per transaction modelled" },
    ],
    artefacts: ["poc-charter"],
  },
};
