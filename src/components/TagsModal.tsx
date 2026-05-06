import { useEffect, useRef, useState } from "react"
import styles from "./TagsModal.module.css"

interface Props {
  open: boolean
  onClose: () => void
  tags: [tag: string, count: number][]
  selectedTags: string[]
  onToggle: (tag: string) => void
  lang: "zh-CN" | "en"
}

type SortBy = "count" | "name"

const COPY = {
  "zh-CN": {
    title: (n: number) => `全部标签 · ${n}`,
    searchPlaceholder: "搜索标签",
    sortLabel: "排序",
    byCount: "按频次",
    byName: "按名称",
    empty: "没有匹配的标签",
    close: "关闭",
  },
  en: {
    title: (n: number) => `All Tags · ${n}`,
    searchPlaceholder: "search tags",
    sortLabel: "Sort",
    byCount: "by count",
    byName: "by name",
    empty: "No tags match",
    close: "Close",
  },
} as const

export function TagsModal({ open, onClose, tags, selectedTags, onToggle, lang }: Props) {
  const c = COPY[lang]
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("count")

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setSortBy("count")
    }
  }, [open])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const filtered = q ? tags.filter(([t]) => t.toLowerCase().includes(q)) : tags
  const sorted =
    sortBy === "name"
      ? [...filtered].sort((a, b) => a[0].localeCompare(b[0]))
      : [...filtered].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={c.title(tags.length)}
      >
        <div className={styles.header}>
          <p className={styles.title}>{c.title(tags.length)}</p>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={c.close}
          >
            ×
          </button>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>⌕</span>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder={c.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={c.searchPlaceholder}
          />
        </div>

        <div className={styles.sortRow} role="radiogroup" aria-label={c.sortLabel}>
          <span className={styles.sortLabel}>{c.sortLabel}:</span>
          <button
            type="button"
            className={`${styles.sortOption} ${sortBy === "count" ? styles.sortActive : ""}`}
            onClick={() => setSortBy("count")}
            role="radio"
            aria-checked={sortBy === "count"}
          >
            {c.byCount}
          </button>
          <span className={styles.sortSep} aria-hidden>·</span>
          <button
            type="button"
            className={`${styles.sortOption} ${sortBy === "name" ? styles.sortActive : ""}`}
            onClick={() => setSortBy("name")}
            role="radio"
            aria-checked={sortBy === "name"}
          >
            {c.byName}
          </button>
        </div>

        <div className={styles.tagList}>
          {sorted.length === 0 ? (
            <p className={styles.empty}>{c.empty}</p>
          ) : (
            sorted.map(([tag, n]) => {
              const active = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.tagItem} ${active ? styles.tagItemActive : ""}`}
                  onClick={() => {
                    onToggle(tag)
                    onClose()
                  }}
                  aria-pressed={active}
                >
                  <span className={styles.tagName}>{tag}</span>
                  <span className={styles.tagCount}>{n}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
