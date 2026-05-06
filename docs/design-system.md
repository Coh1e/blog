# Design System

This document is the project-side mirror of the Figma file's design intent. It tells you what's been decided, where it lives, and which choices to honor when extending the design.

## Figma file

- **Key**: `FIGMA_FILE_ID`
- **Display name**: "My Garden — Blog Prototype" (legacy; should be renamed in Figma UI to "Unauthorized — Blog Prototype" — Plugin API can't do it)
- Open via `figma.com/design/FIGMA_FILE_ID/...`
- The canonical "read me first" doc lives **inside** the file as a section called `Design Notes — Read Me First` (node `166:215`). Read that first; this file summarizes.

## Aesthetic

**Restrained**: greyscale + one classic-blue (`#0645ad` / dark `#7eb6ff`) for links. Color is reserved — there are no warm accents, no sepia, no gradients. The single intentional yellow is `<mark>` highlight (`#fff7d6`).

**Bilingual** (CN/EN parallel trees) with deliberate font choices per script:

| Role | EN | CN |
|---|---|---|
| Body | Newsreader (serif, optical-sized) | LXGW WenKai TC (calligraphic) |
| Headers | Inter Bold | LXGW WenKai TC Bold (gardened) / Noto Sans SC Bold (neutral) |
| UI labels | Inter Regular | Inter Regular (universal) |
| Wordmark | Inter Semi Bold (mixed run) | LXGW WenKai TC Bold (mixed run) |
| Code | JetBrains Mono | JetBrains Mono |
| Emoji | Twemoji (cross-platform consistency) | Twemoji |

CN typography deliberately **does not italicize** — LXGW has no italic style, and the convention is to use bold or 着重号 (text-emphasis dots) for emphasis. Where Markdown samples need italic in CN, they use 删除线 (strikethrough) instead, with a footnote explaining the convention.

## Token surface

Three Figma variable collections, mirrored from `src/styles/tokens.css`:

- **Garden** (color, 9 vars × 2 modes Light/Dark): `bg`, `canvas`, `border`, `muted`, `body`, `heading`, `link`, `link-hover`, `code-bg`
- **Spacing** (number, 6 vars): `space/1=4`, `/2=8`, `/3=12`, `/4=16`, `/6=24`, `/8=32`
- **Dimension** (number, 4 vars): `dim/article=720`, `dim/sidebar=240`, `dim/rail=180`, `dim/indent=140`

Dark mode is **validated** end-to-end — every screen, demo, and Markdown element renders correctly under the Dark mode of the Garden collection. The only known unbound color is `<mark>` highlight yellow (intentional; the semantic of `<mark>` is yellow regardless of mode).

## Page inventory

The Figma file holds five sections worth of layouts.

### Section 1 — Bilingual Layouts (the 6 main screens)

| Page | Route | Notes |
|---|---|---|
| Article CN/EN | `/posts/<slug>` (+ `/en/`) | Top bar + 720 body column + right rail (TOC + Backlinks) |
| Home CN/EN | `/` (+ `/en/`) | Sidebar (avatar + chrome) + main column + right rail (Elsewhere + Subscribe) |
| Map CN/EN | `/map` (+ `/en/map/`) | Linkding-style: filter strip + flat chronological entries + tag rail |

### Section 2 — Components Library

12 grouped sets of atoms + composites + demos. See [`docs/components.md`](./components.md) for component-by-component contracts.

### Section 3 — Markdown Samples

CN+EN reference for every markdown element the site supports:

- Standard: H1/H2/H3, paragraph, bold, strikethrough, inline code, links, wikilinks, ordered/unordered lists (with nesting), blockquote, code block, horizontal rule, footnote
- GFM: task list, table
- Extensions: callouts (NOTE/TIP/WARNING with muted/link/link-hover left borders), highlight (`<mark>`), keyboard keys (`<kbd>`), math (inline + block), heading anchors (`#`)
- Article-specific: breadcrumb, title, meta, tags, image with caption + hover hint, definition list

EN body uses Newsreader and Newsreader Italic; CN does not italicize (see Aesthetic above).

### Section 4 — Layouts II (static + index pages)

- 404 (CN+EN): minimal title + message + 3 nav links
- About, Now (CN+EN): Article-style single column
- Tag listing (CN+EN): Map page pre-filtered by tag, with chip + other-tags rail
- Archive (CN+EN): pure chronological flat list — no filter chrome (more "filing cabinet" than Map)
- Empty state demo: Map main column when filters yield 0 entries

> **No type-specific list pages.** The Figma file deliberately does **not** include screens for `/posts`, `/notes`, or `/projects`. The codebase used to carry those routes as a leftover from before the Index collapse; they were removed when the `project` type was retired. Map is the only browse surface. Don't design new variants for the type lists; design within Map / Tag / Archive instead.

### Section 5 — Layouts III (Reader Mode)

Reader mode is a system-wide toggle (top bar `⛶` icon). When active:

- Top bar minimizes to `← Exit reader` + small wordmark, no controls
- All sidebars and rails disappear
- Content centered in a **680**-wide column (vs 720 normal — slightly tighter for reading rhythm)
- Body bumps to **18px / 200% line-height** (vs 16/180% normal)
- H2 bumps to 22px (vs 21 normal)
- **No color shift** — same Light/Dark tokens as normal mode

Reader variants exist for Article, Home, and Map (CN+EN each).

## Filter system (Map page)

Two orthogonal filter axes, designed for scale:

### Maturity filter

Inline single-row strip, only 4 stages: `○ seedling 6 · ◐ growing 13 · ● evergreen 9 · ▣ archived 8`

- Geometric glyphs from Unicode "Geometric Shapes" block (mono, CN/EN-neutral, render in any font)
- The progression empty → half → filled → boxed maps to: idea forming → half-formed → mature → archived. Box for archived intentionally breaks the round-growth metaphor — signals "out of active garden".
- **Toggle behavior**: click an active stage to clear. There's no "all" pill — subtitle "36 entries" carries total count.

### Time filter

A single dropdown trigger `[any year ▾]` placed at the end of the maturity strip. **Reason**: a flat strip with all years would explode at 10+ years; dropdown handles arbitrary timespan.

Open dropdown panel shows each year with:
- Year label + 12-bar **monthly sparkline** (height proportional to entry count) + total count
- Top item: "any year (N)" reset

The sparkline pattern (Github contributions / Are.na timelines) lets readers see content distribution at a glance.

### Tag rail

**Linkding-style**, scales to 100s/1000s of tags:

- **Inline-wrap layout** — multiple tags per line, wrap at 180px rail width (NOT one-tag-per-row)
- **Frequency-sorted** by default (not alphabetical) — heavy tags surface first
- **Top-N visible** (default 9), `Show all 23 →` link expands a modal with full tag list + search + sort toggle
- **Search input** above the list (only appears when total tags exceed threshold)
- **Selected state**: bold + heading color
- **Selected chips region** above the tag list (only renders when ≥1 tag is filtered): each chip with `×` to remove, plus `Clear` link

## Audio Player (Plan B)

Each article may carry a companion audio track. The player has two states:

- **Collapsed (default)**: a meta-line entry `▶ 配读 12:34` / `▶ Listen 12:34` rendered as an inline link in the article meta line (alongside date and read time). Only shows when frontmatter declares an audio source.
- **Expanded (after click)**: a 720-wide bar inline between tags and body, with play/pause + scrub + time + speed + download + `✕` close. Click `✕` to collapse back.

Implementation: standard HTML5 `<audio>` + custom JS for the bar UI. **Don't use Spotify's iframe** — it can't be styled. Use Buzzsprout / Libsyn / Transistor for hosting (they give MP3 direct URLs); RSS feed for podcast subscription.

## Avatar

Real photo embedded in Figma (image hash `22a8f8d3...`). Source file at [`public/avatar.png`](../public/avatar.png) (480×480, ~516KB PNG). For production: re-encode to WebP or JPG q85 (~50KB target) and serve via `<picture>` with fallback.

In design:
- Master Avatar component is 56×56 with cornerRadius 4 (rounded square, not circle)
- Home Sidebar instance is resized to 240×240 (Hero placement, replaces the old MAP graph)
- Reader-mode Home shows it at 64×64 (compact)
- Hover state shows a bio popover (separate demo frame)

## What was removed (and why)

- **Home sidebar MAP graph**: a small node-edge visualization. Removed as decorative — replaced with the Avatar. The "go to map" affordance moved to a single Index entry "→ Content map · 36 entries" in the main column.
- **5-link Index nav** (All Posts, All Notes, Projects, About, Now): collapsed to one link to `/map`, since Map handles all browse facets.
- **"Hubs" group on the rail**: Tags + counts already encode importance. A Hubs layer would have added curatorial chrome that contradicts the digital-garden ethos of "let the graph emerge".
- **Sepia/warm color tokens**: tried briefly during Map redesign, then removed for color discipline.

## Status of design phases

- **P0 (desktop + design system)**: done — all 6 main screens + Layouts II + Layouts III + components + Markdown samples.
- **P1 #9 Reader Mode**: done.
- **P1 #32 Dark mode validation**: done.
- **P1 #10 Mobile responsive**: deferred (lowest priority — 375 viewport adapt of all screens; sidebar → hamburger; rail → collapse below content).

## When extending

1. **Read the Figma file's Design Notes section first** (node `166:215`).
2. **Tokens are authoritative** — `src/styles/tokens.css` for runtime, Figma `Garden` / `Spacing` / `Dimension` collections for design. Keep them in sync.
3. **Component contracts** live in [`docs/components.md`](./components.md). Keep that in sync when components change.
4. **New content surfaces** should match the Article body's tone (Newsreader/LXGW body, 1.8 line-height, JetBrains Mono code, restrained ink) — not the UI chrome's tone (Inter, functional). See the validated tone anchor at Article Column `45:12` (CN) / `46:12` (EN).
