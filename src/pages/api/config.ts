import type { APIContext } from "astro";
import { getEnv } from "../../lib/env";
import { requireAuth, unauthorized } from "../../lib/guard";
import { readGitHubEnv, commitFile } from "../../lib/github";
import siteConfig from "../../content/site.json";

export const prerender = false;

const CONFIG_PATH = "src/content/site.json";

// GET — return the current config (used by the admin to hydrate the editor).
export async function GET(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  return json({ ok: true, config: siteConfig });
}

// PUT — commit an updated config to GitHub, triggering a Cloudflare rebuild.
export async function PUT(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();

  let config: unknown;
  try {
    const body = (await context.request.json()) as { config?: unknown };
    config = body.config;
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }
  if (!config || typeof config !== "object") {
    return json({ ok: false, error: "配置内容无效" }, 400);
  }

  const env = readGitHubEnv(getEnv(context));
  const content = JSON.stringify(config, null, 2) + "\n";
  const result = await commitFile(env, CONFIG_PATH, content, "chore(cms): 更新站点配置");

  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "提交失败", status: result.status }, 502);
  }
  return json({ ok: true, commitUrl: result.commitUrl });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
