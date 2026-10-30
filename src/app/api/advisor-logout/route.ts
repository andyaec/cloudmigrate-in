import { NextResponse } from "next/server";
import { ADVISOR_COOKIE } from "@/lib/advisor-auth";

function signOut(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  res.cookies.set(ADVISOR_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export const GET = signOut;
export const POST = signOut;
