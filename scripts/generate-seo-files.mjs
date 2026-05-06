/**
 * Post-build: generate sitemap.xml + bilingual RSS feeds from content/.
 *
 * Runs after `vite-react-ssg build`. Reads markdown directly from disk
 * (we're in plain Node here, no Vite import.meta.glob) and writes to dist/.
 *
 * Site URL: read from SITE_URL env var, falls back to the production domain.
 */
import { readdir, readFile, writeFile, stat, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, "..")
const CONTENT_DIR = path.join(ROOT, "content")
const DIST_DIR = path.join(ROOT, "dist")

const SITE_URL = (process.env.SITE_URL ?? "https://blog.coh1e.com").replace(/\/$/, "")
const FEED_AUTHOR = "未经授权"
const FEED_RECENT = 20

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === "assets" || e.name.startsWith("_") || e.name.startsWith(".")) continue
      out.push(...(await walk(full)))
    } else if (e.isFile() && /\.mdx?$/.test(e.name)) {
      out.push(full)
    }
  }
  return out
}

function inferType(slug) {
  const segments = slug.replace(/^en\//, "").split("/")
  const top = segments[0]
  if (top === "posts") return "post"
  if (top === "notes") return "note"
  return "page"
}

function inferLang(slug) {
  return slug.startsWith("en/") ? "en" : "zh-CN"
}

async function loadEntries() {
  const files = await walk(CONTENT_DIR)
  const entries = []
  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, "/")
    const slug = rel.replace(/\.mdx?$/, "")
    if (slug === "index" || slug === "en/index") continue
    if (slug.endsWith("/index")) continue
    if (slug === "all" || slug === "en/all") continue

    const raw = await readFile(file, "utf8")
    const fm = matter(raw)
    const data = fm.data
    if (data.draft === true) continue

    const lang = data.lang ?? inferLang(slug)
    const type = data.type ?? inferType(slug)

    let date
    if (data.date) {
      const d = new Date(data.date)
      if (!Number.isNaN(d.getTime())) date = d
    }
    if (!date) date = (await stat(file)).mtime

    entries.push({
      slug,
      lang,
      type,
      title: data.title ?? slug,
      date,
      summary: data.summary,
      tags: data.tags ?? [],
      body: fm.content,
    })
  }
  return entries
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function entryUrl(entry) {
  return `${SITE_URL}/${entry.slug}/`
}

function counterpartUrl(entry) {
  // CN ↔ EN slug pairing: just toggle the en/ prefix
  if (entry.lang === "en") {
    return `${SITE_URL}/${entry.slug.replace(/^en\//, "")}/`
  }
  return `${SITE_URL}/en/${entry.slug}/`
}

// ---- sitemap.xml ----

function buildSitemap(entries) {
  // Each entry in the sitemap is keyed by its language-specific URL plus
  // the CN-form slug (used to build the alternate URLs).
  // cnSlug "" means homepage; "posts/foo" means /posts/foo/ (CN) and /en/posts/foo/ (EN).
  const items = []

  function emit({ cnSlug, lang, lastmod }) {
    const cnPath = cnSlug ? `/${cnSlug}/` : "/"
    const enPath = cnSlug ? `/en/${cnSlug}/` : "/en/"
    const selfPath = lang === "en" ? enPath : cnPath
    const cnUrl = `${SITE_URL}${cnPath}`
    const enUrl = `${SITE_URL}${enPath}`
    const selfUrl = `${SITE_URL}${selfPath}`
    items.push(`  <url>
    <loc>${escapeXml(selfUrl)}</loc>${lastmod ? `\n    <lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>` : ""}
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(cnUrl)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(cnUrl)}"/>
  </url>`)
  }

  // Homepages, list pages, archive — one CN URL + one EN URL each.
  // Pages (about, now) come through the entries loop below.
  const staticSlugs = ["", "all"]
  for (const cnSlug of staticSlugs) {
    emit({ cnSlug, lang: "zh-CN" })
    emit({ cnSlug, lang: "en" })
  }

  // Entries: each one becomes one URL in its own language.
  for (const e of entries) {
    const cnSlug = e.slug.replace(/^en\//, "")
    emit({ cnSlug, lang: e.lang, lastmod: e.date })
  }

  // Tag pages.
  const cnTags = new Set()
  const enTags = new Set()
  for (const e of entries) {
    const set = e.lang === "en" ? enTags : cnTags
    for (const t of e.tags) set.add(t)
  }
  for (const t of cnTags) emit({ cnSlug: `tags/${t}`, lang: "zh-CN" })
  for (const t of enTags) emit({ cnSlug: `tags/${t}`, lang: "en" })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.join("\n")}
</urlset>
`
}

// ---- feed.xml (RSS 2.0) ----

function buildFeed(entries, lang) {
  const titleByLang = {
    "zh-CN": "未经授权 · Unauthorized",
    en: "Unauthorized · 未经授权",
  }
  const descByLang = {
    "zh-CN": "一个中英双语的写作站点。长一点的文章 · 短一点的笔记。",
    en: "A bilingual personal writing site. Long-form essays · short notes.",
  }
  const homeUrl = lang === "en" ? `${SITE_URL}/en/` : `${SITE_URL}/`
  const feedUrl = lang === "en" ? `${SITE_URL}/en/feed.xml` : `${SITE_URL}/feed.xml`

  const recent = entries
    .filter((e) => e.lang === lang && (e.type === "post" || e.type === "note"))
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, FEED_RECENT)

  const items = recent.map((e) => {
    const url = entryUrl(e)
    const desc = e.summary ?? e.body.slice(0, 280).replace(/\s+/g, " ").trim()
    return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${e.date.toUTCString()}</pubDate>
      <description>${escapeXml(desc)}</description>
    </item>`
  }).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(titleByLang[lang])}</title>
    <link>${escapeXml(homeUrl)}</link>
    <description>${escapeXml(descByLang[lang])}</description>
    <language>${lang}</language>
    <managingEditor>noreply@blog.coh1e.com (${escapeXml(FEED_AUTHOR)})</managingEditor>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

// ---- main ----

async function main() {
  const entries = await loadEntries()

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemap(entries), "utf8")
  console.log(`[seo] wrote dist/sitemap.xml (${entries.length} entries)`)

  await writeFile(path.join(DIST_DIR, "feed.xml"), buildFeed(entries, "zh-CN"), "utf8")
  console.log(`[seo] wrote dist/feed.xml`)

  await mkdir(path.join(DIST_DIR, "en"), { recursive: true })
  await writeFile(path.join(DIST_DIR, "en", "feed.xml"), buildFeed(entries, "en"), "utf8")
  console.log(`[seo] wrote dist/en/feed.xml`)

}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
