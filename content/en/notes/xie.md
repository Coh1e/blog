---
title: Unauthorized · 未经授权 (this site)
date: 2026-05-05
status: evergreen
tags: [meta, writing, tools]
summary: The design document for the site itself
---

This site is its own subject.

## Stack

- **Vite + React 18 + TypeScript** — no meta-framework, plain React. [[en/posts/markdown-as-infrastructure|Why Markdown lasts]] reasoning applies to the stack: simple = still runs in five years.
- **react-router-dom 6 + vite-react-ssg** — every route SSR'd to full HTML at build, hydrates to SPA. SEO-friendly. See [[en/posts/from-vault-to-site|the pipeline post]].
- **CSS Modules** — no Tailwind, no CSS-in-JS. Tokens in `src/styles/tokens.css`, scoped styles per component
- **Pagefind** — client-side search, indexed at build, split per language
- **Markdown extensions**: see [[notes/callouts-and-math|the cheatsheet]] (the CN version covers all of this)

## Key decisions

- **Bilingual mirror, slugs match** ([[en/notes/permalinks|permalinks]])
- **Wikilinks parsed at the mdast level**, not in the React component layer — got this wrong early, see the cheatsheet
- **No `remark-wiki-link`** — wrote 25 lines of regex preprocessing instead. The whole unified ecosystem is ESM-only; every plugin is a fresh ESM/CJS interop story
- **Comments via Giscus over Disqus** ([[en/posts/why-i-deleted-twitter|context]])
- **Mermaid client-side, lazy-loaded** — the 600KB library doesn't enter the main bundle, only fetched when a page contains a mermaid block

## What it doesn't do

- ❌ NoteIR / SiteIR / multi-renderer architecture — single `Entry` type is enough
- ❌ LLM-generated wiki
- ❌ Stacked notes ([[en/posts/the-cost-of-features|why]])
- ❌ Email subscription (RSS suffices)

## Reproducible

Repo is public, `npm install && npm run build` builds it. See root `README.md` and `docs/architecture.md`.

> [!note]
> This page is a living doc, updated periodically. Last touched: May 2026.
