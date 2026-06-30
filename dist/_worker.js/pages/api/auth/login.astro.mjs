globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getEnv, i as isSecure } from '../../../chunks/env_fEzJcfzM.mjs';
import { r as readAuthEnv, a as authConfigured, c as checkCredentials, b as createSession, s as sessionCookieString } from '../../../chunks/auth_D6f9g80t.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Png_mWke.mjs';

const prerender = false;
async function POST(context) {
  const env = readAuthEnv(getEnv(context));
  if (!authConfigured(env)) {
    return json({ ok: false, error: "认证未配置：请设置 ADMIN_USERNAME、ADMIN_PASSWORD、AUTH_SECRET" }, 500);
  }
  let username = "";
  let password = "";
  try {
    const body = await context.request.json();
    username = body.username ?? "";
    password = body.password ?? "";
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }
  const valid = await checkCredentials(env, username, password);
  if (!valid) {
    return json({ ok: false, error: "用户名或密码错误" }, 401);
  }
  const token = await createSession(env, username);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": sessionCookieString(token, isSecure(context))
    }
  });
}
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
