---
title: File naming
date: 2026-03-18
type: note
status: evergreen
tags: [tools, work, meta]
summary: Naming is the first design step
---

Rules I follow:

1. **lowercase-with-hyphens** (`my-essay.md`, not `My Essay.md`) — cross-platform, URL-safe
2. **No date prefix** — date changes shouldn't ripple to filename + URL
3. **Slug never changes** — once published, name is locked. Title can change, slug can't.
4. **CN names only in vault**, mapped to en-style slugs at publish
5. **Descriptive over categorical** — `why-i-deleted-twitter`, not `social-media-thoughts`

[[en/notes/permalinks|Permalinks]] expands on the URL design promise. Filenames are URL sources — bad filenames pollute downstream.

## Anti-patterns

- `notes-1.md`, `notes-2.md`: never know which is which
- `final.md`, `final-final.md`, `final-final-actually.md`: laugh, but I've seen it
- `untitled-2.md`: editor default-name hell
