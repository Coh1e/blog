---
title: CJK and Latin in the same paragraph
date: 2026-04-02
type: post
tags: [meta, design, writing]
summary: Letter spacing, font fallback, line height, line breaks — common pitfalls
---

> [!abstract]
> A short-note version of this went out earlier. This is the long version.

This site's body font stack is `Newsreader, "LXGW WenKai", serif`. The browser's per-glyph fallback means a sentence like "I was reading 村上春树" renders Latin glyphs in Newsreader and CJK glyphs in WenKai — no markup needed.

## Line height

CJK characters are visually taller than Latin x-height. The same `line-height: 1.5` is breathy for Latin and suffocating for Chinese. This site's tokens:

- `--body-line: 1.7` (Latin default)
- `--body-line-cjk: 1.85` (CJK paragraph override)

Switched via `:lang(zh-CN) p { line-height: var(--body-line-cjk) }`.

## Letter spacing

CJK characters have natural visual gaps and don't need letter-spacing. But adding `letter-spacing: 0.01em` to the whole paragraph helps the transitions between CJK and Latin feel less jammed.

## Line breaking

CJK breaks at any character. Latin breaks at word boundaries. Mix them and the rules fight — a 75% CN + 25% EN paragraph will push English words to the next line, leaving the line end stretched by Chinese.

There's no perfect fix. Compromise: `word-break: normal`, `overflow-wrap: break-word`. Long URLs wrap on narrow screens; normal paragraphs don't get torn apart.

## Punctuation

The Chinese `。` is full-width — visually larger than `.`. After an English `,`, English text feels too tight without space; full-width `，` looks abrupt mid-Latin. My approach: complete CN sentences use full-width; quoted EN phrases keep half-width.

> [!warning]
> Don't chase perfection. CN/EN typography has 100 details that bother typography nerds. Fix 10 and the remaining 90 won't bother a real reader. Spend the time writing.

Set the macros (size, line-height, font stack) once. Tolerate the micro stuff.
