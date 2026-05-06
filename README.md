# 未经授权 · Unauthorized

A bilingual (中文 + English) personal content site. Static-rendered React, deployable to any static host.

- **CN** at `/`, **EN** at `/en/` — parallel route trees, no i18n library
- Markdown content with frontmatter; `[[wikilinks]]` resolved at build; backlinks panel
- Pre-rendered HTML for every route (vite-react-ssg) — SEO-friendly, hydrates as SPA after first paint
- Pagefind search, RSS feeds, sitemap with hreflang alternates — all generated at build
- Hand-coded design (no UI framework). Newsreader + LXGW 文楷 + Inter + JetBrains Mono. Greyscale + classic blue.

## Run

```bash
npm install
npm run dev          # vite dev server (search disabled — index isn't built in dev)
npm run build        # full pipeline: vite-react-ssg → seo files → pagefind
npm run preview      # serve dist/
npm run typecheck
```

## Structure

```
content/         markdown — CN at root, EN under en/
public/          static assets (robots.txt, SVG illustrations)
patches/         patch-package patches (vite-react-ssg Windows fix)
scripts/         build-time scripts (sitemap.xml, feed.xml generator)
src/
├── main.tsx     vite-react-ssg entry
├── App.tsx      root layout
├── routes.tsx   route table (concrete routes enumerated from content)
├── lib/         content / markdown / wikilinks / backlinks
├── components/  pure render components + interactive bits (Search, ThemeToggle, ReaderToggle)
├── pages/       route components
└── styles/      tokens.css + global.css
docs/            design documents
```

## Working in this repo with an AI agent

See **`CLAUDE.md`** (Claude Code) or **`AGENTS.md`** (any other coding agent — Codex, Cursor, Aider, Gemini-CLI). Both are quick orientation guides: how the codebase is laid out, what conventions to follow, what NOT to touch.

## Documentation

| File | Topic |
|---|---|
| [docs/architecture.md](./docs/architecture.md) | Stack, build pipeline, hydration, SEO posture, the Windows-Vite patch |
| [docs/content-model.md](./docs/content-model.md) | Markdown frontmatter, `Entry` type, future IR plan |
| [docs/theming.md](./docs/theming.md) | Design tokens, fonts, dark mode, reader mode |
| [docs/i18n.md](./docs/i18n.md) | Bilingual routing, `LangToggle`, mirror URLs |
| [docs/components.md](./docs/components.md) | Component inventory |
| [docs/wikilinks-and-backlinks.md](./docs/wikilinks-and-backlinks.md) | `[[...]]` syntax, resolution, inverse-link map |
| [docs/deploy.md](./docs/deploy.md) | Cloudflare Pages / Vercel, `SITE_URL`, troubleshooting |

## License

MIT — see [LICENSE.txt](./LICENSE.txt).
