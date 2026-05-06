/**
 * Wikilink resolution: [[slug]] or [[slug|display text]] → real Markdown link.
 *
 * Convention:
 *   - Slug matches Entry.slug exactly. CN entries use bare slugs ("posts/foo").
 *     EN entries are prefixed ("en/posts/foo").
 *   - From a CN file, [[posts/foo]] → /posts/foo/ (CN).
 *   - From an EN file, [[en/posts/foo]] → /en/posts/foo/ (EN).
 *   - Cross-language is explicit: a CN file linking to the EN version writes [[en/posts/foo]].
 *
 * Resolution at build time. No remark plugin (avoids more ESM/CJS gymnastics).
 */
import { readAllEntries } from "./content"

export const WIKILINK_RE = /\[\[([^\]\|\n]+?)(?:\|([^\]\n]+?))?\]\]/g

export interface ResolvedWikilink {
  slug: string
  display: string
  href: string
}

let titleMap: Map<string, string> | null = null

function getTitleMap(): Map<string, string> {
  if (titleMap) return titleMap
  titleMap = new Map()
  for (const e of readAllEntries()) titleMap.set(e.slug, e.title)
  return titleMap
}

export function resolveWikilink(rawSlug: string, customDisplay?: string): ResolvedWikilink | null {
  const slug = rawSlug.trim()
  const titles = getTitleMap()
  if (!titles.has(slug)) return null
  const display = customDisplay?.trim() || titles.get(slug)!
  return { slug, display, href: `/${slug}/` }
}

/** Split body into prose / code segments so wikilinks inside code spans + code
 *  fences are left untouched. We preserve fenced blocks (``` ... ```), indented
 *  code blocks (4-space leading), and inline backtick spans. */
function segmentByCode(body: string): { text: string; isCode: boolean }[] {
  const parts: { text: string; isCode: boolean }[] = []
  let i = 0
  let buf = ""
  const flush = (isCode: boolean) => {
    if (buf) parts.push({ text: buf, isCode })
    buf = ""
  }
  while (i < body.length) {
    // Fenced code: ``` or ~~~ at line start
    if ((i === 0 || body[i - 1] === "\n") && body.slice(i, i + 3).match(/^(```|~~~)/)) {
      flush(false)
      const fence = body.slice(i, i + 3)
      const closeRe = new RegExp(`\\n${fence.replace(/[`~]/g, "\\$&")}`, "g")
      closeRe.lastIndex = i + 3
      const match = closeRe.exec(body)
      const end = match ? match.index + 1 + fence.length : body.length
      parts.push({ text: body.slice(i, end), isCode: true })
      i = end
      continue
    }
    // Inline backtick span. Match any run of N backticks, then content (non-greedy)
    // until matching N backticks. Standard CommonMark behavior.
    if (body[i] === "`") {
      let n = 0
      while (body[i + n] === "`") n++
      const open = "`".repeat(n)
      const closeIdx = body.indexOf(open, i + n)
      if (closeIdx !== -1) {
        flush(false)
        parts.push({ text: body.slice(i, closeIdx + n), isCode: true })
        i = closeIdx + n
        continue
      }
    }
    buf += body[i]
    i++
  }
  flush(false)
  return parts
}

/** Rewrite [[wikilinks]] to standard Markdown links inside a body string.
 *  Skips code spans + code fences so syntax examples like `[[posts/foo]]`
 *  in documentation are preserved verbatim. */
export function transformWikilinks(body: string): string {
  return segmentByCode(body)
    .map((seg) => {
      if (seg.isCode) return seg.text
      return seg.text.replace(WIKILINK_RE, (full, slug, display) => {
        const r = resolveWikilink(slug, display)
        if (!r) return full
        return `[${r.display}](${r.href})`
      })
    })
    .join("")
}

/** All wikilink targets present in a body string (raw, unresolved slugs).
 *  Same code-aware filtering applies. */
export function extractWikilinkTargets(body: string): string[] {
  const out: string[] = []
  for (const seg of segmentByCode(body)) {
    if (seg.isCode) continue
    const re = new RegExp(WIKILINK_RE.source, "g")
    let m: RegExpExecArray | null
    while ((m = re.exec(seg.text))) out.push(m[1].trim())
  }
  return out
}
