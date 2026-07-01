import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import type { SiteConfig, Block, BlockType, PresetComponent } from "../../lib/config-types";
import { StudioPromptDialog } from "./StudioDialog";

/* ─── Metadata ──────────────────────────────────────────────────────────────── */

const BLOCK_META: Record<BlockType, { name: string; desc: string; icon: string }> = {
  hero:        { name: "主视觉",   desc: "姓名与一句话标签",   icon: "◈" },
  intro:       { name: "引言",     desc: "开场文字段落",       icon: "¶" },
  writingList: { name: "随笔列表", desc: "最新文章链接",        icon: "≡" },
  projectList: { name: "作品列表", desc: "精选作品链接",        icon: "◻" },
  richText:    { name: "富文本",   desc: "自由排版的段落",      icon: "T" },
  linkList:    { name: "链接列表", desc: "外部链接集合",        icon: "⌘" },
  spacer:      { name: "留白",     desc: "纵向间距",            icon: "↕" },
  divider:     { name: "分割线",   desc: "水平分隔线",          icon: "—" },
  imageRow:    { name: "图片行",   desc: "横向图片组",          icon: "⊞" },
};

const BLOCK_GROUPS: { label: string; types: BlockType[] }[] = [
  { label: "核心",   types: ["hero", "intro", "richText"] },
  { label: "内容",   types: ["writingList", "projectList", "linkList"] },
  { label: "装饰",   types: ["spacer", "divider", "imageRow"] },
];

const DEFAULT_PROPS: Record<BlockType, Record<string, any>> = {
  hero:        { name: "你的名字", tagline: "一句话标签", intro: "简短的自我介绍。" },
  intro:       { text: "一段引言，开门见山地表达你在做什么。" },
  writingList: { heading: "随笔", limit: 5, showDescription: true },
  projectList: { heading: "作品", limit: 4 },
  richText:    { heading: "", body: "在这里写点什么。" },
  linkList:    { heading: "在别处", items: [{ label: "GitHub", href: "https://github.com", note: "" }] },
  spacer:      { size: 48 },
  divider:     { style: "solid", opacity: 30 },
  imageRow:    { images: [{ src: "", alt: "", caption: "" }], columns: 2 },
};

/* Friendly Chinese labels for prop keys */
const PROP_LABELS: Record<string, string> = {
  name: "姓名", tagline: "标签", intro: "简介", text: "正文",
  heading: "标题", limit: "显示数量", showDescription: "显示简介",
  body: "内容", size: "高度（px）", style: "线条样式",
  opacity: "不透明度（%）", columns: "列数", images: "图片组",
  items: "链接列表",
};

let _idSeq = 0;
function uid(p = "b") { return `${p}-${Date.now().toString(36)}-${++_idSeq}`; }

/* ─── Canvas block preview card ────────────────────────────────────────────── */

function BlockPreviewCard({ block, active }: { block: Block; active: boolean }) {
  const meta = BLOCK_META[block.type];
  const p = block.props;

  const preview = (() => {
    switch (block.type) {
      case "hero":
        return (
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--s-text)" }}>{p.name || "姓名"}</div>
            <div style={{ fontSize: 11, color: "var(--s-muted)", marginTop: 2 }}>{p.tagline || "标签"}</div>
            {p.intro && <div style={{ fontSize: 11, color: "var(--s-muted)", marginTop: 6, lineHeight: 1.5 }}>{p.intro}</div>}
          </div>
        );
      case "intro":
        return (
          <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--s-muted)", lineHeight: 1.6 }}>
            {p.text || "引言…"}
          </div>
        );
      case "writingList":
      case "projectList":
        return (
          <div style={{ padding: "10px 16px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--s-muted)", marginBottom: 8 }}>
              {p.heading || meta.name}
            </div>
            {[1, 2, 3].slice(0, Math.min(p.limit || 3, 3)).map((i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--s-border)" }}>
                <div style={{ width: "55%", height: 8, background: "var(--s-border)", borderRadius: 4 }} />
                <div style={{ width: "18%", height: 8, background: "var(--s-border)", borderRadius: 4, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        );
      case "richText":
        return (
          <div style={{ padding: "10px 16px" }}>
            {p.heading && <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--s-muted)", marginBottom: 6 }}>{p.heading}</div>}
            <div style={{ fontSize: 11, color: "var(--s-muted)", lineHeight: 1.6 }}>
              {(p.body || "").slice(0, 100)}{(p.body || "").length > 100 ? "…" : ""}
            </div>
          </div>
        );
      case "linkList":
        return (
          <div style={{ padding: "10px 16px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--s-muted)", marginBottom: 8 }}>{p.heading}</div>
            {(Array.isArray(p.items) ? p.items : []).slice(0, 3).map((item: any, i: number) => (
              <div key={i} style={{ fontSize: 11, color: "var(--s-text)", padding: "3px 0" }}>↗ {item.label}</div>
            ))}
          </div>
        );
      case "spacer":
        return (
          <div style={{ height: Math.max(12, Math.min(p.size / 3, 40)), display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
            <div style={{ borderTop: "1px dashed var(--s-border)", width: "100%", position: "relative" }}>
              <span style={{ position: "absolute", left: "50%", transform: "translate(-50%, -50%)", background: "var(--s-panel)", padding: "0 6px", fontSize: 9, color: "var(--s-muted)" }}>{p.size}px</span>
            </div>
          </div>
        );
      case "divider":
        return (
          <div style={{ padding: "12px 16px" }}>
            <hr style={{ border: "none", borderTop: `1px ${p.style || "solid"} var(--s-border)`, opacity: (p.opacity || 30) / 100 }} />
          </div>
        );
      case "imageRow":
        return (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${p.columns || 2}, 1fr)`, gap: 4, padding: "10px 16px" }}>
            {(Array.isArray(p.images) ? p.images : [{}]).slice(0, p.columns || 2).map((_: any, i: number) => (
              <div key={i} style={{ background: "var(--s-border)", borderRadius: 4, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--s-muted)" }}>⊞</div>
            ))}
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div
      className={`canvas-block-card ${active ? "canvas-block-card--active" : ""} ${!block.visible ? "canvas-block-card--hidden" : ""}`}
    >
      <div className="canvas-block-label">
        <span className="canvas-block-icon">{meta.icon}</span>
        <span>{meta.name}</span>
        {!block.visible && <span className="canvas-block-badge">隐藏</span>}
      </div>
      {preview}
    </div>
  );
}

/* ─── Sortable canvas row ───────────────────────────────────────────────────── */

function SortableCanvasBlock({
  block,
  active,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
}: {
  block: Block;
  active: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        position: "relative",
      }}
      className={`canvas-block-wrap ${active ? "canvas-block-wrap--active" : ""}`}
      onClick={onSelect}
    >
      {/* drag handle bar */}
      <div className="canvas-block-handle" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        <DragHandleIcon />
      </div>

      <BlockPreviewCard block={block} active={active} />

      {/* action row — only visible on hover/active */}
      <div className="canvas-block-actions" onClick={(e) => e.stopPropagation()}>
        <button className="cba-btn" onClick={onToggle} title={block.visible ? "隐藏" : "显示"}>
          {block.visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
        <button className="cba-btn" onClick={onDuplicate} title="复制">
          <CopyIcon />
        </button>
        <button className="cba-btn cba-btn--danger" onClick={onDelete} title="删除">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

/* ─── Prop editor panel ─────────────────────────────────────────────────────── */

function PropEditor({
  block,
  onChange,
  onClose,
  onSavePreset,
}: {
  block: Block;
  onChange: (b: Block) => void;
  onClose: () => void;
  onSavePreset: (b: Block) => void;
}) {
  const meta = BLOCK_META[block.type];

  function set(key: string, value: any) {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  }

  function renderField(key: string, value: any) {
    const label = PROP_LABELS[key] || key;

    if (typeof value === "boolean") {
      return (
        <div className="field" key={key}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label>{label}</label>
            <button className={`toggle ${value ? "on" : ""}`} onClick={() => set(key, !value)} aria-label={label} />
          </div>
        </div>
      );
    }
    if (typeof value === "number") {
      return (
        <div className="field" key={key}>
          <label>{label}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="range" min={key === "limit" ? 1 : key === "columns" ? 1 : key === "opacity" ? 0 : 0} max={key === "limit" ? 20 : key === "columns" ? 4 : key === "opacity" ? 100 : 300} step={1} value={value} onChange={(e) => set(key, parseFloat(e.target.value))} style={{ flex: 1 }} />
            <span className="range-val">{value}{key === "opacity" ? "%" : key === "size" ? "px" : ""}</span>
          </div>
        </div>
      );
    }
    if (key === "style" && block.type === "divider") {
      return (
        <div className="field" key={key}>
          <label>{label}</label>
          <select className="select" value={value} onChange={(e) => set(key, e.target.value)}>
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="dotted">点线</option>
          </select>
        </div>
      );
    }
    if (Array.isArray(value)) {
      // Special editor for linkList items
      if (key === "items" && block.type === "linkList") {
        return (
          <div className="field" key={key}>
            <label>{label}</label>
            {value.map((item: any, i: number) => (
              <div key={i} className="array-item">
                <input className="input" placeholder="标签" value={item.label || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], label: e.target.value }; set(key, v); }} />
                <input className="input" placeholder="链接 https://…" value={item.href || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], href: e.target.value }; set(key, v); }} style={{ marginTop: 4 }} />
                <input className="input" placeholder="备注（可选）" value={item.note || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], note: e.target.value }; set(key, v); }} style={{ marginTop: 4 }} />
                <button className="btn btn-danger" style={{ marginTop: 4 }} onClick={() => set(key, value.filter((_: any, j: number) => j !== i))}>删除此项</button>
              </div>
            ))}
            <button className="btn" style={{ marginTop: 6, width: "100%" }} onClick={() => set(key, [...value, { label: "", href: "", note: "" }])}>+ 添加链接</button>
          </div>
        );
      }
      // Special editor for imageRow images
      if (key === "images" && block.type === "imageRow") {
        return (
          <div className="field" key={key}>
            <label>{label}</label>
            {value.map((img: any, i: number) => (
              <div key={i} className="array-item">
                <input className="input" placeholder="图片 URL" value={img.src || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], src: e.target.value }; set(key, v); }} />
                <input className="input" placeholder="Alt 描述" value={img.alt || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], alt: e.target.value }; set(key, v); }} style={{ marginTop: 4 }} />
                <input className="input" placeholder="说明文字（可选）" value={img.caption || ""} onChange={(e) => { const v = [...value]; v[i] = { ...v[i], caption: e.target.value }; set(key, v); }} style={{ marginTop: 4 }} />
                <button className="btn btn-danger" style={{ marginTop: 4 }} onClick={() => set(key, value.filter((_: any, j: number) => j !== i))}>删除</button>
              </div>
            ))}
            <button className="btn" style={{ marginTop: 6, width: "100%" }} onClick={() => set(key, [...value, { src: "", alt: "", caption: "" }])}>+ 添加图片</button>
          </div>
        );
      }
      // fallback: raw JSON
      return (
        <div className="field" key={key}>
          <label>{label}</label>
          <textarea
            className="textarea"
            style={{ minHeight: 100, fontFamily: "monospace", fontSize: 12 }}
            defaultValue={JSON.stringify(value, null, 2)}
            onBlur={(e) => { try { set(key, JSON.parse(e.target.value)); } catch {} }}
          />
        </div>
      );
    }
    if (key === "intro" || key === "body" || key === "text") {
      return (
        <div className="field" key={key}>
          <label>{label}</label>
          <textarea className="textarea" style={{ minHeight: 100 }} value={value as string} onChange={(e) => set(key, e.target.value)} />
        </div>
      );
    }
    return (
      <div className="field" key={key}>
        <label>{label}</label>
        <input className="input" value={value as string} onChange={(e) => set(key, e.target.value)} />
      </div>
    );
  }

  return (
    <div className="prop-editor">
      <div className="prop-editor-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, opacity: 0.7 }}>{meta.icon}</span>
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{meta.name}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }} onClick={() => onSavePreset(block)}>
            存为预设
          </button>
          <button className="btn" style={{ padding: "0.3rem 0.55rem" }} onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
      </div>
      <div className="prop-editor-body">
        {Object.entries(block.props).map(([k, v]) => renderField(k, v))}
      </div>
    </div>
  );
}

/* ─── Main LayoutBuilder ────────────────────────────────────────────────────── */

export default function LayoutBuilder({
  config,
  onChange,
}: {
  config: SiteConfig;
  onChange: (c: SiteConfig) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [presetTab, setPresetTab] = useState<"library" | "my">("library");
  const [presetDraft, setPresetDraft] = useState("");
  const [presetTarget, setPresetTarget] = useState<Block | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const selectedBlock = config.blocks.find((b) => b.id === selectedId) ?? null;
  const activeBlock = activeId ? config.blocks.find((b) => b.id === activeId) : null;

  function setBlocks(blocks: Block[]) { onChange({ ...config, blocks }); }

  function onDragStart(e: DragStartEvent) { setActiveId(e.active.id as string); }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = config.blocks.findIndex((b) => b.id === active.id);
    const ni = config.blocks.findIndex((b) => b.id === over.id);
    setBlocks(arrayMove(config.blocks, oi, ni));
  }

  function addBlock(type: BlockType) {
    const block: Block = { id: uid(), type, visible: true, props: structuredClone(DEFAULT_PROPS[type]) };
    setBlocks([...config.blocks, block]);
    setSelectedId(block.id);
  }

  function addFromPreset(preset: PresetComponent) {
    const block: Block = { id: uid(), type: preset.baseType, visible: true, props: structuredClone(preset.defaultProps) };
    setBlocks([...config.blocks, block]);
    setSelectedId(block.id);
  }

  function duplicateBlock(id: string) {
    const src = config.blocks.find((b) => b.id === id);
    if (!src) return;
    const dup: Block = { ...structuredClone(src), id: uid() };
    const idx = config.blocks.findIndex((b) => b.id === id);
    const next = [...config.blocks];
    next.splice(idx + 1, 0, dup);
    setBlocks(next);
    setSelectedId(dup.id);
  }

  function toggleVisible(id: string) {
    setBlocks(config.blocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  }

  function removeBlock(id: string) {
    setBlocks(config.blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateBlock(updated: Block) {
    setBlocks(config.blocks.map((b) => (b.id === updated.id ? updated : b)));
  }

  function saveAsPreset(block: Block) {
    setPresetTarget(block);
    setPresetDraft("");
  }

  function confirmSavePreset() {
    if (!presetTarget || !presetDraft.trim()) return;
    const preset: PresetComponent = {
      id: uid("preset"),
      name: presetDraft.trim(),
      baseType: presetTarget.type,
      defaultProps: structuredClone(presetTarget.props),
    };
    onChange({ ...config, presets: [...(config.presets || []), preset] });
    setPresetTarget(null);
    setPresetDraft("");
  }

  function removePreset(id: string) {
    onChange({ ...config, presets: (config.presets || []).filter((p) => p.id !== id) });
  }

  return (
    <>
      <div className="lb-root">
      {/* ── Left sidebar: block library ── */}
      <aside className="lb-sidebar">
        <div className="lb-sidebar-tabs">
          <button className={`lb-stab ${presetTab === "library" ? "active" : ""}`} onClick={() => setPresetTab("library")}>区块库</button>
          <button className={`lb-stab ${presetTab === "my" ? "active" : ""}`} onClick={() => setPresetTab("my")}>我的预设</button>
        </div>

        {presetTab === "library" && (
          <div className="lb-library">
            {BLOCK_GROUPS.map((group) => (
              <div key={group.label} className="lb-group">
                <div className="lb-group-label">{group.label}</div>
                {group.types.map((type) => (
                  <button key={type} className="lb-block-btn" onClick={() => addBlock(type)}>
                    <span className="lb-block-icon">{BLOCK_META[type].icon}</span>
                    <div>
                      <div className="lb-block-name">{BLOCK_META[type].name}</div>
                      <div className="lb-block-desc">{BLOCK_META[type].desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {presetTab === "my" && (
          <div className="lb-library">
            {(config.presets || []).length === 0 ? (
              <p className="hint" style={{ padding: "0.5rem 0.25rem" }}>
                在画布中编辑任意区块，点击「存为预设」即可保存到这里。
              </p>
            ) : (
              (config.presets || []).map((preset) => (
                <div key={preset.id} className="lb-preset-item">
                  <div>
                    <div className="lb-block-name">{preset.name}</div>
                    <div className="lb-block-desc">{BLOCK_META[preset.baseType].name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }} onClick={() => addFromPreset(preset)}>插入</button>
                    <button className="btn btn-danger" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }} onClick={() => removePreset(preset.id)}>删除</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </aside>

      {/* ── Center: canvas ── */}
      <div className="lb-canvas-area">
        <div className="lb-canvas-toolbar">
          <span className="lb-canvas-hint">拖拽调整顺序，点击区块编辑属性</span>
          <div className="lb-viewport-toggle">
            <button className={`lb-vp-btn ${viewport === "desktop" ? "active" : ""}`} onClick={() => setViewport("desktop")} title="桌面">
              <DesktopIcon />
            </button>
            <button className={`lb-vp-btn ${viewport === "mobile" ? "active" : ""}`} onClick={() => setViewport("mobile")} title="移动端">
              <MobileIcon />
            </button>
          </div>
        </div>

        <div className="lb-canvas-scroll">
          <div className={`lb-canvas-frame lb-canvas-frame--${viewport}`}>
            {/* browser chrome mock */}
            <div className="lb-frame-chrome">
              <div className="lb-frame-dots">
                <span /><span /><span />
              </div>
              <div className="lb-frame-url">{config.meta?.url || "yoursite.com"}</div>
            </div>

            <div className="lb-frame-body">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <SortableContext items={config.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {config.blocks.map((block) => (
                    <SortableCanvasBlock
                      key={block.id}
                      block={block}
                      active={block.id === selectedId}
                      onSelect={() => setSelectedId(block.id === selectedId ? null : block.id)}
                      onToggle={() => toggleVisible(block.id)}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onDelete={() => removeBlock(block.id)}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeBlock && (
                    <div style={{ opacity: 0.85, transform: "rotate(1.5deg)" }}>
                      <BlockPreviewCard block={activeBlock} active={false} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>

              {config.blocks.length === 0 && (
                <div className="lb-empty">
                  <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>◈</div>
                  <p>还没有区块</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--s-muted)" }}>从左侧区块库点击添加</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: prop editor ── */}
      <div className={`lb-prop-panel ${selectedBlock ? "lb-prop-panel--open" : ""}`}>
        {selectedBlock ? (
          <PropEditor
            block={selectedBlock}
            onChange={updateBlock}
            onClose={() => setSelectedId(null)}
            onSavePreset={saveAsPreset}
          />
        ) : (
          <div className="lb-prop-empty">
            <div style={{ fontSize: 24, opacity: 0.3, marginBottom: 8 }}>←</div>
            <p>点击画布中的区块</p>
            <p style={{ fontSize: "0.78rem", color: "var(--s-muted)" }}>即可在此处编辑属性</p>
          </div>
        )}
      </div>
      </div>
      <StudioPromptDialog
        open={Boolean(presetTarget)}
        title="保存为预设"
        label="预设名称"
        value={presetDraft}
        placeholder="例如：双栏项目导语"
        confirmLabel="保存"
        cancelLabel="取消"
        onChange={setPresetDraft}
        onConfirm={confirmSavePreset}
        onCancel={() => {
          setPresetTarget(null);
          setPresetDraft("");
        }}
      />
    </>
  );
}

/* ─── Tiny icon components ──────────────────────────────────────────────────── */

function DragHandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="3.5" r="1.1" fill="currentColor" />
      <circle cx="9.5" cy="3.5" r="1.1" fill="currentColor" />
      <circle cx="4.5" cy="7" r="1.1" fill="currentColor" />
      <circle cx="9.5" cy="7" r="1.1" fill="currentColor" />
      <circle cx="4.5" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function DesktopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function MobileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
