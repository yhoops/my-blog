import siteData from "../content/site.json"
import type { SiteConfig, ThemeConfig } from "./config-types"

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig
}

// Convert theme tokens into an inline `style` string of CSS custom properties.
// Injected on <html> so every page (and the live admin preview) reflects the theme.
export function themeToCssVars(theme: ThemeConfig): string {
  const c = theme.colors
  const t = theme.typography
  const a = theme.animation
  const vars: Record<string, string> = {
    "--color-bg": c.bg,
    "--color-surface": c.surface,
    "--color-ink": c.ink,
    "--color-muted": c.muted,
    "--color-faint": c.faint,
    "--color-accent": c.accent,
    "--color-accent-soft": c.accentSoft,
    "--color-line": c.line,
    "--font-heading": theme.fonts.heading,
    "--font-body": theme.fonts.body,
    "--fs-base": `${t.baseSize}px`,
    "--fs-scale": String(t.scale),
    "--measure": `${t.measure}rem`,
    "--radius": `${t.radius}px`,
    "--anim-duration": a.enabled ? `${a.duration}ms` : "0ms",
    "--anim-distance": a.enabled ? `${a.distance}px` : "0px",
    "--anim-ease": a.ease,
  }
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")
}

// Modular type scale helper (used inline where needed).
export function typeScale(theme: ThemeConfig, step: number): string {
  return `${Math.pow(theme.typography.scale, step).toFixed(3)}rem`
}
