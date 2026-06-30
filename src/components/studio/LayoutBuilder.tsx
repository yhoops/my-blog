import { useState } from "react";
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
  linkList: { heading: "在别处", items: [{ label: "GitHub", href: "https://github.com", note: "" }] },
  spacer: { size: 48 },
};

let idCounter = 0;
function newId(prefix = "blk") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export default function LayoutBuilder({
  config,
  onChange,
}: {
  config: SiteConfig;
  onChange: (c: SiteConfig) => void;
}) {
  const [editing, setEditing] = useState<Block | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
    setBlocks(config.blocks.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
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
    onChange({ ...config, presets: (config.presets || []).filter((p) => p.id !== id) });
  }

  return (
    <>
      <div className="panel">
        <h3>首页区块（拖拽排序）</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={config.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {config.blocks.map((block) => (
              <SortableBlock
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
        {config.blocks.length === 0 && <p className="hint">还没有区块，从下方添加。</p>}
      </div>

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
              <button className="btn btn-danger" onClick={() => removePreset(preset.id)}>
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {editing && (
        <BlockEditor block={editing} onClose={() => setEditing(null)} onSave={saveBlock} />
      )}
    </>
  );
}

function SortableBlock({
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
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

// Generic prop editor — renders fields based on the block's props shape.
function BlockEditor({
  block,
  onClose,
  onSave,
}: {
  block: Block;
  onClose: () => void;
  onSave: (b: Block) => void;
}) {
  const [props, setProps] = useState<Record<string, any>>(structuredClone(block.props));

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
          <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => onSave({ ...block, props })}>
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
