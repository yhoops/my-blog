import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SiteConfig, Block, BlockType, PresetComponent } from "../../lib/config-types";

/* ---------- Block metadata ---------- */

const BLOCK_META: Record<BlockType, { name: string; desc: string }> = {
  hero: { name: "主视觉", desc: "姓名、标签与简介" },
  intro: { name: "引言", desc: "一段开场文字" },
  writingList: { name: "随笔列表", desc: "最新文章" },
  projectList: { name: "作品列表", desc: "精选作品" },
  richText: { name: "富文本", desc: "自由排版的段落" },
  linkList: { name: "链接列表", desc: "外部链接集合" },
  spacer: { name: "间隔", desc: "纵向留白" },
};

const DEFAULT_PROPS: Record<BlockType, Record<string, any>> = {
  hero: { name: "你的名字", tagline: "一句话标签", intro: "简短的自我介绍。" },
  intro: { text: "一段引言。" },
  writingList: { heading: "随笔", limit: 5, showDescription: true },
  projectList: { heading: "作品", limit: 4 },
  richText: { heading: "", body: "在这里写点什么。" },
  linkList: {
    heading: "在别处",
    items: [{ label: "GitHub", href: "https://github.com", note: "" }],
  },
  spacer: { size: 48 },
};

let idCounter = 0;
function newId(prefix = "blk") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

/* ---------- Post data shape ---------- */

interface PostItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  kind: "writing" | "project";
  year?: string;
  role?: string;
}

/* ============================ MAIN COMPONENT ============================ */

export default function LayoutBuilder({
  config,
  onChange,
}: {
  config: SiteConfig;
  onChange: (c: SiteConfig) => void;
}) {
  const [editing, setEditing] = useState<Block | null>(null);
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual");
  const [posts, setPosts] = useState<PostItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Fetch posts for visual preview of writingList / projectList
  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.posts) setPosts(d.posts);
      })
      .catch(() => {});
  }, []);

  function setBlocks(blocks: Block[]) {
    onChange({ ...config, blocks });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = config.blocks.findIndex((b) => b.id === active.id);
    const newIndex = config.blocks.findIndex((b) => b.id === over.id);
    setBlocks(arrayMove(config.blocks, oldIndex, newIndex));
  }

  function toggle(id: string) {
    setBlocks(
      config.blocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)),
    );
  }
  function remove(id: string) {
    setBlocks(config.blocks.filter((b) => b.id !== id));
  }
  function addBlock(type: BlockType) {
    const block: Block = {
      id: newId(),
      type,
      visible: true,
      props: structuredClone(DEFAULT_PROPS[type]),
    };
    setBlocks([...config.blocks, block]);
    setEditing(block);
  }
  function addFromPreset(preset: PresetComponent) {
    const block: Block = {
      id: newId(),
      type: preset.baseType,
      visible: true,
      props: structuredClone(preset.defaultProps),
    };
    setBlocks([...config.blocks, block]);
  }
  function saveBlock(updated: Block) {
    setBlocks(config.blocks.map((b) => (b.id === updated.id ? updated : b)));
    setEditing(null);
  }
  function saveAsPreset(block: Block) {
    const name = prompt("为这个预设组件命名：");
    if (!name) return;
    const preset: PresetComponent = {
      id: newId("preset"),
      name,
      baseType: block.type,
      defaultProps: structuredClone(block.props),
    };
    onChange({ ...config, presets: [...(config.presets || []), preset] });
  }
  function removePreset(id: string) {
    onChange({
      ...config,
      presets: (config.presets || []).filter((p) => p.id !== id),
    });
  }

  return (
    <>
      {/* ===== Mode toggle ===== */}
      <div className="panel" style={{ padding: "0.6rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.82rem", color: "var(--s-muted)" }}>
            显示模式
          </span>
          <button
            className={`btn`}
            style={{
              ...modeBtnStyle,
              background: viewMode === "list" ? "var(--s-accent)" : "var(--s-panel-2)",
              color: viewMode === "list" ? "#fff" : "var(--s-text)",
              borderColor: viewMode === "list" ? "var(--s-accent)" : "var(--s-border)",
            }}
            onClick={() => setViewMode("list")}
          >
            ☰ 列表
          </button>
          <button
            className={`btn`}
            style={{
              ...modeBtnStyle,
              background: viewMode === "visual" ? "var(--s-accent)" : "var(--s-panel-2)",
              color: viewMode === "visual" ? "#fff" : "var(--s-text)",
              borderColor: viewMode === "visual" ? "var(--s-accent)" : "var(--s-border)",
            }}
            onClick={() => setViewMode("visual")}
          >
            ◉ 可视化
          </button>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--s-muted)" }}>
            {config.blocks.filter((b) => b.visible).length} / {config.blocks.length} 个区块可见
          </span>
        </div>
      </div>

      {/* ===== Block list ===== */}
      <div className="panel">
        <h3>
          {viewMode === "list"
            ? "首页区块（拖拽排序）"
            : "可视化布局（拖拽排序）"}
        </h3>

        {config.blocks.length === 0 ? (
          <p className="hint">还没有区块，从下方添加。</p>
        ) : viewMode === "list" ? (
          /* -- List view (original) -- */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={config.blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {config.blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  onToggle={() => toggle(block.id)}
                  onEdit={() => setEditing(block)}
                  onRemove={() => remove(block.id)}
                  onSavePreset={() => saveAsPreset(block)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          /* -- Visual view -- */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={config.blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {config.blocks.map((block) => (
                <SortableVisualBlock
                  key={block.id}
                  block={block}
                  theme={config.theme}
                  posts={posts}
                  onToggle={() => toggle(block.id)}
                  onEdit={() => setEditing(block)}
                  onRemove={() => remove(block.id)}
                  onSavePreset={() => saveAsPreset(block)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ===== Add block ===== */}
      <div className="panel">
        <h3>添加区块</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(BLOCK_META) as BlockType[]).map((type) => (
            <button key={type} className="btn" onClick={() => addBlock(type)}>
              + {BLOCK_META[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Presets ===== */}
      <div className="panel">
        <h3>我的预设组件</h3>
        <p className="hint" style={{ marginTop: 0, marginBottom: "0.75rem" }}>
          在任一区块上点击「存为预设」，即可保存配置好的组件，随时复用。
        </p>
        {(config.presets || []).length === 0 ? (
          <p className="hint">暂无预设。</p>
        ) : (
          (config.presets || []).map((preset) => (
            <div className="block-item" key={preset.id}>
              <span className="b-title">{preset.name}</span>
              <span className="b-type">{BLOCK_META[preset.baseType].name}</span>
              <button className="btn" onClick={() => addFromPreset(preset)}>
                插入
              </button>
              <button
                className="btn btn-danger"
                onClick={() => removePreset(preset.id)}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===== Block editor modal ===== */}
      {editing && (
        <BlockEditor
          block={editing}
          onClose={() => setEditing(null)}
          onSave={saveBlock}
        />
      )}
    </>
  );
}

/* ======================== LIST-VIEW SORTABLE BLOCK ======================== */

function SortableBlockItem({
  block,
  onToggle,
  onEdit,
  onRemove,
  onSavePreset,
}: {
  block: Block;
  onToggle: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onSavePreset: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div className="block-item" ref={setNodeRef} style={style}>
      <span className="handle" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="b-title" style={{ opacity: block.visible ? 1 : 0.45 }}>
        {BLOCK_META[block.type].name}
      </span>
      <span className="b-type">{BLOCK_META[block.type].desc}</span>
      <button className="btn" onClick={onEdit}>
        编辑
      </button>
      <button className="btn" onClick={onSavePreset}>
        存为预设
      </button>
      <button
        className={`toggle ${block.visible ? "on" : ""}`}
        onClick={onToggle}
        aria-label="显示/隐藏"
      />
      <button className="btn btn-danger" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
}

/* ==================== VISUAL-VIEW SORTABLE BLOCK ==================== */

function SortableVisualBlock({
  block,
  theme,
  posts,
  onToggle,
  onEdit,
  onRemove,
  onSavePreset,
}: {
  block: Block;
  theme: SiteConfig["theme"];
  posts: PostItem[];
  onToggle: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onSavePreset: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 12,
        borderRadius: 10,
        border: block.visible
          ? "1px solid var(--s-border)"
          : "1px dashed rgba(154,154,163,0.35)",
        background: "var(--s-panel-2)",
        overflow: "hidden",
        position: "relative",
        ...(isDragging
          ? { boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 50 }
          : {}),
      }}
    >
      {/* --- Top bar: drag handle + block name + actions --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid var(--s-border)",
          background: "var(--s-panel)",
        }}
      >
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            color: "var(--s-muted)",
            fontSize: "1rem",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          ⠿
        </span>

        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: block.visible ? "var(--s-text)" : "var(--s-muted)",
          }}
        >
          {BLOCK_META[block.type].name}
        </span>
        <span style={{ fontSize: "0.7rem", color: "var(--s-muted)" }}>
          {BLOCK_META[block.type].desc}
        </span>

        <div style={{ flex: 1 }} />

        {/* Actions — always visible */}
        <button className="btn" onClick={onEdit} style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
          编辑
        </button>
        <button className="btn" onClick={onSavePreset} style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
          预设
        </button>
        <button
          className={`toggle ${block.visible ? "on" : ""}`}
          onClick={onToggle}
          aria-label="显示/隐藏"
          style={{ transform: "scale(0.8)" }}
        />
        <button
          className="btn btn-danger"
          onClick={onRemove}
          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
        >
          ✕
        </button>
      </div>

      {/* --- Block preview rendered with public-site theme --- */}
      <div
        style={{
          background: block.visible ? theme.colors.bg : "transparent",
          transition: "background 200ms",
          opacity: block.visible ? 1 : 0.35,
          pointerEvents: "none",
          userSelect: "none",
          maxHeight: 280,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fade-out at bottom for long blocks */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 48,
            background: `linear-gradient(transparent, ${block.visible ? theme.colors.bg : "var(--s-panel-2)"})`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {block.visible ? (
          <PreviewBlockContent block={block} theme={theme} posts={posts} />
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--s-muted)",
              fontSize: "0.82rem",
            }}
          >
            此区块已隐藏，切换上方的 toggle 可恢复显示
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== BLOCK PREVIEW RENDERERS ==================== */

function PreviewBlockContent({
  block,
  theme,
  posts,
}: {
  block: Block;
  theme: SiteConfig["theme"];
  posts: PostItem[];
}) {
  const p = block.props;
  switch (block.type) {
    case "hero":
      return <PreviewHero props={p} theme={theme} />;
    case "writingList":
      return <PreviewWritingList props={p} theme={theme} posts={posts} />;
    case "projectList":
      return <PreviewProjectList props={p} theme={theme} posts={posts} />;
    case "linkList":
      return <PreviewLinkList props={p} theme={theme} />;
    case "richText":
      return <PreviewRichText props={p} theme={theme} />;
    case "spacer":
      return <PreviewSpacer props={p} theme={theme} />;
    default:
      return <div style={{ padding: 24, color: theme.colors.muted }}>未知区块</div>;
  }
}

/* ------------ Hero ------------ */

function PreviewHero({
  props,
  theme,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
}) {
  return (
    <div
      style={{
        padding: "2rem 1.5rem 3rem",
        color: theme.colors.ink,
        fontFamily: theme.fonts.body,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: theme.colors.accent,
          letterSpacing: "0.05em",
          margin: "0 0 12px",
        }}
      >
        {props.tagline}
      </p>
      <h1
        style={{
          fontSize: 28,
          fontFamily: theme.fonts.heading,
          fontWeight: 400,
          lineHeight: 1.05,
          margin: "0 0 16px",
          color: theme.colors.ink,
        }}
      >
        {props.name}
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.colors.muted, margin: 0 }}>
        {props.intro}
      </p>
    </div>
  );
}

/* ------------ Writing list ------------ */

function PreviewWritingList({
  props,
  theme,
  posts,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
  posts: PostItem[];
}) {
  const items = posts.filter((p) => p.kind === "writing").slice(0, props.limit || 3);

  return (
    <PreviewSection theme={theme}>
      <PreviewHeading theme={theme} label={props.heading || "随笔"} />
      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: theme.colors.muted, margin: 0 }}>
          （暂无随笔文章）
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((post) => (
            <li
              key={post.slug}
              style={{
                borderTop: `1px solid ${theme.colors.line}`,
                padding: "0.75rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontFamily: theme.fonts.heading,
                  color: theme.colors.ink,
                }}
              >
                {post.title}
              </span>
              <span style={{ fontSize: 11, color: theme.colors.faint, flexShrink: 0 }}>
                {fmtShort(post.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PreviewSection>
  );
}

/* ------------ Project list ------------ */

function PreviewProjectList({
  props,
  theme,
  posts,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
  posts: PostItem[];
}) {
  const items = posts.filter((p) => p.kind === "project").slice(0, props.limit || 3);

  return (
    <PreviewSection theme={theme}>
      <PreviewHeading theme={theme} label={props.heading || "作品"} />
      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: theme.colors.muted, margin: 0 }}>
          （暂无作品）
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((p) => (
            <li
              key={p.slug}
              style={{
                borderTop: `1px solid ${theme.colors.line}`,
                padding: "0.75rem 0",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 11, color: theme.colors.faint, fontVariantNumeric: "tabular-nums" }}>
                {p.year || yr(p.date)}
              </span>
              <div>
                <span style={{ fontSize: 15, fontFamily: theme.fonts.heading, color: theme.colors.ink }}>
                  {p.title}
                </span>
                {p.description && (
                  <p style={{ fontSize: 12, color: theme.colors.muted, margin: "2px 0 0", lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PreviewSection>
  );
}

/* ------------ Link list ------------ */

function PreviewLinkList({
  props,
  theme,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
}) {
  const items: { label: string; href: string; note?: string }[] = props.items ?? [];

  return (
    <PreviewSection theme={theme}>
      <PreviewHeading theme={theme} label={props.heading || "在别处"} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              borderTop: `1px solid ${theme.colors.line}`,
              padding: "0.75rem 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 15, fontFamily: theme.fonts.heading, color: theme.colors.ink }}>
              {item.label}
            </span>
            {item.note && (
              <span style={{ fontSize: 11, color: theme.colors.muted }}>{item.note}</span>
            )}
          </li>
        ))}
      </ul>
    </PreviewSection>
  );
}

/* ------------ Rich text ------------ */

function PreviewRichText({
  props,
  theme,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
}) {
  const body: string = props.body || props.text || "";
  const paras = body.split("\n\n").filter(Boolean).slice(0, 3);

  return (
    <PreviewSection theme={theme}>
      {props.heading && <PreviewHeading theme={theme} label={props.heading} />}
      <div style={{ lineHeight: 1.6, color: theme.colors.ink, fontSize: 13 }}>
        {paras.map((p: string, i: number) => (
          <p key={i} style={{ margin: "0.8em 0" }}>
            {p}
          </p>
        ))}
        {body.split("\n\n").filter(Boolean).length > 3 && (
          <p style={{ color: theme.colors.faint, fontSize: 12, fontStyle: "italic" }}>
            …（更多内容在页面上完整显示）
          </p>
        )}
      </div>
    </PreviewSection>
  );
}

/* ------------ Spacer ------------ */

function PreviewSpacer({
  props,
  theme,
}: {
  props: Record<string, any>;
  theme: SiteConfig["theme"];
}) {
  const sizes: Record<string, string> = { sm: "24px", md: "48px", lg: "80px" };
  const height = sizes[props.size || "md"];

  return (
    <div
      style={{
        padding: `0 1.5rem`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, height: 1, background: theme.colors.line }} />
      <span style={{ fontSize: 11, color: theme.colors.faint, whiteSpace: "nowrap" }}>
        间隔 {height}
      </span>
      <div style={{ flex: 1, height: 1, background: theme.colors.line }} />
    </div>
  );
}

/* ------------ Shared preview helpers ------------ */

function PreviewSection({
  theme,
  children,
}: {
  theme: SiteConfig["theme"];
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        color: theme.colors.ink,
        fontFamily: theme.fonts.body,
      }}
    >
      {children}
    </div>
  );
}

function PreviewHeading({
  theme,
  label,
}: {
  theme: SiteConfig["theme"];
  label: string;
}) {
  return (
    <p
      style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: theme.colors.faint,
        margin: "0 0 1rem",
        fontFamily: theme.fonts.body,
      }}
    >
      {label}
    </p>
  );
}

/* ============================ BLOCK EDITOR MODAL ============================ */

function BlockEditor({
  block,
  onClose,
  onSave,
}: {
  block: Block;
  onClose: () => void;
  onSave: (b: Block) => void;
}) {
  const [props, setProps] = useState<Record<string, any>>(
    structuredClone(block.props),
  );

  function set(key: string, value: any) {
    setProps((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>编辑「{BLOCK_META[block.type].name}」</h3>
        {Object.entries(props).map(([key, value]) => (
          <div className="field" key={key}>
            <label>{key}</label>
            {typeof value === "boolean" ? (
              <button
                className={`toggle ${value ? "on" : ""}`}
                onClick={() => set(key, !value)}
                aria-label={key}
              />
            ) : typeof value === "number" ? (
              <input
                type="number"
                className="input"
                value={value}
                onChange={(e) => set(key, parseFloat(e.target.value))}
              />
            ) : Array.isArray(value) ? (
              <textarea
                className="textarea"
                style={{ minHeight: 120 }}
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    set(key, JSON.parse(e.target.value));
                  } catch {
                    /* ignore invalid json while typing */
                  }
                }}
              />
            ) : key === "intro" || key === "body" || key === "text" ? (
              <textarea
                className="textarea"
                style={{ minHeight: 90 }}
                value={value as string}
                onChange={(e) => set(key, e.target.value)}
              />
            ) : (
              <input
                className="input"
                value={value as string}
                onChange={(e) => set(key, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            取消
          </button>
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={() => onSave({ ...block, props })}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================ HELPERS ============================ */

function fmtShort(d: string): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(
      new Date(d),
    );
  } catch {
    return d;
  }
}

function yr(d: string): string {
  try {
    return String(new Date(d).getFullYear());
  } catch {
    return d;
  }
}

const modeBtnStyle: React.CSSProperties = {
  padding: "0.35rem 0.8rem",
  fontSize: "0.82rem",
  borderRadius: 8,
  border: "1px solid var(--s-border)",
  cursor: "pointer",
  fontWeight: 500,
  transition: "all 150ms",
};
