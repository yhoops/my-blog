// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import cloudflare from "@astrojs/cloudflare"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  // Static-first: content pages are prerendered for speed on the Cloudflare CDN.
  // Admin + API routes opt into on-demand rendering via `export const prerender = false`.
  output: "static",
  site: "https://example.pages.dev",
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: "passthrough",
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
