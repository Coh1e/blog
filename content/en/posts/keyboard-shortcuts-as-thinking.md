---
title: Keyboard shortcuts as thinking
date: 2026-04-28
type: post
tags: [tools, programming, writing, work]
summary: Why I spent a month learning vim properly
---

I've used keyboards for thirty years. The first time I actually learned a full shortcut system was 2019, learning vim.

Month one: my productivity was negative. Month two: flat. Month three: things took off. Today: my per-character cost is near zero. I can write as fast as I can think.

## The math

Writing speed is bounded by **thinking speed** and **keyboard-to-screen latency**. The average person sits at 200-500ms latency (touch typing + mouse + visual confirm). Vim, fluent: 50-100ms.

Sounds small? Compute it:

$$
\text{6 hours editing} = 21600 \text{ seconds}
$$

If you save 200ms per edit at ~2 edits per second:

$$
21600 \times 2 \times 0.2 = 8640 \text{ seconds/day} \approx 2.4 \text{ hours/day}
$$

Two hours saved daily. ~700+ hours per year.

## But that's not the main thing

The real win is **uninterrupted attention**.

Every time you raise your hand to find a key or grab the mouse, you break the thought stream. The break costs more than the latency — it takes 5-10 seconds to re-enter flow state.

Once vim is fluent, "move cursor to the second character of the fifth word" is muscle memory. No visual search, no attention. Hands act, mind thinks.

## The curve is steep

First week, you'll cry. Speed regresses to 30%. Every sentence, you check a cheatsheet.

> [!warning]
> Don't learn a new tool while shipping a deadline. Both will suffer. Give yourself a low-pressure two-week ramp.

## Which tools deserve this investment

Few. My list:

1. **Keyboard + text editor** (vim / emacs / vscode-vim) — decades of compounding return
2. **Shell** (bash / zsh / fish)
3. **git** — CLI plus a few aliases
4. **Window manager / tmux**

These are the tools I use 10+ hours a day. Learning cost: once. Return: daily.

## Not worth

- IDE shortcut depth (forgotten in a week)
- Browser shortcuts beyond Ctrl+T / W / L
- High-density "productivity" apps (your brain can't keep 50 shortcuts loaded)

[[en/posts/the-cost-of-features|Default no]] applies to keyboard shortcuts too — only learn the ones you use 10+ times a day.
