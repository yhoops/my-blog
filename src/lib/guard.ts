import type { APIContext } from "astro";
import { getEnv } from "./env";
import { readAuthEnv, verifySession, SESSION_COOKIE } from "./auth";

// Returns true if the request carries a valid admin session.
export async function requireAuth(context: APIContext): Promise<boolean> {
  const env = readAuthEnv(getEnv(context));
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(env, token);
}

export function unauthorized(): Response {
  return new Response(JSON.stringify({ ok: false, error: "未授权" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
