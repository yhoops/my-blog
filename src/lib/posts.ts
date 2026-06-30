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
