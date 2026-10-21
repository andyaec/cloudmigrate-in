"use client";

import { createContext, useContext, useEffect, useId, useState } from "react";
import { credentialGroups, sourceLabel } from "@/lib/incentives/data";
import type { Check } from "@/lib/advisor/azure-engine";
import type { Payout, SizeBand, SourceRef } from "@/lib/incentives/types";
import { fmtMoney } from "@/lib/format";

/* ---------- persisted state (per-viewer convenience only) ---------- */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  // Never write before the stored value has been read back, or defaults would overwrite it.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setValue((prev) => (typeof prev === "object" && prev !== null && !Array.isArray(prev) ? { ...prev, ...parsed } : parsed));
      }
    } catch {
      /* storage unavailable — fall back to defaults */
    }
    setHydrated(true);
  }, [key]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, hydrated]);
  return [value, setValue];
}

/* ---------- currency ---------- */
export type Currency = { code: "USD" | "INR"; rate: number };
export const CurrencyContext = createContext<Currency>({ code: "USD", rate: 88 });
export function Money({ v, className }: { v: number; className?: string }) {
  const c = useContext(CurrencyContext);
  return <span className={className ?? "money"}>{fmtMoney(v, c)}</span>;
}

/* ---------- small inputs ---------- */
export function NumberField({
  label,
  value,
  onChange,
  hint,
  prefix,
  step = 1,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  prefix?: string;
  step?: number;
  min?: number;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={prefix ? "input-prefix" : undefined}>
        {prefix && <span>{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (b: boolean) => void; hint?: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint && <em>{hint}</em>}
      </span>
    </label>
  );
}

export function Pill({ status }: { status: "eligible" | "conditional" | "ineligible" }) {
  const label = status === "eligible" ? "Eligible" : status === "conditional" ? "Eligible — confirm" : "Not eligible";
  return <span className={`pill ${status}`}>{label}</span>;
}

export function Checks({ checks }: { checks: Check[] }) {
  return (
    <ul className="checks">
      {checks.map((c, i) => (
        <li key={i} className={c.state}>
          <span aria-hidden="true">{c.state === "pass" ? "✓" : c.state === "warn" ? "!" : "✕"}</span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export function PayoutLadder({ sizes, markets, metric, highlight }: { sizes: SizeBand[]; markets: ("A" | "B" | "C")[]; metric: string; highlight?: string }) {
  const hasStage2 = sizes.some((s) => s.stage2);
  const isUsd = !/seat|MAU|MPU/i.test(metric);
  const fmtBand = (s: SizeBand) => {
    const f = (n: number) => (isUsd ? `$${n >= 1000 ? `${n / 1000}K` : n}` : n.toLocaleString());
    if (s.max == null) return `${f(s.min)}+`;
    return `${f(s.min)} – ${f(s.max)}`;
  };
  return (
    <div className="table-scroll">
      <table className="ladder">
        <thead>
          <tr>
            <th>Size</th>
            <th>{metric}</th>
            {sizes.some((s) => s.workloadMin) && <th>Workload min</th>}
            {sizes.some((s) => s.reduce) && <th>Competitor seats</th>}
            {markets.map((m) => (
              <th key={m}>{hasStage2 ? `Stage 1 · ${m}` : `Market ${m}`}</th>
            ))}
            {hasStage2 && markets.map((m) => <th key={`s2${m}`}>Stage 2 · {m}</th>)}
          </tr>
        </thead>
        <tbody>
          {sizes.map((s) => (
            <tr key={s.size} className={highlight === s.size ? "hl" : undefined}>
              <td className="mono">{s.size}</td>
              <td>{fmtBand(s)}</td>
              {sizes.some((x) => x.workloadMin) && <td>{s.workloadMin ? `$${s.workloadMin.toLocaleString()}` : "—"}</td>}
              {sizes.some((x) => x.reduce) && <td>{s.reduce ? `${s.reduce}+` : "—"}</td>}
              {markets.map((m) => (
                <td key={m}>
                  <Money v={(s.payout as Payout)[m] ?? 0} />
                </td>
              ))}
              {hasStage2 &&
                markets.map((m) => (
                  <td key={`s2${m}`}>
                    <Money v={(s.stage2 as Payout)?.[m] ?? 0} />
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Expandable programme result card used by both practices. */
export function ProgramCard({
  title,
  official,
  status,
  size,
  payout,
  stage2,
  basisLine,
  checks,
  hints,
  summary,
  poe,
  controls,
  notes,
  source,
  ladder,
  badge,
  defaultOpen = false,
}: {
  title: string;
  official: string;
  status: "eligible" | "conditional" | "ineligible";
  size?: string;
  payout: number;
  stage2?: number;
  basisLine?: string;
  checks: Check[];
  hints?: string[];
  summary: string;
  poe: string[];
  controls: string[];
  notes?: string[];
  source: SourceRef;
  ladder?: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details className={`pcard ${status}`} open={defaultOpen}>
      <summary>
        <div className="pcard-main">
          <div className="pcard-title">
            {badge && <span className="badge">{badge}</span>}
            <strong>{title}</strong>
            <Pill status={status} />
          </div>
          {basisLine && <div className="pcard-basis">{basisLine}</div>}
        </div>
        <div className="pcard-amt">
          {status !== "ineligible" ? (
            <>
              <span className="size">{size}</span>
              <Money v={payout} className="amt" />
              {!!stage2 && (
                <span className="stage2">
                  + <Money v={stage2} /> if ACR hits band
                </span>
              )}
            </>
          ) : (
            <span className="muted small">—</span>
          )}
        </div>
      </summary>
      <div className="pcard-body">
        <p className="small">{summary}</p>
        {hints && hints.length > 0 && (
          <ul className="hints">
            {hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <h5>Eligibility checks</h5>
        <Checks checks={checks} />
        {ladder && (
          <>
            <h5>Payout ladder</h5>
            {ladder}
          </>
        )}
        <div className="pcard-cols">
          <div>
            <h5>Proof of execution</h5>
            <ul className="small">
              {poe.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Controls & notes</h5>
            <ul className="small">
              {[...controls, ...(notes ?? [])].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="official tiny">
          {official} · <span className="mono">{sourceLabel(source)}</span>
        </p>
      </div>
    </details>
  );
}

/* ---------- partner credentials ---------- */
const presets: { label: string; ids: string[] }[] = [
  {
    label: "Azure infra & data partner",
    ids: ["spec-infra-db-migration", "spec-app-modernization", "spec-analytics", "sp-infra", "sp-data-ai", "sp-dai", "csp-direct", "rev-1m", "lsp"],
  },
  {
    label: "AI & apps partner",
    ids: ["spec-ai-apps", "spec-ai-platform", "spec-agentic-devops", "spec-app-modernization", "sp-data-ai", "sp-dai"],
  },
  {
    label: "Security partner",
    ids: ["spec-threat-protection", "spec-cloud-security", "spec-iam", "spec-data-security", "sp-security"],
  },
  {
    label: "Modern Work & Copilot partner",
    ids: ["spec-m365-copilot", "spec-modernize-endpoints", "spec-mw-other", "sp-modern-work", "csp-indirect", "rev-25k", "cap-25"],
  },
  { label: "Business Apps partner", ids: ["spec-ba-sales", "spec-ba-service", "spec-ba-finance", "sp-bizapps"] },
];

export function CredentialsEditor({ creds, onChange }: { creds: string[]; onChange: (c: string[]) => void }) {
  const set = new Set(creds);
  const toggle = (id: string) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    onChange([...n]);
  };
  return (
    <div className="creds">
      <div className="creds-presets">
        <span className="label">Quick add</span>
        {presets.map((p) => (
          <button key={p.label} type="button" className="chip-btn" onClick={() => onChange([...new Set([...creds, ...p.ids])])}>
            + {p.label}
          </button>
        ))}
        <button type="button" className="chip-btn ghost" onClick={() => onChange([])}>
          Clear all
        </button>
      </div>
      <div className="creds-grid">
        {credentialGroups.map((g) => (
          <fieldset key={g.id}>
            <legend>{g.label}</legend>
            {g.items.map((i) => (
              <label key={i.id} className="cred">
                <input type="checkbox" checked={set.has(i.id)} onChange={() => toggle(i.id)} />
                <span>{i.label}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return { copied, copy };
}
