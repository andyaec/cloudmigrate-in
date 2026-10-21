import type { CloudContent } from "../types";

export const azure: CloudContent = {
  assessment: {
    headline: "Azure assessment that turns licences into leverage",
    lede:
      "Most estates we assess are already Microsoft-heavy. The assessment's job is to measure what really runs, decide each application's path, and quantify what Azure Hybrid Benefit, extended security updates and existing Microsoft agreements are worth — before anyone commits.",
    sections: [
      {
        h: "Discovery with Azure Migrate",
        p: [
          "The Azure Migrate appliance discovers VMware, Hyper-V and physical servers agentlessly, collects performance history, inventories installed software, SQL Server instances and web apps, and maps dependencies. Where a deeper data-centre view is needed we add Dr. Migrate insights — both are accepted evidence for Microsoft's Frontier Accelerate assessment engagements.",
          "We insist on at least two weeks of performance data before right-sizing and on confirming every dependency group with the application owner.",
        ],
      },
      {
        h: "Decide the path, workload by workload",
        p: [
          "Rehost to Azure VMs, replatform to Azure SQL Managed Instance, App Service or AKS, relocate VMware to Azure VMware Solution, or retire. Azure Migrate's business case gives the first cut; we refine it with Hybrid Benefit for Windows Server and SQL Server, reservations and savings plans, and the cost of staying (ESU, hardware refresh, support renewals).",
        ],
      },
      {
        h: "Funded by Microsoft where eligible",
        p: [
          "Qualifying assessments can run as a Frontier Accelerate Assessment + POV engagement (Core Migrate & Modernize, Databases, Data Platform, AI Apps, SAP or Digital Sovereignty), paid by Microsoft on a fixed fee. Our Funding Advisor shows which one fits before we start.",
        ],
      },
    ],
    deliverables: [
      "Azure Migrate discovery and assessment reports",
      "Application portfolio with disposition, owner and rationale",
      "Azure Migrate business case refined with AHB, reservations and ESU avoidance",
      "Target architecture on CAF landing zones",
      "Wave plan and Post-Assessment + POV deployment plan (POE-ready)",
      "Azure Pricing Calculator estimate and solution architecture (POE-ready)",
    ],
    approach: [
      { phase: "Mobilise", when: "Week 1", detail: "Scope, access, Azure Migrate project and appliance, data-handling agreement, customer consent for Microsoft funding." },
      { phase: "Discover", when: "Week 1–4", detail: "Performance, software inventory, SQL and web-app discovery, dependency analysis." },
      { phase: "Assess", when: "Week 3–5", detail: "Azure VM, SQL and App Service assessments; right-sizing; licence modelling." },
      { phase: "Design", when: "Week 5–6", detail: "Landing zone, network topology, identity, management and security baselines." },
      { phase: "Decide", when: "Week 6", detail: "Business case, wave plan, executive read-out and post-sales nomination." },
    ],
    tooling: ["Azure Migrate", "Azure Migrate business case", "Dr. Migrate", "Azure Pricing Calculator", "Azure Advisor", "Cloud Adoption Framework", "Azure Well-Architected Review", "Data Migration Assistant / SQL assessments"],
    targets: [
      { m: "≥ 14 days", l: "of performance history before any sizing decision" },
      { m: "100%", l: "of SQL Server instances assessed for Azure SQL MI readiness" },
      { m: "6 weeks", l: "typical time from mobilisation to funded business case" },
    ],
    pitfalls: [
      "Ignoring Azure Hybrid Benefit and paying twice for Windows Server and SQL Server.",
      "Sizing from 'as-on-premises' instead of performance-based recommendations.",
      "Not capturing Subscription IDs and customer consent early — it delays Microsoft funding claims.",
    ],
    artefacts: ["assessment-workbook", "pre-checklist"],
  },

  migration: {
    headline: "Migration to Azure on landing zones that scale",
    lede:
      "We build Azure Landing Zones the Cloud Adoption Framework way — management groups, policy, hub networking, identity and logging — then migrate in rehearsed waves with Azure Migrate, Database Migration Service and Azure VMware Solution.",
    sections: [
      {
        h: "Landing zone before lift",
        p: [
          "Management-group hierarchy with platform and landing-zone subscriptions; Azure Policy for allowed regions (Central, South and West India), encryption, diagnostics and tagging; hub-and-spoke or Virtual WAN with Azure Firewall; private DNS zones for Private Link; Entra ID with Privileged Identity Management; and a Log Analytics workspace that every resource reports to.",
          "Deployed as code with the Azure Landing Zones accelerator so the next subscription is a pull request, not a project.",
        ],
      },
      {
        h: "The right engine for each workload",
        p: [
          "Servers move with Azure Migrate replication; SQL Server goes to Azure SQL Managed Instance with the Database Migration Service or Managed Instance link for near-zero downtime; open-source databases to Azure Database for PostgreSQL or MySQL; VMware estates relocate to Azure VMware Solution with HCX; desktops to Azure Virtual Desktop; SAP to SAP-certified infrastructure with Azure Center for SAP solutions.",
        ],
      },
      {
        h: "Secure from day one",
        p: [
          "Defender for Cloud and Microsoft Sentinel are switched on as part of the landing zone, not after the audit. That is also commercially sensible — Microsoft's Core Migrate & Modernize with Defender for Cloud / Sentinel engagement pays a 15% uplift when security consumption is designed in.",
        ],
      },
    ],
    deliverables: [
      "CAF landing zone deployed as code",
      "Migration handbook and per-wave runbooks",
      "Server, database, VMware, VDI and SAP migrations as scoped",
      "Validation and reconciliation evidence per wave",
      "Defender for Cloud and Sentinel baseline",
      "Engagement Details & POE pack with Subscription IDs for Microsoft funding",
    ],
    approach: [
      { phase: "Foundation", when: "Week 1–4", detail: "Landing zone, ExpressRoute / VPN, identity, policy, monitoring, backup and security baselines." },
      { phase: "Pilot wave", when: "Week 4–6", detail: "Low-risk applications to validate replication, test failover and cutover runbooks." },
      { phase: "Waves", when: "Two-week cadence", detail: "Replicate → test migrate → UAT → cutover → hypercare, with a wave board and daily stand-ups." },
      { phase: "Modernise", when: "Parallel", detail: "SQL MI, App Service, AKS and PaaS data services for applications that justify it." },
      { phase: "Exit", when: "Final 4 weeks", detail: "Decommission, ESU retirement, reservations and savings plans, handover to operations." },
    ],
    tooling: ["Azure Landing Zones accelerator", "Azure Migrate", "Azure Site Recovery", "Azure Database Migration Service", "Managed Instance link", "Azure VMware Solution + HCX", "Azure Virtual Desktop", "Azure Center for SAP solutions", "Azure Data Box", "Azure Storage Mover", "Bicep / Terraform", "Azure Arc"],
    targets: [
      { m: "100%", l: "of resources compliant with landing-zone policy at go-live" },
      { m: "≤ 15 min", l: "SQL cutover downtime with MI link or DMS online migration" },
      { m: "100%", l: "of waves with rehearsed test-migrations before cutover" },
    ],
    pitfalls: [
      "Building subscriptions by hand and retro-fitting policy later.",
      "Private endpoint DNS left unresolvable from on-premises.",
      "Forgetting to apply Azure Hybrid Benefit at deployment time.",
      "Moving existing consumption between subscriptions and expecting it to count as incremental ACR.",
    ],
    artefacts: ["handbook", "pre-checklist", "cutover-runbook", "post-checklist"],
  },

  "managed-services": {
    headline: "Azure managed services to Azure Expert MSP standards",
    lede:
      "One team runs the platform, the workloads and the bill. We operate through Azure Lighthouse so you keep control of your tenant, and we measure ourselves on availability, posture and cost — not on ticket volume.",
    sections: [
      {
        h: "Operations through Lighthouse",
        p: [
          "Delegated, auditable, least-privilege access across subscriptions with Azure Lighthouse and Privileged Identity Management. Azure Monitor, Log Analytics and workbooks for observability; Update Manager for patching Azure and Arc-enabled servers; Azure Backup with immutable vaults and soft delete; Site Recovery for tier-1 DR.",
        ],
      },
      {
        h: "Security operations included",
        p: [
          "Defender for Cloud recommendations are worked as a backlog against Secure Score; Microsoft Sentinel analytics and automation rules run in our SOC with India-resident log retention. Monthly posture reviews show trend, not just snapshot.",
        ],
      },
      {
        h: "FinOps with Microsoft's levers",
        p: [
          "Reservations and savings plans managed to coverage targets, Hybrid Benefit audited monthly, Advisor cost recommendations actioned with owners, and budgets with action groups. In CSP we also track the growth accelerator tiers so modernisation choices are made with eyes open.",
        ],
      },
    ],
    deliverables: [
      "Lighthouse onboarding and access model",
      "Runbook, RACI and SLA matrix",
      "Monitoring, alerting and incident management 24×7",
      "Patch, backup and DR testing calendar",
      "Monthly service review: availability, Secure Score, cost",
      "Continuous improvement and modernisation backlog",
    ],
    approach: [
      { phase: "Onboard", when: "Week 1–4", detail: "Lighthouse delegation, Arc for hybrid servers, monitoring baselines, runbook validation." },
      { phase: "Operate", when: "Ongoing", detail: "Incident, change, problem, patching, backup, capacity, security and cost operations." },
      { phase: "Improve", when: "Quarterly", detail: "Well-Architected reviews, automation, PaaS adoption, reservation re-balancing." },
    ],
    tooling: ["Azure Lighthouse", "Azure Monitor", "Log Analytics", "Azure Update Manager", "Azure Backup", "Azure Site Recovery", "Microsoft Defender for Cloud", "Microsoft Sentinel", "Azure Advisor", "Microsoft Cost Management", "Azure Arc", "Azure Policy"],
    targets: [
      { m: "15 min", l: "P1 response 24×7×365" },
      { m: "+10 pts", l: "Secure Score improvement in the first two quarters" },
      { m: "≥ 80%", l: "reservation / savings-plan coverage of steady-state compute" },
    ],
    pitfalls: [
      "Standing access via guest accounts instead of Lighthouse and PIM.",
      "Log Analytics ingestion costs nobody is watching.",
      "Reservations bought for VM sizes that were later right-sized away.",
    ],
    artefacts: ["runbook-raci", "post-checklist"],
  },

  "security-assessment": {
    headline: "Azure and Microsoft 365 security assessment",
    lede:
      "We assess your Azure estate against the Microsoft Cloud Security Benchmark and CIS, and your identity and data posture across Entra ID and Microsoft 365 — then hand back a prioritised plan mapped to DPDP and CERT-In.",
    sections: [
      {
        h: "Cloud posture",
        p: [
          "Defender CSPM attack-path analysis, Secure Score by control, Azure Policy compliance, network exposure (public IPs, NSGs, Azure Firewall rules), Key Vault and encryption, Defender plan coverage for servers, SQL, storage and containers, and diagnostic settings flowing to Log Analytics.",
        ],
      },
      {
        h: "Identity and data",
        p: [
          "Conditional Access design, legacy authentication, privileged roles and PIM, break-glass accounts, guest access and app consents in Entra ID; sensitivity labelling, DLP and insider-risk readiness in Purview. These usually expose the fastest risk reduction available.",
        ],
      },
      {
        h: "Funded routes",
        p: [
          "Microsoft's Security Envisioning & POC engagement can fund a Zero Trust workshop with hands-on configuration for eligible ME3 / ME5 and OE3 / EMS customers; Sentinel and Defender for Cloud deployment accelerators fund the post-assessment build. See the Funding Advisor for eligibility.",
        ],
      },
    ],
    deliverables: [
      "Microsoft Cloud Security Benchmark and CIS scorecard",
      "Entra ID and Conditional Access review",
      "Defender for Cloud attack paths and prioritised recommendations",
      "Sentinel readiness and log-source plan (CERT-In 180-day retention)",
      "DPDP Act gap analysis",
      "30 / 60 / 90-day remediation roadmap",
    ],
    approach: [
      { phase: "Scope", when: "Days 1–2", detail: "Tenants, subscriptions, crown-jewel data, read-only access." },
      { phase: "Collect", when: "Days 3–8", detail: "Defender CSPM, Secure Score, Policy, Entra sign-in and audit logs, Purview configuration." },
      { phase: "Analyse", when: "Days 9–13", detail: "Attack paths, control mapping, regulatory gaps, quick wins." },
      { phase: "Report", when: "Days 14–15", detail: "Findings, roadmap, and funded next steps." },
    ],
    tooling: ["Microsoft Defender for Cloud (CSPM)", "Microsoft Secure Score", "Azure Policy", "Microsoft Entra ID", "Privileged Identity Management", "Microsoft Sentinel", "Microsoft Purview", "Zero Trust Assessment", "Azure Resource Graph"],
    targets: [
      { m: "0", l: "accounts with standing Global Administrator outside PIM" },
      { m: "100%", l: "of subscriptions with Defender for Cloud and diagnostics enabled" },
      { m: "180 days", l: "security log retention in India" },
    ],
    pitfalls: [
      "Conditional Access policies in report-only mode for months.",
      "Defender for Servers enabled without endpoint integration.",
      "Sentinel ingesting everything and detecting nothing.",
    ],
    artefacts: ["security-checklist"],
  },

  poc: {
    headline: "Azure proofs of concept — AI, data and modernisation",
    lede:
      "We run time-boxed POCs on Microsoft Foundry, Fabric, AKS and Azure databases with written success criteria and a production path. Many qualify for Microsoft-funded Assessment + POV engagements.",
    sections: [
      {
        h: "Agents and AI apps",
        p: [
          "Retrieval-augmented assistants and multi-agent workflows on Microsoft Foundry with Azure OpenAI models, AI Search and Content Safety; evaluation harnesses that measure groundedness and accuracy rather than demo polish; API Management as the AI gateway for quotas and observability.",
        ],
      },
      {
        h: "Data platform",
        p: [
          "Microsoft Fabric POCs that land real source data in OneLake, prove a semantic model and a Power BI report against a business KPI, and size capacity honestly. Databricks where the customer is already invested in Spark.",
        ],
      },
      {
        h: "Modernisation",
        p: [
          "A slice of a monolith on AKS or Container Apps, SQL Server to Azure SQL MI with workload replay, or AVD for a pilot user group — each with performance and cost measured against the current state.",
        ],
      },
    ],
    deliverables: [
      "POC charter and success criteria",
      "Isolated subscription with policy and budget",
      "Working POC with measured results",
      "Solution architecture and Pricing Calculator estimate (POE-ready)",
      "Post-POV deployment plan and go / no-go",
    ],
    approach: [
      { phase: "Frame", when: "Week 1", detail: "Use case, criteria, data access, Responsible AI review." },
      { phase: "Build", when: "Week 2–4", detail: "Minimum architecture to prove each criterion." },
      { phase: "Evaluate", when: "Week 4–5", detail: "Measured tests, user feedback, cost model." },
      { phase: "Decide", when: "Week 6", detail: "Read-out and production plan." },
    ],
    tooling: ["Microsoft Foundry", "Azure OpenAI in Foundry Models", "Azure AI Search", "Azure AI Content Safety", "Copilot Studio", "Microsoft Fabric", "Azure Databricks", "AKS", "Azure Container Apps", "Azure SQL Managed Instance", "GitHub Copilot"],
    targets: [
      { m: "≤ 6 weeks", l: "charter to decision" },
      { m: "100%", l: "of criteria evidenced" },
      { m: "1", l: "production plan or a clean stop" },
    ],
    artefacts: ["poc-charter"],
  },
};
