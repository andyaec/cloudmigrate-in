"use client";

import { useState } from "react";
import { azureMarket, countries, credentialLabel, meta, mwMarket, sectors, segments } from "@/lib/incentives/data";
import type { SegmentId, Sector } from "@/lib/incentives/types";
import { AzurePractice } from "./AzurePractice";
import { MwPractice } from "./MwPractice";
import { CredentialsEditor, CurrencyContext, type Currency, usePersistentState } from "./shared";

type Practice = "azure" | "mw";
interface Profile {
  country: string;
  segment: SegmentId;
  sector: Sector;
  creds: string[];
  currency: Currency;
  practice: Practice;
}

const initial: Profile = {
  country: "India",
  segment: "majors",
  sector: "commercial",
  creds: [],
  currency: { code: "USD", rate: 88 },
  practice: "azure",
};

export function FundingAdvisor() {
  const [p, setP] = usePersistentState<Profile>("cm.advisor.profile.v1", initial);
  const [showCreds, setShowCreds] = useState(false);
  const update = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));

  return (
    <CurrencyContext.Provider value={p.currency}>
      <div className="advisor">
        <div className="wrap">
          <div className="practice-switch" role="tablist" aria-label="Practice mode">
            <button type="button" role="tab" aria-selected={p.practice === "azure"} className={p.practice === "azure" ? "on" : ""} onClick={() => update({ practice: "azure" })}>
              <span className="pn">Practice 1</span>
              <strong>Azure ACR</strong>
              <span>Consumption-based: Pre-Sales · Post-Sales · Sentinel / MDC two-stage · Marketplace · CSP / EA</span>
            </button>
            <button type="button" role="tab" aria-selected={p.practice === "mw"} className={p.practice === "mw" ? "on" : ""} onClick={() => update({ practice: "mw" })}>
              <span className="pn">Practice 2</span>
              <strong>Modern Work, Copilot, Security Seats &amp; BizApps</strong>
              <span>Seat-based: Envisioning &amp; POC · CSP Deployment Accelerators · Conversion bonuses · Cowork · ME5 usage · CPOR</span>
            </button>
          </div>

          <section className="profile-bar" aria-label="Partner and customer profile">
            <div className="field">
              <label htmlFor="country">Our partner location</label>
              <select id="country" value={p.country} onChange={(e) => update({ country: e.target.value })}>
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <span className="hint">
                Azure: Market {azureMarket(p.country)} · MW / Security: Market {mwMarket(p.country)}
              </span>
            </div>
            <div className="field">
              <label htmlFor="segment">Customer segment</label>
              <select id="segment" value={p.segment} onChange={(e) => update({ segment: e.target.value as SegmentId })}>
                {segments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="sector">Customer sector</label>
              <select id="sector" value={p.sector} onChange={(e) => update({ sector: e.target.value as Sector })}>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <span className="flabel">Show amounts in</span>
              <div className="seg">
                <button type="button" className={p.currency.code === "USD" ? "on" : ""} onClick={() => update({ currency: { ...p.currency, code: "USD" } })}>
                  USD
                </button>
                <button type="button" className={p.currency.code === "INR" ? "on" : ""} onClick={() => update({ currency: { ...p.currency, code: "INR" } })}>
                  INR
                </button>
                {p.currency.code === "INR" && (
                  <input
                    type="number"
                    aria-label="USD to INR rate"
                    value={p.currency.rate}
                    min={1}
                    step={0.5}
                    onChange={(e) => update({ currency: { ...p.currency, rate: Number(e.target.value) || 88 } })}
                    style={{ width: 80 }}
                  />
                )}
              </div>
              <span className="hint">Microsoft pays in USD</span>
            </div>
            <div className="field creds-field">
              <span className="flabel">Our partner credentials ({p.creds.length})</span>
              <button type="button" className="btn small ghost" onClick={() => setShowCreds((s) => !s)} aria-expanded={showCreds}>
                {showCreds ? "Done" : p.creds.length ? "Edit credentials" : "Set credentials"}
              </button>
              {!showCreds && p.creds.length > 0 && (
                <span className="hint" title={p.creds.map(credentialLabel).join(", ")}>
                  {p.creds.slice(0, 3).map(credentialLabel).join(" · ")}
                  {p.creds.length > 3 ? ` +${p.creds.length - 3}` : ""}
                </span>
              )}
              {!showCreds && !p.creds.length && <span className="hint" style={{ color: "var(--accent-ink)" }}>Needed for eligibility checks</span>}
            </div>
          </section>
          {showCreds && <CredentialsEditor creds={p.creds} onChange={(c) => update({ creds: c })} />}

          {p.practice === "azure" ? (
            <AzurePractice profile={{ country: p.country, segment: p.segment, creds: p.creds }} />
          ) : (
            <MwPractice base={{ country: p.country, segment: p.segment, sector: p.sector, creds: p.creds }} />
          )}

          <p className="disclaimer tiny">
            Guidance only. Built from the {meta.sources.cpi.title} ({meta.sources.cpi.edition}) and the {meta.sources.mci.title}. Microsoft Confidential programme terms are
            shared subject to partner agreements; final eligibility, sizing and payment are determined by Microsoft in Partner Center. Confirm with your Partner Development
            Manager before nominating.
          </p>
        </div>
      </div>
    </CurrencyContext.Provider>
  );
}
