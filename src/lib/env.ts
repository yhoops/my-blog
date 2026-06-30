import type { APIContext } from "astro";

// Resolve the runtime env bag:
//  1. Cloudflare Workers runtime via locals.runtime.env (production + wrangler dev)
//  2. Vite import.meta.env (astro dev — variables declared in .env without PUBLIC_ prefix
//     are accessible server-side only via import.meta.env)
//  3. process.env fallback (Node.js environments)
export function getEnv(context: { locals?: any }): Record<string, unknown> {
  const runtimeEnv = (context.locals as any)?.runtime?.env;
  if (runtimeEnv && typeof runtimeEnv === "object" && Object.keys(runtimeEnv).length > 0) {
    return runtimeEnv as Record<string, unknown>;
  }
  // Merge Vite's import.meta.env with process.env; prefer import.meta.env entries.
  const viteEnv = (typeof import.meta !== "undefined" ? (import.meta as any).env : {}) as Record<string, unknown>;
  const processEnv = (typeof process !== "undefined" ? process.env : {}) as Record<string, unknown>;
  return { ...processEnv, ...viteEnv };
}

export function isSecure(context: APIContext): boolean {
  return new URL(context.request.url).protocol === "https:";
}
