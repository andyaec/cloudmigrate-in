import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in — Azure Funding Advisor",
  robots: { index: false, follow: false },
};

export default async function AdvisorLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const needsUser = !!process.env.ADVISOR_USER;
  return (
    <section className="page-head" style={{ minHeight: "60vh" }}>
      <div className="wrap" style={{ maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
        <div className="crumbs">
          <Link href="/">Home</Link> / <Link href="/clouds/azure">Azure</Link> / <span>Sales</span>
        </div>
        <div className="cloud-rule" style={{ background: "var(--c-azure)" }} />
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>Funding Advisor sign-in</h1>
        <p className="lede" style={{ fontSize: "1.05rem" }}>
          The Azure Partner Funding Advisor is for the CloudMigrate sales team. It summarises Microsoft partner-incentive terms that are shared under partner agreements.
        </p>
        {error && (
          <p className="notice warn small" role="alert">
            {error === "config" ? "Sign-in isn't configured on this deployment yet." : "That username or password didn't match. Try again."}
          </p>
        )}
        <form className="form" method="post" action="/api/advisor-login" style={{ marginTop: 20 }}>
          {needsUser && (
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" autoComplete="username" required autoFocus />
            </div>
          )}
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus={!needsUser} />
          </div>
          <div>
            <button className="btn accent" type="submit">
              Sign in
            </button>
          </div>
        </form>
        <p className="small muted" style={{ marginTop: 24 }}>
          Not on the sales team? <Link href="/clouds/azure">See our Azure services</Link> or <Link href="/contact">talk to an architect</Link>.
        </p>
      </div>
    </section>
  );
}
