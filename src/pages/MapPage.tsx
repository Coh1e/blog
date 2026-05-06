import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Toolbar } from "@/components/Toolbar"
import { PageHead } from "@/components/PageHead"
import { ArchiveRow } from "@/components/ArchiveRow"
import { YearFilter } from "@/components/YearFilter"
import { TagsModal } from "@/components/TagsModal"
import {
  byDateDesc,
  getEntriesFor,
  type Lang,
  type Status,
  type Entry,
} from "@/lib/content"
import styles from "./MapPage.module.css"

interface Props {
  locale: "zh" | "en"
}

const STATUSES: Status[] = ["seedling", "growing", "evergreen", "archived"]
const STATUS_SET = new Set<string>(STATUSES)

function parseStatus(raw: string | null): Status | null {
  return raw && STATUS_SET.has(raw) ? (raw as Status) : null
}
function parseYear(raw: string | null): number | null {
  return raw && /^\d{4}$/.test(raw) ? Number(raw) : null
}
function parseTags(raw: string | null): string[] {
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : []
}
const STATUS_GLYPH: Record<Status, string> = {
  seedling: "○",
  growing: "◐",
  evergreen: "●",
  archived: "▣",
}

const COPY = {
  zh: {
    title: "内容地图",
    eyebrow: "map /",
    subtitle: (n: number) => `${n} 条 · 按时序`,
    tagsLabel: "标签",
    showAll: (n: number) => `查看全部 ${n} →`,
    empty: "没有匹配的条目",
    clear: "清空",
    clearAll: "全部清空",
    chipRemove: (t: string) => `移除标签 ${t}`,
    selectedHeading: (n: number) => `已选 (${n})`,
    searchTags: "搜索标签",
    noTagMatch: "没有匹配的标签",
  },
  en: {
    title: "Content Map",
    eyebrow: "map /",
    subtitle: (n: number) => `${n} entries · chronological`,
    tagsLabel: "Tags",
    showAll: (n: number) => `Show all ${n} →`,
    empty: "No entries match",
    clear: "Clear",
    clearAll: "Clear all",
    chipRemove: (t: string) => `remove tag ${t}`,
    selectedHeading: (n: number) => `Selected (${n})`,
    searchTags: "search tags",
    noTagMatch: "No tags match",
  },
}

const TAG_RAIL_LIMIT = 9

export function MapPage({ locale }: Props) {
  const lang: Lang = locale === "en" ? "en" : "zh-CN"
  const copy = COPY[locale]

  const all = getEntriesFor(lang)
    .filter((e: Entry) => e.type !== "page")
    .sort(byDateDesc)

  // ── Filters: URL is the source of truth (?status, ?year, ?tags=a,b).
  //    SSG + first client render show no filters (mounted=false) so the
  //    server-rendered HTML matches the first hydration pass; once mounted
  //    we read whatever the URL actually carries and re-render.
  const [searchParams, setSearchParams] = useSearchParams()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const activeStatus = mounted ? parseStatus(searchParams.get("status")) : null
  const activeYear = mounted ? parseYear(searchParams.get("year")) : null
  const selectedTags = mounted ? parseTags(searchParams.get("tags")) : []
  const [tagQuery, setTagQuery] = useState("")
  const [tagsModalOpen, setTagsModalOpen] = useState(false)

  const updateParams = (mut: (next: URLSearchParams) => void) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mut(next)
        return next
      },
      { replace: true },
    )
  }
  const setActiveStatus = (s: Status | null) => {
    updateParams((p) => (s ? p.set("status", s) : p.delete("status")))
  }
  const setActiveYear = (y: number | null) => {
    updateParams((p) => (y !== null ? p.set("year", String(y)) : p.delete("year")))
  }
  const setSelectedTags = (tags: string[]) => {
    updateParams((p) => (tags.length > 0 ? p.set("tags", tags.join(",")) : p.delete("tags")))
  }
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag],
    )
  }
  const clearAll = () => {
    updateParams((p) => {
      p.delete("status")
      p.delete("year")
      p.delete("tags")
    })
  }

  let filtered = all
  if (activeStatus) filtered = filtered.filter((e) => e.status === activeStatus)
  if (activeYear !== null) filtered = filtered.filter((e) => e.date?.getFullYear() === activeYear)
  if (selectedTags.length > 0) {
    filtered = filtered.filter((e) => selectedTags.every((t) => e.tags.includes(t)))
  }

  // Counts per status (across all entries, not filtered)
  const statusCounts: Record<Status, number> = {
    seedling: 0,
    growing: 0,
    evergreen: 0,
    archived: 0,
  }
  for (const e of all) {
    if (e.status) statusCounts[e.status]++
  }

  // Tag frequencies (across all entries — rail isn't context-filtered for v1)
  const tagFreq = new Map<string, number>()
  for (const e of all) {
    for (const t of e.tags) tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)
  }
  const sortedTags = [...tagFreq.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )
  const tagSearchActive = tagQuery.trim().length > 0
  const matchedTags = tagSearchActive
    ? sortedTags.filter(([t]) => t.toLowerCase().includes(tagQuery.trim().toLowerCase()))
    : sortedTags
  const visibleTags = tagSearchActive ? matchedTags : sortedTags.slice(0, TAG_RAIL_LIMIT)
  const hiddenCount = tagSearchActive ? 0 : sortedTags.length - visibleTags.length
  const showTagSearch = sortedTags.length > TAG_RAIL_LIMIT

  return (
    <>
      <PageHead
        title={copy.title}
        description={copy.subtitle(all.length)}
        lang={lang}
        pageSlug="map"
      />
      <Toolbar lang={lang} currentLocale={locale} pageSlug="map" mirrorExists />

      <div className={styles.row}>
        <main className={styles.main}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.subtitle}>{copy.subtitle(all.length)}</p>
          </header>

          <div className={styles.filterStrip} role="tablist" aria-label="maturity filter">
            {STATUSES.map((s, i) => (
              <span key={s} className={styles.filterRow}>
                {i > 0 && (
                  <span className={styles.filterSep} aria-hidden>
                    ·
                  </span>
                )}
                <FilterPill
                  active={activeStatus === s}
                  onClick={() => setActiveStatus(activeStatus === s ? null : s)}
                  glyph={STATUS_GLYPH[s]}
                  label={s}
                  count={statusCounts[s]}
                />
              </span>
            ))}
            <span className={styles.filterSep} aria-hidden>·</span>
            <YearFilter entries={all} active={activeYear} onChange={setActiveYear} lang={lang} />
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty} role="status">
              <p>{copy.empty}</p>
              <button
                type="button"
                className={styles.clearLink}
                onClick={clearAll}
              >
                → {copy.clear}
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {filtered.map((e) => (
                <ArchiveRow
                  key={e.slug}
                  entry={e}
                  showType={false}
                  dateFormat="short"
                  showBacklinkCount
                />
              ))}
            </ul>
          )}
        </main>

        <aside className={styles.rail}>
          {selectedTags.length > 0 && (
            <div className={styles.railSelected}>
              <h2 className={styles.railHeading}>
                {copy.selectedHeading(selectedTags.length)}
              </h2>
              <div className={styles.chipRow}>
                {selectedTags.map((t) => (
                  <span key={t} className={styles.chip}>
                    <span className={styles.chipLabel}>{t}</span>
                    <button
                      type="button"
                      className={styles.chipClose}
                      onClick={() => toggleTag(t)}
                      aria-label={copy.chipRemove(t)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.clearLink}
                onClick={() => setSelectedTags([])}
              >
                {copy.clearAll}
              </button>
            </div>
          )}

          <h2 className={styles.railHeading}>{copy.tagsLabel}</h2>
          {showTagSearch && (
            <div className={styles.tagSearchWrap}>
              <span className={styles.tagSearchIcon} aria-hidden>⌕</span>
              <input
                type="search"
                className={styles.tagSearchInput}
                placeholder={copy.searchTags}
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                aria-label={copy.searchTags}
              />
            </div>
          )}
          <div className={styles.tagWrap}>
            {visibleTags.length === 0 ? (
              <p className={styles.noTagMatch}>{copy.noTagMatch}</p>
            ) : (
              visibleTags.map(([tag, n]) => {
                const active = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagItem} ${active ? styles.tagItemActive : ""}`}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                  >
                    <span className={styles.tagName}>{tag}</span>
                    <span className={styles.tagCount}>{n}</span>
                  </button>
                )
              })
            )}
          </div>
          {hiddenCount > 0 && (
            <button
              type="button"
              className={styles.showAll}
              onClick={() => setTagsModalOpen(true)}
            >
              {copy.showAll(sortedTags.length)}
            </button>
          )}
        </aside>
      </div>

      <TagsModal
        open={tagsModalOpen}
        onClose={() => setTagsModalOpen(false)}
        tags={sortedTags}
        selectedTags={selectedTags}
        onToggle={toggleTag}
        lang={lang}
      />
    </>
  )
}

interface PillProps {
  active: boolean
  onClick: () => void
  label: string
  count: number
  glyph?: string
}

function FilterPill({ active, onClick, label, count, glyph }: PillProps) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${active ? styles.pillActive : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {glyph && (
        <span className={styles.pillGlyph} aria-hidden>
          {glyph}
        </span>
      )}
      <span className={styles.pillLabel}>{label}</span>
      <span className={styles.pillCount}>{count}</span>
    </button>
  )
}
