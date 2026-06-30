import type { APIContext } from "astro";
import { getEnv } from "../../../lib/env";
import { readAuthEnv, verifySession, SESSION_COOKIE } from "../../../lib/auth";

export const prerender = false;

// Lightweight endpoint to check if the visitor has a valid admin session.
// Used by the front page to conditionally enable drag-reorder.
export async function GET(context: APIContext): Promise<Response> {
  const env = readAuthEnv(getEnv(context));
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySession(env, token);
  return new Response(JSON.stringify({ ok: true, authed }), {
    headers: { "Content-Type": "application/json" },
  });
}
