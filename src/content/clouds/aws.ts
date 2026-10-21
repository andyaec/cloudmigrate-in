import type { CloudContent } from "../types";

export const aws: CloudContent = {
  sales: {
    headline: "AWS commercials, engineered like the architecture",
    lede:
      "Most AWS overspend is decided before the first instance launches — in how the account is bought, what is committed and when. We structure the commercial model up front: who bills, what gets committed after right-sizing, and which AWS programmes pay for the move.",
    sections: [
      {
        h: "Buying AWS in India",
        p: [
          "Indian customers contract with Amazon Internet Services Private Limited (AISPL), which invoices in rupees with GST. You can buy direct, through a Solution Provider who consolidates billing and adds support, or through AWS Marketplace private offers that land on the existing AWS bill and can retire committed spend.",
          "We help you pick the route by asking dull but decisive questions: who needs the GST input credit, who owns the payer account, whether a partner should hold root on the management account, and how chargeback will work across business units.",
        ],
      },
      {
        h: "Commit after you right-size, not before",
        p: [
          "Compute Savings Plans cover EC2, Fargate and Lambda and survive instance-family changes; EC2 Instance Savings Plans go deeper but lock the family. RDS, ElastiCache, OpenSearch and Redshift still use Reserved Instances. A private pricing agreement only makes sense once the run-rate is predictable.",
          "Our rule: migrate, right-size against 30–60 days of CloudWatch and Compute Optimizer data, then layer commitments in tranches. Committing to a lift-and-shift footprint simply locks in the waste.",
        ],
      },
      {
        h: "Let AWS fund the move",
        p: [
          "The Migration Acceleration Program (MAP) funds the Assess, Mobilize and Migrate & Modernize phases for qualifying workloads — but only for resources carrying the map-migrated tag from day one. An Optimization and Licensing Assessment (OLA) is usually the cheapest way to cut Windows and SQL Server licence cost before you move.",
          "We build the MAP plan, the tagging policy that protects the credits, and the evidence pack your AWS account team needs to approve each phase.",
        ],
      },
    ],
    deliverables: [
      "Commercial options paper — direct, Solution Provider or Marketplace",
      "Three-year TCO with a staged Savings Plan / RI commitment ladder",
      "MAP funding plan with map-migrated tagging policy and SCP guardrails",
      "Licensing position: BYOL vs licence-included, Dedicated Hosts, OLA findings",
      "Cost allocation tag taxonomy, Budgets and Cost Anomaly Detection set-up",
      "Procurement checklist for Marketplace private offers",
    ],
    approach: [
      { phase: "Baseline", when: "Week 1", detail: "Current contracts, on-prem run cost, licence entitlements, existing AWS spend from Cost and Usage Reports." },
      { phase: "Model", when: "Week 2–3", detail: "Migration Evaluator and Pricing Calculator scenarios; commitment ladder sized to post-migration p95, not peak." },
      { phase: "Fund", when: "Week 3", detail: "MAP / OLA / POC-credit applications with the AWS account team; partner funding claims." },
      { phase: "Contract", when: "Week 4", detail: "Billing route, payer-account ownership, Marketplace private offers and support plan." },
      { phase: "Govern", when: "Ongoing", detail: "Monthly FinOps review: commitment coverage and utilisation, anomalies, untagged spend." },
    ],
    tooling: ["AWS Pricing Calculator", "Migration Evaluator", "Cost Explorer", "Cost and Usage Report / Data Exports", "Savings Plans recommendations", "Compute Optimizer", "AWS Budgets", "Cost Anomaly Detection", "AWS Marketplace", "Billing Conductor"],
    targets: [
      { m: "≥ 70%", l: "of steady-state compute under Savings Plans within 90 days of the final wave" },
      { m: "100%", l: "of migrated resources carrying MAP and cost-allocation tags" },
      { m: "< 24 h", l: "from cost anomaly to named owner" },
    ],
    pitfalls: [
      "Buying three-year commitments against an un-right-sized lift-and-shift estate.",
      "Missing the map-migrated tag on early waves — the credits are lost, not deferred.",
      "Ignoring NAT Gateway, inter-AZ and egress charges in the business case.",
      "Running Windows Server with licence-included pricing when Dedicated Hosts and BYOL would be cheaper.",
    ],
    artefacts: ["commercial-checklist", "assessment-workbook"],
  },

  assessment: {
    headline: "An AWS assessment built on telemetry",
    lede:
      "A credible migration plan starts with measured utilisation, real dependencies and an honest 7R decision for every application. We collect, we don't guess — and we leave you with a wave plan and business case that survive scrutiny.",
    sections: [
      {
        h: "What we measure",
        p: [
          "At least two weeks of CPU, memory, disk and network utilisation per server; listening ports and established connections to build dependency groups; database versions, sizes and feature use; licences in force; change windows and data-classification constraints.",
          "Agentless collection via Migration Evaluator or the Application Discovery Service collector covers VMware estates fast; agents fill the dependency gaps on physical and Hyper-V hosts.",
        ],
      },
      {
        h: "From inventory to decisions",
        p: [
          "Every application gets an owner and a 7R disposition — retire, retain, rehost, relocate, replatform, repurchase or refactor — with the reasoning written down. Rehost through Application Migration Service is the default for speed; Aurora, RDS, EKS and Lambda are chosen where the payback is clear within the business case horizon.",
          "Move groups are built from dependency data, then sequenced into waves that respect change freezes, licence renewals and data-centre exit dates.",
        ],
      },
      {
        h: "A business case the CFO will sign",
        p: [
          "We price the target with right-sized instances, storage tiers and commitment coverage, compare it with fully loaded on-premises cost (hardware refresh, power, space, support contracts, people), and show the migration cost and MAP funding separately so nobody double counts.",
        ],
      },
    ],
    deliverables: [
      "Discovery data set with utilisation and dependency evidence",
      "Application portfolio with 7R disposition, owner and rationale",
      "Move groups and a dated wave plan",
      "Target architecture and Control Tower landing-zone design",
      "TCO and business case, including MAP assess / mobilise funding",
      "Risk, assumption and decision registers",
    ],
    approach: [
      { phase: "Mobilise", when: "Week 1", detail: "Stakeholders, scope, access, collector deployment and data-handling agreement." },
      { phase: "Discover", when: "Week 1–4", detail: "Agentless and agent-based collection; application owner interviews; licence and contract inventory." },
      { phase: "Analyse", when: "Week 3–5", detail: "Right-sizing, dependency grouping, 7R workshops, database assessments with DMS Fleet Advisor and Schema Conversion." },
      { phase: "Plan", when: "Week 5–6", detail: "Landing-zone design, wave plan, migration tooling choices, resourcing model." },
      { phase: "Decide", when: "Week 6", detail: "Business case read-out, executive decision, MAP mobilise application." },
    ],
    tooling: ["Migration Evaluator", "AWS Application Discovery Service", "AWS Migration Hub", "Migration Hub Strategy Recommendations", "AWS Transform", "DMS Fleet Advisor", "DMS Schema Conversion", "AWS Well-Architected Tool", "Pricing Calculator"],
    targets: [
      { m: "≥ 95%", l: "of in-scope servers with 14+ days of utilisation data before sizing" },
      { m: "100%", l: "of applications with a named owner and signed-off disposition" },
      { m: "± 15%", l: "business-case accuracy against 12-month actuals" },
    ],
    pitfalls: [
      "Sizing from allocated vCPU instead of measured p95 — the cloud bill doubles.",
      "Treating Active Directory, DNS, NTP and file shares as 'infrastructure' rather than dependencies.",
      "Leaving licensing to the end; it often decides the target pattern.",
    ],
    artefacts: ["assessment-workbook", "pre-checklist"],
  },

  migration: {
    headline: "Factory-model migration to AWS",
    lede:
      "Landing zone first, then waves. Every wave follows the same rehearsed runbook — replicate, test, cut over, hold, decommission — so the twentieth wave is boring in the best possible way.",
    sections: [
      {
        h: "A foundation you won't have to rebuild",
        p: [
          "We stand up AWS Control Tower with an OU structure for security, infrastructure, workloads and sandboxes; IAM Identity Center federated to your identity provider; organisation-wide CloudTrail and Config into a log-archive account; and a Transit Gateway hub with centralised inspection and Route 53 Resolver for hybrid DNS.",
          "Service control policies enforce the non-negotiables — approved regions (Mumbai and Hyderabad for residency), no public S3, mandatory encryption and tagging — before a single workload lands.",
        ],
      },
      {
        h: "The migration factory",
        p: [
          "Application Migration Service keeps block-level replication running continuously, so test launches and cutovers take minutes. Databases move with native tools where downtime allows and DMS with change data capture where it doesn't; heterogeneous moves such as Oracle to Aurora PostgreSQL go through Schema Conversion first.",
          "Each wave has a go / no-go checkpoint, a rollback trigger agreed with the business in advance, and a hypercare window staffed by the people who built it.",
        ],
      },
      {
        h: "Special estates",
        p: [
          "SAP moves with AWS Launch Wizard and SAP-certified instances; VMware estates either rehost through MGN or relocate where Amazon EVS fits; mainframe and .NET modernisation use AWS Transform to compress the analysis. Windows estates get a licence-optimised pattern before they move, not after.",
        ],
      },
    ],
    deliverables: [
      "Control Tower landing zone with guardrails, networking and logging",
      "Migration handbook and wave-specific runbooks",
      "Replication, test and cutover execution per wave",
      "Database migrations with validation scripts and reconciliation reports",
      "Rollback plans rehearsed for every wave",
      "Hypercare, handover to operations and source decommissioning",
    ],
    approach: [
      { phase: "Foundation", when: "Week 1–4", detail: "Landing zone, connectivity (Direct Connect / VPN), identity, security tooling, backup policy." },
      { phase: "Pilot wave", when: "Week 4–6", detail: "Three to five low-risk applications to prove tooling, runbooks and team rhythm." },
      { phase: "Factory waves", when: "Two-week cadence", detail: "Replicate → test launch → UAT → cutover → hypercare, with daily stand-ups and a wave board." },
      { phase: "Complex moves", when: "Parallel track", detail: "Databases, SAP, mainframe and refactor candidates on their own plans." },
      { phase: "Exit", when: "Final 4 weeks", detail: "Decommission sources, release contracts, close MAP evidence, hand over to managed services." },
    ],
    tooling: ["AWS Control Tower", "AWS Organizations", "IAM Identity Center", "AWS Application Migration Service", "AWS Database Migration Service", "DMS Schema Conversion", "AWS DataSync", "AWS Transfer Family", "Migration Hub Orchestrator", "AWS Launch Wizard", "AWS Transform", "Systems Manager"],
    targets: [
      { m: "100%", l: "of waves with a rehearsed rollback before cutover" },
      { m: "≤ 4 h", l: "business-visible downtime for tier-2 applications" },
      { m: "0", l: "unplanned P1 incidents during hypercare as the goal" },
    ],
    pitfalls: [
      "Overlapping IP ranges between on-premises and VPCs discovered on cutover night.",
      "Replication bandwidth sized for the average day, not the month-end batch.",
      "Hard-coded IPs and hostnames in application configs and firewall rules.",
      "No agreed rollback trigger — so nobody calls it until it's too late.",
    ],
    artefacts: ["handbook", "pre-checklist", "cutover-runbook", "post-checklist"],
  },

  "managed-services": {
    headline: "Run, secure and optimise AWS — 24×7",
    lede:
      "Migration is the start of the bill, not the end of the project. Our managed service runs your AWS estate under clear SLAs with a single RACI, and treats cost and security as operating metrics, not annual audits.",
    sections: [
      {
        h: "Operating model",
        p: [
          "L1 monitoring and triage from our India operations centre, L2 platform engineers per tower (compute, data, network, security), and L3 architects for change and problem management. ITIL-aligned change with automated pre-checks, and an SRE practice for customers who want error budgets rather than ticket counts.",
        ],
      },
      {
        h: "Automation over heroics",
        p: [
          "Patch baselines and maintenance windows in Systems Manager, AWS Backup plans with vault lock and cross-region copies, Config conformance packs for drift, and infrastructure as code for every change. Runbooks are executable documents, not wiki pages.",
        ],
      },
      {
        h: "FinOps that actually closes the loop",
        p: [
          "Monthly reviews of commitment coverage and utilisation, idle and over-provisioned resources, storage lifecycle and data-transfer hotspots — with owners and dates against every recommendation. Graviton and gp3 migrations are planned changes, not suggestions.",
        ],
      },
    ],
    deliverables: [
      "Service runbook, RACI and SLA matrix",
      "24×7 monitoring, incident and problem management",
      "Patch, backup and restore-testing schedule",
      "Monthly service review with FinOps and security posture",
      "Quarterly Well-Architected review and improvement backlog",
      "Change management with IaC and automated pre-checks",
    ],
    approach: [
      { phase: "Transition", when: "Week 1–4", detail: "Knowledge transfer, access, monitoring baselines, runbook validation, shadow support." },
      { phase: "Steady state", when: "Ongoing", detail: "Incident, change, problem, patching, backup, capacity and cost management." },
      { phase: "Improve", when: "Quarterly", detail: "Well-Architected reviews, automation backlog, modernisation proposals." },
    ],
    tooling: ["Amazon CloudWatch", "CloudWatch Application Signals", "AWS Systems Manager", "AWS Backup", "AWS Security Hub", "Amazon GuardDuty", "AWS Config", "Trusted Advisor", "Compute Optimizer", "AWS Health", "Managed Grafana", "Managed Service for Prometheus"],
    targets: [
      { m: "15 min", l: "P1 response, 24×7×365" },
      { m: "≥ 95%", l: "patch compliance within 14 days of release" },
      { m: "Monthly", l: "restore test for every tier-1 backup policy" },
    ],
    pitfalls: [
      "Backups that have never been restored.",
      "Monitoring every metric and alerting on none that matter.",
      "Savings Plans bought once and never re-balanced.",
    ],
    artefacts: ["runbook-raci", "post-checklist"],
  },

  "security-assessment": {
    headline: "AWS security assessment that ends in a fix list",
    lede:
      "We assess identity, detection, data protection, network and workload security against AWS Foundational Security Best Practices and the CIS AWS Foundations Benchmark — and map the gaps to India's DPDP Act and CERT-In directions.",
    sections: [
      {
        h: "What we look at",
        p: [
          "Root and break-glass usage, IAM Identity Center and permission sets, SCPs and IAM Access Analyzer findings; an organisation CloudTrail, GuardDuty and Security Hub across every account and region; KMS key policies, S3 Block Public Access and Macie coverage for personal data; security groups, Network Firewall and WAF; Inspector and ECR image scanning for workloads.",
        ],
      },
      {
        h: "Indian obligations, not just benchmarks",
        p: [
          "CERT-In's 2022 directions require reportable incidents within six hours and 180 days of logs retained in India. The DPDP Act and Rules require reasonable security safeguards, breach notification and purpose-limited processing. We check whether your log retention, region choices and incident runbooks actually satisfy them.",
        ],
      },
      {
        h: "Prioritised by exploitability",
        p: [
          "Findings are ranked by blast radius and how easily they can be exploited — an internet-exposed admin port beats a missing tag every time. The output is a 30 / 60 / 90-day remediation plan with owners, plus Security Hub automations so the same issue cannot quietly return.",
        ],
      },
    ],
    deliverables: [
      "Security findings register with severity, evidence and owner",
      "CIS / FSBP control scorecard per account",
      "DPDP and CERT-In gap analysis",
      "Incident-response readiness review and playbooks",
      "30 / 60 / 90-day remediation roadmap",
      "Executive summary for the board or audit committee",
    ],
    approach: [
      { phase: "Scope", when: "Days 1–2", detail: "Accounts, regions, crown-jewel data, read-only access roles." },
      { phase: "Collect", when: "Days 3–7", detail: "Security Hub, Config, Access Analyzer, Prowler scans; interviews with platform and app teams." },
      { phase: "Analyse", when: "Days 8–12", detail: "Attack-path analysis, control mapping, regulatory gap assessment." },
      { phase: "Report", when: "Days 13–15", detail: "Findings walkthrough, remediation plan, quick wins applied where approved." },
    ],
    tooling: ["AWS Security Hub", "Amazon GuardDuty", "IAM Access Analyzer", "Amazon Inspector", "Amazon Macie", "AWS Config", "Amazon Detective", "AWS Audit Manager", "Prowler (open source)"],
    targets: [
      { m: "0", l: "critical findings open beyond 30 days" },
      { m: "100%", l: "of accounts and regions covered by GuardDuty and CloudTrail" },
      { m: "180 days", l: "of security logs retained in India" },
    ],
    pitfalls: [
      "Long-lived IAM user access keys with administrator rights.",
      "GuardDuty enabled in the primary region only.",
      "Security Hub findings nobody owns.",
    ],
    artefacts: ["security-checklist"],
  },

  poc: {
    headline: "AWS proofs of concept with a real exit decision",
    lede:
      "A POC should answer one business question with evidence, inside a fixed time box, in an environment that could become production. We write the success criteria before we write any code.",
    sections: [
      {
        h: "What makes a POC worth doing",
        p: [
          "A testable hypothesis, quantified success criteria agreed with the sponsor, representative data, and a decision date. Anything else is a demo. We run POCs in a Control Tower sandbox OU with budgets and SCPs, so experimentation never compromises the production estate.",
        ],
      },
      {
        h: "POCs we run most often",
        p: [
          "Generative AI on Amazon Bedrock — retrieval-augmented assistants over enterprise documents with Knowledge Bases and Guardrails; EKS modernisation of a monolith slice; Oracle or SQL Server to Aurora PostgreSQL with a real workload replay; Redshift and Lake Formation analytics; and AWS Transform-assisted code modernisation.",
        ],
      },
      {
        h: "From POC to production",
        p: [
          "Every POC ends with a go / no-go, an indicative production architecture and cost, and a backlog. If the answer is no, you have spent weeks, not quarters, to learn it. POC credits from AWS can often fund the infrastructure.",
        ],
      },
    ],
    deliverables: [
      "POC charter with hypothesis and success criteria",
      "Sandbox environment with guardrails and budget alarms",
      "Working POC and test evidence",
      "Results report against each success criterion",
      "Production architecture, cost estimate and backlog",
      "Tear-down or promote decision",
    ],
    approach: [
      { phase: "Frame", when: "Week 1", detail: "Hypothesis, criteria, data, stakeholders, timeline; charter signed." },
      { phase: "Build", when: "Week 2–4", detail: "Minimum architecture that can prove or disprove each criterion." },
      { phase: "Prove", when: "Week 4–5", detail: "Run tests with real users or replayed workload; capture metrics." },
      { phase: "Decide", when: "Week 6", detail: "Read-out, go / no-go, production plan or tear-down." },
    ],
    tooling: ["Amazon Bedrock", "Bedrock Knowledge Bases", "Bedrock Guardrails", "Amazon EKS", "Amazon Aurora", "Amazon Redshift", "AWS Lake Formation", "AWS Transform", "AWS CloudFormation / CDK"],
    targets: [
      { m: "≤ 6 weeks", l: "from charter to decision" },
      { m: "100%", l: "of success criteria measured, not asserted" },
      { m: "1", l: "clear go / no-go recommendation" },
    ],
    artefacts: ["poc-charter"],
  },
};
