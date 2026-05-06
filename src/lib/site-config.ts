/**
 * Static site config. Fill in to enable optional integrations.
 * Anything left null/empty disables that integration cleanly.
 */

/** Off-site links shown in the Home page's right rail ("Elsewhere"). Each
 *  entry rendered as a single 14px Inter link. Set href to "" to hide. */
export const socialLinks: { label: string; href: string }[] = [
  { label: "Instagram", href: "" },
  { label: "GitHub", href: "" },
  { label: "Email", href: "" },
]

export const siteConfig = {
  /** Giscus comments — leave any field empty to disable.
   *  Set up at https://giscus.app, then paste the values here. */
  giscus: {
    repo: "Coh1e/blog" as `${string}/${string}` | "",         // "user/repo"
    repoId: "R_kgDOSV6ahQ",
    category: "Announcements",
    categoryId: "DIC_kwDOSV6ahc4C8cpP",
    mapping: "pathname" as
      | "pathname" | "url" | "title" | "og:title"
      | "specific" | "number",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "bottom" as "top" | "bottom",
    /** Base theme. Light/dark suffix is chosen at runtime by mirroring the
     *  site's `<html data-theme>` attribute (see Comments.tsx).
     *   - "noborder" — no card frame, matches the site's flat look
     *   - "default"  — giscus's default boxed style
     *   - "custom"   — load themeUrlLight / themeUrlDark (see docs/comments.md). */
    themeBase: "custom" as "noborder" | "default" | "custom",
    /** Only used when themeBase === "custom". Must be absolute https:// URLs
     *  the giscus iframe can fetch (i.e. served from your prod domain). */
    themeUrlLight: "https://blog.coh1e.com/giscus-light.css" as `https://${string}` | "",
    themeUrlDark: "https://blog.coh1e.com/giscus-dark.css" as `https://${string}` | "",
    lang: "auto",
    loading: "lazy" as "lazy" | "eager",
  },
} as const

export function isGiscusEnabled(): boolean {
  const g = siteConfig.giscus
  return Boolean(g.repo && g.repoId && g.categoryId)
}
