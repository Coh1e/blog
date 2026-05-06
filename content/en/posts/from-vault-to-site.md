---
title: From vault to site
date: 2026-05-05
type: post
tags: [meta, markdown, tools, workflow]
summary: What happens between writing a note and the site rebuild
series: Markdown Infrastructure
---

Continuing from [[en/posts/markdown-as-infrastructure|the previous one]]: the Markdown files are the source of truth — so how do they become a website?

My pipeline:

```mermaid
graph LR
  Obsidian[local Obsidian vault] -->|manual triage| Repo[content/ in git repo]
  Repo -->|git push| GH[GitHub remote]
  GH -->|webhook| CF[Cloudflare Pages build]
  CF -->|npm run build| Static[dist/ HTML]
  Static --> CDN[edge cache]
```

Every link is replaceable:

- Obsidian → vim, vscode, anything that edits text
- GitHub → GitLab, self-hosted Gitea
- Cloudflare → Vercel, Netlify, even your own nginx
- The whole pipeline can break — the files are still in the vault

## Why not full auto-sync

I tried mounting the Obsidian vault directly inside the git repo at first. Gave up after a week: my vault has draft fragments, dream notes, mood entries — none of which I want indexed by the site's search.

The "manual triage" step is now `cp` from `vault/published/` to `repo/content/`. Ten seconds of friction in exchange for a publishing boundary I actually control.

## Cadence

Roughly one or two posts a week, sometimes three in a row, sometimes nothing for two months. The pipeline has no opinion about that.
