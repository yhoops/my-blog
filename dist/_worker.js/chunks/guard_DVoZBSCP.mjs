globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getEnv } from './env_fEzJcfzM.mjs';
import { r as readAuthEnv, S as SESSION_COOKIE, v as verifySession } from './auth_D6f9g80t.mjs';

async function requireAuth(context) {
  const env = readAuthEnv(getEnv(context));
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(env, token);
}
function unauthorized() {
  return new Response(JSON.stringify({ ok: false, error: "未授权" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}

export { requireAuth as r, unauthorized as u };
