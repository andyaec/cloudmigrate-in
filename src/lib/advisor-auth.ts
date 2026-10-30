/**
 * Sign-in for the Azure Funding Advisor. The session cookie holds an HMAC of the
 * configured username keyed by ADVISOR_PASSWORD, so changing the password signs
 * everyone out. Uses Web Crypto so it runs in the proxy and in route handlers.
 */
export const ADVISOR_PATH = "/clouds/azure/sales";
export const ADVISOR_LOGIN_PATH = "/advisor-login";
export const ADVISOR_COOKIE = "cm_advisor";
export const ADVISOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function advisorToken(user: string | undefined, password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`cloudmigrate-advisor:${user ?? ""}`));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
