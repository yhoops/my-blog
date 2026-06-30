import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentConfig, ContentFolder, SiteConfig } from "../../lib/config-types";

interface PostItem {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  kind?: "writing" | "project";
  tags?: string[];
  category?: string;
  folder?: string;
  cover?: string;
  year?: string;
  role?: string;
  url?: string;
  draft?: boolean;
  body?: string;
}

interface FolderNode {
  name: string;
  path: string;
  children: FolderNode[];
  posts: PostItem[];
}

const EMPTY: PostItem & { body: string } = {
  slug: "",
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  kind: "writing",
  tags: [],
  category: "",
  folder: "",
  draft: false,
  body: "# ",
};

const DEFAULT_CONTENT: ContentConfig = {
  categories: [],
  folders: [],
  floatingNav: {
    title: "知识碎片",
    searchPlaceholder: "Search",
    writingLabel: "随笔导航",
    workLabel: "作品导航",
    readingLabel: "阅读模式",
  },
};

export default function ContentManager({ githubConfigured }: { githubConfigured: boolean }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostItem & { body: string }>({ ...EMPTY });
  const [selectedFolder, setSelectedFolder] = useState("");
  const [status, setStatus] = useState("");
  const importRef = useRef<HTMLInputElement | null>(null);

  const content = useMemo(() => normalizeContent(config?.content), [config]);
  const folderTree = useMemo(() => buildFolderTree(posts, content.folders), [posts, content.folders]);

  async function load() {
    setLoading(true);
    const [postRes, configRes] = await Promise.all([fetch("/api/posts"), fetch("/api/config")]);
    const postData = (await postRes.json()) as { ok: boolean; posts?: PostItem[] };
    const configData = (await configRes.json()) as { ok: boolean; config?: SiteConfig };
    if (postData.ok && postData.posts) {
      const next = postData.posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setPosts(next);
      if (!editing.title && next[0]) selectPost(next[0]);
    }
    if (configData.ok && configData.config) setConfig(configData.config);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function selectPost(post: PostItem) {
    const editable = toEditablePost(post);
    setEditing(editable);
    setSelectedFolder(editable.folder || "");
    setStatus("");
  }

  function newPost(kind: "writing" | "project" = "writing") {
    setEditing({ ...EMPTY, kind, folder: selectedFolder });
    setStatus("");
  }

  function set<K extends keyof typeof editing>(key: K, value: (typeof editing)[K]) {
    setEditing((form) => ({ ...form, [key]: value }));
  }

  async function save() {
    if (!editing.title.trim()) {
      setStatus("标题不能为空");
      return;
    }
    setStatus("正在保存...");
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        folder: selectedFolder,
        tags: normalizeTags(editing.tags),
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) {
      setStatus("已保存并提交到 GitHub");
      await load();
    } else {
      setStatus(data.error || "保存失败");
    }
  }

  async function del(slug: string) {
    if (!confirm(`确定删除《${slug}》？此操作会从 GitHub 移除该文件。`)) return;
    const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) {
      setEditing({ ...EMPTY, folder: selectedFolder });
      await load();
    } else {
      setStatus(data.error || "删除失败");
    }
  }

  async function saveFolders(nextFolders: ContentFolder[]) {
    if (!config) return;
    const nextContent = { ...content, folders: nextFolders };
    const nextConfig = { ...config, content: nextContent };
    setConfig(nextConfig);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: nextConfig }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setStatus(data.ok ? "文件夹已保存" : data.error || "文件夹保存失败");
  }

  async function saveContentSettings(nextContent: ContentConfig) {
    if (!config) return;
    const nextConfig = { ...config, content: nextContent };
    setConfig(nextConfig);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: nextConfig }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setStatus(data.ok ? "导航配置已保存" : data.error || "配置保存失败");
  }

  async function importMarkdown(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (!selected.length) return;
    setStatus("正在导入 Markdown...");
    const imports = await Promise.all(
      selected.map((file) => parseMarkdownFile(file, { kind: editing.kind, category: editing.category, folder: selectedFolder })),
    );
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: imports }),
    });
    const data = (await res.json()) as { ok: boolean; failed?: number; error?: string };
    setStatus(data.ok ? `已导入 ${imports.length} 篇` : data.error || `导入完成，失败 ${data.failed ?? 0} 篇`);
    await load();
    if (importRef.current) importRef.current.value = "";
  }

  function preview() {
    const doc = previewDocument(editing, renderMarkdown(editing.body), config);
    const win = window.open("about:blank", "_blank", "width=980,height=820");
    if (!win) {
      setStatus("浏览器阻止了预览窗口，请允许此站点打开弹窗。");
      return;
    }
    win.opener = null;
    win.document.open();
    win.document.write(doc);
    win.document.close();
  }

  const visiblePosts = selectedFolder
    ? posts.filter((post) => postFolder(post) === selectedFolder)
    : posts.filter((post) => !postFolder(post));

  if (loading) return <p className="hint">正在加载...</p>;

  return (
    <div className="content-workbench">
      <input
        ref={importRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        multiple
        hidden
        onChange={(e) => importMarkdown(e.target.files)}
      />

      <aside className="content-explorer">
        <div className="explorer-head">
          <div>
            <div className="eyebrow">内容目录</div>
            <strong>src/content/posts</strong>
          </div>
          <button
            className="icon-mini"
            onClick={() => {
              const name = prompt("新文件夹名称");
              if (!name?.trim()) return;
              const parentId = folderIdByPath(content.folders, selectedFolder);
              saveFolders([...content.folders, { id: `folder-${Date.now()}`, name: name.trim(), parentId, description: "" }]);
            }}
            aria-label="添加文件夹"
          >
            +
          </button>
        </div>
        <FolderTree
          node={folderTree}
          selected={selectedFolder}
          onSelect={(path) => {
            setSelectedFolder(path);
            set("folder", path);
          }}
          onPost={selectPost}
        />
      </aside>

      <main className="editor-canvas">
        <div className="workbench-topbar">
          <div className="toolbar">
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => newPost("writing")}>
              新建随笔
            </button>
            <button className="btn" onClick={() => newPost("project")}>
              新建作品
            </button>
            <button className="btn" onClick={() => importRef.current?.click()}>
              导入 MD
            </button>
            <button className="btn" onClick={preview}>
              预览
            </button>
          </div>
          <div className="toolbar">
            {status && <span className="hint">{status}</span>}
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={save}>
              保存并提交
            </button>
          </div>
        </div>

        {!githubConfigured && <div className="banner warn">未配置 GitHub，保存会失败。请先设置 GITHUB_TOKEN / GITHUB_REPO。</div>}

        <div className="editor-layout">
          <section className="editor-main-card">
            <div className="title-grid">
              <input
                className="ghost-input title-input"
                value={editing.title}
                placeholder="标题"
                onChange={(e) => set("title", e.target.value)}
              />
              <input
                className="ghost-input slug-input"
                value={editing.slug}
                placeholder="slug (xx-xx)"
                onChange={(e) => set("slug", e.target.value)}
              />
            </div>
            <textarea
              className="article-textarea"
              value={editing.body}
              placeholder="#&#10;&#10;从这里开始写作..."
              onChange={(e) => set("body", e.target.value)}
            />
          </section>

          <aside className="editor-side-stack">
            <section className="glass-card cover-card">
              <label>封面</label>
              <button className="cover-drop" onClick={() => set("cover", prompt("封面图片 URL", editing.cover || "") || editing.cover)}>
                {editing.cover ? <img src={editing.cover} alt="" /> : <span>+</span>}
              </button>
            </section>

            <section className="glass-card">
              <label>元信息</label>
              <textarea
                className="ghost-input meta-summary"
                value={editing.description}
                placeholder="为这篇文章写一段简短摘要"
                onChange={(e) => set("description", e.target.value)}
              />
              <input
                className="ghost-input"
                value={Array.isArray(editing.tags) ? editing.tags.join(", ") : (editing.tags as any)}
                placeholder="添加标签（逗号分隔）"
                onChange={(e) => set("tags", e.target.value as any)}
              />
              <input
                className="ghost-input"
                list="post-categories"
                value={editing.category}
                placeholder="未分类"
                onChange={(e) => set("category", e.target.value)}
              />
              <datalist id="post-categories">
                {content.categories.map((cat) => (
                  <option value={cat} key={cat} />
                ))}
              </datalist>
              <select className="ghost-input" value={editing.kind} onChange={(e) => set("kind", e.target.value as "writing" | "project")}>
                <option value="writing">随笔</option>
                <option value="project">作品</option>
              </select>
              <input className="ghost-input" type="date" value={editing.date} onChange={(e) => set("date", e.target.value)} />
              <label className="check-row">
                <input type="checkbox" checked={Boolean(editing.draft)} onChange={(e) => set("draft", e.target.checked)} />
                隐藏此文章（仅管理员可见）
              </label>
              <div className="selected-path">保存到：{selectedFolder || "顶层"}</div>
            </section>

            <section className="glass-card">
              <div className="card-headline">
                <label>图片管理</label>
                <button className="link-button">压缩工具</button>
              </div>
              <div className="image-add">
                <input className="ghost-input" placeholder="https://..." />
                <button className="btn">添加</button>
              </div>
              <button className="image-tile">+</button>
            </section>
          </aside>
        </div>

        <section className="panel compact-panel">
          <div className="panel-headline">
            <h3>当前目录内容</h3>
            {editing.slug && (
              <button className="btn btn-danger" onClick={() => del(editing.folder ? `${editing.folder}/${editing.slug}` : editing.slug)}>
                删除当前文章
              </button>
            )}
          </div>
          {visiblePosts.length === 0 ? (
            <p className="hint">当前目录还没有内容。</p>
          ) : (
            visiblePosts.map((post) => (
              <button className="file-row" key={post.slug} onClick={() => selectPost(post)}>
                <span>{post.kind === "project" ? "◆" : "◇"}</span>
                <strong>{post.title}</strong>
                <small>{post.slug}</small>
              </button>
            ))
          )}
        </section>

        <ContentSettingsInline content={content} onSave={saveContentSettings} />
      </main>
    </div>
  );
}

function normalizeContent(content?: Partial<ContentConfig>): ContentConfig {
  return {
    ...DEFAULT_CONTENT,
    ...(content ?? {}),
    categories: content?.categories ?? [],
    folders: content?.folders ?? [],
    floatingNav: {
      ...DEFAULT_CONTENT.floatingNav,
      ...(content?.floatingNav ?? {}),
    },
  };
}

function toEditablePost(post: PostItem): PostItem & { body: string } {
  const parts = post.slug.split("/").filter(Boolean);
  return {
    ...EMPTY,
    ...post,
    slug: parts.at(-1) ?? post.slug,
    folder: post.folder || parts.slice(0, -1).join("/"),
    body: post.body || "",
  };
}

function normalizeTags(tags: PostItem["tags"]): string[] {
  if (Array.isArray(tags)) return tags;
  return String(tags || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function postFolder(post: PostItem): string {
  if (post.folder) return post.folder;
  return post.slug.split("/").filter(Boolean).slice(0, -1).join("/");
}

function buildFolderTree(posts: PostItem[], folders: ContentFolder[]): FolderNode {
  const root: FolderNode = { name: "posts", path: "", children: [], posts: [] };
  const ensure = (path: string) => {
    let cursor = root;
    let prefix = "";
    for (const part of path.split("/").filter(Boolean)) {
      prefix = [prefix, part].filter(Boolean).join("/");
      let child = cursor.children.find((item) => item.path === prefix);
      if (!child) {
        child = { name: part, path: prefix, children: [], posts: [] };
        cursor.children.push(child);
      }
      cursor = child;
    }
    return cursor;
  };

  for (const option of folderOptions(folders, posts)) ensure(option.path);
  for (const post of posts) ensure(postFolder(post)).posts.push(post);
  sortTree(root);
  return root;
}

function sortTree(node: FolderNode) {
  node.children.sort((a, b) => a.name.localeCompare(b.name));
  node.posts.sort((a, b) => a.title.localeCompare(b.title));
  node.children.forEach(sortTree);
}

function folderOptions(folders: ContentFolder[], posts: PostItem[] = []) {
  const byParent = new Map<string, ContentFolder[]>();
  for (const folder of folders) {
    const parent = folder.parentId || "";
    byParent.set(parent, [...(byParent.get(parent) ?? []), folder]);
  }
  const map = new Map<string, { label: string; path: string }>();
  function walk(parentId: string, prefix: string, depth: number) {
    for (const folder of byParent.get(parentId) ?? []) {
      const path = [prefix, folder.name].filter(Boolean).join("/");
      map.set(path, { label: `${"  ".repeat(depth)}${folder.name}`, path });
      walk(folder.id, path, depth + 1);
    }
  }
  walk("", "", 0);
  for (const post of posts) {
    const parts = post.slug.split("/").filter(Boolean).slice(0, -1);
    let prefix = "";
    for (const [index, part] of parts.entries()) {
      prefix = [prefix, part].filter(Boolean).join("/");
      if (!map.has(prefix)) map.set(prefix, { label: `${"  ".repeat(index)}${part}`, path: prefix });
    }
    if (post.folder && !map.has(post.folder)) {
      const depth = post.folder.split("/").filter(Boolean).length - 1;
      map.set(post.folder, { label: `${"  ".repeat(Math.max(depth, 0))}${post.folder.split("/").at(-1)}`, path: post.folder });
    }
  }
  return [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function folderIdByPath(folders: ContentFolder[], path: string): string {
  if (!path) return "";
  const parts = path.split("/").filter(Boolean);
  let parentId = "";
  let found = "";
  for (const part of parts) {
    const folder = folders.find((item) => item.name === part && (item.parentId || "") === parentId);
    if (!folder) return "";
    found = folder.id;
    parentId = folder.id;
  }
  return found;
}

function FolderTree({
  node,
  selected,
  onSelect,
  onPost,
}: {
  node: FolderNode;
  selected: string;
  onSelect: (path: string) => void;
  onPost: (post: PostItem) => void;
}) {
  return (
    <div className="folder-tree">
      <button className={`folder-node ${selected === "" ? "active" : ""}`} onClick={() => onSelect("")}>
        <span>▾</span>
        <strong>posts</strong>
      </button>
      <div className="folder-children">
        {node.children.map((child) => (
          <FolderBranch key={child.path} node={child} selected={selected} onSelect={onSelect} onPost={onPost} />
        ))}
        {node.posts.map((post) => (
          <button className="post-node" key={post.slug} onClick={() => onPost(post)}>
            <span>◇</span>
            {post.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function FolderBranch({
  node,
  selected,
  onSelect,
  onPost,
}: {
  node: FolderNode;
  selected: string;
  onSelect: (path: string) => void;
  onPost: (post: PostItem) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button className={`folder-node ${selected === node.path ? "active" : ""}`} onClick={() => onSelect(node.path)}>
        <span onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>{open ? "▾" : "▸"}</span>
        <strong>{node.name}</strong>
      </button>
      {open && (
        <div className="folder-children">
          {node.children.map((child) => (
            <FolderBranch key={child.path} node={child} selected={selected} onSelect={onSelect} onPost={onPost} />
          ))}
          {node.posts.map((post) => (
            <button className="post-node" key={post.slug} onClick={() => onPost(post)}>
              <span>{post.kind === "project" ? "◆" : "◇"}</span>
              {post.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentSettingsInline({ content, onSave }: { content: ContentConfig; onSave: (content: ContentConfig) => void }) {
  const [draft, setDraft] = useState(content);
  useEffect(() => setDraft(content), [content]);
  return (
    <details className="panel compact-panel">
      <summary>分类与悬浮导航配置</summary>
      <div className="grid-2" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label>随笔分类（每行一个）</label>
          <textarea
            className="textarea textarea-compact"
            value={draft.categories.join("\n")}
            onChange={(e) => setDraft({ ...draft, categories: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
        <div className="field">
          <label>悬浮模块标题</label>
          <input className="input" value={draft.floatingNav.title} onChange={(e) => setDraft({ ...draft, floatingNav: { ...draft.floatingNav, title: e.target.value } })} />
          <label style={{ marginTop: "0.75rem" }}>搜索占位文案</label>
          <input className="input" value={draft.floatingNav.searchPlaceholder} onChange={(e) => setDraft({ ...draft, floatingNav: { ...draft.floatingNav, searchPlaceholder: e.target.value } })} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => onSave(draft)}>
        保存配置
      </button>
    </details>
  );
}

async function parseMarkdownFile(
  file: File,
  defaults: Pick<PostItem, "kind" | "category" | "folder">,
): Promise<PostItem & { body: string }> {
  const text = await file.text();
  const parsed = parseFrontmatter(text);
  const fallbackTitle = file.name.replace(/\.(md|markdown)$/i, "");
  return {
    ...EMPTY,
    ...defaults,
    ...parsed.data,
    title: String(parsed.data.title || fallbackTitle),
    slug: String(parsed.data.slug || fallbackTitle),
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : String(parsed.data.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
    body: parsed.body,
  };
}

function parseFrontmatter(text: string): { data: Record<string, any>; body: string } {
  if (!text.startsWith("---")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const data: Record<string, any> = {};
  for (const line of raw.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body };
}

function renderMarkdown(markdown: string): string {
  const escaped = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${inline(block.slice(2))}</h1>`;
      if (block.startsWith("&gt; ")) return `<blockquote>${inline(block.replace(/^&gt; /gm, ""))}</blockquote>`;
      if (block.startsWith("- ")) return `<ul>${block.split(/\n/).map((line) => `<li>${inline(line.replace(/^- /, ""))}</li>`).join("")}</ul>`;
      return `<p>${inline(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function previewDocument(post: PostItem, html: string, site: SiteConfig | null): string {
  const theme = site?.theme;
  const colors = theme?.colors;
  const fonts = theme?.fonts;
  const typography = theme?.typography;
  const bg = colors?.bg || "#f4f1ea";
  const surface = colors?.surface || "#ece8df";
  const ink = colors?.ink || "#1a1814";
  const muted = colors?.muted || "#6f6a60";
  const accent = colors?.accent || "#b4502e";
  const line = colors?.line || "#d9d3c7";
  const headingFont = fonts?.heading || `"Newsreader", Georgia, serif`;
  const bodyFont = fonts?.body || `"Inter", system-ui, sans-serif`;
  const baseSize = typography?.baseSize || 18;
  const measure = typography?.measure || 38;
  const radius = typography?.radius || 2;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(post.title || "预览")}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:${bg};--surface:${surface};--ink:${ink};--muted:${muted};--accent:${accent};--line:${line};--heading:${headingFont};--body:${bodyFont};--radius:${radius}px}
    html{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:${baseSize}px;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    body{margin:0;background:var(--bg);color:var(--ink)}
    article{max-width:${measure}rem;margin:0 auto;padding:72px 24px}
    h1,h2,h3{font-family:var(--heading);font-weight:400;color:var(--ink);letter-spacing:0}
    h1{font-size:clamp(2.2rem,6vw,3.2rem);line-height:1.04;margin:0 0 16px}
    .meta{color:var(--muted);font:14px/1.5 var(--body);margin-bottom:56px}
    .prose{line-height:1.7}.prose p,.prose ul,.prose blockquote{margin:1.4em 0}.prose h2{font-size:1.6rem;margin:2.2em 0 .6em}.prose h3{font-size:1.25rem;margin:1.8em 0 .5em}
    .prose blockquote{border-left:2px solid var(--accent);padding-left:1.2rem;color:var(--muted);font-style:italic}
    .prose code{background:var(--surface);padding:.1em .35em;border-radius:var(--radius)}.prose a{color:inherit;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--accent)}
    .prose pre{background:var(--ink);color:var(--bg);padding:1.2rem;border-radius:var(--radius);overflow:auto}
  </style>
</head>
<body>
  <article>
    <h1>${escapeHtml(post.title || "未命名")}</h1>
    <div class="meta">${escapeHtml(post.date || "")} / ${escapeHtml(post.category || "未分类")}</div>
    <div class="prose">${html}</div>
  </article>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
