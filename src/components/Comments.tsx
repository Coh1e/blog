import { useEffect, useRef } from "react"
import { siteConfig, isGiscusEnabled } from "@/lib/site-config"
import styles from "./Comments.module.css"

interface Props {
  /** Used as the term for "specific" mapping. Otherwise informational. */
  pageId: string
  lang: "zh-CN" | "en"
}

/** Resolve the giscus `data-theme` value from the site's current `<html data-theme>`
 *  attribute and the configured base theme. The site's dark mode is attribute-driven
 *  (see index.html bootstrap), not media-query-driven, so we mirror the attribute
 *  rather than letting giscus follow `prefers-color-scheme`.
 *
 *   - "noborder" → "noborder_dark" | "noborder_light"
 *   - "default"  → "dark" | "light"
 *   - "custom"   → themeUrlDark | themeUrlLight (URLs must be absolute https:// so
 *     the giscus iframe can fetch them; falls back to "noborder" if a URL is empty).
 */
function pickGiscusTheme(): string {
  const g = siteConfig.giscus
  const isDark = typeof document !== "undefined" && document.documentElement.dataset.theme === "dark"
  if (g.themeBase === "custom") {
    const url = isDark ? g.themeUrlDark : g.themeUrlLight
    if (url) return url
    // Fallback when the URL for the active mode hasn't been set yet (e.g. in dev
    // before deploy). Keep the user from staring at giscus's default light theme.
    return isDark ? "noborder_dark" : "noborder_light"
  }
  if (g.themeBase === "noborder") return isDark ? "noborder_dark" : "noborder_light"
  return isDark ? "dark" : "light"
}

/** Mounts the Giscus iframe via its script. SSR-safe (does nothing during render). */
export function Comments({ pageId, lang }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  // Effect 1: mount / remount the iframe when the article (pageId) or lang changes.
  useEffect(() => {
    if (!isGiscusEnabled() || !ref.current) return
    const g = siteConfig.giscus
    const giscusLang = g.lang === "auto" ? (lang === "zh-CN" ? "zh-CN" : "en") : g.lang

    // Wipe any previous mount (handles SPA navigation between articles)
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("data-repo", g.repo as string)
    script.setAttribute("data-repo-id", g.repoId)
    script.setAttribute("data-category", g.category)
    script.setAttribute("data-category-id", g.categoryId)
    script.setAttribute("data-mapping", g.mapping)
    script.setAttribute("data-strict", g.strict)
    script.setAttribute("data-reactions-enabled", g.reactionsEnabled)
    script.setAttribute("data-emit-metadata", g.emitMetadata)
    script.setAttribute("data-input-position", g.inputPosition)
    script.setAttribute("data-theme", pickGiscusTheme())
    script.setAttribute("data-lang", giscusLang)
    script.setAttribute("data-loading", g.loading)
    if (g.mapping === "specific") script.setAttribute("data-term", pageId)

    ref.current.appendChild(script)
  }, [pageId, lang])

  // Effect 2: subscribe to <html data-theme> changes; postMessage to the iframe
  // instead of remounting (avoids losing the user's reply draft).
  useEffect(() => {
    if (!isGiscusEnabled() || typeof MutationObserver === "undefined") return

    const sendTheme = () => {
      const iframe = ref.current?.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
      if (!iframe?.contentWindow) return
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: pickGiscusTheme() } } },
        "https://giscus.app",
      )
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          sendTheme()
          break
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  if (!isGiscusEnabled()) return null

  const headingLabel = lang === "zh-CN" ? "评论" : "Comments"
  const privacyNote =
    lang === "zh-CN"
      ? "评论审核后显示。不收邮箱，不存 IP。"
      : "Comments are moderated. No email, no IP collection."

  return (
    <section className={styles.comments} aria-label={headingLabel}>
      <h2 className={styles.heading}>{headingLabel}</h2>
      <p className={styles.privacyNote}>{privacyNote}</p>
      <div ref={ref} className={styles.giscus} />
    </section>
  )
}
