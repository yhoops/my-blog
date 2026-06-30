globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getEnv } from '../../chunks/env_fEzJcfzM.mjs';
import { r as requireAuth, u as unauthorized } from '../../chunks/guard_DVoZBSCP.mjs';
import { r as readGitHubEnv, d as deleteFile, c as commitFile } from '../../chunks/github_DxJJTTGJ.mjs';
import { g as getCollection } from '../../chunks/_astro_content_BEtAUU1n.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Png_mWke.mjs';

const prerender = false;
const POSTS_DIR = "src/content/posts";
function buildMarkdown(p) {
  const fm = ["---"];
  fm.push(`title: ${yaml(p.title)}`);
  if (p.description) fm.push(`description: ${yaml(p.description)}`);
  fm.push(`date: ${p.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`);
  fm.push(`kind: ${p.kind || "writing"}`);
  if (p.tags && p.tags.length) fm.push(`tags: [${p.tags.map(yaml).join(", ")}]`);
  if (p.cover) fm.push(`cover: ${yaml(p.cover)}`);
  if (p.year) fm.push(`year: ${yaml(p.year)}`);
  if (p.role) fm.push(`role: ${yaml(p.role)}`);
  if (p.url) fm.push(`url: ${yaml(p.url)}`);
  fm.push(`draft: ${p.draft ? "true" : "false"}`);
  fm.push("---");
  fm.push("");
  fm.push(p.body || "");
  return fm.join("\n");
}
function yaml(v) {
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(v) || v.trim() !== v) {
    return JSON.stringify(v);
  }
  return v;
}
function slugify(s) {
  return s.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
async function GET(context) {
  if (!await requireAuth(context)) return unauthorized();
  const posts = await getCollection("posts");
  const list = posts.map((p) => ({
    slug: p.id.replace(/\.(md|mdx)$/, ""),
    ...p.data,
    date: p.data.date instanceof Date ? p.data.date.toISOString().slice(0, 10) : p.data.date,
    body: p.body ?? ""
  }));
  return json({ ok: true, posts: list });
}
async function PUT(context) {
  if (!await requireAuth(context)) return unauthorized();
  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }
  if (!payload.title) return json({ ok: false, error: "标题不能为空" }, 400);
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  if (!slug) return json({ ok: false, error: "无法生成有效的文件名" }, 400);
  const env = readGitHubEnv(getEnv(context));
  const path = `${POSTS_DIR}/${slug}.md`;
  const content = buildMarkdown({ ...payload});
  const result = await commitFile(env, path, content, `content: 保存《${payload.title}》`);
  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "提交失败" }, 502);
  }
  return json({ ok: true, slug, commitUrl: result.commitUrl });
}
async function DELETE(context) {
  if (!await requireAuth(context)) return unauthorized();
  const slug = new URL(context.request.url).searchParams.get("slug");
  if (!slug) return json({ ok: false, error: "缺少 slug" }, 400);
  const env = readGitHubEnv(getEnv(context));
  const result = await deleteFile(env, `${POSTS_DIR}/${slug}.md`, `content: 删除 ${slug}`);
  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "删除失败" }, 502);
  }
  return json({ ok: true });
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
