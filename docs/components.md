# Components

A short inventory of what's in `src/components/` and what each one does. Keep this list in sync with reality — when a component is added, removed, or its contract changes, update this file.

The Figma file [`FIGMA_FILE_ID`](https://www.figma.com/design/FIGMA_FILE_ID) is the design source. See [`docs/design-system.md`](./design-system.md) for the full visual spec. Where code and design have drifted, this file flags it inline.

## Layout wrappers

### `HomeLayout`
The home page chrome only — heavy left sidebar + main column. Used by `/` and `/en/`. Renders Wordmark, SearchButton, ThemeToggle, ReaderToggle, LangToggle, MapBlock in the sidebar. Children land in `<main>`.

Props: `lang`, `currentLocale`, `counts?`, `children`.

> **Design drift**: the Figma design has removed `MapBlock` from the home sidebar and replaced it with a 240×240 Avatar plus a tagline + "About me" link. The "go to map" affordance moved to a single Index entry in the main column (`→ Content map · 36 entries`). When implementing, drop `MapBlock` here and render `Avatar` instead. See `docs/design-system.md § Page inventory`.

### `Toolbar`
The full-width top chrome — Wordmark on the left, utilities (Search button + ThemeToggle + ReaderToggle + LangToggle) on the right. Used by `ArticleLayout` and `ListLayout`. Pull this in directly only if you're building a one-off page that needs the chrome but neither list nor article layout fits.

Props: `lang`, `currentLocale`, `pageSlug?` (default `""`).

### `ArticleLayout`
Used by every article-style route. Renders `<Toolbar>` + indented article column + right rail (TOC + Backlinks). Renders breadcrumb, title, date+reading-time, tag pills above the body slot.

Props: `lang`, `currentLocale`, `pageSlug`, `title`, `date?`, `updated?`, `tags?`, `readingTime?`, `headings: Heading[]`, `backlinks?: Backlink[]`, `children`.

The `pageSlug` is the path **without** the locale prefix (so `LangToggle` can compute the mirror URL correctly). For `/posts/foo`, `pageSlug = "posts/foo"`; for the EN mirror at `/en/posts/foo`, also `pageSlug = "posts/foo"`.

### `ListLayout`
Used by the archive (`/all`). Renders `<Toolbar>` + indented main column. **No right rail** — the dense rows want full width. Renders an `<h1>` and optional description above the children slot.

Props: `lang`, `currentLocale`, `pageSlug?`, `title`, `description?`, `children`.

> Originally shared with type-specific `/posts` and `/notes` list pages, which were removed because Figma's design canon has no such screens (Map is the canonical browse surface). The component remains generic enough to serve any future flat-list view — but the current site only uses it for Archive.

## Identity

### `Wordmark`
The site name in the top-left or sidebar. Renders `未经授权 · Unauthorized` as three spans (`zh` + `sep` + `en`) so each side can be styled independently. CSS gives the CN side LXGW WenKai TC Bold and the EN side Inter Semi Bold (slightly smaller), matching the mixed-run wordmark in Figma.

Props: `href?`.

## Navigation / utilities

### `LangToggle`
Two-link CN ↔ EN switch. Computes mirror URL by prepending or stripping `en/` on the current path. The `pageSlug` prop is the path **without** the locale prefix — for the home it's `""`, for `/posts/foo` it's `"posts/foo"`.

Props: `currentLocale: "zh" | "en"`, `pageSlug?: string`.

### `ThemeToggle`
Stateful client component. Reads `document.documentElement.dataset.theme` on mount, on click flips it and writes `localStorage.theme`. Label is locale-aware ("深色" / "Dark").

Props: `lang?: "zh-CN" | "en"`.

### `ReaderToggle`
Stateless client component. Toggles `.reader-mode` class on `<html>`. Does not persist (intentional — reader mode is a per-session focus toggle).

Props: `lang?: "zh-CN" | "en"`.

### `SearchButton`
Two visual variants. `variant="input"` is the inline-looking search field used in the home sidebar; `variant="button"` is a compact icon+label used on article pages. Clicking either opens the `<Search>` overlay.

Props: `lang?`, `variant?: "input" | "button"`.

### `Search`
Modal overlay that lazy-loads Pagefind on first open and runs queries against the built index at `/pagefind/pagefind.js`. Debounced 150 ms after each keystroke. Results: title (linked), excerpt with `<mark>` keyword highlights from Pagefind. ESC or backdrop click closes.

Status states: `idle` → `loading` → `ready` (or `error` if no index, e.g. in dev). The error state explains why instead of failing silently.

Props: `open: boolean`, `onClose: () => void`, `lang`.

> **Design**: Figma's Cmd+K modal demo (`Components — Library` node `190:206`) groups results by **POSTS / NOTES / TAGS** with a footer hint row (`↑↓` navigate · `⏎` open · `esc` close). Match this when revisiting the Search UI.

## Visual blocks

### `MapBlock`
Hand-coded SVG force-graph mock used on the home sidebar.

> **Design drift**: removed from the home sidebar in Figma — the Avatar replaces it. Keep `MapBlock` available for the dedicated `/map` page or future graph view; do not render it on the home sidebar.

Props: `lang?`, `counts?: { notes; essays }`. (Component is currently unused — kept while the home Avatar replacement is the canonical placement.)

### `StatusPill`
A small bordered badge for note status: glyph + label. Glyph mapping `seedling: ○`, `growing: ◐`, `evergreen: ●`, `archived: ▣`. Styling matches Figma's `Status Badge` component (`190:180`): 1px `color/border`, corner radius 2, padding 1/6, 11px Inter Regular muted, 4px gap between glyph and label.

Props: `status: Status`.

### `TypePill`
Badge for the entry type ("文章 / Essay", "笔记 / Note", "页面 / Page"). Used on archive / list pages.

Props: `type: EntryType`, `lang`.

### `TagPill`
Linked badge `#tag` that navigates to `/tags/<tag>/` (or `/en/tags/<tag>/`).

Props: `tag: string`, `lang`.

### `TableOfContents`
Right-rail TOC for article pages. Renders only `h2` entries (h3 deferred). Anchor links use the same slugify as `lib/markdown.tsx`'s `MdH2` so they match the in-page IDs.

Props: `headings: Heading[]`, `lang`. Returns `null` if there are no h2s.

### `Backlinks`
Right-rail panel showing pages that link to the current page via `[[wikilinks]]`. Populated by `lib/backlinks.ts` at build time. Shows "暂无 / None yet" when empty.

Props: `backlinks: Backlink[]`, `lang`.

## Rows (used inside lists on home / archive / list pages)

### `RecentEssayRow`
Date column (100px) + body (title link + optional summary). Used in the "近期文章 / Recent Essays" home section.

Props: `date?`, `title`, `href`, `summary?`.

### `NoteRow`
Title link + StatusPill + optional summary, all inline. Used in the "近期笔记 / Recent Notes" home section.

Props: `title`, `href`, `status?`, `summary?`.

### `ArchiveRow`
Three-column dense row (date · type pill · body) used by the list pages and the archive. Body cell holds the linked title plus inline status pill (notes only) and optional summary. Pass `showType={false}` on type-specific lists like `/posts` where the type column would be redundant.

Props: `entry: Entry`, `showType?` (default `true`).

## Designed in Figma but not yet implemented in code

The following components are spec'd in the Figma `Components — Library` section and used by the design's page templates, but have no React counterpart yet. Implement when needed.

### `Avatar` — Figma node `168:159`
Square (cornerRadius 4), 56×56 master with a real photo embedded via image fill. Used at:
- 240×240 in the Home sidebar (Hero placement, replaces the old `MapBlock`)
- 64×64 in Reader-mode Home
- 56×56 in the hover demo
- Source photo in `public/avatar.png` (480×480, 516KB — re-encode to WebP/JPG q85 for production)

Behavior: click → navigate to `/about`; hover → show bio popover (separate Figma demo `168:160`).

### `Audio Player` — Figma node `190:195` (expanded), `196:342` (collapsed entry demo)
Plan B (toggle pattern):
- **Collapsed**: meta-line entry rendered as `▶ 配读 12:34` / `▶ Listen 12:34` (link blue) — sits in the article meta line alongside the date and read time. Only renders when frontmatter declares an audio source.
- **Expanded** (after click): a 720-wide bar between tags and body. Children: ▶ play/pause + scrub (track + filled segment + thumb) + 1:42/12:34 mono time + spacer + 1× speed + ⤓ download + ✕ close.

Wire to standard HTML5 `<audio>` via JS. Do **not** use Spotify embed iframe — it can't be styled. Use Buzzsprout / Libsyn / Transistor for hosting (they give MP3 direct URLs); RSS feed for podcast subscription.

### `Series Nav` — Figma node `190:182`
Article footer prev/next, only rendered on posts that are part of a series. Two cells inside a top-bordered container: each cell has a small eyebrow ("← Previous in series" / "Next in series →") + a link-blue title (Newsreader Bold 16px). The filesystem already has `SeriesNav.tsx` — verify it matches this spec.

### `Status Badge` — Figma node `190:180` (component set, 4 variants)
Bordered pill version of `StatusPill`. Variants: `seedling / growing / evergreen / archived`. Padding 1/6, corner radius 2, 1px `color/border` stroke, glyph (○◐●▣) + label at 11px Inter Regular muted.

May replace or supplement `StatusPill` (which is currently a non-bordered text variant).

### `Last-tended meta variant` — Figma node `190:190`
For evergreen notes, the article meta line gets a "最近修剪 N 天前 / Last tended N days ago" segment plus an inline `· ●` status indicator. Activate on entries where `status === "evergreen"` and `updated > date`.

### `Search Overlay (Cmd+K modal)` — Figma node `190:206`
Detailed modal spec: 560-wide rounded card with input row (⌕ + query + esc kbd), grouped results (POSTS / NOTES / TAGS) with active row highlighted via `color/code-bg` background, footer hint row with `↑↓` / `⏎` / `esc` keys. The current `Search.tsx` is the entry point but does not yet render this exact layout — match this when revisiting.

### `Comments` — Figma node `200:342` (CN), `200:375` (EN)
Article footer comments block. Top-bordered container with: header (`评论 · 2` / `Comments · 2`) + RSS subscribe link, list of 2-up sample comments (avatar 32×32 + name + when + body + Reply link), then a top-bordered form (name input + body textarea + privacy hint + Submit button). The filesystem has `Comments.tsx` — verify it matches.

### `Year Filter Dropdown (open state)` — Figma node `166:159`
The expanded state of the Map page's time filter. Panel: 260-wide bordered card with rows per year (label + 12-bar monthly sparkline + count) and "any year (36)" reset at top. Used as a Map filter, opened by clicking the `[any year ▾]` trigger in the maturity strip.

### `Show All Tags Modal` — Figma node `170:167`
The expanded state of the tag rail's "Show all 23 →" link. Modal: 480-wide rounded card with title + close × + search input + sort toggle (`by count` | `by name`) + wrapping tag list (all 23 tags, frequency-sorted by default).

## Static and index pages (Figma-spec'd)

The following routes have layouts designed in Figma `Layouts II — Static & Index Pages` (node `193:167`) and `Layouts III — Reader Mode` (node `209:341`). Code wrappers exist (`ListLayout` / `ArticleLayout`) but page-specific content needs to match the Figma reference:

| Route | Figma node | Notes |
|---|---|---|
| `/404` | inside Layouts II | Minimal: `404` + short message + 3 link nav |
| `/about`, `/now` | inside Layouts II | Article-style single column, no tags, no rail |
| `/tags/<name>` | `194:269` (CN), `194:332` (EN) | Map page pre-filtered by tag; active chip + other-tags rail |
| `/all` | `194:400` (CN), `194:481` (EN) | Pure chronological flat list — no filter chrome |
| Map empty state | `194:562` | Rendered when filters yield 0 entries |
| Article reader | inside Layouts III | Strip chrome, body 18px / 200% lh, 680 column |
| Home reader | inside Layouts III | Avatar 64 + wordmark + bio + recent essays/notes + map link |
| Map reader | inside Layouts III | Title + flat chronological list, no filter strip |

## Conventions

- Every component has a matching `*.module.css`. Class names inside the module are local; only `var(--token)` references reach into the global token surface.
- Components import `Link` from `react-router-dom`, never from anywhere else. SPA navigation is the assumption.
- Components that read locale-dependent strings take `lang` as a prop. Don't hardcode `if (lang === ...)` inside utility helpers — push it to the leaf component.
- No component reads markdown directly. They consume `Entry` (or props derived from one). The single content path is `lib/content.ts`.
- When extending the design beyond what's in code, **read the Figma file's `Design Notes — Read Me First` section first** (node `166:215`). It documents intent, variant rules, and decisions that aren't recoverable from the visual alone.
