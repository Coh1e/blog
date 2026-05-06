---
title: "What I learned rebuilding this site"
date: 2023-08-15
updated: 2024-02-09
type: post
tags: [meta, writing, tools]
summary: "Notes from migrating off WordPress, then off Ghost, then off Eleventy, then settling."
---

This is the fourth incarnation of this site. The first was WordPress (2016). The second was Ghost (2018). The third was Eleventy (2020). The fourth is what you're reading.

Each rebuild took about three weekends. Each time I told myself the rebuild was the last one. Each time the rebuild was real engineering and the writing fell off for a quarter.

A few things I'd tell my 2016 self:

## Pick a system you can rebuild in a weekend

The WordPress rebuild took three weekends because WordPress had become the site _and_ the database _and_ the theme _and_ the plugins. The migration was a database export problem first.

The current setup — markdown files in a folder, a static site generator in another folder — could be rebuilt entirely in a weekend by anyone. The site _is the content folder_. The generator is interchangeable.

## The article column is the only thing that matters

![Diagram of the page layout — wide viewport, focused article column with a small TOC rail](../../assets/page-layout.svg)

I spent two of the three weekends on the WordPress rebuild fighting the theme system. The version of the site I'm writing in now has a single column of text, a sidebar with a search box, and a right rail with the table of contents. That's it. Everything I built on top of that for years was decoration.

## Comments are not worth the database

I had Disqus on WordPress. I had Ghost's native comments. The signal-to-noise was bad in both cases — most comments were promotional, occasional ones were genuinely interesting, and the admin overhead was constant. Email beats comments by a wide margin: it's slower, but the people who write are the ones with something to say.

## The fourth rebuild is the one that sticks

Probably. The reason I think this is that the format underneath — flat markdown — hasn't changed across the last two rebuilds, and the only thing I've actually swapped is the renderer. The data has stopped being the migration target. Once that's true, future rebuilds are weekend projects, not season-killers.

> The right architecture for a personal site isn't the one with the most features. It's the one you can rebuild without losing anything.

Related: [[en/posts/markdown-first-blog]], [[en/posts/quitting-tools-that-didnt-help-me-write]].
