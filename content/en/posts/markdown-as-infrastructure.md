---
title: Markdown as infrastructure
date: 2026-05-04
type: post
tags: [meta, markdown, writing, tools]
summary: Every writing tool I've used has died. The Markdown files are still here.
series: Markdown Infrastructure
---

I started keeping a journal at twelve. The platform was something called LiveJournal. After that came Wordpress, then Medium, then Notion, then Obsidian. Every migration lost something — formatting, links, attachments, or at least my memory of where any of it was.

The only things that survived were the plain Markdown files I happened to write on the side as "drafts." A `.md` written ten years ago on Windows XP, five years ago on a Mac, last week on Linux — they all open in any text editor today.

## Why it lasts

Not because Markdown is elegantly designed. It has plenty of warts: ugly tables, inconsistent nested-list behavior, weird asymmetry between image and link syntax.

It survives because it's *barely* a format — just an ASCII convention for hinting at typography. `# title` for a heading because it looks like a heading. `-` for a list because typewriters did the same. The "barely a format" property means: even if every Markdown renderer in the world disappears, the files are still readable English (or Chinese) sentences.

## What it implies

I can completely separate "writing" from "publishing." When I write, all I touch is a `.md` file — any editor, any sync tool, any backup scheme works. Publishing is a separate, replaceable step.

> [!note]
> Part 1 of three. Part 2 [[en/posts/from-vault-to-site|covers the pipeline]]. Part 3 [[en/posts/git-as-cms|covers publishing]].

I don't care what generates HTML in ten years. I care that those Markdown files are still there.
