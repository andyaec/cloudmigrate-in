import { NextResponse, type NextRequest } from "next/server";

/**
 * Password gate for the Azure Funding Advisor.
 * The advisor summarises Microsoft partner-incentive terms that Microsoft marks
 * "Confidential — shared subject to partner agreements", so it fails closed:
 * outside `next dev` the page is unavailable until ADVISOR_PASSWORD is set
 * (optionally with ADVISOR_USER) in the deployment's environment variables.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADVISOR_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("The Funding Advisor is locked. Set ADVISOR_PASSWORD in the deployment environment to enable sign-in.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  const user = process.env.ADVISOR_USER;
  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(":");
      if ((!user || u === user) && rest.join(":") === password) return NextResponse.next();
    } catch {
      /* malformed header — fall through to challenge */
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CloudMigrate Funding Advisor", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = {
  matcher: ["/clouds/azure/sales"],
};
