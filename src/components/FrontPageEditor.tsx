import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Block, SiteConfig } from "../lib/config-types"

/* ---------- Local types ---------- */

interface PostItem {
  slug: string
  title: string
  description: string
  date: string
  kind: "writing" | "project"
  year?: string
  role?: string
}

/* ---------- Main component ---------- */

export default function FrontPageEditor() {
  const [authed, setAuthed] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [savedBlocks, setSavedBlocks] = useState<Block[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  // 1) Check session on mount
  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.authed) setAuthed(true)
      })
      .catch(() => {})
  }, [])

  // 2) Enter layout editor
  async function enterEditMode() {
    setEditMode(true)
    setStatus("加载中…")
    try {
      const [configRes, postsRes] = await Promise.all([
        fetch("/api/config").then((r) => r.json()),
        fetch("/api/posts").then((r) => r.json()),
      ])
      if (configRes.ok && configRes.config) {
        setBlocks(configRes.config.blocks)
        setSavedBlocks(configRes.config.blocks)
      }
      if (postsRes.ok && postsRes.posts) {
        setPosts(postsRes.posts)
      }
      setStatus(null)
      // hide static blocks
      hideStaticBlocks()
    } catch {
      setStatus("加载失败，请重试")
    }
  }

  // 3) Exit editor — restore static view
  function exitEditMode() {
    const hasChanges =
      savedBlocks.length &&
      JSON.stringify(blocks.map((b) => b.id)) !==
        JSON.stringify(savedBlocks.map((b) => b.id))
    if (hasChanges && !confirm("有未保存的更改，确定退出吗？")) return
    setEditMode(false)
    setStatus(null)
    showStaticBlocks()
  }

  // 4) Cancel unsaved changes
  function cancelChanges() {
    setBlocks(savedBlocks)
    setStatus(null)
  }

  // 5) Save new block order to GitHub
  async function saveOrder() {
    setSaving(true)
    setStatus("提交中…")
    try {
      const res = await fetch("/api/config")
      const configData = await res.json()
      if (!configData.ok) {
        setStatus("获取配置失败")
        setSaving(false)
        return
      }
      const config: SiteConfig = configData.config
      config.blocks = blocks

      const saveRes = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })
      const saveData = await saveRes.json()
      if (saveData.ok) {
        setSavedBlocks(blocks)
        setStatus("排序已保存，站点将自动重新部署")
        setTimeout(() => setStatus(null), 4000)
      } else {
        setStatus("保存失败: " + (saveData.error || "未知错误"))
      }
    } catch {
      setStatus("网络错误，请重试")
    } finally {
      setSaving(false)
    }
  }

  // DOM helpers for toggling static content
  function hideStaticBlocks() {
    const c = document.getElementById("blocks-container")
    if (c) c.style.display = "none"
  }
  function showStaticBlocks() {
    const c = document.getElementById("blocks-container")
    if (c) c.style.display = ""
  }

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const oldIdx = prev.findIndex((b) => b.id === active.id)
      const newIdx = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  const dirty =
    savedBlocks.length &&
    blocks.length &&
    JSON.stringify(blocks.map((b) => b.id)) !==
      JSON.stringify(savedBlocks.map((b) => b.id))

  // Not authed — render nothing (static HTML stays)
  if (!authed) return null

  return (
    <>
      {/* ------ Floating toolbar ------ */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--color-surface)",
          border: "1px solid var(--color-line)",
          borderRadius: 14,
          padding: "6px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          userSelect: "none",
          color: "var(--color-ink)",
        }}
      >
        {/* icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.4 }}>
          <rect x="1" y="1" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="11" width="12" height="2" rx="1" fill="currentColor" />
        </svg>

        {!editMode ? (
          <button onClick={enterEditMode} style={{ ...btn, fontWeight: 500 }}>
            编辑布局
          </button>
        ) : (
          <>
            <span style={{ color: "var(--color-faint)", fontSize: 12 }}>
              {dirty ? "有未保存的更改" : "拖动区块左侧手柄排序"}
            </span>
            {dirty && (
              <>
                <button
                  onClick={saveOrder}
                  disabled={saving}
                  style={{ ...btn, ...btnPrimary, opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? "保存中…" : "保存排序"}
                </button>
                <button onClick={cancelChanges} style={{ ...btn, ...btnGhost }}>
                  撤销
                </button>
              </>
            )}
            {!dirty && (
              <button onClick={exitEditMode} style={{ ...btn, ...btnGhost }}>
                退出
              </button>
            )}
          </>
        )}

        {status && (
          <span
            style={{
              fontSize: 12,
              color: status.includes("失败") || status.includes("错误")
                ? "#e53e3e"
                : "var(--color-muted)",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* ------ Draggable blocks (edit mode) ------ */}
      {editMode && (
        <div id="frontpage-draggable">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks
                .filter((b) => b.visible)
                .map((block) => (
                  <SortableBlockItem key={block.id} block={block} posts={posts} />
                ))}
            </SortableContext>
          </DndContext>

          {/* hidden blocks hint */}
          {blocks.some((b) => !b.visible) && (
            <div
              style={{
                textAlign: "center",
                padding: "1rem",
                color: "var(--color-faint)",
                fontSize: 13,
              }}
            >
              {blocks.filter((b) => !b.visible).length} 个区块已隐藏
            </div>
          )}
        </div>
      )}

      {/* global hover styles for drag handle */}
      <style>{`
        .fp-block-wrap {
          position: relative;
          transition: box-shadow 200ms;
        }
        .fp-block-wrap:hover .fp-drag-handle {
          opacity: 1 !important;
        }
        .fp-block-wrap:hover {
          --drag-handle-opacity: 1;
        }
      `}</style>
    </>
  )
}

/* ---------- Sortable block item ---------- */

function SortableBlockItem({
  block,
  posts,
}: {
  block: Block
  posts: PostItem[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    ...(isDragging
      ? {
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          borderRadius: "var(--radius, 2px)",
          zIndex: 999,
        }
      : {}),
  }

  return (
    <div ref={setNodeRef} style={style} className="fp-block-wrap">
      {/* Drag handle — accent bar on the left */}
      <div
        {...attributes}
        {...listeners}
        className="fp-drag-handle"
        style={{
          position: "absolute",
          left: 0,
          top: 4,
          bottom: 4,
          width: 4,
          background: "var(--color-accent)",
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          cursor: "grab",
          opacity: 0,
          transition: "opacity 200ms",
          zIndex: 10,
        }}
        title="拖拽排序"
      />
      {renderBlock(block, posts)}
    </div>
  )
}

/* ---------- Block renderers ---------- */

function renderBlock(block: Block, posts: PostItem[]) {
  const p = block.props
  switch (block.type) {
    case "hero":
      return <BlockHero name={p.name} tagline={p.tagline} intro={p.intro} />
    case "writingList":
      return (
        <BlockWritingList
          heading={p.heading}
          limit={p.limit}
          showDescription={p.showDescription}
          posts={posts}
        />
      )
    case "projectList":
      return (
        <BlockProjectList heading={p.heading} limit={p.limit} posts={posts} />
      )
    case "linkList":
      return <BlockLinkList heading={p.heading} items={p.items} />
    case "richText":
      return <BlockRichText heading={p.heading} body={p.body || p.text} />
    case "spacer":
      return <BlockSpacer size={p.size} divider={p.divider} />
    default:
      return null
  }
}

/* ------ Hero ------ */

function BlockHero({
  name,
  tagline,
  intro,
}: {
  name?: string
  tagline?: string
  intro?: string
}) {
  return (
    <section
      style={{
        maxWidth: 768,
        margin: "0 auto",
        padding: "2.5rem 1.5rem 4rem",
      }}
      className="md-px-8 md-pt-16 md-pb-24"
    >
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-accent)",
          letterSpacing: "0.05em",
          marginBottom: 20,
          marginTop: 0,
        }}
      >
        {tagline}
      </p>
      <h1
        style={{
          fontSize: "2.25rem",
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          lineHeight: 1.05,
          marginBottom: 32,
          marginTop: 0,
          color: "var(--color-ink)",
        }}
        className="md-text-6xl"
      >
        {name}
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          lineHeight: 1.7,
          color: "var(--color-muted)",
          maxWidth: "var(--measure)",
          margin: 0,
        }}
        className="md-text-xl"
      >
        {intro}
      </p>
    </section>
  )
}

/* ------ Writing list ------ */

function BlockWritingList({
  heading,
  limit,
  showDescription,
  posts,
}: {
  heading?: string
  limit?: number
  showDescription?: boolean
  posts: PostItem[]
}) {
  const items = posts
    .filter((p) => p.kind === "writing")
    .slice(0, limit || 5)

  return (
    <Section>
      <SectionHeader heading={heading || "随笔"} href="/writing" />
      <Ul>
        {items.map((post) => (
          <Li key={post.slug} href={`/writing/${post.slug}`}>
            <Row>
              <Title>{post.title}</Title>
              <Faint>{fmtDate(post.date)}</Faint>
            </Row>
            {showDescription && post.description && (
              <Desc>{post.description}</Desc>
            )}
          </Li>
        ))}
      </Ul>
    </Section>
  )
}

/* ------ Project list ------ */

function BlockProjectList({
  heading,
  limit,
  posts,
}: {
  heading?: string
  limit?: number
  posts: PostItem[]
}) {
  const items = posts
    .filter((p) => p.kind === "project")
    .slice(0, limit || 4)

  return (
    <Section>
      <h2 style={sectionHeaderStyle}>{heading || "作品"}</h2>
      <Ul>
        {items.map((p) => (
          <Li key={p.slug} href={`/work/${p.slug}`}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <Faint style={{ width: 48, flexShrink: 0 }}>
                {p.year || yr(p.date)}
              </Faint>
              <div>
                <Title>{p.title}</Title>
                {p.description && <Desc>{p.description}</Desc>}
              </div>
              {p.role && (
                <Faint
                  className="sm-block"
                  style={{ display: "none" }}
                >
                  {p.role}
                </Faint>
              )}
            </div>
          </Li>
        ))}
      </Ul>
    </Section>
  )
}

/* ------ Link list ------ */

function BlockLinkList({
  heading,
  items,
}: {
  heading?: string
  items?: { label: string; href: string; note?: string }[]
}) {
  const list = items ?? []

  return (
    <Section>
      <h2 style={sectionHeaderStyle}>{heading || "在别处"}</h2>
      <Ul>
        {list.map((item, i) => (
          <Li
            key={i}
            href={item.href}
            external={item.href.startsWith("http")}
          >
            <Row>
              <Title>{item.label}</Title>
              {item.note && <Faint>{item.note}</Faint>}
            </Row>
          </Li>
        ))}
      </Ul>
    </Section>
  )
}

/* ------ Rich text ------ */

function BlockRichText({
  heading,
  body,
}: {
  heading?: string
  body?: string
}) {
  const paras = (body ?? "").split("\n\n").filter(Boolean)

  return (
    <Section>
      {heading && (
        <h2 style={sectionHeaderStyle}>{heading}</h2>
      )}
      <div
        style={{
          maxWidth: "var(--measure)",
          lineHeight: 1.7,
          color: "var(--color-ink)",
        }}
      >
        {paras.map((p, i) => (
          <p key={i} style={{ margin: "1.4em 0" }}>
            {p}
          </p>
        ))}
      </div>
    </Section>
  )
}

/* ------ Spacer ------ */

function BlockSpacer({
  size,
  divider,
}: {
  size?: string
  divider?: boolean
}) {
  const h: Record<string, string> = {
    sm: "1.5rem",
    md: "3rem",
    lg: "5rem",
  }
  const py = h[size || "md"]

  return (
    <div style={{ padding: `${py} 1.5rem`, maxWidth: 768, margin: "0 auto" }}>
      {divider && (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--color-line)",
            margin: 0,
          }}
        />
      )}
    </div>
  )
}

/* ---------- Shared sub-components ---------- */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        maxWidth: 768,
        margin: "0 auto",
        padding: "3rem 1.5rem",
      }}
    >
      {children}
    </section>
  )
}

function SectionHeader({
  heading,
  href,
}: {
  heading: string
  href?: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 32,
      }}
    >
      <h2 style={sectionHeaderStyle}>{heading}</h2>
      {href && (
        <a
          href={href}
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            textDecoration: "none",
          }}
        >
          全部
        </a>
      )}
    </div>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </ul>
  )
}

function Li({
  children,
  href,
  external,
}: {
  children: React.ReactNode
  href?: string
  external?: boolean
}) {
  const borderStyle: React.CSSProperties = {
    borderTop: "1px solid var(--color-line)",
  }

  if (!href) {
    return <li style={borderStyle}>{children}</li>
  }

  return (
    <li style={borderStyle}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={{
          display: "block",
          padding: "1.25rem 0",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {children}
      </a>
    </li>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      {children}
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "1.25rem",
        fontFamily: "var(--font-heading)",
        fontWeight: 400,
        margin: 0,
        transition: "color 200ms",
      }}
    >
      {children}
    </h3>
  )
}

function Desc({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        marginTop: 8,
        color: "var(--color-muted)",
        lineHeight: 1.7,
        maxWidth: "var(--measure)",
      }}
    >
      {children}
    </p>
  )
}

function Faint({
  children,
  style: extStyle,
  className,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        fontSize: "0.875rem",
        color: "var(--color-faint)",
        fontVariantNumeric: "tabular-nums",
        flexShrink: 0,
        ...extStyle,
      }}
    >
      {children}
    </span>
  )
}

/* ---------- Helpers ---------- */

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "var(--color-faint)",
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  margin: 0,
}

function fmtDate(d: string): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(d))
  } catch {
    return d
  }
}

function yr(d: string): string {
  try {
    return String(new Date(d).getFullYear())
  } catch {
    return d
  }
}

/* ---------- Button styles ---------- */

const btn: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "1px solid var(--color-line)",
  background: "transparent",
  color: "var(--color-ink)",
  cursor: "pointer",
  fontSize: 13,
  lineHeight: "20px",
  transition: "all 150ms",
}

const btnPrimary: React.CSSProperties = {
  background: "var(--color-accent)",
  borderColor: "var(--color-accent)",
  color: "#fff",
}

const btnGhost: React.CSSProperties = {
  borderColor: "transparent",
  color: "var(--color-muted)",
}
