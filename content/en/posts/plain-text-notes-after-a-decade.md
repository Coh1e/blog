---
title: "Plain-text notes after a decade"
date: 2025-09-27
updated: 2025-12-01
type: post
featured: true
tags: [tools, writing, meta]
summary: "What still works, what I gave up on, what I'd recommend now."
---

I started keeping notes in plain text in 2015. A decade and several thousand files later, here's what survived.

## What still works

**Markdown files in a flat folder, with a date prefix in the filename.** I tried hierarchies. Hierarchies always die. The flat folder with `2024-08-13-some-note.md` filenames is the one organizational scheme I have never regretted.

**One folder for active notes, one for archive.** Once a quarter I move things that haven't been touched in 6+ months to `archive/`. They're still searchable; they just don't clutter.

**Wikilinks (`[[like this]]`) for internal references.** The square brackets are the right syntax — visually distinct from regular markdown links, easy to grep for, neutral about the link target's exact filename.

**`grep` and `ripgrep` for search.** I've tried every "second brain" search interface. None of them beat `rg "thing I'm looking for" ~/notes` for raw speed and no-surprises behavior.

## What I gave up on

- **Tags.** I added them for years. I have used them twice. The second time was to make a point about how I never use them. They were a category error: I was trying to compress relationships into a single dimension.
- **Daily notes.** Mine became a low-grade journaling habit that produced nothing reusable. Other people swear by them; I am not other people.
- **Sync apps.** Every sync app is great until the sync conflict. Now I just commit to a private git repo. Conflicts surface as merge conflicts, which I know how to handle.
- **Note IDs / Zettelkasten numbers.** A genuine attempt for two years. Real Zettelkasten does this for a reason. My version was cargo-culting.

## What I'd recommend now

- Plain markdown files. Any directory. Any editor.
- A flat folder with date prefixes.
- One archive folder that you sweep into quarterly.
- `[[wikilinks]]` for cross-references — even if your editor doesn't render them, they grep cleanly.
- Git for backup, not for sync. Sync over Dropbox/iCloud/Syncthing.
- A single text editor you don't customize obsessively.

## The thing nobody tells you

The notes are not the point. The point is the _act of writing them_, repeatedly, for a long time, about things you care about. The medium gets out of the way. Plain text gets out of the way better than anything else.

I went through the whole tooling cycle. I'm back here, with the same files I had in 2015, in the same format, in the same flat folder. The ones from 2015 still open. That's the test.
