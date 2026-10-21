"use client";

import { useMemo, useState } from "react";
import { azureCategories, azureServices } from "@/lib/incentives/data";
import type { ServiceLine } from "@/lib/advisor/azure-engine";

const TAG_LABELS: Record<string, string> = {
  core: "Core M&M",
  db: "Databases",
  data: "Data Platform",
  ai: "AI Apps",
  aic: "AI complementary",
  fr: "Agentic (Frontier)",
  fdy: "Foundry",
  mdc: "Defender for Cloud",
  sen: "Sentinel",
  avs: "VMware",
  avd: "VDI",
  sap: "SAP",
  sov: "Sovereignty",
  infra: "Supporting",
  cs: "Copilot Studio",
  t3: "CSP Tier 3",
  t2: "CSP Tier 2",
  verify: "Verify",
};

const VISIBLE_TAGS = ["core", "db", "data", "ai", "fr", "mdc", "sen", "avs", "avd", "sap", "sov", "verify"];

const BUNDLES: { label: string; lines: [string, number][] }[] = [
  { label: "Windows / SQL data-centre exit", lines: [["vm-windows", 9000], ["vm-sql", 3500], ["sql-mi", 4000], ["managed-disks", 1800], ["backup", 600], ["vnet", 300], ["firewall", 1200], ["monitor", 500]] },
  { label: "AWS RDS → Azure databases", lines: [["sql-mi", 6000], ["postgres", 4500], ["app-service", 1800], ["monitor", 300]] },
  { label: "Agentic AI on Foundry + Fabric", lines: [["foundry-agent", 3000], ["foundry-models", 6000], ["ai-search", 1200], ["fabric", 4000], ["gh-copilot", 800], ["apim", 400]] },
  { label: "VMware exit to AVS", lines: [["avs", 22000], ["expressroute", 900], ["backup", 700]] },
  { label: "SIEM replacement + MDC", lines: [["sentinel", 7000], ["sentinel-lake", 1500], ["mdc-servers-p2", 2500], ["mdc-cspm", 900]] },
  { label: "Citrix → Azure Virtual Desktop", lines: [["avd", 8000], ["files", 1200], ["vm-windows", 1500]] },
];

export function ServicePicker({ lines, onChange }: { lines: ServiceLine[]; onChange: (l: ServiceLine[]) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const selected = new Map(lines.map((l) => [l.id, l]));

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return azureServices.filter((s) => {
      if (cat !== "All" && s.c !== cat) return false;
      if (!terms.length) return true;
      const hay = `${s.n} ${s.a} ${s.c} ${s.t.map((t) => TAG_LABELS[t] ?? t).join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [q, cat]);

  const toggle = (id: string) => {
    if (selected.has(id)) onChange(lines.filter((l) => l.id !== id));
    else onChange([...lines, { id, monthly: 0 }]);
  };
  const setMonthly = (id: string, monthly: number) => onChange(lines.map((l) => (l.id === id ? { ...l, monthly } : l)));
  const addBundle = (b: (typeof BUNDLES)[number]) => {
    const next = [...lines];
    for (const [id, m] of b.lines) {
      const i = next.findIndex((l) => l.id === id);
      if (i >= 0) next[i] = { ...next[i], monthly: next[i].monthly + m };
      else next.push({ id, monthly: m });
    }
    onChange(next);
  };

  const totalMonthly = lines.reduce((a, l) => a + (l.monthly || 0), 0);
  const byId = new Map(azureServices.map((s) => [s.id, s]));

  return (
    <div className="picker">
      <div className="picker-search">
        <input
          type="search"
          placeholder={`Search ${azureServices.length} Azure services — e.g. "sql mi", "openai", "avs", "sentinel"`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search Azure services"
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
          <option>All</option>
          {azureCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="bundles">
        <span className="label">Start from a pattern</span>
        {BUNDLES.map((b) => (
          <button key={b.label} type="button" className="chip-btn" onClick={() => addBundle(b)}>
            + {b.label}
          </button>
        ))}
      </div>
      <div className="picker-list" role="listbox" aria-multiselectable="true" aria-label="Azure services">
        {results.map((s) => (
          <label key={s.id} className={`svc ${selected.has(s.id) ? "on" : ""}`}>
            <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
            <span className="svc-name">{s.n}</span>
            <span className="svc-tags">
              {s.t
                .filter((t) => VISIBLE_TAGS.includes(t))
                .map((t) => (
                  <span key={t} className={`tag tag-${t}`}>
                    {TAG_LABELS[t]}
                  </span>
                ))}
            </span>
            <span className="svc-cat">{s.c}</span>
          </label>
        ))}
        {!results.length && <p className="muted small" style={{ padding: 12 }}>No services match “{q}”.</p>}
      </div>

      <div className="selected">
        <div className="selected-head">
          <h4>
            Selected workloads <span className="muted">({lines.length})</span>
          </h4>
          {lines.length > 0 && (
            <button type="button" className="chip-btn ghost" onClick={() => onChange([])}>
              Clear
            </button>
          )}
        </div>
        {!lines.length && <p className="muted small">Tick services above or start from a pattern. Then enter the steady-state monthly Azure consumption each will add (USD, from the Azure Pricing Calculator).</p>}
        {lines.length > 0 && (
          <table className="sel-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Counts toward</th>
                <th style={{ width: 140 }}>New ACR / month (USD)</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const s = byId.get(l.id);
                if (!s) return null;
                return (
                  <tr key={l.id}>
                    <td>{s.n}</td>
                    <td>
                      {s.t
                        .filter((t) => VISIBLE_TAGS.includes(t))
                        .map((t) => (
                          <span key={t} className={`tag tag-${t}`}>
                            {TAG_LABELS[t]}
                          </span>
                        ))}
                      {!s.t.some((t) => VISIBLE_TAGS.includes(t)) && <span className="tag">{s.t.includes("infra") ? "Supporting" : "Other Azure"}</span>}
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={l.monthly}
                        onChange={(e) => setMonthly(l.id, Number(e.target.value) || 0)}
                        aria-label={`Monthly ACR for ${s.n}`}
                      />
                    </td>
                    <td>
                      <button type="button" className="x" onClick={() => toggle(l.id)} aria-label={`Remove ${s.n}`}>
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total new monthly ACR</td>
                <td className="mono">${totalMonthly.toLocaleString()}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export { TAG_LABELS };
