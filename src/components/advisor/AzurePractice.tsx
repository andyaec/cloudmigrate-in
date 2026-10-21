"use client";

import { useMemo, useState } from "react";
import { scenarios } from "@/content/scenarios";
import {
  buildPlan,
  defaultDeal,
  incrementalCheck,
  ratioCheck,
  successRate,
  type AzureDeal,
  type Evaluation,
  type SourcePlatform,
} from "@/lib/advisor/azure-engine";
import { azureData, azureMarket, meta, mwMarket, sourceLabel } from "@/lib/incentives/data";
import type { AzureLane, SegmentId } from "@/lib/incentives/types";
import { fmtPct } from "@/lib/format";
import { ServicePicker, TAG_LABELS } from "./ServicePicker";
import { Money, NumberField, PayoutLadder, ProgramCard, Toggle, useClipboard, usePersistentState } from "./shared";

type Tab = "builder" | "catalogue" | "compliance" | "notes";

const LANE_LABEL: Record<AzureLane, string> = {
  "pre-sales": "Pre-sales · Assessment + POV",
  "post-sales": "Post-sales · Delivery (paid on incremental ACR)",
  "two-stage": "Security consumption · Sentinel / Defender for Cloud two-stage",
  marketplace: "Marketplace · SDC & AI Build-Publish",
};

const SOURCES: { id: SourcePlatform; label: string }[] = [
  { id: "onprem", label: "On-premises / private DC" },
  { id: "aws-rds", label: "AWS RDS (SQL Server / PostgreSQL)" },
  { id: "aws-aurora", label: "AWS Aurora (MySQL / PostgreSQL)" },
  { id: "gcp-cloudsql", label: "Google Cloud SQL" },
  { id: "gcp-bigquery", label: "Google BigQuery" },
  { id: "aws-other", label: "Other AWS services" },
  { id: "gcp-other", label: "Other Google Cloud services" },
  { id: "other-cloud", label: "Other cloud / hosting" },
];

function ladderFor(e: Evaluation) {
  const markets: ("A" | "B" | "C")[] = e.programme.markets === "ABC" ? ["A", "B", "C"] : ["A", "B"];
  const metric = e.programme.rule.metricInput === "agentMau" ? "Agent MAU" : e.programme.rule.metricInput === "mbs" ? "Marketplace billed sales" : "Incremental ACR / yr";
  return <PayoutLadder sizes={e.programme.sizes} markets={markets} metric={metric} highlight={e.size?.size} />;
}

function EvalCard({ e, badge, open }: { e: Evaluation; badge?: string; open?: boolean }) {
  const basis =
    e.programme.rule.metricInput === "agentMau"
      ? `${Math.round(e.basis).toLocaleString()} Agent MAU`
      : e.basis > 0
        ? `Sized on $${Math.round(e.basis).toLocaleString()} / yr${e.workload ? ` · ${e.workload.label} ${fmtPct(e.workload.share)} ($${Math.round(e.workload.value).toLocaleString()})` : ""} · Market ${e.market}`
        : `Market ${e.market}`;
  return (
    <ProgramCard
      title={e.programme.short}
      official={e.programme.name}
      status={e.status}
      size={e.size?.size}
      payout={e.payout}
      stage2={e.stage2}
      basisLine={basis}
      checks={e.checks}
      hints={e.hints}
      summary={e.programme.summary}
      poe={e.programme.poe}
      controls={e.programme.controls}
      notes={e.programme.notes}
      source={e.programme.source}
      ladder={ladderFor(e)}
      badge={badge}
      defaultOpen={open}
    />
  );
}

export function AzurePractice({ profile }: { profile: { country: string; segment: SegmentId; creds: string[] } }) {
  const [tab, setTab] = useState<Tab>("builder");
  const [stored, setStored] = usePersistentState<AzureDeal>("cm.advisor.azure.v1", defaultDeal);
  const deal: AzureDeal = { ...stored, country: profile.country, segment: profile.segment, creds: profile.creds };
  const set = <K extends keyof AzureDeal>(k: K, v: AzureDeal[K]) => setStored((d) => ({ ...d, [k]: v }));
  const plan = useMemo(() => buildPlan(deal), [JSON.stringify(deal)]); // eslint-disable-line react-hooks/exhaustive-deps
  const scenario = scenarios.find((s) => s.id === deal.scenario)!;
  const hasSap = deal.lines.some((l) => l.id.startsWith("sap-") || l.id === "acss");
  const { copied, copy } = useClipboard();

  const summaryText = () => {
    const L: string[] = [];
    L.push(`Azure funding plan — ${scenario.title}`);
    L.push(`Customer segment: ${deal.segment} · Partner market (Azure): ${azureMarket(deal.country)} · Security market: ${mwMarket(deal.country)}`);
    L.push(`Incremental ACR (12 months): $${Math.round(plan.totals.incrementalAnnual).toLocaleString()}`);
    const line = (label: string, e?: Evaluation) => e && L.push(`${label}: ${e.programme.short} — ${e.size?.size ?? ""} — $${e.payout.toLocaleString()}${e.stage2 ? ` + $${e.stage2.toLocaleString()} (Stage 2)` : ""}`);
    line("Pre-sales", plan.pre);
    line("Post-sales", plan.post);
    plan.bonuses.forEach((b) => line("Bonus", b));
    plan.security.forEach((s) => line("Security", s));
    plan.marketplace.forEach((m) => line("Marketplace", m));
    L.push(`Fee potential: $${plan.guaranteed.toLocaleString()} + conditional $${plan.conditional.toLocaleString()}`);
    if (plan.csp) L.push(`CSP incentive estimate: $${Math.round(plan.csp.total).toLocaleString()} / yr`);
    plan.warnings.forEach((w) => L.push(`Note: ${w}`));
    L.push("Source: Microsoft Commercial Partner Incentives Guide (exported 3 Sep 2026). Validate with your PDM before nomination.");
    return L.join("\n");
  };

  const split = [
    { k: "Core M&M", v: plan.totals.byTag.core ?? 0, c: "var(--ink)" },
    { k: "Databases", v: plan.totals.byTag.db ?? 0, c: "#2f6f8f" },
    { k: "Frontier (GitHub · Foundry · Fabric)", v: plan.totals.byTag.fr ?? 0, c: "var(--accent)" },
    { k: "Security (MDC · Sentinel)", v: (plan.totals.byTag.mdc ?? 0) + (plan.totals.byTag.sen ?? 0), c: "#b97e10" },
    { k: "AVS · AVD · SAP · Sovereignty", v: (plan.totals.byTag.avs ?? 0) + (plan.totals.byTag.avd ?? 0) + (plan.totals.byTag.sap ?? 0) + (plan.totals.byTag.sov ?? 0), c: "#2c6a3c" },
  ];
  const splitMax = Math.max(1, plan.totals.incrementalAnnual);

  return (
    <div>
      <div className="subtabs" role="tablist" aria-label="Azure ACR practice views">
        {(
          [
            ["builder", "Deal builder"],
            ["catalogue", "Programme catalogue"],
            ["compliance", "Compliance calculators"],
            ["notes", "Guide notes & rules"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)} type="button">
            {label}
          </button>
        ))}
      </div>

      {tab === "builder" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> What is happening on this deal?
              </h3>
              <div className="scenario-grid">
                {scenarios.map((s) => (
                  <label key={s.id} className={`scenario ${deal.scenario === s.id ? "on" : ""}`}>
                    <input type="radio" name="scenario" checked={deal.scenario === s.id} onChange={() => set("scenario", s.id)} />
                    <strong>{s.title}</strong>
                    <span>{s.short}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="step">
              <h3>
                <span className="stepn">2</span> Customer & commercial facts
              </h3>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="lic">Licensing / billing route</label>
                  <select id="lic" value={deal.licensing} onChange={(e) => set("licensing", e.target.value as AzureDeal["licensing"])}>
                    <option value="ea-indirect">Enterprise Agreement via LSP (indirect)</option>
                    <option value="ea-direct">Enterprise Agreement (direct)</option>
                    <option value="mca-e">Microsoft Customer Agreement – Enterprise</option>
                    <option value="csp-direct">CSP — we are the Direct Bill partner</option>
                    <option value="csp-indirect">CSP — we are the Indirect Reseller</option>
                    <option value="payg">Pay-as-you-go / web direct</option>
                  </select>
                </div>
                <div className="field">
                  <span className="flabel">Database source platforms</span>
                  <div className="checkset">
                    {SOURCES.map((s) => (
                      <label key={s.id}>
                        <input
                          type="checkbox"
                          checked={deal.sourcePlatforms.includes(s.id)}
                          onChange={(e) =>
                            set("sourcePlatforms", e.target.checked ? [...deal.sourcePlatforms, s.id] : deal.sourcePlatforms.filter((x) => x !== s.id))
                          }
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="toggles">
                <Toggle label="Customer has a valid Azure tenant / TPID" checked={deal.validTenant} onChange={(b) => set("validTenant", b)} />
                <Toggle label="Customer is on Microsoft's GTM security propensity list" hint="Required for Sentinel / Defender for Cloud accelerators" checked={deal.propensityList} onChange={(b) => set("propensityList", b)} />
                <Toggle label="Azure credits, ACO or sponsorship in place" hint="Delays recognised incremental ACR" checked={deal.credits} onChange={(b) => set("credits", b)} />
                {deal.scenario === "partner-change" && (
                  <Toggle label="We replace ALL existing CSP partners on the tenant" hint="Triggers Change of Channel Partner" checked={deal.cocpReplacesAll} onChange={(b) => set("cocpReplacesAll", b)} />
                )}
                <Toggle label="We are an SDC moving customers onto our own Azure solution" checked={deal.isSdc} onChange={(b) => set("isSdc", b)} />
                <Toggle label="We are an SI delivering an SDC's Azure solution" checked={deal.isSiForSdc} onChange={(b) => set("isSiForSdc", b)} />
              </div>
              {(deal.isSdc || deal.scenario === "sdc-solution") && (
                <div className="field-grid">
                  <NumberField label="Planned Marketplace Billed Sales, year 1 (USD)" value={deal.mbs} onChange={(n) => set("mbs", n)} hint="For AI Build & Publish (Marketplace)" step={1000} />
                  <NumberField label="Planned Agent 365 MAU, year 1" value={deal.agentMau} onChange={(n) => set("agentMau", n)} hint="For AI Build & Publish (Copilot Agent Store)" step={100} />
                </div>
              )}
              {hasSap && (
                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="sapt">SAP engagement type</label>
                    <select id="sapt" value={deal.sapType} onChange={(e) => set("sapType", e.target.value as AzureDeal["sapType"])}>
                      <option value="native">SAP Native on Azure (sized on ACR)</option>
                      <option value="rise">RISE with SAP (sized on first-year ACV)</option>
                      <option value="grow">GROW with SAP (sized on first-year ACV)</option>
                    </select>
                  </div>
                  {deal.sapType !== "native" && <NumberField label="First-year SAP ACV (USD)" value={deal.sapAcv} onChange={(n) => set("sapAcv", n)} step={5000} />}
                </div>
              )}
            </section>

            <section className="step">
              <h3>
                <span className="stepn">3</span> Azure services in the deal
              </h3>
              <ServicePicker lines={deal.lines} onChange={(l) => set("lines", l)} />
            </section>

            <section className="step">
              <h3>
                <span className="stepn">4</span> Baseline & moved consumption
              </h3>
              <div className="field-grid">
                <NumberField
                  label="Current monthly Azure spend on this tenant (avg. last 3 full months, USD)"
                  value={deal.baselineMonthly}
                  onChange={(n) => set("baselineMonthly", n)}
                  hint="Microsoft baseline = this × 12"
                  step={500}
                />
                <NumberField
                  label="Of the selected workloads, monthly ACR that is only being moved (USD)"
                  value={deal.movedMonthly}
                  onChange={(n) => set("movedMonthly", n)}
                  hint="Subscription, tenant or partner moves — not incremental"
                  step={500}
                />
                {(deal.licensing === "csp-direct" || deal.licensing === "csp-indirect") && (
                  <NumberField label="Tenant's prior-year Azure ACR (all partners, USD)" value={deal.priorYearTenantAcr} onChange={(n) => set("priorYearTenantAcr", n)} hint="For CSP growth accelerator" step={1000} />
                )}
              </div>
            </section>
          </div>

          <aside className="builder-results" aria-live="polite">
            <div className="results-card">
              <div className="results-head">
                <span className="label">Funding plan</span>
                <button type="button" className="chip-btn" onClick={() => copy(summaryText())}>
                  {copied ? "Copied ✓" : "Copy summary"}
                </button>
              </div>
              <div className="kpi-row">
                <div>
                  <span className="k">Incremental ACR / yr</span>
                  <Money v={plan.totals.incrementalAnnual} className="v" />
                </div>
                <div>
                  <span className="k">Fee potential</span>
                  <Money v={plan.guaranteed} className="v accent" />
                </div>
                <div>
                  <span className="k">Conditional (Stage 2)</span>
                  <Money v={plan.conditional} className="v" />
                </div>
              </div>
              <p className="tiny muted" style={{ margin: "6px 0 0" }}>
                Partner market: Azure offers {azureMarket(deal.country)} · Security accelerators {mwMarket(deal.country)} ({deal.country}). Baseline ${Math.round(plan.totals.baselineAnnual).toLocaleString()} → projected tenant ACR ${Math.round(plan.totals.projectedTenantAnnual).toLocaleString()}.
              </p>
              {plan.totals.incrementalAnnual > 0 && (
                <div className="split">
                  {split
                    .filter((s) => s.v > 0)
                    .map((s) => (
                      <div key={s.k} className="split-row">
                        <span>{s.k}</span>
                        <div className="bar">
                          <i style={{ width: `${Math.min(100, (s.v / splitMax) * 100)}%`, background: s.c }} />
                        </div>
                        <span className="mono">{fmtPct(s.v / splitMax)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {plan.warnings.length > 0 && (
              <ul className="warnlist small">
                {plan.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}

            {!deal.lines.length && <div className="notice info small">Select Azure services and enter monthly consumption to see eligible programmes. Set partner credentials in the profile above.</div>}

            {deal.lines.length > 0 && (
              <>
                <h4 className="lane-h">Recommended path</h4>
                {plan.pre ? <EvalCard e={plan.pre} badge="1 · Pre-sales" /> : <p className="small muted">No pre-sales engagement fits (needs $50K+ ACR, Majors / SMC-Corporate or eligible SMB, and a matching specialization).</p>}
                {plan.post ? <EvalCard e={plan.post} badge="2 · Post-sales" open /> : <p className="small muted">No post-sales engagement fits yet — open “All programmes evaluated” below to see why.</p>}
                {plan.bonuses.map((b) => (
                  <EvalCard key={b.programme.id} e={b} badge="3 · Bonus" />
                ))}
                {plan.security.length > 0 && <h4 className="lane-h">Security consumption accelerators</h4>}
                {plan.security.map((s) => (
                  <EvalCard key={s.programme.id} e={s} badge="Two-stage" />
                ))}
                {plan.marketplace.length > 0 && <h4 className="lane-h">Marketplace</h4>}
                {plan.marketplace.map((m) => (
                  <EvalCard key={m.programme.id} e={m} badge="Marketplace" />
                ))}

                {(plan.csp || plan.ea) && <h4 className="lane-h">Partner-of-record earnings</h4>}
                {plan.csp && (
                  <div className="results-card">
                    <div className="results-head">
                      <strong>Azure CSP incentive (estimate, 12 months)</strong>
                      <Money v={plan.csp.total} className="amt" />
                    </div>
                    {!plan.csp.eligible && <p className="small" style={{ color: "var(--bad)" }}>Missing: {plan.csp.missing.join(" · ")}</p>}
                    <table className="mini">
                      <tbody>
                        {plan.csp.rows.map((r) => (
                          <tr key={r.label}>
                            <td>{r.label}</td>
                            <td className="mono">${Math.round(r.base).toLocaleString()}</td>
                            <td>
                              <Money v={r.earn} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {plan.csp.notes.map((n) => (
                      <p key={n} className="tiny muted">
                        {n}
                      </p>
                    ))}
                    <p className="tiny muted">60% rebate / 40% co-op · paid monthly · TPOR association · {sourceLabel(azureData.csp.source)}</p>
                  </div>
                )}
                {plan.ea && (
                  <div className="results-card">
                    <div className="results-head">
                      <strong>Enterprise incentive — Azure consumption (indirect EA)</strong>
                      <Money v={plan.ea.earn} className="amt" />
                    </div>
                    <p className="small">1.5% of Azure consumed revenue on the enrollment, capped at $200K per enrollment per term. {plan.ea.eligible ? "" : "Requires LSP / EDA authorisation."}</p>
                    <p className="tiny" style={{ color: "var(--amber)" }}>Term shown in the guide: {plan.ea.term}.</p>
                  </div>
                )}

                <details className="all-evals">
                  <summary>All programmes evaluated ({plan.all.length}) — see why each one does or doesn't fit</summary>
                  {(Object.keys(LANE_LABEL) as AzureLane[]).map((lane) => (
                    <div key={lane}>
                      <h5 className="lane-h">{LANE_LABEL[lane]}</h5>
                      {plan.all
                        .filter((e) => e.programme.lane === lane)
                        .map((e) => (
                          <EvalCard key={e.programme.id} e={e} badge={e.programme.track === "smb" ? "SMB track" : undefined} />
                        ))}
                    </div>
                  ))}
                </details>
              </>
            )}

            <div className="results-card scenario-card">
              <span className="label">Rules for this scenario</span>
              <h4 style={{ margin: "6px 0 8px" }}>{scenario.title}</h4>
              <ul className="small">
                {scenario.guidance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              {(deal.scenario === "partner-change" || deal.scenario === "subscription-move") && (
                <details>
                  <summary className="small">Change of Channel Partner (COCP) rules</summary>
                  <ul className="small">
                    {azureData.cocp.rules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </aside>
        </div>
      )}

      {tab === "catalogue" && <Catalogue />}
      {tab === "compliance" && <Compliance />}
      {tab === "notes" && <Notes />}
    </div>
  );
}

function Catalogue() {
  const [lane, setLane] = useState<AzureLane | "all">("all");
  const [track, setTrack] = useState<"all" | "specialized" | "smb">("all");
  const list = azureData.programmes.filter((p) => (lane === "all" || p.lane === lane) && (track === "all" || p.lane !== "post-sales" || p.track === track));
  return (
    <div className="catalogue">
      <div className="filters">
        <select value={lane} onChange={(e) => setLane(e.target.value as AzureLane | "all")} aria-label="Lane">
          <option value="all">All lanes</option>
          {(Object.keys(LANE_LABEL) as AzureLane[]).map((l) => (
            <option key={l} value={l}>
              {LANE_LABEL[l]}
            </option>
          ))}
        </select>
        <select value={track} onChange={(e) => setTrack(e.target.value as typeof track)} aria-label="Track">
          <option value="all">Specialized + SMB tracks</option>
          <option value="specialized">Specialized partners only</option>
          <option value="smb">SMB designation track only</option>
        </select>
        <span className="small muted">{list.length} programmes · FY27 (1 Jul 2026 – 30 Jun 2027)</span>
      </div>
      {list.map((p) => (
        <details key={p.id} className="pcard eligible">
          <summary>
            <div className="pcard-main">
              <div className="pcard-title">
                <span className="badge">{LANE_LABEL[p.lane].split(" · ")[0]}</span>
                <strong>{p.short}</strong>
                {p.track === "smb" && <span className="badge alt">SMB track</span>}
              </div>
              <div className="pcard-basis">{p.qualifying}</div>
            </div>
            <div className="pcard-amt">
              <span className="size">up to</span>
              <Money v={Math.max(...p.sizes.map((s) => s.payout.A + (s.stage2?.A ?? 0)))} className="amt" />
            </div>
          </summary>
          <div className="pcard-body">
            <p className="small">{p.summary}</p>
            <PayoutLadder sizes={p.sizes} markets={p.markets === "ABC" ? ["A", "B", "C"] : ["A", "B"]} metric={p.rule.metricInput === "agentMau" ? "Agent MAU" : p.rule.metricInput === "mbs" ? "Marketplace billed sales" : "ACR / yr"} />
            <div className="pcard-cols">
              <div>
                <h5>Partner eligibility</h5>
                <ul className="small">{p.partner.text.map((t) => <li key={t}>{t}</li>)}</ul>
                <h5>Customer criteria</h5>
                <ul className="small">{p.customer.text.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div>
                <h5>Proof of execution</h5>
                <ul className="small">{p.poe.map((t) => <li key={t}>{t}</li>)}</ul>
                <h5>Controls</h5>
                <ul className="small">{[...p.controls, ...(p.notes ?? [])].map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
            <p className="official tiny">
              {p.name} · <span className="mono">{sourceLabel(p.source)}</span>
            </p>
          </div>
        </details>
      ))}
      <details className="pcard eligible">
        <summary>
          <div className="pcard-main">
            <div className="pcard-title">
              <span className="badge">CSP</span>
              <strong>{azureData.csp.name}</strong>
            </div>
            <div className="pcard-basis">{azureData.csp.association}</div>
          </div>
          <div className="pcard-amt">
            <span className="size">rates</span>
            <span className="amt">3% – 12%</span>
          </div>
        </summary>
        <div className="pcard-body">
          <table className="ladder">
            <thead>
              <tr>
                <th>Lever</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {azureData.csp.levers.map((l) => (
                <tr key={l.id}>
                  <td>{l.label}</td>
                  <td className="mono">{(l.rate * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">Caps: $150K on consumption + RI/SP; $250K across growth accelerators — per customer tenant, per partner.</p>
          <ul className="small">{azureData.csp.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="official tiny mono">{sourceLabel(azureData.csp.source)}</p>
        </div>
      </details>
    </div>
  );
}

function Compliance() {
  const [r, setR] = useState({ pre: 9, appr: 2, prog: 1 });
  const [b, setB] = useState({ m1: 2000, m2: 2000, m3: 1600, actual: 17000, projected: 34000, min: 15000 });
  const [s, setS] = useState({ pass: 7, measured: 10 });
  const ratio = ratioCheck(r.pre, r.appr, r.prog);
  const inc = incrementalCheck([b.m1, b.m2, b.m3], b.actual, b.projected, b.min);
  const sr = successRate(s.pass, s.measured);
  return (
    <div className="calc-grid">
      <section className="results-card">
        <span className="label">Pre-sales to post-sales ratio · 2 : 1</span>
        <h4>Can we nominate more pre-sales?</h4>
        <div className="field-grid three">
          <NumberField label="Pre-sales claims" value={r.pre} onChange={(n) => setR({ ...r, pre: n })} />
          <NumberField label="Approved post-sales" value={r.appr} onChange={(n) => setR({ ...r, appr: n })} />
          <NumberField label="In-progress post-sales" value={r.prog} onChange={(n) => setR({ ...r, prog: n })} />
        </div>
        <p className={`verdict ${ratio.compliant ? "ok" : "bad"}`}>
          {ratio.points} points × 2 = {ratio.allowed} pre-sales allowed → {ratio.compliant ? `compliant, headroom ${ratio.headroom}` : `non-compliant — add about ${ratio.shortfall} approved post-sales claim(s) or cancel invalid pre-sales`}
        </p>
        <p className="tiny muted">Approved claims score 1 point, in-progress 0.5. 30 days' notice before pre-sales are paused. {sourceLabel({ doc: "cpi", pages: [311] })}</p>
      </section>
      <section className="results-card">
        <span className="label">Incremental ACR · baseline method</span>
        <h4>Will this post-sales claim pass?</h4>
        <div className="field-grid three">
          <NumberField label="Baseline month 1 (USD)" value={b.m1} onChange={(n) => setB({ ...b, m1: n })} />
          <NumberField label="Baseline month 2" value={b.m2} onChange={(n) => setB({ ...b, m2: n })} />
          <NumberField label="Baseline month 3" value={b.m3} onChange={(n) => setB({ ...b, m3: n })} />
          <NumberField label="Actual ACR to date" value={b.actual} onChange={(n) => setB({ ...b, actual: n })} />
          <NumberField label="Projected remainder of 12 months" value={b.projected} onChange={(n) => setB({ ...b, projected: n })} />
          <NumberField label="Size minimum (e.g. XS = 15,000)" value={b.min} onChange={(n) => setB({ ...b, min: n })} />
        </div>
        <p className={`verdict ${inc.pass ? "ok" : "bad"}`}>
          Baseline ${Math.round(inc.baseline).toLocaleString()} · full year ${inc.fullYear.toLocaleString()} · incremental ${Math.round(inc.incremental).toLocaleString()} → {inc.pass ? "passing" : "below minimum"}
        </p>
        <p className="tiny muted">Pre-filled with Microsoft's Data Platform XS worked example. 3-month grace; months 4–6 should reach 75%, months 7–12 100% of the minimum.</p>
      </section>
      <section className="results-card">
        <span className="label">Post-sales success rate · 60%</span>
        <h4>Are we at risk of a pause?</h4>
        <div className="field-grid">
          <NumberField label="Claims meeting minimum ACR" value={s.pass} onChange={(n) => setS({ ...s, pass: n })} />
          <NumberField label="Claims measured (past grace)" value={s.measured} onChange={(n) => setS({ ...s, measured: n })} />
        </div>
        <p className={`verdict ${sr.compliant ? "ok" : "bad"}`}>
          Success rate {fmtPct(sr.rate)} → {sr.compliant ? "compliant" : "below 60% — 30-day notice then post-sales nominations paused"}
        </p>
        <p className="tiny muted">Partner Nominated offers: 60% (CPI guide p. 312). Marketplace: monitored for governance, no automatic pause.</p>
      </section>
    </div>
  );
}

function Notes() {
  return (
    <div className="calc-grid">
      <section className="results-card">
        <span className="label">Sources</span>
        <h4>What this advisor is built from</h4>
        <ul className="small">
          {Object.values(meta.sources).map((s) => (
            <li key={s.title}>
              <strong>{s.title}</strong> — {s.edition}. {s.authority}.
            </li>
          ))}
        </ul>
        <p className="small">Investment term {meta.investmentTerm}. Last reviewed {meta.lastReviewed}. Programme data lives in <code>src/data/incentives/*.json</code> and is replaced when Microsoft publishes a new guide.</p>
      </section>
      <section className="results-card">
        <span className="label">Read before nominating</span>
        <h4>Where the two documents disagree</h4>
        <ul className="small">
          {meta.discrepancies.map((d) => (
            <li key={d.topic}>
              <strong>{d.topic}.</strong> {d.detail}
            </li>
          ))}
        </ul>
      </section>
      <section className="results-card">
        <span className="label">Always true</span>
        <h4>Rules that apply to every Azure claim</h4>
        <ul className="small">
          <li>All earnings are fees in USD, calculated on the country of the nominating Partner Location ID (Azure: Market A or B — India is Market B; Security accelerators: India is Market C).</li>
          <li>{azureData.performance.baseline}; incremental ACR is tracked for 12 months from claim submission.</li>
          <li>{azureData.performance.credits}.</li>
          <li>Customer consent and attestations must come from a named customer employee on a customer domain — no shared mailboxes or aliases.</li>
          <li>No subcontracting of claimed activities; no duplicate funding across MCI, ECIF, deployment vouchers or other programmes.</li>
          <li>Project fragmentation, duplicate tracking, forged POE or misrepresented market rates can suspend a partner for at least six months.</li>
          <li>Link your Partner ID (PAL) on managed subscriptions to record influence; CSP incentives use TPOR, not PAL.</li>
        </ul>
      </section>
      <section className="results-card">
        <span className="label">Tag legend</span>
        <h4>How services map to programmes</h4>
        <ul className="small">
          {Object.entries(TAG_LABELS)
            .filter(([k]) => ["core", "db", "data", "ai", "aic", "fr", "fdy", "mdc", "sen", "avs", "avd", "sap", "sov", "infra", "verify"].includes(k))
            .map(([k, v]) => (
              <li key={k}>
                <span className={`tag tag-${k}`}>{v}</span>{" "}
                {
                  {
                    core: "Counts toward Core Migrate & Modernize.",
                    db: "Core database service — counts toward the Databases engagement and its 40% rule.",
                    data: "Fabric / Databricks — anchors the Data Platform engagement.",
                    ai: "Qualifying AI Apps, Agents & Developer service.",
                    aic: "Complementary — counts toward AI Apps only alongside a qualifying AI service.",
                    fr: "GitHub, Foundry or Fabric — counts toward the Agentic AI Platforms 40% rule.",
                    fdy: "Foundry — counts with Fabric / Databricks for Data Platform.",
                    mdc: "Defender for Cloud plan — Core M&M with MDC minimum and the MDC accelerator.",
                    sen: "Sentinel — Core M&M with Sentinel minimum and the Sentinel accelerator.",
                    avs: "Azure VMware Solution — VMware engagement.",
                    avd: "Azure Virtual Desktop — VDI engagement.",
                    sap: "SAP on Azure — SAP engagements.",
                    sov: "Digital Sovereignty qualifying service.",
                    infra: "Supporting platform service — counts inside a migration project's ACR.",
                    verify: "Qualification unclear in the guide — confirm with your PDM.",
                  }[k]
                }
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
