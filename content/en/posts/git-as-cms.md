---
title: Git as CMS
date: 2026-05-06
type: post
tags: [meta, markdown, tools, workflow]
summary: git push is my publish button
series: Markdown Infrastructure
---

[[en/posts/markdown-as-infrastructure|Series opener]] said Markdown is the source of truth, [[en/posts/from-vault-to-site|part two]] covered the pipeline. This is publishing's last mile.

There is no publish button. There is `git push`.

## What this means

- **A draft is a commit.** Half-write on main, commit, push, think, edit, push again. Every build deploys whatever main is.
- **Rollback is `git revert`.** Deleted the wrong file? Wrote yourself into a corner? Revert that commit.
- **History is versions.** Every revision of every post lives in `git log`. I can see what I thought three years ago, what I changed, why.
- **No admin panel.** No "blog system" to maintain, no `wp-login.php` for the entire internet to scan.

## What it doesn't do

- No scheduled publishing. If a post must go live at 9am Tuesday, I'm pushing at 9am Tuesday. Don't care.
- No collaborative editing. But it's just me.
- No "comment notifications center." Giscus shoves comments into GitHub Discussions; I have GitHub Discussions configured to email me. That's enough.

## What actually happens

```
$ vim content/posts/some-thought.md
$ git add content/posts/some-thought.md
$ git commit -m 'essay: some thought'
$ git push
```

Four seconds. Cloudflare builds in about thirty more, pushes to the CDN. Live.

> [!quote]
> Software is a means to an end, not a hobby.
> — someone I'd like to be, probably

There isn't a single GUI in the publishing flow. That's why it survives.
