---
title: "Backlinks"
date: 2026-05-03
updated: 2026-05-03
type: note
status: growing
tags: [knowledge, tools]
summary: "Reverse links are the connective tissue of a digital garden."
aliases: []
---

A **backlink** is the inverse of a hyperlink: instead of "this page links to that one," it shows "these pages link to this one." Quartz computes them at build time and renders them at the bottom of every page.

## Why they matter

Forward links are what the author thought was important when writing. Backlinks are what _the rest of the site_ thinks is important about this page. The two views are not the same, and the second one is usually more interesting.

In a [[en/notes/digital-garden|digital garden]], backlinks are how you discover that an old note has become unexpectedly central — three other notes started pointing at it without you planning it. That's the signal that the idea is doing real work.

## How Quartz builds them

Quartz parses every wikilink (`[[like-this]]`) at build time and inverts the graph. No JS, no runtime cost. The whole thing is a static JSON file the page reads on load.

## Limits

- Backlinks only work for `[[wikilinks]]`, not for prose links to external URLs.
- They don't capture _semantic_ relatedness — only explicit links.
- They get noisy if every note links to a "hub" note.

That last one is fine. It just means the hub is real.
