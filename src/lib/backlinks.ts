/**
 * Build-time inverse-link map.
 * For every entry that contains [[target]], record (entry → target) so we
 * can answer "what links to me?" in O(1).
 */
import { readAllEntries } from "./content"
import { extractWikilinkTargets } from "./wikilinks"

export interface Backlink {
  slug: string
  title: string
  context?: string
}

const CTX_MAX = 110

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Pull the paragraph that contains the first [[target]] occurrence in body,
 *  strip markdown noise, and trim to ~CTX_MAX chars with leading/trailing
 *  ellipses if the surrounding text was clipped. Returns undefined if we
 *  can't extract anything readable. */
function extractContext(body: string, target: string): string | undefined {
  const re = new RegExp(`\\[\\[${escapeRe(target)}(?:\\|[^\\]\\n]+)?\\]\\]`)
  const m = re.exec(body)
  if (!m) return undefined
  const idx = m.index

  let start = body.lastIndexOf("\n\n", idx)
  start = start === -1 ? 0 : start + 2
  let end = body.indexOf("\n\n", idx)
  if (end === -1) end = body.length
  const clipStart = start > 0
  const clipEnd = end < body.length

  let para = body.slice(start, end).trim()
  // Strip markdown noise so the excerpt reads as prose.
  para = para
    .replace(/\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g, (_, slug: string, disp?: string) => {
      if (disp) return disp.trim()
      const tail = slug.trim().split("/").pop() ?? slug
      return tail.replace(/-/g, " ")
    })
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(?<![_\w])_([^_]+)_(?![_\w])/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!para) return undefined
  let out = para
  let trimmedTail = clipEnd
  if (out.length > CTX_MAX) {
    out = out.slice(0, CTX_MAX).trimEnd()
    trimmedTail = true
  }
  return `${clipStart ? "…" : ""}${out}${trimmedTail ? "…" : ""}`
}

let cache: Map<string, Backlink[]> | null = null

function compute(): Map<string, Backlink[]> {
  const map = new Map<string, Backlink[]>()
  const entries = readAllEntries()
  const validSlugs = new Set(entries.map((e) => e.slug))
  const broken = new Set<string>()

  for (const entry of entries) {
    const targets = new Set(extractWikilinkTargets(entry.body))
    for (const target of targets) {
      if (!validSlugs.has(target)) {
        broken.add(`${entry.slug} → [[${target}]]`)
        continue
      }
      if (target === entry.slug) continue // ignore self-links
      const list = map.get(target) ?? []
      list.push({
        slug: entry.slug,
        title: entry.title,
        context: extractContext(entry.body, target),
      })
      map.set(target, list)
    }
  }

  if (broken.size > 0 && typeof console !== "undefined") {
    // Only useful at SSG time; harmless in the browser.
    console.warn(`[wikilinks] ${broken.size} unresolved target(s):`)
    for (const b of broken) console.warn(`  ${b}`)
  }

  return map
}

export function getBacklinks(slug: string): Backlink[] {
  if (!cache) cache = compute()
  return cache.get(slug) ?? []
}
