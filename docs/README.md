# 未经授权 · Unauthorized — design documents

Short docs, written for handoff. Each one is self-contained; read individually.

| File | Topic |
|---|---|
| [architecture.md](./architecture.md) | Stack, build pipeline, hydration model, SEO posture, why we picked what we picked |
| [content-model.md](./content-model.md) | Markdown frontmatter, the `Entry` type, the path to a real IR later |
| [theming.md](./theming.md) | Design tokens, fonts, dark mode, reader mode |
| [design-system.md](./design-system.md) | Full design intent + Figma file map + page inventory + decision log |
| [i18n.md](./i18n.md) | Bilingual routing, `LangToggle`, mirror URLs |
| [components.md](./components.md) | Inventory of `src/components/` (with design-drift notes vs Figma) |
| [wikilinks-and-backlinks.md](./wikilinks-and-backlinks.md) | `[[...]]` syntax, resolution rules, the inverse-link map |
| [comments.md](./comments.md) | Giscus setup, per-entry override, privacy stance |
| [deploy.md](./deploy.md) | Cloudflare Pages / Vercel deployment, build command, troubleshooting |

For instructions on how to *work* in the codebase (commands, conventions, how to add an entry), see `../CLAUDE.md` or `../AGENTS.md` instead — those are working manuals; the docs here are reference.
