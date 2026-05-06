---
title: Permalinks
date: 2026-03-30
type: note
status: evergreen
tags: [meta, tools, web]
summary: URLs are a long-term promise
---

URLs are the most serious thing about a blog — more serious than design, font, or "comment system" by a factor of ten.

> [!important]
> A URL, once published, **can never change**. Every share, bookmark, citation depends on it staying. Changing a URL is a betrayal.

## My rules

- **Slug never changes** — even if title changes
- **No date prefix** (`/2024/05/...`) — dates shouldn't influence URLs
- **No `.html` suffix** — `/posts/foo/`, not `/posts/foo.html`
- **Trailing slash** — easier for static hosts (write `dist/posts/foo/index.html`)
- **No query strings** — `?utm_source=...` never enters my canonical URL

## Bilingual mirror

CN at `/posts/<slug>/`, EN at `/en/posts/<slug>/`. Same slug. So `[[en/posts/markdown-as-infrastructure]]` from any file targets EN; bare `[[posts/markdown-as-infrastructure]]` targets CN. Simple enough that I don't forget.

## Setting up Giscus (the minimal steps)

(Referenced from [[en/posts/why-i-deleted-twitter|elsewhere]] — capturing it here.)

1. Visit https://giscus.app
2. Repo name (must be public, Discussions enabled)
3. Pick a Discussion category — recommend creating one called "Comments"
4. Mapping: `pathname` (one URL → one discussion)
5. Paste the four IDs into `src/lib/site-config.ts`

Filled = enabled. Empty = `<Comments>` returns null, zero build warnings.
