import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-head" style={{ minHeight: "50vh" }}>
      <div className="wrap">
        <p className="label">
          <b>404</b> &nbsp;Not found
        </p>
        <h1>This page didn't make the migration.</h1>
        <p className="lede">The link may be old. Start from the home page or pick a cloud.</p>
        <Link href="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  );
}
