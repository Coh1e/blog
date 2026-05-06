# Content model

## File layout

```
content/
├── index.md                     # CN homepage copy (currently unused; routes have their own)
├── all.md                       # CN /all archive copy (planned)
├── posts/<slug>.md              # CN long-form essays
├── notes/<slug>.md              # CN short notes / digital garden entries
├── pages/<slug>.md              # CN standalone pages: about, now, etc.
└── en/                          # mirror of the above for English
    ├── posts/<slug>.md
    ├── notes/<slug>.md
    └── ...
```

Slug = path under `content/` minus the `.md` extension. So `content/posts/markdown-blog.md` → slug `posts/markdown-blog` → URL `/posts/markdown-blog/`. EN equivalent: `content/en/posts/markdown-blog.md` → slug `en/posts/markdown-blog` → URL `/en/posts/markdown-blog/`.

## Frontmatter

All fields are optional except `title`. Unknown fields are ignored.

```yaml
---
title: 第一篇文章                  # required; falls back to slug if missing
date: 2026-04-01                  # any ISO date or anything new Date() understands
updated: 2026-04-15               # optional revision date
tags: [zettelkasten, writing]     # array of strings
summary: 一句话摘要                # optional; appears on home + list pages
status: growing                    # notes only: seedling | growing | evergreen | archived
                                  #   `seed` is also accepted (aliased to seedling)
type: note                         # rarely needed; inferred from folder
lang: zh-CN                        # rarely needed; inferred from path
featured: true                     # bumps to a featured row (planned)
audio: /audio/foo.mp3              # optional companion audio. When present, the article
                                   #   meta line shows a "▶ 配读 / Listen" link that
                                   #   toggles a player bar (Plan B; see design-system.md)
moc: true                          # optional Map-of-Content flag. Marks this entry as
                                   #   a hub page. Surfaced in the tag rail's hub list
                                   #   ahead of regular tags. (Implementation TBD)
series: writing-tools              # optional series name; entries sharing it form a sequence
comments: false                    # optional; only `false` is meaningful — suppresses the
                                   #   Giscus comments section on this entry. Default = on
                                   #   (when site-wide Giscus config is filled in). See
                                   #   docs/comments.md.
draft: true                        # exclude from the build entirely
---
```

Inference rules in `src/lib/content.ts`:
- `lang`: `slug.startsWith("en/")` → `"en"`, else `"zh-CN"`
- `type`: top folder under `content/` (`posts` → `post`, `notes` → `note`, `pages` → `page`, anything else → `page`)
- `date`: if missing, falls back to nothing (we used to fall back to file mtime via `fs.statSync`, but `import.meta.glob` doesn't expose mtime — add `date:` to your frontmatter)
- `status`: optional; only meaningful for notes

### Internal type → user-facing label

The internal `type` value and the label rendered to readers are not the same. The mapping lives in `src/pages/ListPage.tsx` (`COPY` table) and `getCounts` in `lib/content.ts`:

| Internal `type` | CN label | EN label | API alias |
|---|---|---|---|
| `post` | 文章 | Essays | `getCounts.essays` |
| `note` | 笔记 | Notes | `getCounts.notes` |
| `page` | 页面 | Pages | (not counted) |

Only `post` is asymmetric: the reader never sees the word "post". The internal name and the URL prefix `/posts/<slug>` are kept for external-link stability — renaming would break inbound links. When you author copy or add a new aggregate view, use the label, not the internal name.

### Where each type surfaces

| Type | Home | Map | Tag pages | Archive (`/all`) | Own route |
|---|---|---|---|---|---|
| `post` | "Recent Essays" (top 4) | yes | yes | yes | `/posts/<slug>` |
| `note` | "Recent Notes" (top 3 by status/date) | yes | yes | yes | `/notes/<slug>` |
| `page` | no | no | no | no | `/about`, `/now` (or any `pages/<name>`) |

The site is a **two-content-type design**: essays and notes. There is no "project" type — see "Relationship to the Figma design canon" below for the history.

## The `Entry` type

This is the single shape every component sees:

```ts
export type Entry = {
  slug: string                  // "posts/markdown-blog" or "en/posts/foo"
  lang: "zh-CN" | "en"
  type: "post" | "note" | "page"
  status?: "seedling" | "growing" | "evergreen" | "archived"
  title: string
  date?: Date
  updated?: Date
  tags: string[]
  summary?: string
  featured?: boolean
  series?: string               // optional series name; peers share the value
  audio?: string                // optional companion audio URL
  moc?: boolean                 // optional Map-of-Content flag
  comments?: boolean            // false = suppress comments on this entry
  body: string                  // raw markdown body (rendered by react-markdown later)
  filePath: string              // glob key, kept for debugging
}
```

If a component wants different fields, the answer is "extend `Entry`" — never read frontmatter again somewhere else. The single shape is the whole point.

## API surface

`src/lib/content.ts` exports exactly these functions. Use them; don't reach into `RAW_FILES` directly.

| Function | Purpose |
|---|---|
| `readAllEntries()` | All entries across both languages. Cached. |
| `getEntry(slug)` | One entry by slug, or `null`. |
| `getEntriesFor(lang, { type? })` | Entries in one language, optionally filtered by type. |
| `getRecent(lang, type, n)` | Top `n` entries by date desc for the home page. |
| `getCounts(lang)` | `{ notes, essays }` — used for the home page's "all N entries" summary. The key `essays` corresponds to internal type `post`, which is the bridge between the internal name and the user-facing label. |
| `byDateDesc`, `byStatusThenDate` | Sort comparators. |
| `formatDate(d)` | `YYYY/MM/DD` for display. |
| `entryHref(entry)` | URL for an entry. |

## "Architecture later, simple now"

The `Entry` shape is intentionally a flat record. There is no NoteIR / SiteIR / multi-renderer pipeline today. The user has chosen to defer that until there's a concrete reason (LLM wiki export, multiple output formats, etc.).

When the time comes, the path is:

1. `Entry` becomes a *subset* of a richer `NoteIR` (add: rendered HTML AST, outgoing wikilink targets, computed reading time, etc.).
2. `lib/content.ts` becomes a thin facade over a real compiler module (`lib/compiler/`) that emits `NoteIR[]`.
3. Renderers (HTML page, JSON for LLM, OPML, etc.) consume `NoteIR[]` independently.
4. Components keep importing from `lib/content.ts` and don't notice the change.

Until then: one type, one reader, one place to look.

## Drafts and excludes

- `draft: true` in frontmatter — entry is dropped from `readAllEntries()`.
- Files under `content/assets/` — silently skipped.
- `index.md` files at any level — skipped (those are page copy, not entries).
- `all.md` — skipped (the archive page).

If an entry isn't appearing, check those rules first.

## Relationship to the Figma design canon

The current taxonomy (`post / note / page`) reflects two decisions recorded in the Figma file `FIGMA_FILE_ID` (Design Notes node `166:215`, decision log dated 2026-05-05):

1. **Index nav collapsed.** The old "5-link Index" (Posts / Notes / Projects / About / Now) was reduced to one entry: `→ Content map · 36 entries`. **Map (`/map`) is the canonical browse surface.** Tag and Archive are facets of Map; everything else is a leaf page.
2. **Home carries only essays + notes.** Home shows two narrow ribbons — "Recent Essays" (`post`) and "Recent Notes" (`note`) — plus the single Map link. There is no third content category.

### What was removed: the `project` type

There used to be a fourth `EntryType` value `project`, with a `content/projects/` folder, `/projects` and `/en/projects` ListPage routes, a `getCounts.projects` field, and a `MapBlock` SVG node-edge graphic that mentioned project counts. All of that was removed because the design only ever showed essays + notes, and the maturity status (`seedling / growing / evergreen / archived`) on notes already covers the "in-progress / abandoned / mature" axis that `project` was trying to express. Existing project entries were migrated to `notes/` with appropriate status (e.g. wuban-pinyin → `archived`, wenxue-jisuan → `growing`, dotfiles → `evergreen`).

### Code state matches design canon

The route table is now exactly the Figma page inventory:

`/` (Home) · `/posts/<slug>` (Article) · `/map` · `/tags/<name>` · `/all` (Archive) · `/about` · `/now` · `/404`

The previous type-specific list routes (`/posts`, `/notes`, `/projects`) and the corresponding `ListPage` component were removed in the same pass that retired the `project` type. Any new browse capability belongs in Map; flat chronology lives in Archive.
