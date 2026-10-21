import { clouds } from "@/content/site";

/** Engineering-drawing style schematic: one estate, five governed paths into five clouds. */
export function HeroFigure() {
  const ys = [56, 136, 216, 296, 376];
  return (
    <figure className="hero-figure" aria-label="Diagram: a single on-premises estate with governed migration paths to AWS, Azure, Google Cloud, JioCloud and OCI">
      <svg viewBox="0 0 560 440" role="img">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--rule)" strokeWidth="0.6" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--accent)" />
          </marker>
        </defs>
        <rect x="0" y="0" width="560" height="440" fill="url(#grid)" />
        <rect x="0.5" y="0.5" width="559" height="439" fill="none" stroke="var(--rule-strong)" />

        {/* Estate rack */}
        <g transform="translate(36 120)">
          <rect width="120" height="200" fill="var(--card)" stroke="var(--ink)" strokeWidth="1.4" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i} transform={`translate(10 ${12 + i * 22})`}>
              <rect width="100" height="14" fill="none" stroke="var(--ink)" strokeWidth="1" />
              <circle cx="88" cy="7" r="2" fill={i % 3 === 0 ? "var(--accent)" : "var(--ink)"} />
              <path d="M8 7h40" stroke="var(--rule-strong)" />
            </g>
          ))}
          <text x="0" y="-12" fontFamily="var(--f-mono)" fontSize="10" letterSpacing="1.2" fill="var(--muted)">
            YOUR ESTATE
          </text>
          <text x="0" y="222" fontFamily="var(--f-mono)" fontSize="9" fill="var(--muted)">
            DC · VMware · SAP · Oracle · M365
          </text>
        </g>

        {/* Dimension line */}
        <g fontFamily="var(--f-mono)" fontSize="9" fill="var(--muted)">
          <path d="M176 24h168" stroke="var(--muted)" strokeWidth="0.8" />
          <path d="M176 20v8M344 20v8" stroke="var(--muted)" strokeWidth="0.8" />
          <text x="196" y="16">ASSESS → MIGRATE → OPERATE</text>
        </g>

        {/* Paths */}
        {clouds.map((c, i) => {
          const y = ys[i];
          return (
            <g key={c.slug}>
              <path
                d={`M156 220 C 250 220, 270 ${y + 14}, 360 ${y + 14}`}
                fill="none"
                stroke={i === 1 ? "var(--accent)" : "var(--ink)"}
                strokeWidth={i === 1 ? 1.8 : 1.1}
                strokeDasharray={i === 1 ? undefined : "4 4"}
                markerEnd="url(#arrow)"
              />
              <g transform={`translate(372 ${y - 8})`}>
                <rect width="160" height="44" fill="var(--card)" stroke="var(--ink)" strokeWidth="1.2" />
                <rect width="4" height="44" fill={c.color} />
                <image href={c.logo} x="14" y="9" width="34" height="26" preserveAspectRatio="xMidYMid meet" />
                <text x="58" y="20" fontFamily="var(--f-cond)" fontWeight="600" fontSize="13" fill="var(--ink)">
                  {c.short}
                </text>
                <text x="58" y="34" fontFamily="var(--f-mono)" fontSize="8.5" fill="var(--muted)">
                  {["MAP · Control Tower", "Frontier Accelerate", "RaMP · CFF", "Sovereign · INR", "ZDM · Cloud Lift"][i]}
                </text>
              </g>
            </g>
          );
        })}
        <circle cx="156" cy="220" r="4" fill="var(--accent)" />
        <text x="24" y="424" fontFamily="var(--f-mono)" fontSize="9" fill="var(--muted)">
          FIG. 01 — ONE TEAM, FIVE GOVERNED PATHS
        </text>
        <text x="420" y="424" fontFamily="var(--f-mono)" fontSize="9" fill="var(--muted)">
          SCALE: ENTERPRISE
        </text>
      </svg>
    </figure>
  );
}
