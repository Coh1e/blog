import { useEffect, useId, useRef, useState } from "react"
import styles from "./Mermaid.module.css"

interface Props {
  source: string
}

/**
 * Lazy-loads the mermaid library on the first render of any block, then
 * renders the SVG into a div ref. SSR-safe: useEffect doesn't run on server,
 * so the mermaid module is never imported in the SSR bundle.
 *
 * Mermaid is heavy (~600KB). It is not imported until a page that contains
 * a ```mermaid block actually mounts in the browser.
 */
export function Mermaid({ source }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")
  const ref = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.dataset.theme === "dark" ? "dark" : "default",
          fontFamily: "var(--header-font)",
        })
        const { svg } = await mermaid.render(`m-${id}`, source)
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, source])

  if (error) {
    return (
      <pre className={styles.error}>
        <code>{`Mermaid render error:\n${error}`}</code>
      </pre>
    )
  }
  return (
    <div ref={ref} className={styles.block} aria-label="Diagram">
      <span className={styles.placeholder}>Loading diagram…</span>
    </div>
  )
}
