/**
 * Content layer — single API surface for all content reads.
 *
 * Designed so the internals can be replaced later with a proper
 * Content → IR compiler without touching component callers.
 *
 * Today: Vite's import.meta.glob inlines every markdown file at build
 * time as a raw string. We use a tiny YAML-subset frontmatter parser
 * (no gray-matter — it pulls in Node's Buffer which doesn't exist in
 * the browser, and routes.tsx calls readAllEntries() at module init,
 * which would crash the entire client bundle).
 */

const RAW_FILES = import.meta.glob("../../content/**/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

/** Minimal frontmatter parser. Handles the YAML subset our files use:
 *  - `key: value` (string, number, boolean)
 *  - `key: "quoted value"` (with \" escapes)
 *  - `key: [a, b, "c, d"]` (inline arrays)
 *  Multiline values are not supported — we don't author them. */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const [, fmStr, body] = match
  const data: Record<string, unknown> = {}
  for (const line of fmStr.split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/)
    if (!m) continue
    data[m[1]] = parseValue(m[2])
  }
  return { data, content: body }
}

function parseValue(raw: string): unknown {
  const s = raw.trim()
  if (!s) return ""
  // Quoted string
  const dq = s.match(/^"((?:[^"\\]|\\.)*)"$/)
  if (dq) return dq[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\")
  const sq = s.match(/^'((?:[^'\\]|\\.)*)'$/)
  if (sq) return sq[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\")
  // Inline array: [a, "b, c", d]
  if (s.startsWith("[") && s.endsWith("]")) {
    const inner = s.slice(1, -1).trim()
    if (!inner) return []
    return splitArrayItems(inner).map((x) => parseValue(x))
  }
  if (s === "true") return true
  if (s === "false") return false
  if (s === "null" || s === "~") return null
  if (/^-?\d+$/.test(s)) return Number(s)
  if (/^-?\d*\.\d+$/.test(s)) return Number(s)
  // Bare string (covers ISO dates, slugs, plain words, CJK)
  return s
}

/** Split an inline-array body by commas while respecting quoted segments. */
function splitArrayItems(s: string): string[] {
  const out: string[] = []
  let buf = ""
  let q: '"' | "'" | null = null
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (q) {
      buf += c
      if (c === q && s[i - 1] !== "\\") q = null
    } else if (c === '"' || c === "'") {
      q = c
      buf += c
    } else if (c === ",") {
      out.push(buf.trim())
      buf = ""
    } else {
      buf += c
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

export type Status = "seedling" | "growing" | "evergreen" | "archived"
export type EntryType = "post" | "note" | "page"
export type Lang = "zh-CN" | "en"

export type Entry = {
  slug: string                  // "posts/markdown-blog" or "en/posts/foo"
  lang: Lang
  type: EntryType
  status?: Status
  title: string
  date?: Date
  updated?: Date
  tags: string[]
  summary?: string
  featured?: boolean
  series?: string               // optional series name; entries sharing it form a sequence
  audio?: string                // optional audio source URL — triggers the audio player meta entry
  moc?: boolean                 // optional MOC (Map of Content) flag — promotes this page in the tag rail's "hubs" section
  comments?: boolean            // false to suppress the comments section on this entry; default (undefined) = on
  body: string                  // raw markdown body
  filePath: string              // glob key, kept for debugging
}

const STATUS_ALIASES: Record<string, Status> = {
  seed: "seedling",
  seedling: "seedling",
  growing: "growing",
  evergreen: "evergreen",
  archived: "archived",
}

function inferTypeFromPath(slug: string): EntryType {
  const segments = slug.replace(/^en\//, "").split("/")
  const top = segments[0]
  if (top === "posts") return "post"
  if (top === "notes") return "note"
  if (top === "pages") return "page"
  return "page"
}

function inferLangFromPath(slug: string): Lang {
  return slug.startsWith("en/") ? "en" : "zh-CN"
}

function slugFromGlobKey(key: string): string {
  // key looks like "../../content/posts/markdown-blog.md"
  const m = key.match(/\/content\/(.+)\.(md|mdx)$/)
  return m ? m[1] : key
}

let cache: Entry[] | null = null

export function readAllEntries(): Entry[] {
  if (cache) return cache

  const entries: Entry[] = []

  for (const [key, raw] of Object.entries(RAW_FILES)) {
    if (key.includes("/assets/")) continue
    const slug = slugFromGlobKey(key)

    if (slug === "index" || slug === "en/index") continue
    if (slug.endsWith("/index")) continue
    if (slug === "all" || slug === "en/all") continue

    const fm = parseFrontmatter(raw)
    const data = fm.data

    if (data.draft === true) continue

    const lang = (data.lang as Lang | undefined) ?? inferLangFromPath(slug)
    const type = (data.type as EntryType | undefined) ?? inferTypeFromPath(slug)
    const status = data.status ? STATUS_ALIASES[String(data.status)] : undefined

    let date: Date | undefined
    if (data.date) {
      const d = new Date(data.date as string)
      if (!Number.isNaN(d.getTime())) date = d
    }
    let updated: Date | undefined
    if (data.updated) {
      const d = new Date(data.updated as string)
      if (!Number.isNaN(d.getTime())) updated = d
    }

    entries.push({
      slug,
      lang,
      type,
      status,
      title: (data.title as string) ?? slug,
      date,
      updated,
      tags: (data.tags as string[]) ?? [],
      summary: data.summary as string | undefined,
      featured: data.featured as boolean | undefined,
      series: typeof data.series === "string" ? data.series : undefined,
      audio: typeof data.audio === "string" ? data.audio : undefined,
      moc: data.moc === true,
      comments: data.comments === false ? false : undefined,
      body: fm.content,
      filePath: key,
    })
  }

  cache = entries
  return entries
}

export function getEntry(slug: string): Entry | null {
  return readAllEntries().find((e) => e.slug === slug) ?? null
}

export function getEntriesFor(lang: Lang, filter: { type?: EntryType } = {}): Entry[] {
  return readAllEntries().filter(
    (e) => e.lang === lang && (!filter.type || e.type === filter.type),
  )
}

export function byDateDesc(a: Entry, b: Entry): number {
  return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)
}

const STATUS_ORDER: Record<Status, number> = {
  evergreen: 0,
  growing: 1,
  seedling: 2,
  archived: 3,
}

export function byStatusThenDate(a: Entry, b: Entry): number {
  const sa = STATUS_ORDER[a.status ?? "growing"]
  const sb = STATUS_ORDER[b.status ?? "growing"]
  if (sa !== sb) return sa - sb
  return byDateDesc(a, b)
}

export function getRecent(lang: Lang, type: EntryType, n: number): Entry[] {
  return getEntriesFor(lang, { type }).sort(byDateDesc).slice(0, n)
}

export function getCounts(lang: Lang): { notes: number; essays: number } {
  const entries = getEntriesFor(lang)
  return {
    notes: entries.filter((e) => e.type === "note").length,
    essays: entries.filter((e) => e.type === "post").length,
  }
}

export function formatDate(d: Date | undefined): string {
  if (!d) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}/${m}/${day}`
}

/** Compact date for list rows: M/D when current year, YYYY/M/D otherwise. */
export function formatDateShort(d: Date | undefined, now: Date = new Date()): string {
  if (!d) return ""
  const m = d.getMonth() + 1
  const day = d.getDate()
  if (d.getFullYear() === now.getFullYear()) return `${m}/${day}`
  return `${d.getFullYear()}/${m}/${day}`
}

export function entryHref(entry: Entry): string {
  return `/${entry.slug}`
}

/** Find the previous and next entries (by date desc, same lang + type) for an entry. */
export function getNeighbors(entry: Entry): { prev?: Entry; next?: Entry } {
  const peers = getEntriesFor(entry.lang, { type: entry.type }).sort(byDateDesc)
  const idx = peers.findIndex((e) => e.slug === entry.slug)
  if (idx === -1) return {}
  // Sorted desc means: index-1 is newer ("next" in reading order), index+1 is older ("prev").
  return {
    next: peers[idx - 1],
    prev: peers[idx + 1],
  }
}

/** Return all entries in the same series as `entry`, sorted oldest → newest.
 *  Empty array if the entry has no series. */
export function getSeriesPeers(entry: Entry): Entry[] {
  if (!entry.series) return []
  return readAllEntries()
    .filter((e) => e.lang === entry.lang && e.series === entry.series)
    .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0))
}

/** Does this entry have a mirror in the other language?
 *  An entry at "posts/foo" has a mirror iff "en/posts/foo" exists, and vice versa. */
export function hasMirror(entry: Entry): boolean {
  const all = readAllEntries()
  if (entry.lang === "en") {
    const mirrorSlug = entry.slug.replace(/^en\//, "")
    return all.some((e) => e.slug === mirrorSlug)
  }
  const mirrorSlug = `en/${entry.slug}`
  return all.some((e) => e.slug === mirrorSlug)
}

/** For tag pages: does the OTHER language have any entries with this tag? */
export function tagHasMirror(tag: string, currentLang: Lang): boolean {
  const otherLang: Lang = currentLang === "en" ? "zh-CN" : "en"
  return readAllEntries().some((e) => e.lang === otherLang && e.tags.includes(tag))
}
