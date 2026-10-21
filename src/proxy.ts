import { NextResponse, type NextRequest } from "next/server";

/**
 * Optional password gate for the Azure Funding Advisor.
 * The advisor summarises Microsoft partner-incentive terms that Microsoft marks
 * "Confidential — shared subject to partner agreements". Set ADVISOR_PASSWORD
 * (and optionally ADVISOR_USER) in Vercel to restrict it to your sales team.
 * With no password set, the page is open (useful for local development).
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADVISOR_PASSWORD;
  if (!password) return NextResponse.next();
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
    headers: { "WWW-Authenticate": 'Basic realm="CloudMigrate Funding Advisor", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/clouds/azure/sales"],
};
