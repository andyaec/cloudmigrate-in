"use client";

import { useMemo, useState } from "react";
import {
  competitorLabels,
  coworkCalc,
  cporCalc,
  cspMwCalc,
  defaultProfile,
  evaluateFamily,
  type Competitor,
  type CoworkInput,
  type CporLine,
  type CspRevenueInput,
  type MwEvaluation,
  type MwProfile,
} from "@/lib/advisor/mw-engine";
import { isEmergingMarket, mwData, mwMarket, sourceLabel } from "@/lib/incentives/data";
import type { MwFamily, SegmentId, Sector } from "@/lib/incentives/types";
import { Checks, Money, NumberField, PayoutLadder, ProgramCard, Toggle, usePersistentState } from "./shared";

type Tab = "copilot" | "productivity" | "security" | "bizapps" | "csp" | "stack";

const TABS: [Tab, string, string][] = [
  ["copilot", "Copilot & Agents", "M365 Copilot · Agents · Cowork"],
  ["productivity", "ME3 · BP · Windows 365", "AI-ready productivity"],
  ["security", "Security seats", "ME3/ME5 · E7 · Defender · Purview"],
  ["bizapps", "Business Apps", "Dynamics 365 · CPOR"],
  ["csp", "CSP rebates", "M365 · D365 transactional"],
  ["stack", "Deal stack", "Everything that fits"],
];

const LANE_ORDER = ["envisioning", "deployment", "conversion", "usage", "activation"] as const;
const LANE_NAME: Record<string, string> = {
  envisioning: "Envisioning & POC (pre-sales)",
  deployment: "CSP Deployment Accelerators (post-sales)",
  conversion: "Competitor Conversion Bonuses",
  usage: "ME5 Usage Accelerators",
  activation: "Activation",
};

function MwCard({ e }: { e: MwEvaluation }) {
  const p = e.programme;
  const metricLabel = p.sizing?.metric === "d365Acv" ? "D365 ACV (USD)" : /mpu/i.test(p.sizing?.metric ?? "") ? "MPU whitespace" : "Seats";
  return (
    <ProgramCard
      title={p.short}
      official={p.name}
      status={e.status}
      size={e.size?.size}
      payout={e.payout}
      basisLine={p.sizing ? `${p.sizing.label} · Market ${e.market}${e.size?.hours ? ` · min. ${e.size.hours} delivery hours` : ""}${e.size?.perf ? ` · Performance goal: ${e.size.perf}` : ""}` : undefined}
      checks={e.checks}
      hints={e.hints}
      summary={p.summary}
      poe={p.poe}
      controls={p.controls}
      notes={p.toolkit ? [`Delivery guide: ${p.toolkit}`] : undefined}
      source={p.source}
      ladder={p.sizes ? <PayoutLadder sizes={p.sizes} markets={["A", "B", "C"]} metric={metricLabel} highlight={e.size?.size} /> : undefined}
      badge={p.kind === "bonus" ? "Bonus" : undefined}
    />
  );
}

function Results({ evals }: { evals: MwEvaluation[] }) {
  const total = evals.filter((e) => e.status !== "ineligible").reduce((a, e) => a + e.payout, 0);
  return (
    <div>
      <div className="results-card">
        <div className="results-head">
          <span className="label">Eligible fee potential</span>
          <Money v={total} className="amt" />
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          {evals.filter((e) => e.status !== "ineligible").length} of {evals.length} engagements fit. Open a card for checks, payout ladder and proof of execution.
        </p>
      </div>
      {LANE_ORDER.map((lane) => {
        const list = evals.filter((e) => e.programme.lane === lane);
        if (!list.length) return null;
        return (
          <div key={lane}>
            <h4 className="lane-h">{LANE_NAME[lane]}</h4>
            {list.map((e) => (
              <MwCard key={e.programme.id} e={e} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function CompetitorField({ c, profile, set }: { c: Competitor; profile: MwProfile; set: (p: MwProfile) => void }) {
  return (
    <NumberField
      label={`${competitorLabels[c]} seats transitioned`}
      value={profile.competitorSeats[c]}
      onChange={(n) => set({ ...profile, competitorSeats: { ...profile.competitorSeats, [c]: n } })}
      step={25}
    />
  );
}

export function MwPractice({ base }: { base: { country: string; segment: SegmentId; sector: Sector; creds: string[] } }) {
  const [tab, setTab] = useState<Tab>("copilot");
  const [stored, setStored] = usePersistentState<MwProfile>("cm.advisor.mw.v1", defaultProfile);
  const profile: MwProfile = { ...stored, ...base };
  const set = (p: MwProfile) => setStored(p);
  const num = (k: keyof MwProfile) => (n: number) => setStored({ ...stored, [k]: n });

  const [cowork, setCowork] = usePersistentState<CoworkInput>("cm.advisor.cowork.v1", { baseMau: 10, baseConsumption: 500, m3Mau: 72, m3Consumption: 3700, cspLed: true });
  const [cporSeg, setCporSeg] = useState<"ENT" | "SMC">("ENT");
  const [cporLic, setCporLic] = useState<"ea" | "csp">("ea");
  const [cporLines, setCporLines] = usePersistentState<CporLine[]>(
    "cm.advisor.cpor.v1",
    mwData.cpor.rates.map((r) => ({ id: r.id, hwm: 0, current: 0 })),
  );
  const [csp, setCsp] = usePersistentState<CspRevenueInput>("cm.advisor.cspmw.v1", {
    type: "indirect",
    m365: { core: 0, t2: 0, t1: 0, pstn: 0, priorYearTenant: 0, currentYearTenant: 0, businessStandard: 0 },
    d365: { core: 0, t2: 0, t1: 0, priorYearTenant: 0, currentYearTenant: 0, growthEligible: 0 },
    cocp: false,
  });

  const all = useMemo(() => evaluateFamily(profile), [JSON.stringify(profile)]); // eslint-disable-line react-hooks/exhaustive-deps
  const fam = (f: MwFamily) => all.filter((e) => e.programme.family === f);
  const cw = coworkCalc(cowork, profile);
  const cpor = cporCalc(cporLines, cporSeg, cporLic, profile.creds);
  const cspCalc = cspMwCalc(csp, profile.country);
  const market = mwMarket(profile.country);

  return (
    <div>
      <div className="subtabs" role="tablist" aria-label="Modern Work practice views">
        {TABS.map(([id, label, sub]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            {label}
            <small>{sub}</small>
          </button>
        ))}
      </div>
      <p className="tiny muted" style={{ margin: "0 0 18px" }}>
        Payouts shown for Market {market} ({profile.country}). Modern Work &amp; Security engagements pay in USD by Partner Location ID market (A / B / C). Portfolio performance rate must stay ≥ 33% per engagement type.
      </p>

      {tab === "copilot" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> Customer Microsoft 365 estate
              </h3>
              <div className="field-grid">
                <NumberField label="Purchased Office 365 / Microsoft 365 seats" value={stored.m365Seats} onChange={num("m365Seats")} hint="OE3/OE5/ME3/ME5/A3/A5/G3/G5, Business Standard, Business Premium" step={50} />
                <NumberField label="Purchased M365 Copilot seats" value={stored.copilotSeats} onChange={num("copilotSeats")} step={25} />
                <NumberField label="M365 Copilot monthly active users" value={stored.copilotMau} onChange={num("copilotMau")} hint="MAU opportunity = seats − MAU" step={25} />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">2</span> Copilot Cowork CSP activation
              </h3>
              <p className="small muted">Customers below 50 Cowork MAU and $2,500 monthly Cowork consumption at the August 2026 baseline. One-time $50 per qualified incremental MAU, max $12,500 per tenant.</p>
              <div className="field-grid">
                <NumberField label="August 2026 Cowork MAU" value={cowork.baseMau} onChange={(n) => setCowork({ ...cowork, baseMau: n })} />
                <NumberField label="August 2026 Cowork consumption (USD / month)" value={cowork.baseConsumption} onChange={(n) => setCowork({ ...cowork, baseConsumption: n })} step={100} />
                <NumberField label="Month-3 Cowork MAU" value={cowork.m3Mau} onChange={(n) => setCowork({ ...cowork, m3Mau: n })} />
                <NumberField label="Month-3 Cowork consumption (USD / month)" value={cowork.m3Consumption} onChange={(n) => setCowork({ ...cowork, m3Consumption: n })} step={100} />
              </div>
              <Toggle label="Customer is CSP-led (≥ 50% of Copilot licences and Cowork consumption via CSP)" checked={cowork.cspLed} onChange={(b) => setCowork({ ...cowork, cspLed: b })} />
            </section>
          </div>
          <aside className="builder-results">
            <Results evals={fam("copilot")} />
            <h4 className="lane-h">Activation</h4>
            <details className={`pcard ${cw.failed ? "ineligible" : "eligible"}`} open>
              <summary>
                <div className="pcard-main">
                  <div className="pcard-title">
                    <strong>Copilot Cowork CSP Activation</strong>
                    <span className={`pill ${cw.failed ? "ineligible" : "conditional"}`}>{cw.failed ? "Not eligible" : "Eligible — confirm"}</span>
                  </div>
                  <div className="pcard-basis">
                    Qualified MAU = min({cw.incMau} incremental MAU, {cw.consMau} consumption-based) = {cw.qualified}
                  </div>
                </div>
                <div className="pcard-amt">
                  <span className="size">rebate</span>
                  <Money v={cw.payout} className="amt" />
                </div>
              </summary>
              <div className="pcard-body">
                <Checks checks={cw.checks} />
                {cw.belowMin && <p className="small" style={{ color: "var(--bad)" }}>Below the $200 minimum payment.</p>}
                <p className="official tiny mono">Term 1 Sep 2026 – 30 Jun 2027 · 100% indirect rebate · {sourceLabel({ doc: "cpi", pages: [18, 19, 20, 21] })}</p>
              </div>
            </details>
          </aside>
        </div>
      )}

      {tab === "productivity" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> Microsoft 365 E3 upgrade
              </h3>
              <div className="field-grid">
                <NumberField label="Purchased Office 365 E1/E3/E5 or M365 Apps seats" value={stored.o365Seats} onChange={num("o365Seats")} step={50} />
                <NumberField label="Intune coverage % — Intune ÷ (O365 + M365) seats" value={stored.intuneCoveragePct} onChange={num("intuneCoveragePct")} hint="ME3 Envisioning needs ≤ 50%" />
                <NumberField label="Incremental M365 E3 seats via CSP" value={stored.newMe3Seats} onChange={num("newMe3Seats")} step={50} />
                <NumberField label="Incremental Business Premium seats via CSP" value={stored.newBpSeats} onChange={num("newBpSeats")} step={10} />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">2</span> Google Workspace conversion
              </h3>
              <div className="field-grid">
                <CompetitorField c="google-workspace" profile={stored} set={set} />
              </div>
              <p className="tiny muted">Must transition at least 50% of the band minimum (e.g. 25 seats for XXS) and follow a completed Deployment Accelerator of the same size.</p>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">3</span> Windows 365 / cloud endpoints
              </h3>
              <div className="field-grid">
                <NumberField label="Windows 11 Enterprise + Intune seats" value={stored.w11IntuneSeats} onChange={num("w11IntuneSeats")} step={50} />
                <NumberField label="Intune MAU ÷ PAU %" value={stored.intuneMauPct} onChange={num("intuneMauPct")} hint="Cloud Endpoints Envisioning needs ≥ 40%" />
                <NumberField label="Incremental Windows 365 seats via CSP" value={stored.newW365Seats} onChange={num("newW365Seats")} step={25} />
              </div>
            </section>
          </div>
          <aside className="builder-results">
            <Results evals={fam("productivity")} />
          </aside>
        </div>
      )}

      {tab === "security" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> Envisioning & POC
              </h3>
              <div className="field-grid">
                <NumberField label="M365 E3 (Entra P1 ≥ 80% MAU) or M365 E5 seats" value={stored.me35Seats} onChange={num("me35Seats")} step={50} />
                <NumberField label="Office 365 E3 + EMS seats (Entra P1 ≥ 80% MAU)" value={stored.oe3EmsSeats} onChange={num("oe3EmsSeats")} step={50} />
                <NumberField label="Security workshops claimed on this tenant in FY26" value={stored.fy26SecurityWorkshops} onChange={num("fy26SecurityWorkshops")} hint="3 or more excludes the tenant" />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">2</span> New seats via CSP
              </h3>
              <div className="field-grid">
                <NumberField label="New M365 E5 / E7 seats" value={stored.newMe5Seats} onChange={num("newMe5Seats")} step={50} />
                <NumberField label="New Defender Suite / Purview Suite seats" value={stored.newDpSeats} onChange={num("newDpSeats")} step={50} />
                <NumberField label="New Defender / Purview Suite for Business Premium seats" value={stored.newBpDpSeats} onChange={num("newBpDpSeats")} step={10} />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">3</span> Competitor displacement
              </h3>
              <div className="field-grid three">
                <CompetitorField c="crowdstrike" profile={stored} set={set} />
                <CompetitorField c="proofpoint" profile={stored} set={set} />
                <CompetitorField c="sentinelone" profile={stored} set={set} />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">4</span> ME5 usage accelerators (at-risk E5)
              </h3>
              <div className="toggles">
                <Toggle label="EA customer without Unified Support, commercial E5" checked={stored.eaNonUnified} onChange={(b) => setStored({ ...stored, eaNonUnified: b })} />
                <Toggle label="Renewal due in FY27 or FY28" checked={stored.renewalDue} onChange={(b) => setStored({ ...stored, renewalDue: b })} />
              </div>
              <div className="field-grid">
                <NumberField label="Data Security PAU (Purview IP P2 / IRM)" value={stored.dsPau} onChange={num("dsPau")} step={100} />
                <NumberField label="Data Security MPU today" value={stored.dsMpu} onChange={num("dsMpu")} step={100} />
                <NumberField label="XDR PAU (MDE · MDO · MDI · MDA · Entra P2)" value={stored.xdrPau} onChange={num("xdrPau")} step={100} />
                <NumberField label="XDR MPU today" value={stored.xdrMpu} onChange={num("xdrMpu")} step={100} />
              </div>
            </section>
            <div className="notice small">
              Sentinel and Defender for Cloud deployment accelerators are consumption-based — use the <strong>Azure ACR practice</strong> for them. They are the only Security engagements open to EDU and Non-profit customers.
            </div>
          </div>
          <aside className="builder-results">
            <Results evals={fam("security")} />
          </aside>
        </div>
      )}

      {tab === "bizapps" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> Dynamics 365 via CSP
              </h3>
              <div className="field-grid">
                <NumberField label="Incremental D365 annual contract value via CSP (USD)" value={stored.d365Acv} onChange={num("d365Acv")} hint="Sales, Customer Service, Field Service, CI, Contact Center, Finance, SCM, BC, HR, Project Ops, Commerce" step={5000} />
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">2</span> Competitor conversion
              </h3>
              <div className="field-grid three">
                <CompetitorField c="salesforce" profile={stored} set={set} />
                <CompetitorField c="sap" profile={stored} set={set} />
                <CompetitorField c="genesys" profile={stored} set={set} />
              </div>
              <p className="tiny muted">Genesys → Contact Center · Salesforce → Sales, Customer Service, Field Service, Customer Insights · SAP → BC, Finance, SCM, Commerce, HR, Project Ops and more.</p>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">3</span> Biz Apps Presales Advisor (CPOR) — EA / MCA-E only
              </h3>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="cseg">Customer segment for CPOR</label>
                  <select id="cseg" value={cporSeg} onChange={(e) => setCporSeg(e.target.value as "ENT" | "SMC")}>
                    <option value="ENT">Enterprise (Strategic & Major)</option>
                    <option value="SMC">SMC (Corporate & SMB)</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="clic">Licensing</label>
                  <select id="clic" value={cporLic} onChange={(e) => setCporLic(e.target.value as "ea" | "csp")}>
                    <option value="ea">Enterprise Agreement / MCA-E</option>
                    <option value="csp">CSP (not eligible)</option>
                  </select>
                </div>
              </div>
              <table className="sel-table">
                <thead>
                  <tr>
                    <th>Workload</th>
                    <th>High-water mark</th>
                    <th>Seats / bundles now</th>
                  </tr>
                </thead>
                <tbody>
                  {cporLines.map((l, i) => {
                    const r = mwData.cpor.rates.find((x) => x.id === l.id)!;
                    return (
                      <tr key={l.id}>
                        <td>
                          {r.label} <span className="tiny muted">(${r[cporSeg].toLocaleString()} / {r.unit})</span>
                        </td>
                        <td>
                          <input type="number" min={0} value={l.hwm} onChange={(e) => setCporLines(cporLines.map((x, j) => (j === i ? { ...x, hwm: Number(e.target.value) || 0 } : x)))} aria-label={`${r.label} high-water mark`} />
                        </td>
                        <td>
                          <input type="number" min={0} value={l.current} onChange={(e) => setCporLines(cporLines.map((x, j) => (j === i ? { ...x, current: Number(e.target.value) || 0 } : x)))} aria-label={`${r.label} current`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </div>
          <aside className="builder-results">
            <Results evals={fam("bizapps")} />
            <h4 className="lane-h">Biz Apps Presales Advisor (CPOR)</h4>
            <div className="results-card">
              <div className="results-head">
                <strong>Net seats above high-water mark × rate card</strong>
                <Money v={cpor.total} className="amt" />
              </div>
              {cpor.blockers.map((b) => (
                <p key={b} className="small" style={{ color: "var(--bad)" }}>
                  {b}
                </p>
              ))}
              <table className="mini">
                <tbody>
                  {cpor.rows
                    .filter((r) => r.inc > 0)
                    .map((r) => (
                      <tr key={r.label}>
                        <td>{r.label}</td>
                        <td className="mono">+{r.inc}</td>
                        <td>
                          <Money v={r.earn} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <ul className="tiny muted">
                {mwData.cpor.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="tiny" style={{ color: "var(--amber)" }}>Term in the guide: {mwData.cpor.term}.</p>
            </div>
          </aside>
        </div>
      )}

      {tab === "csp" && (
        <div className="builder">
          <div className="builder-inputs">
            <section className="step">
              <h3>
                <span className="stepn">1</span> Our CSP role
              </h3>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="ctype">Authorisation</label>
                  <select id="ctype" value={csp.type} onChange={(e) => setCsp({ ...csp, type: e.target.value as "direct" | "indirect" })}>
                    <option value="direct">Direct Bill Partner</option>
                    <option value="indirect">Indirect Reseller</option>
                  </select>
                </div>
              </div>
              <Toggle label="We replaced the customer's entire CSP partner set (Change of Channel Partner)" checked={csp.cocp} onChange={(b) => setCsp({ ...csp, cocp: b })} />
            </section>
            <section className="step">
              <h3>
                <span className="stepn">2</span> Microsoft 365 billed revenue (12 months, USD)
              </h3>
              <div className="field-grid">
                <NumberField label="All eligible MW & Security revenue (Core base)" value={csp.m365.core} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, core: n } })} step={1000} />
                <NumberField label="Tier 2: E5, E7, Agent 365, M365 Copilot, Copilot Studio" value={csp.m365.t2} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, t2: n } })} step={1000} />
                <NumberField label="Tier 1: BP, E3, Copilot Business, Defender / Purview Suites" value={csp.m365.t1} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, t1: n } })} step={1000} />
                <NumberField label="Teams Calling / PSTN" value={csp.m365.pstn} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, pstn: n } })} step={500} />
                <NumberField label="Tenant M365 revenue — prior year (all partners)" value={csp.m365.priorYearTenant} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, priorYearTenant: n } })} step={1000} />
                <NumberField label="Tenant M365 revenue — current year" value={csp.m365.currentYearTenant} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, currentYearTenant: n } })} step={1000} />
                {isEmergingMarket(profile.country) && (
                  <NumberField label="Business Standard growth revenue (emerging-market rate)" value={csp.m365.businessStandard} onChange={(n) => setCsp({ ...csp, m365: { ...csp.m365, businessStandard: n } })} step={500} />
                )}
              </div>
            </section>
            <section className="step">
              <h3>
                <span className="stepn">3</span> Dynamics 365 billed revenue (12 months, USD)
              </h3>
              <div className="field-grid">
                <NumberField label="All eligible D365 revenue (Core base)" value={csp.d365.core} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, core: n } })} step={1000} />
                <NumberField label="Tier 2: Business Central" value={csp.d365.t2} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, t2: n } })} step={1000} />
                <NumberField label="Tier 1: Finance, SCM, Project Ops, HR" value={csp.d365.t1} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, t1: n } })} step={1000} />
                <NumberField label="Growth-eligible revenue (Tier 1/2 + Sales + CI)" value={csp.d365.growthEligible} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, growthEligible: n } })} step={1000} />
                <NumberField label="Tenant D365 revenue — prior year" value={csp.d365.priorYearTenant} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, priorYearTenant: n } })} step={1000} />
                <NumberField label="Tenant D365 revenue — current year" value={csp.d365.currentYearTenant} onChange={(n) => setCsp({ ...csp, d365: { ...csp.d365, currentYearTenant: n } })} step={1000} />
              </div>
            </section>
          </div>
          <aside className="builder-results">
            <div className="results-card">
              <div className="results-head">
                <strong>CSP incentive estimate (12 months)</strong>
                <Money v={cspCalc.total} className="amt" />
              </div>
              <table className="mini">
                <thead>
                  <tr>
                    <th>Lever</th>
                    <th>Base</th>
                    <th>Rate</th>
                    <th>Earn</th>
                  </tr>
                </thead>
                <tbody>
                  {cspCalc.rows
                    .filter((r) => r.rate > 0)
                    .map((r) => (
                      <tr key={r.area + r.label}>
                        <td>
                          <span className="tiny muted">{r.area}</span>
                          <br />
                          {r.label}
                        </td>
                        <td className="mono">${Math.round(r.base).toLocaleString()}</td>
                        <td className="mono">{(r.rate * 100).toFixed(2).replace(/\.00$/, "")}%</td>
                        <td>
                          <Money v={r.earn} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <ul className="tiny muted">
                {mwData.csp.growthRules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
                <li>{mwData.csp.earningType}. Caps per customer tenant, per lever, per partner.</li>
              </ul>
              <p className="official tiny mono">{sourceLabel(mwData.csp.source)}</p>
            </div>
          </aside>
        </div>
      )}

      {tab === "stack" && (
        <div>
          <div className="results-card">
            <div className="results-head">
              <span className="label">Everything that fits this customer</span>
              <Money v={all.filter((e) => e.status !== "ineligible").reduce((a, e) => a + e.payout, 0) + cw.payout + cpor.total} className="amt" />
            </div>
            <p className="small muted" style={{ margin: 0 }}>
              Activity-based fees across Copilot, productivity, security seats and Business Apps, plus Cowork activation and CPOR. CSP transactional rebates are shown on their own tab.
            </p>
          </div>
          <div className="table-scroll">
            <table className="ladder stack">
              <thead>
                <tr>
                  <th>Family</th>
                  <th>Engagement</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Payout</th>
                </tr>
              </thead>
              <tbody>
                {all
                  .filter((e) => e.status !== "ineligible")
                  .map((e) => (
                    <tr key={e.programme.id}>
                      <td className="mono tiny">{e.programme.family}</td>
                      <td>{e.programme.short}</td>
                      <td className="mono">{e.size?.size}</td>
                      <td>
                        <span className={`pill ${e.status}`}>{e.status === "eligible" ? "Eligible" : "Confirm"}</span>
                      </td>
                      <td>
                        <Money v={e.payout} />
                      </td>
                    </tr>
                  ))}
                {cw.payout > 0 && (
                  <tr>
                    <td className="mono tiny">copilot</td>
                    <td>Copilot Cowork CSP Activation</td>
                    <td className="mono">{cw.qualified} MAU</td>
                    <td>
                      <span className="pill conditional">Confirm</span>
                    </td>
                    <td>
                      <Money v={cw.payout} />
                    </td>
                  </tr>
                )}
                {cpor.total > 0 && (
                  <tr>
                    <td className="mono tiny">bizapps</td>
                    <td>Biz Apps Presales Advisor (CPOR)</td>
                    <td className="mono">HWM</td>
                    <td>
                      <span className="pill conditional">Confirm</span>
                    </td>
                    <td>
                      <Money v={cpor.total} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!all.some((e) => e.status !== "ineligible") && <p className="notice small">Nothing fits yet — fill in seats on the other tabs and check partner credentials in the profile.</p>}
        </div>
      )}
    </div>
  );
}
