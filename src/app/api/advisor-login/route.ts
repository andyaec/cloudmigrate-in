import { NextResponse } from "next/server";
import { ADVISOR_COOKIE, ADVISOR_COOKIE_MAX_AGE, ADVISOR_LOGIN_PATH, ADVISOR_PATH, advisorToken, safeEqual } from "@/lib/advisor-auth";

export async function POST(request: Request) {
  const password = process.env.ADVISOR_PASSWORD;
  const expectedUser = process.env.ADVISOR_USER;
  const form = await request.formData();
  const user = String(form.get("username") ?? "").trim();
  const pass = String(form.get("password") ?? "");

  const userOk = !expectedUser || safeEqual(user, expectedUser);
  const passOk = !!password && safeEqual(pass, password);
  if (!password || !userOk || !passOk) {
    return NextResponse.redirect(new URL(`${ADVISOR_LOGIN_PATH}?error=${password ? "1" : "config"}`, request.url), 303);
  }

  const res = NextResponse.redirect(new URL(ADVISOR_PATH, request.url), 303);
  res.cookies.set(ADVISOR_COOKIE, await advisorToken(expectedUser, password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADVISOR_COOKIE_MAX_AGE,
  });
  return res;
}
