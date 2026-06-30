import type { APIContext } from "astro";

// Resolve the runtime env bag across Cloudflare (locals.runtime.env) and Node dev (process.env).
export function getEnv(context: { locals?: any }): Record<string, unknown> {
  const runtimeEnv = (context.locals as any)?.runtime?.env;
  if (runtimeEnv) return runtimeEnv as Record<string, unknown>;
  return (typeof process !== "undefined" ? process.env : {}) as Record<string, unknown>;
}

export function isSecure(context: APIContext): boolean {
  return new URL(context.request.url).protocol === "https:";
}
