import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getEnv } from "../../lib/env";
import { requireAuth, unauthorized } from "../../lib/guard";
import { commitFile, deleteFile, readGitHubEnv } from "../../lib/github";

export const prerender = false;

const POSTS_DIR = "src/content/posts";

interface PostPayload {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  kind?: "writing" | "project";
  tags?: string[];
  category?: string;
  folder?: string;
  cover?: string;
  draft?: boolean;
  year?: string;
  role?: string;
  url?: string;
  body: string;
}

function buildMarkdown(p: PostPayload): string {
  const fm: string[] = ["---"];
  fm.push(`title: ${yaml(p.title)}`);
  if (p.description) fm.push(`description: ${yaml(p.description)}`);
  fm.push(`date: ${p.date || new Date().toISOString().slice(0, 10)}`);
  fm.push(`kind: ${p.kind || "writing"}`);
  if (p.tags && p.tags.length) fm.push(`tags: [${p.tags.map(yaml).join(", ")}]`);
  if (p.category) fm.push(`category: ${yaml(p.category)}`);
  if (p.folder) fm.push(`folder: ${yaml(p.folder)}`);
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

function postPath(slug: string, folder?: string): string {
  const cleanSlug = slugify(slug);
  const cleanFolder = (folder || "")
    .split("/")
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("/");
  return `${POSTS_DIR}/${cleanFolder ? `${cleanFolder}/` : ""}${cleanSlug}.md`;
}

function existingPostPath(slug: string): string {
  const clean = slug
    .split("/")
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("/");
  return `${POSTS_DIR}/${clean}.md`;
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
  const result = await commitFile(
    env,
    postPath(slug, payload.folder),
    buildMarkdown({ ...payload, slug }),
    `content: 保存《${payload.title}》`,
  );

  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "提交失败" }, 502);
  }
  return json({ ok: true, slug, commitUrl: result.commitUrl });
}

export async function POST(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();

  let payload: { posts?: PostPayload[] };
  try {
    payload = (await context.request.json()) as { posts?: PostPayload[] };
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }

  const imports = payload.posts ?? [];
  if (!imports.length) return json({ ok: false, error: "没有可导入的 Markdown" }, 400);

  const env = readGitHubEnv(getEnv(context));
  const results = [];
  for (const item of imports) {
    const title = item.title?.trim();
    if (!title) {
      results.push({ ok: false, slug: item.slug, error: "标题不能为空" });
      continue;
    }
    const slug = item.slug ? slugify(item.slug) : slugify(title);
    if (!slug) {
      results.push({ ok: false, slug: item.slug, error: "无法生成有效的文件名" });
      continue;
    }
    const result = await commitFile(
      env,
      postPath(slug, item.folder),
      buildMarkdown({ ...item, slug, title }),
      `content: 导入《${title}》`,
    );
    results.push({ ok: result.ok, slug, error: result.message, commitUrl: result.commitUrl });
  }

  const failed = results.filter((r) => !r.ok);
  return json({ ok: failed.length === 0, results, failed: failed.length }, failed.length ? 207 : 200);
}

export async function DELETE(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  const slug = new URL(context.request.url).searchParams.get("slug");
  if (!slug) return json({ ok: false, error: "缺少 slug" }, 400);

  const env = readGitHubEnv(getEnv(context));
  const result = await deleteFile(env, existingPostPath(slug), `content: 删除 ${slug}`);
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
