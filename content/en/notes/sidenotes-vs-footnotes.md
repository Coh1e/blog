---
title: Sidenotes vs. footnotes
date: 2026-04-10
type: note
status: growing
tags: [design, writing]
summary: Two different tools — don't substitute one for the other
---

A reader clicks an inline footnote `[1]`, jumps to the bottom of the page, reads, jumps back. Friction.

A sidenote sits in the margin next to the line it annotates<aside class="sidenote">like this. Wide screens float it; narrow screens collapse to inline italic.</aside>so the reader's eye never leaves the main text.

## When to use which

- **Footnote**: relatively standalone supplementary info — a citation, a caveat, a number. Readers *can* jump down; if they don't, they don't lose the thread.
- **Sidenote**: the aside you want them to see *at the moment they read this sentence*. Tufte's "annotation next to the figure" or the author's quiet muttering.

The biggest mistake is using sidenotes as footnotes — stuffing a paragraph of detail in the margin, then watching narrow-screen readers see an inline italic monster shoulder its way through your prose.

## How

Footnotes: `[^1]` + `[^1]: text`. Standard GFM.

Sidenotes: no markdown standard, write the HTML directly: `<aside class="sidenote">text</aside>`. `rehype-raw` lets the HTML through.

> [!tip]
> More than two sidenotes in a single paragraph is too many. Tufte himself was disciplined about this — typically one or two per page.
