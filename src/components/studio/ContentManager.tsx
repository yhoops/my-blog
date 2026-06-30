import { useEffect, useMemo, useState } from "react";
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
  body: "",
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
  const [editing, setEditing] = useState<(PostItem & { body: string }) | null>(null);
  const [status, setStatus] = useState("");

  const content = useMemo(() => normalizeContent(config?.content), [config]);

  async function load() {
    setLoading(true);
    const [postRes, configRes] = await Promise.all([fetch("/api/posts"), fetch("/api/config")]);
    const postData = (await postRes.json()) as { ok: boolean; posts?: PostItem[] };
    const configData = (await configRes.json()) as { ok: boolean; config?: SiteConfig };
    if (postData.ok && postData.posts) {
      setPosts(postData.posts.sort((a, b) => (b.date || "").localeCompare(a.date || "")));
    }
    if (configData.ok && configData.config) setConfig(configData.config);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveContent(next: ContentConfig) {
    if (!config) return;
    setStatus("");
    const nextConfig = { ...config, content: next };
    setConfig(nextConfig);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: nextConfig }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setStatus(data.ok ? "分类与导航配置已保存" : data.error || "保存配置失败");
  }

  async function del(slug: string) {
    if (!confirm(`确定删除《${slug}》？此操作会从 GitHub 移除该文件。`)) return;
    const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) load();
    else alert(data.error || "删除失败");
  }

  const writing = posts.filter((p) => p.kind !== "project");
  const projects = posts.filter((p) => p.kind === "project");

  return (
    <>
      <div className="toolbar" style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setEditing({ ...EMPTY })}>
          + 新建文章
        </button>
        <button className="btn" onClick={load}>
          刷新
        </button>
        {status && <span className="hint">{status}</span>}
      </div>

      {loading ? (
        <p className="hint">正在加载...</p>
      ) : (
        <>
          <TaxonomyEditor content={content} onSave={saveContent} />
          <ImportPanel content={content} onImported={load} />
          <Section
            title="随笔"
            items={writing}
            onEdit={(p) => setEditing(toEditablePost(p))}
            onDelete={del}
          />
          <Section
            title="作品"
            items={projects}
            onEdit={(p) => setEditing(toEditablePost(p))}
            onDelete={del}
          />
          {posts.length === 0 && <p className="hint">还没有内容，点击“新建文章”开始。</p>}
        </>
      )}

      {editing && (
        <PostEditor
          post={editing}
          githubConfigured={githubConfigured}
          content={content}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </>
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

function Section({
  title,
  items,
  onEdit,
  onDelete,
}: {
  title: string;
  items: PostItem[];
  onEdit: (p: PostItem) => void;
  onDelete: (slug: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="panel">
      <h3>{title}</h3>
      {items.map((p) => (
        <div className="post-row" key={p.slug}>
          <div>
            <div>
              {p.title}
              {p.draft && <span className="tag">草稿</span>}
            </div>
            <div className="meta">
              {p.date} / {p.slug}
              {p.category ? ` / ${p.category}` : ""}
              {p.folder ? ` / ${p.folder}` : ""}
            </div>
          </div>
          <div className="toolbar">
            <button className="btn" onClick={() => onEdit(p)}>
              编辑
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(p.slug)}>
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TaxonomyEditor({
  content,
  onSave,
}: {
  content: ContentConfig;
  onSave: (content: ContentConfig) => void;
}) {
  const [draft, setDraft] = useState(content);
  useEffect(() => setDraft(content), [content]);

  function setFolder(i: number, patch: Partial<ContentFolder>) {
    setDraft((d) => ({
      ...d,
      folders: d.folders.map((folder, idx) => (idx === i ? { ...folder, ...patch } : folder)),
    }));
  }

  return (
    <div className="panel">
      <h3>分类、文件夹与悬浮导航</h3>
      <div className="grid-2">
        <div className="field">
          <label>随笔分类（每行一个）</label>
          <textarea
            className="textarea textarea-compact"
            value={draft.categories.join("\n")}
            onChange={(e) =>
              setDraft({ ...draft, categories: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
            }
          />
        </div>
        <div className="field">
          <label>悬浮模块标题</label>
          <input
            className="input"
            value={draft.floatingNav.title}
            onChange={(e) => setDraft({ ...draft, floatingNav: { ...draft.floatingNav, title: e.target.value } })}
          />
          <label style={{ marginTop: "0.75rem" }}>搜索占位文案</label>
          <input
            className="input"
            value={draft.floatingNav.searchPlaceholder}
            onChange={(e) =>
              setDraft({ ...draft, floatingNav: { ...draft.floatingNav, searchPlaceholder: e.target.value } })
            }
          />
          <div className="grid-2" style={{ marginTop: "0.75rem" }}>
            <input
              className="input"
              value={draft.floatingNav.writingLabel}
              onChange={(e) =>
                setDraft({ ...draft, floatingNav: { ...draft.floatingNav, writingLabel: e.target.value } })
              }
            />
            <input
              className="input"
              value={draft.floatingNav.workLabel}
              onChange={(e) =>
                setDraft({ ...draft, floatingNav: { ...draft.floatingNav, workLabel: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      <div className="folder-list">
        <div className="row">
          <span className="label">文件夹层级</span>
          <button
            className="btn"
            onClick={() =>
              setDraft({
                ...draft,
                folders: [
                  ...draft.folders,
                  { id: `folder-${Date.now()}`, name: "新文件夹", parentId: "", description: "" },
                ],
              })
            }
          >
            + 添加文件夹
          </button>
        </div>
        {draft.folders.map((folder, i) => (
          <div className="folder-row" key={folder.id}>
            <input className="input" value={folder.name} onChange={(e) => setFolder(i, { name: e.target.value })} />
            <select className="select" value={folder.parentId || ""} onChange={(e) => setFolder(i, { parentId: e.target.value })}>
              <option value="">顶层</option>
              {draft.folders
                .filter((candidate) => candidate.id !== folder.id)
                .map((candidate) => (
                  <option value={candidate.id} key={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
            </select>
            <input
              className="input"
              placeholder="描述"
              value={folder.description || ""}
              onChange={(e) => setFolder(i, { description: e.target.value })}
            />
            <button
              className="btn btn-danger"
              onClick={() => setDraft({ ...draft, folders: draft.folders.filter((_, idx) => idx !== i) })}
            >
              删除
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ width: "auto", marginTop: "0.75rem" }} onClick={() => onSave(draft)}>
        保存分类与导航配置
      </button>
    </div>
  );
}

function ImportPanel({ content, onImported }: { content: ContentConfig; onImported: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [kind, setKind] = useState<"writing" | "project">("writing");
  const [category, setCategory] = useState("");
  const [folder, setFolder] = useState("");
  const [status, setStatus] = useState("");

  async function importFiles() {
    if (!files.length) return;
    setStatus("正在解析 Markdown...");
    const posts = await Promise.all(files.map((file) => parseMarkdownFile(file, { kind, category, folder })));
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts }),
    });
    const data = (await res.json()) as { ok: boolean; failed?: number; error?: string };
    setStatus(data.ok ? `已导入 ${posts.length} 篇` : data.error || `导入完成，失败 ${data.failed ?? 0} 篇`);
    setFiles([]);
    onImported();
  }

  return (
    <div className="panel">
      <h3>导入 Markdown</h3>
      <div className="grid-2">
        <div className="field">
          <label>选择一个或多个 .md 文件</label>
          <input
            className="input"
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </div>
        <MetaSelectors
          kind={kind}
          category={category}
          folder={folder}
          content={content}
          onKind={setKind}
          onCategory={setCategory}
          onFolder={setFolder}
        />
      </div>
      <div className="toolbar">
        <button className="btn btn-primary" style={{ width: "auto" }} onClick={importFiles} disabled={!files.length}>
          批量导入
        </button>
        <span className="hint">{files.length ? `已选择 ${files.length} 个文件` : "会读取 frontmatter；缺失字段使用这里的默认值。"}</span>
        {status && <span className="hint">{status}</span>}
      </div>
    </div>
  );
}

function PostEditor({
  post,
  githubConfigured,
  content,
  onClose,
  onSaved,
}: {
  post: PostItem & { body: string };
  githubConfigured: boolean;
  content: ContentConfig;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(post);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"visual" | "markdown" | "preview">("visual");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function insertMarkdown(before: string, after = "", fallback = "") {
    const textarea = document.getElementById("post-body") as HTMLTextAreaElement | null;
    const start = textarea?.selectionStart ?? form.body.length;
    const end = textarea?.selectionEnd ?? form.body.length;
    const selected = form.body.slice(start, end) || fallback;
    const next = `${form.body.slice(0, start)}${before}${selected}${after}${form.body.slice(end)}`;
    set("body", next);
  }

  async function save() {
    if (!form.title.trim()) {
      setError("标题不能为空");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags:
          typeof (form.tags as any) === "string"
            ? (form.tags as any).split(",").map((s: string) => s.trim()).filter(Boolean)
            : form.tags,
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setSaving(false);
    if (data.ok) onSaved();
    else setError(data.error || "保存失败");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>{post.slug ? "编辑文章" : "新建文章"}</h3>

        {!githubConfigured && <div className="banner warn">未配置 GitHub，保存将失败。请先设置环境变量。</div>}

        <div className="grid-2">
          <div className="field">
            <label>标题</label>
            <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="field">
            <label>文件名 slug（留空自动生成）</label>
            <input className="input" value={form.slug} placeholder="my-post" onChange={(e) => set("slug", e.target.value)} />
          </div>
        </div>

        <div className="grid-2">
          <MetaSelectors
            kind={form.kind || "writing"}
            category={form.category || ""}
            folder={form.folder || ""}
            content={content}
            onKind={(value) => set("kind", value)}
            onCategory={(value) => set("category", value)}
            onFolder={(value) => set("folder", value)}
          />
          <div className="field">
            <label>日期</label>
            <input className="input" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>摘要</label>
          <input className="input" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>标签（逗号分隔）</label>
            <input
              className="input"
              value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags as any)}
              onChange={(e) => set("tags", e.target.value as any)}
            />
          </div>
          <div className="field">
            <label>封面图 URL（可选）</label>
            <input className="input" value={form.cover || ""} onChange={(e) => set("cover", e.target.value)} />
          </div>
        </div>

        {form.kind === "project" && (
          <div className="grid-2">
            <div className="field">
              <label>年份</label>
              <input className="input" value={form.year || ""} onChange={(e) => set("year", e.target.value)} />
            </div>
            <div className="field">
              <label>角色 / 外链 URL</label>
              <input className="input" value={form.url || ""} onChange={(e) => set("url", e.target.value)} />
            </div>
          </div>
        )}

        <div className="editor-tabs">
          <button className={`btn ${mode === "visual" ? "active" : ""}`} onClick={() => setMode("visual")}>
            可视化
          </button>
          <button className={`btn ${mode === "markdown" ? "active" : ""}`} onClick={() => setMode("markdown")}>
            Markdown
          </button>
          <button className={`btn ${mode === "preview" ? "active" : ""}`} onClick={() => setMode("preview")}>
            预览
          </button>
        </div>

        {mode !== "preview" && (
          <div className="editor-tools">
            <button className="btn" onClick={() => insertMarkdown("## ", "", "小标题")}>
              H2
            </button>
            <button className="btn" onClick={() => insertMarkdown("**", "**", "加粗文本")}>
              B
            </button>
            <button className="btn" onClick={() => insertMarkdown("> ", "", "引用")}>
              引用
            </button>
            <button className="btn" onClick={() => insertMarkdown("- ", "", "列表项")}>
              列表
            </button>
            <button className="btn" onClick={() => insertMarkdown("[", "](https://)", "链接")}>
              链接
            </button>
          </div>
        )}

        {mode === "preview" ? (
          <div className="wysiwyg-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(form.body) }} />
        ) : (
          <textarea
            id="post-body"
            className={`textarea ${mode === "visual" ? "textarea-visual" : ""}`}
            value={form.body}
            placeholder="# 标题&#10;&#10;在这里写作..."
            onChange={(e) => set("body", e.target.value)}
          />
        )}

        <div className="row">
          <span className="label">设为草稿（不公开显示）</span>
          <button className={`toggle ${form.draft ? "on" : ""}`} onClick={() => set("draft", !form.draft)} aria-label="草稿开关" />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            取消
          </button>
          <button className="btn btn-primary" style={{ width: "auto" }} onClick={save} disabled={saving}>
            {saving ? <span className="spin" /> : "保存并提交"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaSelectors({
  kind,
  category,
  folder,
  content,
  onKind,
  onCategory,
  onFolder,
}: {
  kind: "writing" | "project";
  category: string;
  folder: string;
  content: ContentConfig;
  onKind: (value: "writing" | "project") => void;
  onCategory: (value: string) => void;
  onFolder: (value: string) => void;
}) {
  return (
    <div className="grid-2">
      <div className="field">
        <label>类型</label>
        <select className="select" value={kind} onChange={(e) => onKind(e.target.value as "writing" | "project")}>
          <option value="writing">随笔</option>
          <option value="project">作品</option>
        </select>
      </div>
      <div className="field">
        <label>分类</label>
        <input className="input" list="post-categories" value={category} onChange={(e) => onCategory(e.target.value)} />
        <datalist id="post-categories">
          {content.categories.map((cat) => (
            <option value={cat} key={cat} />
          ))}
        </datalist>
      </div>
      <div className="field" style={{ gridColumn: "1 / -1" }}>
        <label>文件夹</label>
        <select className="select" value={folder} onChange={(e) => onFolder(e.target.value)}>
          <option value="">不放入文件夹</option>
          {folderOptions(content.folders).map((option) => (
            <option value={option.path} key={option.path}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function folderOptions(folders: ContentFolder[]) {
  const byParent = new Map<string, ContentFolder[]>();
  for (const folder of folders) {
    const parent = folder.parentId || "";
    byParent.set(parent, [...(byParent.get(parent) ?? []), folder]);
  }
  const out: { label: string; path: string }[] = [];
  function walk(parentId: string, prefix: string, depth: number) {
    for (const folder of byParent.get(parentId) ?? []) {
      const path = [prefix, folder.name].filter(Boolean).join("/");
      out.push({ label: `${"  ".repeat(depth)}${folder.name}`, path });
      walk(folder.id, path, depth + 1);
    }
  }
  walk("", "", 0);
  return out;
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
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${inline(block.slice(2))}</h1>`;
      if (block.startsWith("&gt; ")) return `<blockquote>${inline(block.replace(/^&gt; /gm, ""))}</blockquote>`;
      if (block.startsWith("- ")) {
        const items = block.split(/\n/).map((line) => `<li>${inline(line.replace(/^- /, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${inline(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}
