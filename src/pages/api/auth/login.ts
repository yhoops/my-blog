import type { APIContext } from "astro";
import { getEnv, isSecure } from "../../../lib/env";
import {
  readAuthEnv,
  checkCredentials,
  createSession,
  sessionCookieString,
  authConfigured,
} from "../../../lib/auth";

export const prerender = false;

export async function POST(context: APIContext): Promise<Response> {
  const env = readAuthEnv(getEnv(context));
  if (!authConfigured(env)) {
    return json({ ok: false, error: "认证未配置：请设置 ADMIN_USERNAME、ADMIN_PASSWORD、AUTH_SECRET" }, 500);
  }

  let username = "";
  let password = "";
  try {
    const body = (await context.request.json()) as { username?: string; password?: string };
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
      "Set-Cookie": sessionCookieString(token, isSecure(context)),
    },
  });
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
