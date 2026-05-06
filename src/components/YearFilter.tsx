import { useEffect, useRef, useState } from "react"
import type { Entry } from "@/lib/content"
import styles from "./YearFilter.module.css"

interface Props {
  entries: Entry[]
  active: number | null
  onChange: (year: number | null) => void
  lang: "zh-CN" | "en"
}

const COPY = {
  "zh-CN": {
    anyYear: "任意年份",
    anyYearWithCount: (n: number) => `任意年份（${n}）`,
  },
  en: {
    anyYear: "Any year",
    anyYearWithCount: (n: number) => `Any year (${n})`,
  },
} as const

/**
 * Year/time filter for the Map page. Per Figma 164:161 + design notes:
 *   trigger button "任意年份 ▾"; open panel shows year rows with 12-bar
 *   monthly sparkline + count + reset "any year (N)" entry.
 *
 * Toggle-to-clear (clicking the active year in the panel clears the filter).
 */
export function YearFilter({ entries, active, onChange, lang }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const c = COPY[lang]

  // Close on outside click + Esc.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // Group entries by year and by year+month.
  const yearCounts = new Map<number, number>()
  const yearMonthCounts = new Map<number, number[]>()
  for (const e of entries) {
    if (!e.date) continue
    const y = e.date.getFullYear()
    const m = e.date.getMonth()
    yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1)
    if (!yearMonthCounts.has(y)) yearMonthCounts.set(y, new Array(12).fill(0))
    yearMonthCounts.get(y)![m]++
  }
  const years = [...yearCounts.keys()].sort((a, b) => b - a)
  const maxBar = Math.max(1, ...[...yearMonthCounts.values()].flat())

  const triggerLabel = active === null ? c.anyYear : String(active)
  const select = (year: number | null) => {
    onChange(year)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${active !== null ? styles.triggerActive : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{triggerLabel}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && (
        <div className={styles.panel} role="listbox">
          <button
            type="button"
            className={`${styles.row} ${styles.resetRow} ${active === null ? styles.rowActive : ""}`}
            onClick={() => select(null)}
            role="option"
            aria-selected={active === null}
          >
            <span className={styles.rowLabel}>{c.anyYearWithCount(entries.length)}</span>
          </button>
          {years.map((y) => {
            const counts = yearMonthCounts.get(y) ?? []
            const total = yearCounts.get(y) ?? 0
            return (
              <button
                type="button"
                key={y}
                className={`${styles.row} ${active === y ? styles.rowActive : ""}`}
                onClick={() => select(active === y ? null : y)}
                role="option"
                aria-selected={active === y}
              >
                <span className={styles.rowLabel}>{y}</span>
                <Sparkline counts={counts} max={maxBar} />
                <span className={styles.rowCount}>{total}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Sparkline({ counts, max }: { counts: number[]; max: number }) {
  const W = 96
  const H = 16
  const bars = 12
  const gap = 1
  const barW = (W - gap * (bars - 1)) / bars
  return (
    <svg
      width={W}
      height={H}
      className={styles.sparkline}
      role="img"
      aria-hidden="true"
    >
      {counts.map((n, i) => {
        const h = max === 0 ? 0 : (n / max) * H
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={H - h}
            width={barW}
            height={h}
            className={styles.bar}
          />
        )
      })}
    </svg>
  )
}
