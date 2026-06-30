// Central type definitions for the entire site configuration.
// This single object is what the admin panel edits and what gets committed to GitHub.

export interface ThemeConfig {
  colors: {
    bg: string
    surface: string
    ink: string
    muted: string
    faint: string
    accent: string
    accentSoft: string
    line: string
  }
  fonts: {
    heading: string
    body: string
  }
  typography: {
    baseSize: number // px
    scale: number // modular scale ratio
    measure: number // rem, reading width
    radius: number // px
  }
  animation: {
    duration: number // ms
    distance: number // px
    ease: string
    enabled: boolean
  }
}

// A block is a re-orderable section on the home page.
export type BlockType =
  | "hero"
  | "intro"
  | "writingList"
  | "projectList"
  | "richText"
  | "linkList"
  | "spacer"
  | "divider"
  | "imageRow"

export interface Block {
  id: string
  type: BlockType
  visible: boolean
  // free-form props per block type
  props: Record<string, any>
}

export interface NavLink {
  label: string
  href: string
}

export interface ContentFolder {
  id: string
  name: string
  parentId?: string
  description?: string
}

export interface ContentConfig {
  categories: string[]
  folders: ContentFolder[]
  floatingNav: {
    title: string
    searchPlaceholder: string
    writingLabel: string
    workLabel: string
    readingLabel: string
  }
}

export interface SiteConfig {
  meta: {
    title: string
    description: string
    author: string
    url: string
  }
  nav: NavLink[]
  social: { label: string; href: string }[]
  content?: ContentConfig
  theme: ThemeConfig
  // ordered list of homepage blocks (drag to reorder in admin)
  blocks: Block[]
  // reusable custom preset components the user defines in the admin
  presets: PresetComponent[]
}

// A user-defined preset component: a named, configurable block template.
export interface PresetComponent {
  id: string
  name: string
  baseType: BlockType
  defaultProps: Record<string, any>
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  category?: string
  folder?: string
  kind: "writing" | "project"
  draft: boolean
  cover?: string
  // for projects
  year?: string
  role?: string
  url?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  body: string
}
