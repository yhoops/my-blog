// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  // Static-first: content pages are prerendered at build time for maximum speed.
  // Admin + API routes opt into on-demand SSR via `export const prerender = false`.
  output: "static",
  site: "https://example.vercel.app",
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: false,
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
})
