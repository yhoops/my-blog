import type { APIContext } from "astro";
import { clearCookieString } from "../../../lib/auth";

export const prerender = false;

export async function POST(_context: APIContext): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookieString(),
    },
  });
}
