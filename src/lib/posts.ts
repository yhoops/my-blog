import { getCollection } from "astro:content"
import type { CollectionEntry } from "astro:content"

export async function getAllPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft)
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  )
}

export function getCanonicalSlug(post: CollectionEntry<"posts">): string {
  return post.data.canonicalSlug || post.id.split("/").filter(Boolean).at(-1) || post.id
}

export function getPublicPath(post: CollectionEntry<"posts">): string {
  const prefix = post.data.kind === "project" ? "work" : "writing"
  return `/${prefix}/${getCanonicalSlug(post)}`
}

export async function findPostByPublicSlug(kind: "writing" | "project", slug: string) {
  const posts = await getCollection("posts", ({ data }) => data.kind === kind && !data.draft)
  return posts.find((post) => {
    const canonical = getCanonicalSlug(post)
    const aliases = post.data.aliases ?? []
    return canonical === slug || aliases.includes(slug)
  }) ?? null
}

export async function getWriting() {
  const posts = await getAllPosts()
  return posts.filter((p) => p.data.kind === "writing")
}

export async function getProjects() {
  const posts = await getAllPosts()
  return posts.filter((p) => p.data.kind === "project")
}

export async function getPostCategories() {
  const posts = await getWriting()
  const cats = new Set(posts.map((p) => p.data.category).filter(Boolean))
  return [...cats].sort()
}

export async function getPostTags() {
  const posts = await getWriting()
  const tags = new Set(posts.flatMap((p) => p.data.tags))
  return [...tags].sort()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatYear(date: Date): string {
  return String(date.getFullYear())
}
