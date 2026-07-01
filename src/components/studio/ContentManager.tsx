import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentConfig, ContentFolder, SiteConfig } from "../../lib/config-types";
import { StudioConfirmDialog, StudioPromptDialog } from "./StudioDialog";

interface PostItem {
  slug: string;
  canonicalSlug?: string;
  aliases?: string[];
  sourceId?: string;
  fileSlug?: string;
  library?: "writing" | "work";
  title: string;
  description?: string;
  summary?: string;
  highlights?: string[];
  projectHighlights?: string[];
  contextNote?: string;
  date?: string;
  kind?: "writing" | "project";
  tags?: string[] | string;
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

interface MigrationException {
  sourceId: string;
  reason: string;
  library: "writing" | "work";
  folder: string;
  title: string;
  repairable: boolean;
  conflictWith?: {
    sourceId: string;
    folder: string;
    title: string;
  };
}

type LibraryKey = "writing" | "work";

const EMPTY: PostItem & { body: string } = {
  slug: "",
  canonicalSlug: "",
  aliases: [],
  sourceId: "",
  fileSlug: "",
  library: "writing",
  title: "",
  description: "",
  summary: "",
  highlights: [],
  projectHighlights: [],
  contextNote: "",
  date: new Date().toISOString().slice(0, 10),
  kind: "writing",
  tags: [],
  category: "",
  folder: "",
  cover: "",
  year: "",
  role: "",
  url: "",
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
  const MIGRATION_NOTICE_KEY = "atelier-library-migration-notice-v1";
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostItem & { body: string }>({ ...EMPTY });
  const [selectedFolder, setSelectedFolder] = useState("");
  const [activeLibrary, setActiveLibrary] = useState<LibraryKey>("writing");
  const [pendingLibrary, setPendingLibrary] = useState<LibraryKey | null>(null);
  const [showMigrationNotice, setShowMigrationNotice] = useState(false);
  const [status, setStatus] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [folderPromptOpen, setFolderPromptOpen] = useState(false);
  const [folderDraft, setFolderDraft] = useState("");
  const [deleteTarget, setDeleteTarget] = useState("");
  const [exceptions, setExceptions] = useState<MigrationException[]>([]);
  const [slugConflict, setSlugConflict] = useState("");
  const [repairingSourceId, setRepairingSourceId] = useState("");
  const importRef = useRef<HTMLInputElement | null>(null);

  const content = useMemo(() => normalizeContent(config?.content), [config]);
  const libraryPosts = useMemo(
    () => posts.filter((post) => resolveLibrary(post) === activeLibrary),
    [posts, activeLibrary],
  );
  const folderTree = useMemo(
    () => buildFolderTree(libraryPosts, content.folders.filter((folder) => (folder.library || "writing") === activeLibrary)),
    [libraryPosts, content.folders, activeLibrary],
  );
  const libraryCounts = useMemo(
    () => ({
      writing: posts.filter((post) => resolveLibrary(post) === "writing").length,
      work: posts.filter((post) => resolveLibrary(post) === "work").length,
    }),
    [posts],
  );
  const previewHtml = useMemo(() => previewDocument(editing, renderMarkdown(editing.body), config), [editing, config]);

  async function load() {
    setLoading(true);
    const [postRes, configRes] = await Promise.all([fetch("/api/posts"), fetch("/api/config")]);
    const postData = (await postRes.json()) as { ok: boolean; posts?: PostItem[]; exceptions?: MigrationException[] };
    const configData = (await configRes.json()) as { ok: boolean; config?: SiteConfig };
    if (postData.ok && postData.posts) {
      const next = postData.posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setPosts(next);
      setExceptions(postData.exceptions ?? []);
      if (!editing.title && next[0]) selectPost(next[0]);
    }
    if (configData.ok && configData.config) setConfig(configData.config);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(MIGRATION_NOTICE_KEY);
    if (!seen) setShowMigrationNotice(true);
  }, []);

  function selectPost(post: PostItem) {
    const editable = toEditablePost(post);
    setEditing(editable);
    setActiveLibrary(resolveLibrary(editable));
    setSelectedFolder(editable.folder || "");
    setPreviewing(false);
    setStatus("");
    setSlugConflict("");
  }

  function newPost(kind: "writing" | "project" = activeLibrary === "work" ? "project" : "writing") {
    const library = kind === "project" ? "work" : "writing";
    setEditing({
      ...EMPTY,
      kind,
      library,
      folder: selectedFolder,
    });
    setPreviewing(false);
    setStatus("");
    setSlugConflict("");
  }

  function set<K extends keyof typeof editing>(key: K, value: (typeof editing)[K]) {
    setEditing((form) => ({ ...form, [key]: value }));
  }

  async function save(): Promise<boolean> {
    if (!editing.title.trim()) {
      setStatus("标题不能为空");
      return false;
    }
    setStatus("正在保存...");
    setSlugConflict("");
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        canonicalSlug: editing.canonicalSlug || editing.slug,
        sourceId: editing.sourceId,
        library: activeLibrary,
        folder: selectedFolder,
        tags: normalizeTags(editing.tags),
        highlights: normalizeLines(editing.highlights),
        projectHighlights: normalizeLines(editing.projectHighlights),
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) {
      setStatus("已保存并提交到 GitHub");
      await load();
      return true;
    }
    if (res.status === 409) {
      setSlugConflict("当前内容库中已存在相同的 slug，请换一个公开 slug。");
    }
    setStatus(data.error || "保存失败");
    return false;
  }

  async function saveAndSwitchLibrary(nextLibrary: LibraryKey) {
    const ok = await save();
    if (!ok) return;
    setPendingLibrary(null);
    applyLibrarySwitch(nextLibrary);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/posts?slug=${encodeURIComponent(deleteTarget)}`, { method: "DELETE" });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) {
      setEditing({
        ...EMPTY,
        folder: selectedFolder,
        library: activeLibrary,
        kind: activeLibrary === "work" ? "project" : "writing",
      });
      setPreviewing(false);
      setDeleteTarget("");
      setStatus("已删除当前内容");
      await load();
      return;
    }
    setDeleteTarget("");
    setStatus(data.error || "删除失败");
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

  async function createFolder() {
    const name = folderDraft.trim();
    if (!name) return;
    const parentId = folderIdByPath(content.folders.filter((folder) => (folder.library || "writing") === activeLibrary), selectedFolder);
    await saveFolders([
      ...content.folders,
      { id: `folder-${Date.now()}`, name, library: activeLibrary, parentId, description: "" },
    ]);
    setFolderPromptOpen(false);
    setFolderDraft("");
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
      selected.map((file) =>
        parseMarkdownFile(file, {
          kind: activeLibrary === "work" ? "project" : "writing",
          category: editing.category,
          folder: selectedFolder,
        }),
      ),
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

  const visiblePosts = selectedFolder
    ? libraryPosts.filter((post) => postFolder(post) === selectedFolder)
    : libraryPosts.filter((post) => !postFolder(post));

  const currentDeleteSlug = editing.slug ? (editing.folder ? `${editing.folder}/${editing.slug}` : editing.slug) : "";

  function isDirty() {
    return Boolean(
      editing.title ||
        (editing.body || "").trim() !== "#" ||
        editing.description ||
        editing.summary ||
        editing.contextNote ||
        normalizeTags(editing.tags).length > 0,
    );
  }

  function requestLibrarySwitch(nextLibrary: LibraryKey) {
    if (nextLibrary === activeLibrary) return;
    if (isDirty()) {
      setPendingLibrary(nextLibrary);
      return;
    }
    applyLibrarySwitch(nextLibrary);
  }

  function applyLibrarySwitch(nextLibrary: LibraryKey) {
    setActiveLibrary(nextLibrary);
    setSelectedFolder("");
    setPreviewing(false);
    setEditing({
      ...EMPTY,
      kind: nextLibrary === "work" ? "project" : "writing",
      library: nextLibrary,
      folder: "",
    });
    setPendingLibrary(null);
  }

  function locateException(target: MigrationException) {
    const match = posts.find((post) => post.sourceId === target.sourceId);
    setActiveLibrary(target.library);
    setSelectedFolder(target.folder || "");
    setPreviewing(false);
    setPendingLibrary(null);
    setSlugConflict("");
    if (match) {
      selectPost(match);
      return;
    }
    setEditing({
      ...EMPTY,
      library: target.library,
      kind: target.library === "work" ? "project" : "writing",
      folder: target.folder || "",
      title: target.title || "",
      sourceId: target.sourceId,
    });
    setStatus(`已定位到异常记录：${target.sourceId}`);
  }

  async function repairException(target: MigrationException) {
    if (!target.repairable) return;
    setRepairingSourceId(target.sourceId);
    setStatus("正在修复异常记录...");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "repair", sourceId: target.sourceId }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; canonicalSlug?: string };
    if (data.ok) {
      setStatus(`已修复 ${target.sourceId}${data.canonicalSlug ? ` -> ${data.canonicalSlug}` : ""}`);
      await load();
      return;
    }
    setStatus(data.error || "修复失败");
    setRepairingSourceId("");
  }

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
            <div className="eyebrow">内容库</div>
            <strong>{activeLibrary === "writing" ? "随笔" : "作品"}</strong>
            <div className="explorer-subcopy">按内容类型独立存放与浏览</div>
          </div>
          <button
            className="icon-mini"
            onClick={() => {
              setFolderDraft("");
              setFolderPromptOpen(true);
            }}
            aria-label="添加文件夹"
          >
            +
          </button>
        </div>

        <div className="library-switcher">
          <button
            className={`library-pill ${activeLibrary === "writing" ? "active" : ""}`}
            onClick={() => requestLibrarySwitch("writing")}
          >
            <span>随笔</span>
            <small>{libraryCounts.writing}</small>
          </button>
          <button
            className={`library-pill ${activeLibrary === "work" ? "active" : ""}`}
            onClick={() => requestLibrarySwitch("work")}
          >
            <span>作品</span>
            <small>{libraryCounts.work}</small>
          </button>
        </div>

        <FolderTree
          node={folderTree}
          rootLabel={activeLibrary === "writing" ? "全部随笔" : "全部作品"}
          emptyLabel={activeLibrary === "writing" ? "当前随笔库还没有内容。" : "当前作品库还没有内容。"}
          selected={selectedFolder}
          onSelect={(path) => {
            setSelectedFolder(path);
            set("folder", path);
          }}
          onPost={selectPost}
        />
      </aside>

      <main className="editor-canvas">
        {!previewing && (
          <>
            {showMigrationNotice && (
              <div className="banner ok">
                内容已整理为“随笔 / 作品”两个内容库，公开地址已从文件路径中解耦。旧层级地址仍会保留跳转。
              </div>
            )}

            {exceptions.length > 0 && (
              <div className="banner warn">
                发现 {exceptions.length} 条需要人工处理的内容记录，系统未自动迁移这些异常项。
              </div>
            )}

            {slugConflict && <div className="banner warn">{slugConflict}</div>}

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
                <button className="btn" onClick={() => setPreviewing(true)}>
                  预览
                </button>
              </div>
              <div className="toolbar">
                {status && <span className="hint">{status}</span>}
                <button className="btn btn-primary" style={{ width: "auto" }} onClick={save}>
                  保存并发布
                </button>
              </div>
            </div>

            {!githubConfigured && (
              <div className="banner warn">
                尚未配置 GitHub，保存时无法提交到仓库。预览和编辑仍然可用。
              </div>
            )}

            <section className="editor-workspace">
              <div className="editor-meta-strip">
                <div className="meta-field">
                  <label>内容类型</label>
                  <select
                    className="ghost-input"
                    value={editing.kind}
                    onChange={(e) => {
                      const kind = e.target.value as "writing" | "project";
                      set("kind", kind);
                      set("library", kind === "project" ? "work" : "writing");
                    }}
                  >
                    <option value="writing">随笔</option>
                    <option value="project">作品</option>
                  </select>
                </div>

                <div className="meta-field">
                  <label>分类</label>
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
                </div>

                <div className="meta-field">
                  <label>发布日期</label>
                  <input className="ghost-input" type="date" value={editing.date} onChange={(e) => set("date", e.target.value)} />
                </div>

                <label className="meta-toggle-card">
                  <span>草稿状态</span>
                  <span className="check-row">
                    <input type="checkbox" checked={Boolean(editing.draft)} onChange={(e) => set("draft", e.target.checked)} />
                    仅后台可见
                  </span>
                </label>

                <div className="meta-field meta-field--path">
                  <label>保存位置</label>
                  <div className="selected-path">{selectedFolder || "内容库根目录"}</div>
                </div>
              </div>

              <section className="editor-main-card editor-main-surface">
                <div className="title-grid">
                  <input
                    className="ghost-input title-input"
                    value={editing.title}
                    placeholder="标题"
                    onChange={(e) => set("title", e.target.value)}
                  />
                  <input
                    className="ghost-input slug-input"
                    value={editing.canonicalSlug || editing.slug}
                    placeholder="公开 slug"
                    onChange={(e) => {
                      set("slug", e.target.value);
                      set("canonicalSlug", e.target.value);
                    }}
                  />
                </div>
                <textarea
                  className="article-textarea article-textarea--workbench"
                  value={editing.body}
                  placeholder={"# \n\n从这里开始写作..."}
                  onChange={(e) => set("body", e.target.value)}
                />
              </section>

              <div className="editor-support-grid">
                <details className="editor-fold" open>
                  <summary>基础信息</summary>
                  <div className="editor-fields editor-fields--two">
                    <div className="field">
                      <label>文章摘要</label>
                      <textarea
                        className="ghost-input meta-summary"
                        value={editing.description}
                        placeholder="用于开放页描述与列表摘要"
                        onChange={(e) => set("description", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>封面图</label>
                      <input
                        className="ghost-input"
                        value={editing.cover || ""}
                        placeholder="https://..."
                        onChange={(e) => set("cover", e.target.value)}
                      />
                    </div>
                    <div className="field editor-fields-span-2">
                      <label>标签</label>
                      <input
                        className="ghost-input"
                        value={normalizeTags(editing.tags).join(", ")}
                        placeholder="使用逗号分隔，例如：写作, 设计"
                        onChange={(e) => set("tags", e.target.value)}
                      />
                    </div>
                  </div>
                </details>

                <details className="editor-fold" open>
                  <summary>阅读前预览</summary>
                  <div className="editor-fields">
                    <div className="field">
                      <label>右侧预览摘要</label>
                      <textarea
                        className="ghost-input meta-summary"
                        value={editing.summary || ""}
                        placeholder="留空时会优先使用文章摘要，再回退到正文首段"
                        onChange={(e) => set("summary", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>{editing.kind === "project" ? "项目亮点" : "作者高亮"}</label>
                      <textarea
                        className="ghost-input meta-summary"
                        value={(editing.kind === "project" ? editing.projectHighlights : editing.highlights)?.join("\n") || ""}
                        placeholder="每行一条，最多 3 条"
                        onChange={(e) =>
                          editing.kind === "project"
                            ? set("projectHighlights", splitLines(e.target.value))
                            : set("highlights", splitLines(e.target.value))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>语境备注</label>
                      <textarea
                        className="ghost-input meta-summary"
                        value={editing.contextNote || ""}
                        placeholder="补充这篇内容的背景、约束或写作缘由"
                        onChange={(e) => set("contextNote", e.target.value)}
                      />
                    </div>
                  </div>
                </details>

                {editing.kind === "project" && (
                  <details className="editor-fold" open>
                    <summary>作品信息</summary>
                    <div className="editor-fields editor-fields--three">
                      <div className="field">
                        <label>年份</label>
                        <input className="ghost-input" value={editing.year || ""} placeholder="2026" onChange={(e) => set("year", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>角色</label>
                        <input className="ghost-input" value={editing.role || ""} placeholder="设计 / 开发 / 写作" onChange={(e) => set("role", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>项目链接</label>
                        <input className="ghost-input" value={editing.url || ""} placeholder="https://..." onChange={(e) => set("url", e.target.value)} />
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </section>

            <section className="panel compact-panel">
              <div className="panel-headline">
                <h3>当前目录内容</h3>
                {currentDeleteSlug && (
                  <button className="btn btn-danger" onClick={() => setDeleteTarget(currentDeleteSlug)}>
                    删除当前文章
                  </button>
                )}
              </div>
              {visiblePosts.length === 0 ? (
                <p className="hint">{activeLibrary === "writing" ? "当前目录还没有随笔。" : "当前目录还没有作品。"}</p>
              ) : (
                visiblePosts.map((post) => (
                  <button className="file-row" key={post.slug} onClick={() => selectPost(post)}>
                    <span>{post.kind === "project" ? "◻" : "•"}</span>
                    <strong>{post.title}</strong>
                    <small>{post.slug}</small>
                  </button>
                ))
              )}
            </section>

            {exceptions.length > 0 && (
              <section className="panel compact-panel">
                <div className="panel-headline">
                  <h3>迁移异常列表</h3>
                </div>
                <div className="exception-list">
                  {exceptions.map((item) => (
                    <div className="exception-row" key={`${item.sourceId}-${item.reason}`}>
                      <div className="exception-row-head">
                        <strong>{item.sourceId}</strong>
                        <div className="exception-row-actions">
                          {item.repairable && (
                            <button
                              className="btn btn-primary"
                              onClick={() => repairException(item)}
                              disabled={repairingSourceId === item.sourceId}
                            >
                              {repairingSourceId === item.sourceId ? "修复中" : "一键修复"}
                            </button>
                          )}
                          {item.conflictWith && (
                            <button
                              className="btn"
                              onClick={() =>
                                locateException({
                                  sourceId: item.conflictWith!.sourceId,
                                  reason: "Conflict counterpart",
                                  library: item.library,
                                  folder: item.conflictWith!.folder,
                                  title: item.conflictWith!.title,
                                  repairable: false,
                                })
                              }
                            >
                              定位冲突项
                            </button>
                          )}
                          <button className="btn" onClick={() => locateException(item)}>
                            定位
                          </button>
                        </div>
                      </div>
                      <span>{item.reason}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ContentSettingsInline content={content} onSave={saveContentSettings} />
          </>
        )}

        {previewing && (
          <section className="publish-preview-shell">
            <div className="publish-preview-topbar">
              <button className="btn" onClick={() => setPreviewing(false)}>
                返回编辑
              </button>
              <div className="publish-preview-title">{editing.title || "未命名内容"}</div>
              <div className="toolbar">
                {status && <span className="hint">{status}</span>}
                <button className="btn btn-primary" style={{ width: "auto" }} onClick={save}>
                  发布
                </button>
              </div>
            </div>
            <div className="publish-preview-frame">
              <iframe title="发布预览" srcDoc={previewHtml} />
            </div>
          </section>
        )}
      </main>

      <StudioPromptDialog
        open={folderPromptOpen}
        title="新建文件夹"
        label="文件夹名称"
        value={folderDraft}
        placeholder="例如：随笔 / 设计"
        confirmLabel="创建"
        cancelLabel="取消"
        onChange={setFolderDraft}
        onConfirm={createFolder}
        onCancel={() => {
          setFolderPromptOpen(false);
          setFolderDraft("");
        }}
      />

      <StudioConfirmDialog
        open={Boolean(deleteTarget)}
        title="删除内容"
        message={`将从仓库中移除「${deleteTarget}」，这个操作不能撤销。`}
        confirmLabel="确认删除"
        cancelLabel="取消"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget("")}
      />

      <StudioConfirmDialog
        open={Boolean(pendingLibrary)}
        title="切换内容库"
        message="当前内容还有未保存的修改。你可以先保存，再切换；或者放弃修改后切换。"
        confirmLabel="放弃并切换"
        cancelLabel="取消"
        neutralLabel="保存后切换"
        onConfirm={() => pendingLibrary && applyLibrarySwitch(pendingLibrary)}
        onNeutral={() => pendingLibrary && saveAndSwitchLibrary(pendingLibrary)}
        onCancel={() => setPendingLibrary(null)}
      />

      <StudioConfirmDialog
        open={showMigrationNotice}
        title="内容库迁移完成"
        message="现有内容已按“随笔 / 作品”分库存放，正式公开地址改为扁平 slug，旧层级地址会继续跳转到当前地址。"
        confirmLabel="知道了"
        cancelLabel="稍后再看"
        onConfirm={() => {
          setShowMigrationNotice(false);
          if (typeof window !== "undefined") window.localStorage.setItem(MIGRATION_NOTICE_KEY, "seen");
        }}
        onCancel={() => setShowMigrationNotice(false)}
      />
    </div>
  );
}

function resolveLibrary(post: Pick<PostItem, "library" | "kind">): LibraryKey {
  return (post.library || (post.kind === "project" ? "work" : "writing")) as LibraryKey;
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
  const parts = (post.sourceId || post.slug || "").split("/").filter(Boolean);
  return {
    ...EMPTY,
    ...post,
    slug: post.canonicalSlug || post.slug || parts.at(-1) || "",
    canonicalSlug: post.canonicalSlug || post.slug || parts.at(-1) || "",
    aliases: post.aliases || [],
    sourceId: post.sourceId || post.slug,
    fileSlug: post.fileSlug || parts.at(-1) || "",
    library: resolveLibrary(post),
    folder: post.folder || (parts[0] === "writing" || parts[0] === "work" ? parts.slice(1, -1).join("/") : parts.slice(0, -1).join("/")),
    tags: normalizeTags(post.tags),
    highlights: normalizeLines(post.highlights),
    projectHighlights: normalizeLines(post.projectHighlights),
    body: post.body || "",
  };
}

function normalizeTags(tags: PostItem["tags"]): string[] {
  if (Array.isArray(tags)) return tags;
  return String(tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeLines(value: string[] | undefined): string[] {
  return (value ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function postFolder(post: PostItem): string {
  if (post.folder) return post.folder;
  const source = post.sourceId || post.slug || "";
  const parts = source.split("/").filter(Boolean);
  if (parts[0] === "writing" || parts[0] === "work") return parts.slice(1, -1).join("/");
  return parts.slice(0, -1).join("/");
}

function buildFolderTree(posts: PostItem[], folders: ContentFolder[]): FolderNode {
  const root: FolderNode = { name: "root", path: "", children: [], posts: [] };
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
    const parts = postFolder(post).split("/").filter(Boolean);
    let prefix = "";
    for (const [index, part] of parts.entries()) {
      prefix = [prefix, part].filter(Boolean).join("/");
      if (!map.has(prefix)) map.set(prefix, { label: `${"  ".repeat(index)}${part}`, path: prefix });
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
  rootLabel,
  emptyLabel,
  selected,
  onSelect,
  onPost,
}: {
  node: FolderNode;
  rootLabel: string;
  emptyLabel: string;
  selected: string;
  onSelect: (path: string) => void;
  onPost: (post: PostItem) => void;
}) {
  const hasChildren = node.children.length > 0 || node.posts.length > 0;
  return (
    <div className="folder-tree">
      <button className={`folder-node explorer-root ${selected === "" ? "active" : ""}`} onClick={() => onSelect("")}>
        <span>▾</span>
        <strong>{rootLabel}</strong>
      </button>
      {hasChildren ? (
        <div className="folder-children folder-children-root">
          {node.children.map((child) => (
            <FolderBranch key={child.path} node={child} selected={selected} onSelect={onSelect} onPost={onPost} />
          ))}
          {node.posts.map((post) => (
            <button className="post-node" key={post.slug} onClick={() => onPost(post)}>
              <span>•</span>
              {post.title}
            </button>
          ))}
        </div>
      ) : (
        <p className="explorer-empty">{emptyLabel}</p>
      )}
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
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          {open ? "▾" : "▸"}
        </span>
        <strong>{node.name}</strong>
      </button>
      {open && (
        <div className="folder-children">
          {node.children.map((child) => (
            <FolderBranch key={child.path} node={child} selected={selected} onSelect={onSelect} onPost={onPost} />
          ))}
          {node.posts.map((post) => (
            <button className="post-node" key={post.slug} onClick={() => onPost(post)}>
              <span>{post.kind === "project" ? "◻" : "•"}</span>
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
            onChange={(e) =>
              setDraft({
                ...draft,
                categories: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
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
              setDraft({
                ...draft,
                floatingNav: { ...draft.floatingNav, searchPlaceholder: e.target.value },
              })
            }
          />
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
  const canonical = String(parsed.data.canonicalSlug || parsed.data.slug || fallbackTitle);
  return {
    ...EMPTY,
    ...defaults,
    ...parsed.data,
    title: String(parsed.data.title || fallbackTitle),
    slug: canonical,
    canonicalSlug: canonical,
    tags: Array.isArray(parsed.data.tags)
      ? parsed.data.tags
      : String(parsed.data.tags || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
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
      const trimmed = block.trim();
      if (trimmed.startsWith("### ")) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1>${inline(trimmed.slice(2))}</h1>`;
      if (trimmed.startsWith("&gt; ")) return `<blockquote>${inline(trimmed.replace(/^&gt; /gm, ""))}</blockquote>`;
      if (trimmed.startsWith("- ")) {
        return `<ul>${trimmed
          .split(/\n/)
          .map((line) => `<li>${inline(line.replace(/^- /, ""))}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${inline(trimmed).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
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
  const summary = escapeHtml((post.summary || post.description || firstParagraph(post.body || "") || "这是一篇尚在撰写中的内容。").trim());
  const outline = railOutline(extractMarkdownHeadings(post.body || ""));
  const highlights = normalizeLines(post.kind === "project" ? post.projectHighlights : post.highlights);
  const tags = normalizeTags(post.tags);
  const topLink = post.kind === "project" ? "作品" : "随笔";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(post.title || "预览")}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:${bg};--surface:${surface};--ink:${ink};--muted:${muted};--accent:${accent};--line:${line};--heading:${headingFont};--body:${bodyFont};--radius:${radius}px}
    *{box-sizing:border-box}
    html{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:${baseSize}px;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    body{margin:0;background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 56%, var(--bg) 44%),var(--bg) 24%,var(--bg));color:var(--ink)}
    .page{max-width:1360px;margin:0 auto;padding:40px 28px 72px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:56px;align-items:start}
    article{max-width:min(${measure}rem,100%);margin:0 auto}
    .crumb{display:inline-flex;align-items:center;gap:.5rem;color:var(--muted);font-size:.82rem;text-decoration:none}
    .cover{width:100%;border-radius:calc(var(--radius) + 8px);margin:0 0 2rem;border:1px solid color-mix(in srgb,var(--line) 80%, transparent);display:block;object-fit:cover;max-height:420px}
    h1,h2,h3{font-family:var(--heading);font-weight:400;color:var(--ink);letter-spacing:0}
    h1{font-size:clamp(2.4rem,6vw,4.1rem);line-height:1.02;margin:1.2rem 0 .9rem}
    .meta{display:flex;flex-wrap:wrap;gap:.75rem 1rem;color:var(--muted);font:14px/1.5 var(--body);margin-bottom:2.8rem}
    .meta span::before{content:"";display:inline-block;width:.34rem;height:.34rem;border-radius:50%;background:color-mix(in srgb,var(--accent) 62%, transparent);margin-right:.55rem;vertical-align:middle}
    .project-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;padding-top:1.15rem;border-top:1px solid var(--line);margin-bottom:2.8rem}
    .project-grid dt{font-size:.76rem;color:var(--muted);margin-bottom:.35rem}
    .project-grid dd{margin:0}
    .project-grid a{color:var(--accent);text-decoration:none}
    .prose{line-height:1.78}
    .prose p,.prose ul,.prose blockquote{margin:1.35em 0}
    .prose h2{font-size:1.72rem;margin:2.1em 0 .65em}
    .prose h3{font-size:1.28rem;margin:1.7em 0 .55em}
    .prose blockquote{border-left:2px solid var(--accent);padding-left:1.15rem;color:var(--muted);font-style:italic}
    .prose code{background:color-mix(in srgb,var(--surface) 78%, var(--bg) 22%);padding:.1em .35em;border-radius:var(--radius)}
    .prose a{color:inherit;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--accent)}
    .preview-rail{position:sticky;top:28px}
    .preview-rail-card{border:1px solid var(--line);border-radius:calc(var(--radius) + 12px);background:color-mix(in srgb,var(--surface) 74%, var(--bg) 26%);padding:1.15rem 1rem}
    .preview-rail-card h2{font-size:.95rem;margin:0 0 .9rem}
    .preview-rail-section + .preview-rail-section{margin-top:1rem;padding-top:1rem;border-top:1px solid color-mix(in srgb,var(--line) 76%, transparent)}
    .preview-rail-copy{font-size:.84rem;line-height:1.65;color:color-mix(in srgb,var(--ink) 88%, var(--muted))}
    .preview-rail-list{list-style:none;padding:0;margin:.6rem 0 0}
    .preview-rail-list li{font-size:.78rem;color:var(--muted);padding:.22rem 0}
    .preview-rail-tags{display:flex;flex-wrap:wrap;gap:.45rem}
    .preview-tag{border:1px solid var(--line);border-radius:999px;padding:.18rem .55rem;font-size:.72rem;color:var(--muted)}
    @media (max-width: 1180px){.page{grid-template-columns:1fr}.preview-rail{display:none}}
  </style>
</head>
<body>
  <div class="page">
    <article>
      <a class="crumb" href="#">↖ ${topLink}</a>
      ${post.cover ? `<img class="cover" src="${escapeHtml(post.cover)}" alt="" />` : ""}
      <h1>${escapeHtml(post.title || "未命名内容")}</h1>
      ${
        post.kind === "project"
          ? `<dl class="project-grid">
              <div><dt>年份</dt><dd>${escapeHtml(post.year || post.date || "未填写")}</dd></div>
              ${post.role ? `<div><dt>角色</dt><dd>${escapeHtml(post.role)}</dd></div>` : ""}
              ${tags.length ? `<div><dt>标签</dt><dd>${escapeHtml(tags.join(" / "))}</dd></div>` : ""}
              ${post.url ? `<div><dt>链接</dt><dd><a href="${escapeHtml(post.url)}">访问 ↗</a></dd></div>` : ""}
            </dl>`
          : `<div class="meta">
              ${post.date ? `<span>${escapeHtml(post.date)}</span>` : ""}
              ${post.category ? `<span>${escapeHtml(post.category)}</span>` : ""}
              ${tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")}
            </div>`
      }
      <div class="prose">${html}</div>
    </article>

    <aside class="preview-rail">
      <div class="preview-rail-card">
        <h2>阅读预览</h2>
        <div class="preview-rail-section">
          <div class="preview-rail-copy">${summary}</div>
        </div>
        ${
          highlights.length
            ? `<div class="preview-rail-section">
                <div class="preview-rail-copy">${post.kind === "project" ? "项目亮点" : "作者高亮"}</div>
                <ul class="preview-rail-list">${highlights.map((item) => `<li>• ${escapeHtml(item)}</li>`).join("")}</ul>
              </div>`
            : ""
        }
        ${
          post.contextNote
            ? `<div class="preview-rail-section">
                <div class="preview-rail-copy">${escapeHtml(post.contextNote)}</div>
              </div>`
            : ""
        }
        ${
          outline.length
            ? `<div class="preview-rail-section">
                <div class="preview-rail-copy">大纲</div>
                <ul class="preview-rail-list">${outline
                  .map((item) => `<li>${item.level === 3 ? "· " : ""}${escapeHtml(item.text)}</li>`)
                  .join("")}</ul>
              </div>`
            : ""
        }
        ${
          tags.length
            ? `<div class="preview-rail-section">
                <div class="preview-rail-tags">${tags.map((tag) => `<span class="preview-tag">#${escapeHtml(tag)}</span>`).join("")}</div>
              </div>`
            : ""
        }
      </div>
    </aside>
  </div>
</body>
</html>`;
}

function firstParagraph(markdown: string): string {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const paragraph = blocks.find((block) => !/^#{1,6}\s/.test(block) && !/^[-*>]\s/.test(block));
  return stripMarkdown(paragraph || "");
}

function stripMarkdown(value: string): string {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[`>*_-]/g, "")
    .trim();
}

function extractMarkdownHeadings(markdown: string): Array<{ level: 2 | 3; text: string }> {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const h2 = line.match(/^##\s+(.+)/);
      if (h2) return [{ level: 2 as const, text: stripMarkdown(h2[1]) }];
      const h3 = line.match(/^###\s+(.+)/);
      if (h3) return [{ level: 3 as const, text: stripMarkdown(h3[1]) }];
      return [];
    });
}

function railOutline(items: Array<{ level: 2 | 3; text: string }>): Array<{ level: 2 | 3; text: string }> {
  const h2 = items.filter((item) => item.level === 2);
  if (h2.length >= 3) return h2.slice(0, 6);
  return items.slice(0, 6);
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
