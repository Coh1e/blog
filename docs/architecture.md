# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 5 | Fast HMR, no framework magic, Rollup output |
| UI | React 18 + TypeScript strict | Standard React; React 19 has rough edges with vite-react-ssg today |
| Routing | react-router-dom 6 (data routes) | The shape `vite-react-ssg` consumes; no proprietary file conventions |
| SSG | `vite-react-ssg` | Pre-renders every route to static HTML at build, hydrates as SPA after |
| Markdown | `gray-matter` for frontmatter; `react-markdown` + `remark-gfm` for body (planned, Day 2) | SSR-safe, no special build config |
| Wikilinks | `remark-wiki-link` (planned, Day 4) | Standard remark plugin |
| Styles | CSS Modules | Scoped, zero runtime, no specificity wars |

No Tailwind, no CSS-in-JS, no UI component library, no `next-intl`, no `contentlayer`.

## Build pipeline

```
content/*.md  →  import.meta.glob (Vite, build time)
              →  src/lib/content.ts (gray-matter parse → Entry[])
              →  React components consume Entry[]
              →  vite-react-ssg renders each route via react-dom/server
              →  dist/<route>.html (one HTML file per route)
              →  client bundle hydrates after first paint
```

Two build phases run inside `npm run build`:

1. **Client build**: Vite produces `dist/assets/app-*.js` and `app-*.css`. Pure browser code.
2. **Server build**: Vite produces a separate SSR bundle in `.vite-react-ssg-temp/`. This is the same React app compiled for Node.
3. **SSG render**: vite-react-ssg loads the SSR bundle, walks the route table, renders each route to HTML, and writes `dist/<path>.html`. Loader data (if any) is serialized into the HTML and rehydrated on the client.

The output `dist/` is a flat folder of HTML/CSS/JS files. Drop it on any static host.

## Why no `node:fs` in the source

The single content reader is `src/lib/content.ts`. It uses `import.meta.glob`:

```ts
const RAW_FILES = import.meta.glob("../../content/**/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>
```

Vite resolves this glob at *build time* and inlines the raw markdown contents into both the SSR and client bundles. Result:

- Works identically in SSR and client.
- No `node:fs` ever appears in the client bundle (which would crash the browser).
- Adding/removing a markdown file requires a rebuild — fine for a static site.

If you find yourself reaching for `fs.readFile` somewhere in `src/`, stop. Either extend `lib/content.ts` or write a small Vite plugin.

## Hydration model

vite-react-ssg uses react-router 6's `createStaticRouter` for SSR and `createBrowserRouter` for the client.

- Page HTML is fully rendered before JS loads. View-source on `dist/index.html` shows the article text and the SVG MapBlock — not just `<div id="root"></div>`.
- After the JS bundle loads, React hydrates and the SPA navigation kicks in. Internal links use `react-router-dom`'s `<Link>` (no full page reload).
- Loader data (if a route has a `loader`) is serialized into the HTML as `__VITE_REACT_SSG_STATIC_LOADER_DATA__` and restored on the client without re-running the loader.

We currently don't use route loaders — pages call `lib/content.ts` directly inside the render. This is fine because `import.meta.glob` data is build-time-resolved and identical on both sides.

## Theme bootstrap

`index.html` has an inline `<script>` in `<head>`:

```html
<script>
  try {
    var t = localStorage.getItem("theme")
    if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.dataset.theme = "dark"
    }
  } catch (e) {}
</script>
```

This sets `data-theme="dark"` on `<html>` *before* the React bundle loads, avoiding a flash of light theme on dark-mode users. Don't move this into a React component — by the time React mounts, the user has already seen the wrong colors.

## Known gotcha: Windows + vite-react-ssg ESM mode

`vite-react-ssg@0.7.x` has a path-join bug in its ESM SSG mode on Windows. The internal code does:

```js
const prefix = format === "esm" && process.platform === "win32" ? "file://" : ""
const serverEntry = join(prefix, ssgOut, name + ext)
```

`path.join("file://", "D:\\...")` produces something like `.\file:\D:\...` — not a valid module specifier. Build crashes during the SSG step with `ERR_INVALID_MODULE_SPECIFIER`.

**Patch (the real fix)**: we use `patch-package` to swap that path construction for `pathToFileURL(fsPath).href`. The patch lives at `patches/vite-react-ssg+0.7.3.patch` and is reapplied automatically by the `postinstall` script. Result: ESM mode works on Windows, no ecosystem-wide ESM/CJS interop pain.

**The CJS alternative we rejected**: setting `ssgOptions.format: "cjs"` skips the broken path entirely (CJS uses `createRequire` which handles Windows paths fine). It built fine, but the SSR bundle then has to be CJS, and rollup's CJS interop with the entire `unified` / `remark` / `rehype` ecosystem (all ESM-only) is broken — every plugin's default export comes through as `{ default: fn }` instead of `fn`, causing `is not a function` errors at render time. We hit this with `remark-gfm`, then `github-slugger`, then `is-plain-obj`. The patch is much cleaner than playing whack-a-mole with `noExternal` and import-default unwrapping.

If/when upstream fixes this, the patch can be removed.

## Patches

We patch one upstream package via [patch-package](https://github.com/ds300/patch-package):

| Package | Patch | Why |
|---|---|---|
| `vite-react-ssg@0.7.3` | `patches/vite-react-ssg+0.7.3.patch` | Fix Windows path bug (see above) |

To re-create or update a patch: edit the file in `node_modules/`, run `npx patch-package <package-name>`, commit the new patch file. The `postinstall` script reapplies all patches after every `npm install`.

## Why these choices

- **Vite over Next.js**: the user wanted to learn React without a framework wrapper. Vite is the cleanest "just React" build tool. Next.js's App Router and RSC layer add an extra mental model.
- **vite-react-ssg over a custom build script**: it does the same thing — render routes via `react-dom/server` to HTML — but handles the Vite SSR mode plumbing for you (style collection, manifest hashing, loader data serialization). If we hit a wall, the fallback is rolling our own (~100 lines).
- **CSS Modules over Tailwind**: greyscale + classic-blue palette is small enough that tokens + scoped CSS is faster than Tailwind class chains, and the design-fidelity-vs-Figma loop is the bottleneck, not styling speed.
- **Two parallel route trees over `next-intl`/`react-i18next`**: bilingual content where every page needs hand-translated copy doesn't benefit from a translation library — it benefits from explicit per-locale code. Library would be over-engineering for two locales.

## SEO posture

The architecture is SEO-positive: every route is **fully rendered to static HTML at build time**. Crawlers (Google, Bing, etc.) see the content directly without executing JavaScript. View-source on any route shows the article body, the SVG MapBlock, and the navigation chrome — there is no `<div id="root"></div>` shell.

What's already correct:

- Pre-rendered HTML for every route (`dist/index.html`, `dist/en/index.html`, etc.)
- `<html lang>` set per page in `App.tsx`
- Internal navigation via `react-router-dom` `<Link>` (single-page after first paint, no extra page reloads)
- Semantic markup (`<article>`, `<h1>`, `<nav>` aria-labels)

What we still need to add (not architectural — just remaining work):

| Gap | Fix | When |
|---|---|---|
| No per-page `<title>` / `<meta description>` / OG tags | Use vite-react-ssg's `<Head>` component inside each page | Day 2, alongside ArticleLayout |
| No `<link rel="alternate" hreflang>` between CN ↔ EN mirrors | Compute mirror URL in the page; emit two alternates + `x-default` | Day 3, alongside EN list pages |
| No `sitemap.xml` / `robots.txt` | Generate in `ssgOptions.onFinished` callback | Day 5, deploy step |
| Trailing-slash URLs hit 404 with default `dirStyle: 'flat'` | Set `dirStyle: 'nested'` in `vite.config.ts` so `/en/` resolves to `dist/en/index.html` | Day 1 (immediate) |
| No structured data (JSON-LD Article, BreadcrumbList) | Inline `<script type="application/ld+json">` per article page | Day 5, optional |

None of these require changing the stack — they're additions on top.

## Output directory style

`vite-react-ssg` defaults to `dirStyle: 'flat'`, which produces `dist/en.html` for the `/en` route. That URL only resolves if the user types `/en` (no trailing slash) or `/en.html`. Most static hosts (Cloudflare Pages, Vercel, Netlify) and most users assume `/en/` (with trailing slash) — that hits a 404 by default.

Set `dirStyle: 'nested'` in `vite.config.ts` to produce `dist/en/index.html` instead. This makes `/en/` resolve correctly everywhere.
