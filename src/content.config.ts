import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    canonicalSlug: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    projectHighlights: z.array(z.string()).default([]),
    contextNote: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.string().default("未分类"),
    folder: z.string().default(""),
    kind: z.enum(["writing", "project"]).default("writing"),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    year: z.string().optional(),
    role: z.string().optional(),
    url: z.string().optional(),
  }),
})

export const collections = { posts }
