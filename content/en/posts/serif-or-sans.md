---
title: Serif or sans
date: 2026-05-03
type: post
tags: [design, writing]
summary: Short answer — long-form gets serif
---

You only need to decide this once.

## Rule of thumb

- **Long-form (>500 words)**: serif
- **Short UI text, buttons, forms**: sans-serif
- **Code**: monospace, never serif

That's the answer in 95% of cases.

## Why serif for long-form

Serifs provide horizontal cues at the top of letters that help the eye track along a line. In long paragraphs, that small assist accumulates into a real fatigue difference.

Research[^research] shows serifs are slightly faster in continuous reading on print (>2400 dpi). On screen (96-220 dpi) the gap is smaller, but still there.

## Why sans for UI

UI text is short — buttons are 3 words, menu items are 1, error messages are a sentence. Sans-serif keeps more readable pixels at small sizes; serifs lose detail unevenly.

## What about CJK

CJK has no clean "serif vs sans-serif" mapping. The closest:

- **Song / Ming** ≈ serif (thin horizontal, thick vertical, sharp tips)
- **Hei / Gothic** ≈ sans-serif (uniform stroke weight)
- **Kai / Cursive** ≈ humanist serif (handwritten warmth)

| Use | CN | Latin pair |
|---|---|---|
| Long-form | Song / Kai | EB Garamond / Newsreader |
| UI | Hei / Source | Inter / Helvetica |
| Headers | Hei bold | Sans bold |

This site pairs **LXGW WenKai (Kai-style) + Newsreader (humanist serif)**. They share humanist warmth. See [[en/posts/cjk-line-breaks|CJK line breaks]] for more.

## Don't

- Set long-form in sans (unless you know readers will skim on mobile)
- Use serif for buttons (thin strokes break at small sizes)
- Mix more than three font families (visual noise)
- Use Comic Sans (unless your audience is five-year-olds)

> [!tip]
> Stuck? Default to: serif body + sans heading + monospace code. Three families. You won't get tired of this combo.

[^research]: Karen Schriver, *Dynamics in Document Design* (1997) is the most-cited source. Hartley & Burnhill 1971 has the original data. Gaps fall in the 5-15% range, depending on font, lighting, and individual.
