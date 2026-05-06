---
title: The cost of features
date: 2026-04-30
type: post
tags: [meta, tools, writing]
summary: Every feature you add steals time from the writing
---

Last year I spent eight hours one weekend adding stacked-notes (the Andy Matuschak kind, sliding notes from the right) to my blog. Technically interesting. I enjoyed those eight hours.

In the six months that followed, I never used the feature once.

## Doing the math

A 1500-word essay takes me about 90 minutes[^speed]. Eight hours = 5 essays I didn't write. That year I wrote 12 fewer essays than the year before. I could blame "busy" or "fewer ideas," but really — those weekends went into infrastructure.

The cost of features compounds:

$$
\text{Net writing} = \text{Time spent} \times \frac{1}{1 + \alpha \cdot \text{Features added}}
$$

$\alpha$ captures "ongoing maintenance per feature." I estimate my own $\alpha \approx 0.4$ — four features halve writing time.

## What's actually used

Honest audit:

| Feature | Times I used it | Reader feedback |
|---|---:|---|
| Stacked notes | 0 | — |
| Comments system | Looked at 7, replied to 0 | Neutral |
| Related posts at end | 0 (I hand-add wikilinks) | 0 |
| Reader mode | ~30 (myself) | A few "nice" |
| RSS | unknown | Some subscribers |
| Search | ~50 (myself) | Fewer "can't find" emails |

Only the last two or three earn their maintenance. The others are debt.

## Default no

[[en/posts/markdown-as-infrastructure|The series opener]] explains why Markdown lasts. This is the inverse: why "blog systems" don't. Every shiny feature is future code to maintain, future API to learn, future schema to migrate. Default-no is the only sustainable strategy.

[^speed]: Around 17 Chinese characters per minute. First draft can hit 22, but rewrites bring it back down. Untrained writers manage about half.
