# Working in 未经授权 · Unauthorized (for Claude Code)

This is a bilingual personal content site built on **Vite 5 + React 18 + react-router-dom 6 + vite-react-ssg**, with TypeScript strict and CSS Modules. Static export, no server.

## Quick orientation

- **`content/`** is the source of truth for what the site contains. Authors edit these markdown files; everything else is plumbing.
- **`src/lib/content.ts`** is the *one* place that turns markdown files into typed `Entry[]`. Every page reads from this. Do not bypass it (no ad-hoc `fs.readFile` calls in pages, no second content reader).
- **`src/components/`** holds pure render components. **`src/pages/`** holds route components that pull data and render layouts.
- **`src/styles/tokens.css`** is the design token surface (colors, fonts, layout dimensions). When in doubt, change values here, not inline.

## Commands

```bash
npm run dev          # local dev with HMR (vite)
npm run build        # vite-react-ssg → dist/, then SEO files (sitemap/robots/RSS), then Pagefind index
npm run preview      # serve dist/ to check the actual built output
npm run typecheck    # tsc --noEmit
```

`npm run build` is three steps: `vite-react-ssg build` (static export) → `node scripts/generate-seo-files.mjs` → `pagefind --site dist`. Search (Pagefind) only works against `dist/` after a full build; it does not run in dev.

After changes that touch component contracts, content-model types, or routing, run `npm run typecheck` then `npm run build`. The production build is what ships — dev mode tolerates more.

## How to add a new entry

1. Drop a `.md` file under one of: `content/posts/` (long-form essays), `content/notes/` (shorter, growth-staged), `content/pages/` (about/now-style standalone). EN versions live under `content/en/posts/`, etc.
2. Frontmatter shape (everything optional except `title`):

   ```yaml
   ---
   title: 帖子标题
   date: 2026-04-01
   updated: 2026-05-01    # optional; on evergreen notes drives the "Last tended" line
   tags: [zettelkasten, writing]
   summary: 一句话摘要
   status: growing        # seedling | growing | evergreen | archived (notes only)
   featured: false
   draft: false           # true to hide from the build
   series: 写作工坊        # optional; entries sharing a series get a SeriesNav
   audio: /assets/foo.mp3  # optional; surfaces the inline AudioPlayer on the article
   moc: false             # optional; promotes a page in the tag rail's "hubs" section
   ---
   ```

3. `lib/content.ts` infers `lang` from the path (`en/...` → "en") and `type` from the top folder. Override via `lang:` / `type:` frontmatter when needed.
4. To link to other entries, use `[[posts/slug]]` (CN) or `[[en/posts/slug]]` (EN). Optional display text: `[[posts/slug|custom text]]`. See `docs/wikilinks-and-backlinks.md`.
5. Article body supports GFM, callouts (via `lib/remark-callouts.ts`), KaTeX math (`$inline$` and `$$block$$`), and Mermaid fenced blocks (` ```mermaid `). Wikilinks are rewritten in `lib/markdown.tsx` before react-markdown sees the body.
6. `npm run build` — the new entry surfaces in:
   - `post` → Home's "Recent Essays" (top 4 by date) + Map + Archive (`/all`)
   - `note` → Home's "Recent Notes" (top 3 by status/date) + Map + Archive
   - `page` → its own route (e.g. `/about`, `/now`); not aggregated anywhere.
   Watch the build output for `[wikilinks] N unresolved target(s)` if you typoed a slug.

## Conventions to keep

- **Two languages, two parallel trees.** A CN page lives at `/posts/foo/`; its EN mirror at `/en/posts/foo/`. Same slug, no exceptions. `LangToggle` assumes this.
- **No `node:fs` in `src/`** other than via `import.meta.glob` inside `lib/content.ts`. Adding `fs.readFile` elsewhere will break the client bundle. If you need build-time data, extend `lib/content.ts` or write a Vite plugin.
- **No `!important` in CSS.** If you find yourself reaching for it, the cascade is wrong — fix it via specificity or scoping. CSS Modules give you scope; use them.
- **Default to pure render.** Reach for `useState` / `useEffect` only when the component genuinely needs runtime behavior — open/close modals, scroll listeners, theme/reader toggles, audio playback, search input, Mermaid lazy init. Most layout and row components stay pure; check existing siblings before adding state.
- **CSS Modules everywhere**, never global CSS in `src/components/`. Global rules belong in `src/styles/global.css`.
- **Internal type names ≠ user-facing labels.** The `post` type renders as **"Essay" / "文章"** in every UI surface (`ListPage`, `HomePage`, counts). The internal name `post` is kept only because the URL prefix `/posts/<slug>` predates the rename and external links depend on it. When you add a new aggregate view, write *Essay* in copy — never expose "post" to the reader. The other types (`note` / `page`) match their labels.
- **Two content types, not three.** The taxonomy is **essays + notes**, plus a small set of standalone pages. There used to be a `project` type with `content/projects/` folder and `/projects` routes — it was removed because the Figma design collapsed projects into notes (with maturity status as the natural lifecycle). Don't reintroduce it; if a piece of work needs to be tracked, it's a `note` with appropriate `status`.

## What NOT to touch without thinking

- **`patches/vite-react-ssg+0.7.3.patch`** — fixes a Windows path bug in vite-react-ssg's ESM SSG mode. Reapplied by the `postinstall` script after every `npm install`. Don't delete; if you upgrade vite-react-ssg and the patch fails to apply, regenerate it (see `docs/architecture.md § Patches`).
- **`src/lib/content.ts` `import.meta.glob` path** — `'../../content/**/*.{md,mdx}'` resolves to `react/content/`. Changing it will silently empty the site.
- **`src/lib/markdown.tsx` slugify** — must stay in sync between the `MdH2`/`MdH3` ID generation and `extractHeadings`'s output, otherwise TOC anchors won't match in-page IDs.
- **`index.html` `<script>` theme-bootstrap block** — runs before React mounts to apply both `data-theme="dark"` and the `reader-mode` class, avoiding flashes of the wrong theme/mode. Don't move it into React.
- **The `/en/` route's existence** — `routes.tsx` mirrors the CN tree under `/en`. Removing this is a breaking content change, not a refactor.
- **`scripts/generate-seo-files.mjs`** — runs after the SSG build to emit `sitemap.xml`, `robots.txt`, and per-locale RSS. It re-parses `content/` with `gray-matter` (Node-only, separate from the in-bundle parser in `lib/content.ts`). Keep the two readers' frontmatter expectations in sync.
- **Pagefind index** — emitted into `dist/pagefind/` by the build's third step. The `Search` component fetches it at runtime; if the directory is missing or stale, search silently returns nothing.
- **Browse surfaces are Map / Tag / Archive — that's it.** The site used to have type-specific list pages at `/posts`, `/notes`, `/projects` (and a `ListPage` component); they were all removed because Figma collapsed the old 5-link Index nav (Posts/Notes/Projects/About/Now) into the single "→ Content map" entry. If you find yourself wanting a "list of all X" page, the answer is Map filtered by status/year/tag, or Archive for chronological flat. Don't reintroduce a ListPage.

## When stuck

- Build errors: typecheck first (`npm run typecheck`); most issues are obvious from there.
- Content not appearing: check the file is `.md`, the frontmatter `draft: true` isn't set, and the path is correct (under `posts/`, `notes/`, or `pages/`).
- Dark mode flicker: the inline script in `index.html` should be applying `data-theme` before React paints. Verify it's still in `<head>`.
- Windows-only build error involving `file://` and `D:\`: see `docs/architecture.md` for the `format: "cjs"` workaround.

## Pointers

- `docs/architecture.md` — stack, hydration, the Windows ESM-path patch (and the rejected cjs-format alternative)
- `docs/content-model.md` — frontmatter spec, `Entry` type, internal-type ↔ UI-label mapping, future IR plan, design-canon notes
- `docs/theming.md` — tokens, fonts, dark/reader mode
- `docs/i18n.md` — bilingual routing + LangToggle
- `docs/components.md` — what each component does
- `docs/design-system.md` — full design intent + Figma file map (read this before extending UI)
- `docs/deploy.md` — Cloudflare Pages / Vercel
- `docs/wikilinks-and-backlinks.md` — `[[slug]]` syntax, resolver, backlinks pipeline

## Project name

The site is called **未经授权 · Unauthorized**. Used in the title bar, wordmark, RSS feeds, and `package.json` (`name: "unauthorized"`). Don't rename without the user's call.
