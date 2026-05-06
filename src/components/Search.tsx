import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import styles from "./Search.module.css"

interface PagefindResult {
  url: string
  excerpt: string
  meta: { title?: string }
}

interface PagefindAPI {
  search(query: string): Promise<{
    results: { data: () => Promise<PagefindResult> }[]
  }>
}

interface Props {
  open: boolean
  onClose: () => void
  lang: "zh-CN" | "en"
}

const COPY = {
  "zh-CN": {
    placeholder: "搜索…",
    empty: "没有找到匹配的内容。",
    hint: "输入关键词以搜索全部文章和笔记。",
    loading: "正在加载搜索索引…",
    error: "搜索索引尚未生成。在生产构建中可用。",
    close: "关闭",
  },
  en: {
    placeholder: "Search…",
    empty: "No matches.",
    hint: "Type a keyword to search all essays and notes.",
    loading: "Loading search index…",
    error: "Search index not built. Available after a production build.",
    close: "Close",
  },
}

export function Search({ open, onClose, lang }: Props) {
  const copy = COPY[lang]
  const inputRef = useRef<HTMLInputElement>(null)
  const [pagefind, setPagefind] = useState<PagefindAPI | null>(null)
  const [pagefindStatus, setPagefindStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  )
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PagefindResult[]>([])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    if (pagefind || pagefindStatus !== "idle") return
    setPagefindStatus("loading")
    ;(async () => {
      try {
        // Pagefind drops its bundle at /pagefind/pagefind.js after a production build.
        // Use a Function-wrapped import so neither Vite nor TypeScript tries to resolve
        // the runtime path at build time.
        const dynamicImport = new Function("u", "return import(u)") as (u: string) => Promise<unknown>
        const mod = (await dynamicImport("/pagefind/pagefind.js")) as PagefindAPI
        setPagefind(mod)
        setPagefindStatus("ready")
      } catch {
        setPagefindStatus("error")
      }
    })()
  }, [open, pagefind, pagefindStatus])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!pagefind || !query.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    const handle = setTimeout(async () => {
      const search = await pagefind.search(query)
      const data = await Promise.all(search.results.slice(0, 10).map((r) => r.data()))
      if (!cancelled) setResults(data)
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [query, pagefind])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder={copy.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={copy.placeholder}
        />
        <div className={styles.results}>
          {pagefindStatus === "error" && <p className={styles.message}>{copy.error}</p>}
          {pagefindStatus === "loading" && <p className={styles.message}>{copy.loading}</p>}
          {pagefindStatus === "ready" && query.trim() === "" && (
            <p className={styles.message}>{copy.hint}</p>
          )}
          {pagefindStatus === "ready" && query.trim() !== "" && results.length === 0 && (
            <p className={styles.message}>{copy.empty}</p>
          )}
          {results.length > 0 && (
            <ul className={styles.list}>
              {results.map((r) => (
                <li key={r.url} className={styles.row}>
                  <Link to={r.url} className={styles.title} onClick={onClose}>
                    {r.meta.title ?? r.url}
                  </Link>
                  <p className={styles.excerpt} dangerouslySetInnerHTML={{ __html: r.excerpt }} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={copy.close}>
          ✕
        </button>
      </div>
    </div>
  )
}
