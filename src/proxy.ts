import { NextResponse, type NextRequest } from "next/server";
import { ADVISOR_COOKIE, ADVISOR_LOGIN_PATH, advisorToken, safeEqual } from "@/lib/advisor-auth";

/**
 * Gate for the Azure Funding Advisor, which summarises Microsoft partner-incentive
 * terms marked "Confidential — shared subject to partner agreements".
 * Signed-out visitors are redirected to the sign-in page rather than sent an HTTP
 * auth challenge: background prefetches from other pages then follow a harmless
 * redirect instead of popping a browser login dialog. Fails closed: outside
 * `next dev` the advisor is unavailable until ADVISOR_PASSWORD is configured.
 */
export async function proxy(request: NextRequest) {
  const password = process.env.ADVISOR_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return new NextResponse("The Funding Advisor is locked. Set ADVISOR_PASSWORD in the deployment environment to enable sign-in.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  const session = request.cookies.get(ADVISOR_COOKIE)?.value;
  if (session && safeEqual(session, await advisorToken(process.env.ADVISOR_USER, password))) {
    return NextResponse.next();
  }
  const res = NextResponse.redirect(new URL(ADVISOR_LOGIN_PATH, request.url), 307);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/clouds/azure/sales"],
};
