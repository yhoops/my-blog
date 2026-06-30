import { getCollection } from "astro:content"

export async function getAllPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft)
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  )
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
