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
  canonicalSlug?: string;
  aliases?: string[];
  summary?: string;
  highlights?: string[];
  projectHighlights?: string[];
  contextNote?: string;
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

interface MigrationException {
  sourceId: string;
  reason: string;
  library: "writing" | "work";
  folder: string;
  title: string;
  repairable: boolean;
}

function buildMarkdown(p: PostPayload): string {
  const fm: string[] = ["---"];
  fm.push(`title: ${yaml(p.title)}`);
  if (p.description) fm.push(`description: ${yaml(p.description)}`);
  if (p.canonicalSlug) fm.push(`canonicalSlug: ${yaml(p.canonicalSlug)}`);
  if (p.aliases && p.aliases.length) fm.push(`aliases: [${p.aliases.map(yaml).join(", ")}]`);
  if (p.summary) fm.push(`summary: ${yaml(p.summary)}`);
  if (p.highlights && p.highlights.length) fm.push(`highlights: [${p.highlights.map(yaml).join(", ")}]`);
  if (p.projectHighlights && p.projectHighlights.length) fm.push(`projectHighlights: [${p.projectHighlights.map(yaml).join(", ")}]`);
  if (p.contextNote) fm.push(`contextNote: ${yaml(p.contextNote)}`);
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

function normalizeAliasPath(value: string): string {
  return value
    .split("/")
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("/");
}

function libraryFor(kind: PostPayload["kind"]): "writing" | "work" {
  return kind === "project" ? "work" : "writing";
}

function postPath(kind: PostPayload["kind"], slug: string, folder?: string): string {
  const cleanSlug = slugify(slug);
  const cleanFolder = (folder || "")
    .split("/")
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("/");
  const library = libraryFor(kind);
  return `${POSTS_DIR}/${library}/${cleanFolder ? `${cleanFolder}/` : ""}${cleanSlug}.md`;
}

function normalizeId(id: string): string {
  return id.replace(/\.(md|mdx)$/, "");
}

function folderFromId(id: string): string {
  const parts = normalizeId(id).split("/").filter(Boolean);
  if (!parts.length) return "";
  const trimmed = parts[0] === "writing" || parts[0] === "work" ? parts.slice(1) : parts;
  return trimmed.slice(0, -1).join("/");
}

function fileSlugFromId(id: string): string {
  return normalizeId(id).split("/").filter(Boolean).at(-1) || "";
}

async function getPosts() {
  return getCollection("posts");
}

function findMigrationExceptions(posts: Awaited<ReturnType<typeof getPosts>>): MigrationException[] {
  const seen = new Set<string>();
  const issues: MigrationException[] = [];

  for (const post of posts) {
    const sourceId = normalizeId(post.id);
    const kind = post.data.kind;
    const canonical = post.data.canonicalSlug || fileSlugFromId(post.id);
    const library = kind === "project" ? "work" : "writing";
    const folder = post.data.folder || folderFromId(post.id);
    const title = post.data.title || fileSlugFromId(post.id);

    if (kind !== "writing" && kind !== "project") {
      issues.push({ sourceId, reason: "Missing or invalid content kind", library: "writing", folder, title, repairable: false });
      continue;
    }

    if (!canonical || !slugify(canonical)) {
      issues.push({ sourceId, reason: "Missing canonical slug", library, folder, title, repairable: true });
      continue;
    }

    const scopeKey = `${kind}:${slugify(canonical)}`;
    if (seen.has(scopeKey)) {
      issues.push({ sourceId, reason: "Canonical slug collides inside the same library", library, folder, title, repairable: false });
      continue;
    }
    seen.add(scopeKey);
  }

  return issues;
}

async function findCanonicalConflict(kind: "writing" | "project", canonicalSlug: string, currentId?: string) {
  const posts = await getPosts();
  return posts.find((post) => {
    if (post.data.kind !== kind) return false;
    if (currentId && post.id === currentId) return false;
    const canonical = post.data.canonicalSlug || fileSlugFromId(post.id);
    return canonical === canonicalSlug;
  });
}

async function findPostByLegacySlug(slug: string) {
  const clean = slug
    .split("/")
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("/");
  const posts = await getPosts();
  return posts.find((post) => normalizeId(post.id) === clean) ?? null;
}

function legacyAliasSet(kind: "writing" | "project", canonicalSlug: string, filePathSlug: string, aliases: string[] = []): string[] {
  const merged = new Set<string>(aliases.filter(Boolean).map(normalizeAliasPath).filter(Boolean));
  const legacy = filePathSlug.split("/").filter(Boolean).join("/");
  if (legacy && legacy !== canonicalSlug) merged.add(legacy);
  merged.delete(canonicalSlug);
  return [...merged];
}

export async function GET(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  const posts = await getPosts();
  const exceptions = findMigrationExceptions(posts);
  const list = posts.map((p) => {
    const slug = p.data.canonicalSlug || fileSlugFromId(p.id);
    const folder = p.data.folder || folderFromId(p.id);
    const library = p.data.kind === "project" ? "work" : "writing";
    return {
      slug,
      fileSlug: fileSlugFromId(p.id),
      sourceId: normalizeId(p.id),
      library,
      ...p.data,
      canonicalSlug: slug,
      aliases: legacyAliasSet(p.data.kind, slug, normalizeId(p.id), p.data.aliases ?? []),
      folder,
      date: p.data.date instanceof Date ? p.data.date.toISOString().slice(0, 10) : p.data.date,
      body: (p as { body?: string }).body ?? "",
    };
  });
  return json({ ok: true, posts: list, exceptions });
}

export async function PUT(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();

  let payload: PostPayload & { sourceId?: string };
  try {
    payload = (await context.request.json()) as PostPayload & { sourceId?: string };
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }
  if (!payload.title) return json({ ok: false, error: "标题不能为空" }, 400);

  const kind = payload.kind || "writing";
  const canonicalSlug = slugify(payload.canonicalSlug || payload.slug || payload.title);
  if (!canonicalSlug) return json({ ok: false, error: "无法生成有效的公开地址" }, 400);

  const conflict = await findCanonicalConflict(kind, canonicalSlug, payload.sourceId);
  if (conflict) return json({ ok: false, error: "当前内容库中已存在相同 slug" }, 409);

  const folder = (payload.folder || "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
  const fileSlug = slugify(payload.slug || canonicalSlug || payload.title);
  const targetPath = postPath(kind, fileSlug, folder);
  const source = payload.sourceId ? await findPostByLegacySlug(payload.sourceId) : null;
  const previousCanonical = source ? source.data.canonicalSlug || fileSlugFromId(source.id) : "";
  const previousLegacy = source ? normalizeId(source.id) : "";
  const aliases = legacyAliasSet(
    kind,
    canonicalSlug,
    previousLegacy || `${libraryFor(kind)}${folder ? `/${folder}` : ""}/${fileSlug}`,
    [
      ...(payload.aliases ?? []),
      ...(source?.data.aliases ?? []),
      previousCanonical && previousCanonical !== canonicalSlug ? previousCanonical : "",
      previousLegacy && previousLegacy !== canonicalSlug ? previousLegacy : "",
    ],
  );

  const env = readGitHubEnv(getEnv(context));
  const result = await commitFile(
    env,
    targetPath,
    buildMarkdown({
      ...payload,
      kind,
      folder,
      canonicalSlug,
      aliases,
      slug: canonicalSlug,
    }),
    `content: 保存《${payload.title}》`,
  );

  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "提交失败" }, 502);
  }

  if (source && normalizeId(source.id) !== normalizeId(targetPath.replace(`${POSTS_DIR}/`, "").replace(/\.md$/, ""))) {
    await deleteFile(env, `${POSTS_DIR}/${normalizeId(source.id)}.md`, `content: 清理旧文件 ${source.data.title}`);
  }

  return json({ ok: true, slug: canonicalSlug, commitUrl: result.commitUrl });
}

export async function POST(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();

  let payload: { posts?: PostPayload[]; action?: string; sourceId?: string };
  try {
    payload = (await context.request.json()) as { posts?: PostPayload[]; action?: string; sourceId?: string };
  } catch {
    return json({ ok: false, error: "请求格式错误" }, 400);
  }

  if (payload.action === "repair") {
    return repairException(context, payload.sourceId || "");
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
    const kind = item.kind || "writing";
    const canonicalSlug = slugify(item.canonicalSlug || item.slug || title);
    if (!canonicalSlug) {
      results.push({ ok: false, slug: item.slug, error: "无法生成有效的公开地址" });
      continue;
    }
    const conflict = await findCanonicalConflict(kind, canonicalSlug);
    if (conflict) {
      results.push({ ok: false, slug: canonicalSlug, error: "当前内容库中已存在相同 slug" });
      continue;
    }
    const folder = (item.folder || "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean)
      .join("/");
    const fileSlug = slugify(item.slug || canonicalSlug || title);
    const result = await commitFile(
      env,
      postPath(kind, fileSlug, folder),
      buildMarkdown({
        ...item,
        title,
        kind,
        folder,
        canonicalSlug,
        aliases: [],
        slug: canonicalSlug,
        body: item.body,
      }),
      `content: 导入《${title}》`,
    );
    results.push({ ok: result.ok, slug: canonicalSlug, error: result.message, commitUrl: result.commitUrl });
  }

  const failed = results.filter((r) => !r.ok);
  return json({ ok: failed.length === 0, results, failed: failed.length }, failed.length ? 207 : 200);
}

async function repairException(context: APIContext, sourceId: string): Promise<Response> {
  if (!sourceId) return json({ ok: false, error: "缺少 sourceId" }, 400);

  const post = await findPostByLegacySlug(sourceId);
  if (!post) return json({ ok: false, error: "未找到对应内容" }, 404);

  const exceptions = findMigrationExceptions(await getPosts());
  const target = exceptions.find((item) => item.sourceId === sourceId);
  if (!target) return json({ ok: false, error: "该记录当前不需要修复" }, 409);
  if (!target.repairable) return json({ ok: false, error: "该记录需要人工处理" }, 409);

  const kind = post.data.kind || "writing";
  const canonicalSlug = slugify(post.data.title || fileSlugFromId(post.id));
  if (!canonicalSlug) return json({ ok: false, error: "无法安全生成 canonical slug" }, 409);

  const conflict = await findCanonicalConflict(kind, canonicalSlug, post.id);
  if (conflict) return json({ ok: false, error: "修复会导致 slug 冲突" }, 409);

  const env = readGitHubEnv(getEnv(context));
  const folder = post.data.folder || folderFromId(post.id);
  const result = await commitFile(
    env,
    `${POSTS_DIR}/${normalizeId(post.id)}.md`,
    buildMarkdown({
      title: post.data.title,
      description: post.data.description,
      canonicalSlug,
      aliases: legacyAliasSet(kind, canonicalSlug, normalizeId(post.id), post.data.aliases ?? []),
      summary: post.data.summary,
      highlights: post.data.highlights,
      projectHighlights: post.data.projectHighlights,
      contextNote: post.data.contextNote,
      date: post.data.date instanceof Date ? post.data.date.toISOString().slice(0, 10) : String(post.data.date || ""),
      kind,
      tags: post.data.tags,
      category: post.data.category,
      folder,
      cover: post.data.cover,
      draft: post.data.draft,
      year: post.data.year,
      role: post.data.role,
      url: post.data.url,
      slug: canonicalSlug,
      body: (post as { body?: string }).body ?? "",
    }),
    `content: 修复《${post.data.title}》的 canonical slug`,
  );

  if (!result.ok) {
    return json({ ok: false, error: result.message ?? "修复失败" }, 502);
  }

  return json({ ok: true, repaired: true, sourceId, canonicalSlug, commitUrl: result.commitUrl });
}

export async function DELETE(context: APIContext): Promise<Response> {
  if (!(await requireAuth(context))) return unauthorized();
  const slug = new URL(context.request.url).searchParams.get("slug");
  if (!slug) return json({ ok: false, error: "缺少 slug" }, 400);

  const post = await findPostByLegacySlug(slug);
  if (!post) return json({ ok: false, error: "未找到对应内容" }, 404);

  const env = readGitHubEnv(getEnv(context));
  const result = await deleteFile(env, `${POSTS_DIR}/${normalizeId(post.id)}.md`, `content: 删除 ${slug}`);
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
