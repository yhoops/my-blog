import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getAllPosts } from "../lib/posts"
import { getSiteConfig } from "../lib/config"

export async function GET(context: APIContext) {
  const site = getSiteConfig()
  const posts = await getAllPosts()
  return rss({
    title: site.meta.title,
    description: site.meta.description,
    site: context.site ?? site.meta.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/${post.data.kind === "project" ? "work" : "writing"}/${post.id}/`,
    })),
  })
}
