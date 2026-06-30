import { useEffect, useState } from "react";

interface PostItem {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  kind?: "writing" | "project";
  tags?: string[];
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
  draft: false,
  body: "",
};

export default function ContentManager({ githubConfigured }: { githubConfigured: boolean }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(PostItem & { body: string }) | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = (await res.json()) as { ok: boolean; posts?: PostItem[] };
    if (data.ok && data.posts) {
      setPosts(
        data.posts.sort((a, b) => (b.date || "").localeCompare(a.date || "")),
      );
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

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
      <div className="toolbar" style={{ marginBottom: "1.25rem" }}>
        <button
          className="btn btn-primary"
          style={{ width: "auto" }}
          onClick={() => setEditing({ ...EMPTY })}
        >
          + 新建文章
        </button>
        <button className="btn" onClick={load}>
          刷新
        </button>
      </div>

      {loading ? (
        <p className="hint">正在加载…</p>
      ) : (
        <>
          <Section
            title="随笔"
            items={writing}
            onEdit={(p) => setEditing({ ...EMPTY, ...p, body: p.body || "" })}
            onDelete={del}
          />
          <Section
            title="作品"
            items={projects}
            onEdit={(p) => setEditing({ ...EMPTY, ...p, body: p.body || "" })}
            onDelete={del}
          />
          {posts.length === 0 && <p className="hint">还没有内容，点击「新建文章」开始。</p>}
        </>
      )}

      {editing && (
        <PostEditor
          post={editing}
          githubConfigured={githubConfigured}
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
              {p.date} · {p.slug}
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

function PostEditor({
  post,
  githubConfigured,
  onClose,
  onSaved,
}: {
  post: PostItem & { body: string };
  githubConfigured: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(post);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
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
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{post.slug ? "编辑文章" : "新建文章"}</h3>

        {!githubConfigured && (
          <div className="banner warn">未配置 GitHub，保存将失败。请先设置环境变量。</div>
        )}

        <div className="grid-2">
          <div className="field">
            <label>标题</label>
            <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="field">
            <label>文件名 slug（留空自动生成）</label>
            <input
              className="input"
              value={form.slug}
              placeholder="my-post"
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label>类型</label>
            <select
              className="select"
              value={form.kind}
              onChange={(e) => set("kind", e.target.value as "writing" | "project")}
            >
              <option value="writing">随笔</option>
              <option value="project">作品</option>
            </select>
          </div>
          <div className="field">
            <label>日期</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>摘要</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
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

        <div className="field">
          <label>正文（Markdown）</label>
          <textarea
            className="textarea"
            value={form.body}
            placeholder="# 标题&#10;&#10;在这里用 Markdown 写作…"
            onChange={(e) => set("body", e.target.value)}
          />
        </div>

        <div className="row">
          <span className="label">设为草稿（不公开显示）</span>
          <button
            className={`toggle ${form.draft ? "on" : ""}`}
            onClick={() => set("draft", !form.draft)}
            aria-label="草稿开关"
          />
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
