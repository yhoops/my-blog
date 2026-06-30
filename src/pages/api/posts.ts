import type { APIContext } from "astro";
import { getEnv } from "../../lib/env";
import { requireAuth, unauthorized } from "../../lib/guard";
import { readGitHubEnv, commitFile, deleteFile } from "../../lib/github";
import { getCollection } from "astro:content";

export const prerender = false;

const POSTS_DIR = "src/content/posts";

interface PostPayload {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  kind?: "writing" | "project";
  tags?: string[];
  cover?: string;
  draft?: boolean;
  year?: string;
  role?: string;
  url?: string;
  body: string;
}

// Build a Markdown file (YAML frontmatter + body) from a payload.
function buildMarkdown(p: PostPayload): string {
  const fm: string[] = ["---"];
  fm.push(`title: ${yaml(p.title)}`);
  if (p.description) fm.push(`description: ${yaml(p.description)}`);
  fm.push(`date: ${p.date || new Date().toISOString().slice(0, 10)}`);
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

function yaml(v: string): string {
  // Quote strings that contain YAML-special characters.
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(v) || v.trim() !== v) {
    return JSON.stringify(v);
  }
  return v;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  const posts = await getCollection("posts");
  const list = posts.map((p) => ({
    slug: p.id.replace(/\.(md|mdx)$/, ""),
    ...p.data,
    date: p.data.date instanceof Date ? p.data.date.toISOString().slice(0, 10) : p.data.date,
    body: (p as { body?: string }).body ?? "",
  }));
  return json({ ok: true, posts: list });
}

export async function PUT(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();

  let payload: PostPayload;
  try {
    payload = (await context.request.json()) as PostPayload;
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }
  if (!payload.title) return json({ ok: false, error: "标题不能为空" }, 400);

  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  if (!slug) return json({ ok: false, error: "无法生成有效的文件名" }, 400);

  const env = readGitHubEnv(getEnv(context));
  const path = `${POSTS_DIR}/${slug}.md`;
  const content = buildMarkdown({ ...payload, slug });
  const result = await commitFile(env, path, content, `content: 保存《${payload.title}》`);

  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "提交失败" }, 502);
  }
  return json({ ok: true, slug, commitUrl: result.commitUrl });
}

export async function DELETE(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  const slug = new URL(context.request.url).searchParams.get("slug");
  if (!slug) return json({ ok: false, error: "缺少 slug" }, 400);

  const env = readGitHubEnv(getEnv(context));
  const result = await deleteFile(env, `${POSTS_DIR}/${slug}.md`, `content: 删除 ${slug}`);
  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "删除失败" }, 502);
  }
  return json({ ok: true });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
