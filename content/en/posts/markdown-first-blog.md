---
title: "Why I'm building a Markdown-first blog"
date: 2026-05-03
updated: 2026-05-03
type: post
featured: true
tags: [meta, markdown, writing]
summary: "Plain text outlives every CMS."
audio: "/audio/markdown-first-blog.mp3"
aliases: []
---

I keep coming back to the same realization: every CMS I've used has died, and every Markdown file I wrote a decade ago still opens in any text editor. So this site is built on three rules.

## Three rules

1. **Plain Markdown is the source of truth.** No database, no admin panel.
2. **Links are first-class.** A note that connects to two other notes is more valuable than three isolated notes.[^1]
3. **Publishing is just `git push`.** If it's harder than that, I'll stop writing.

[^1]: This is the core insight behind [[en/notes/digital-garden|digital gardens]] and the reason [[en/notes/backlinks|backlinks]] matter more than chronology.

## What this means in practice

```bash
# new essay
$ touch content/posts/some-thought.md
$ vim content/posts/some-thought.md
$ git commit -am "essay: some thought"
$ git push
```

That's the whole pipeline. The site rebuilds itself.

## What I gave up

> Software is a means to an end, not a hobby. — _someone, probably_

I gave up infinite themes, plugins, comment systems, analytics dashboards, and the fantasy that any of those things would make the writing better. They wouldn't have. They never do.

中英混排也要看起来舒服 — serif body 字体在中英文混排时表现不算完美，但够好。代码块、引用、脚注都按学术排版的习惯处理。

## What's next

- More notes than essays. Notes are cheap; essays are expensive.
- Backlinks visible at the bottom of every page.
- A graph view on the homepage, but nowhere else — graphs are seductive and mostly useless.

That's it. The rest is just writing.
