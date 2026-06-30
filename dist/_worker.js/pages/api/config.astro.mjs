globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getEnv } from '../../chunks/env_fEzJcfzM.mjs';
import { r as requireAuth, u as unauthorized } from '../../chunks/guard_DVoZBSCP.mjs';
import { r as readGitHubEnv, c as commitFile } from '../../chunks/github_DxJJTTGJ.mjs';
import { s as siteConfig } from '../../chunks/site_BqgZ-lNU.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Png_mWke.mjs';

const prerender = false;
const CONFIG_PATH = "src/content/site.json";
async function GET(context) {
  if (!await requireAuth(context)) return unauthorized();
  return json({ ok: true, config: siteConfig });
}
async function PUT(context) {
  if (!await requireAuth(context)) return unauthorized();
  let config;
  try {
    const body = await context.request.json();
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
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
