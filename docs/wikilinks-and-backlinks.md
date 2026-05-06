# Wikilinks + Backlinks

## Wikilink syntax

Inside any markdown body, write `[[<slug>]]` to link to another entry, or `[[<slug>|<display text>]]` to override the link text.

```markdown
See also [[posts/markdown-blog]] for more on this.
The [[en/notes/digital-garden|digital garden]] approach changed how I write.
```

The `<slug>` matches `Entry.slug` exactly:
- CN entries are bare: `[[posts/foo]]`, `[[notes/bar]]`
- EN entries are prefixed: `[[en/posts/foo]]`, `[[en/notes/bar]]`

If `<display text>` is omitted, the entry's `title` from frontmatter is used.

Resolution happens at build time in `src/lib/wikilinks.ts`. Resolved links become standard markdown links and pick up the `MdLink` component override (so internal links use `react-router-dom`'s `<Link>` for SPA navigation).

## Cross-language linking

Linking across languages is **explicit** — write the full `en/` prefix when needed:

```markdown
<!-- in a Chinese note: link to the English version of the same post -->
你也可以读 [[en/posts/markdown-first-blog|the English version]].
```

There is no automatic cross-language fallback. If `[[posts/foo]]` doesn't resolve, it stays unresolved (it doesn't try `en/posts/foo` as a fallback).

## Broken wikilinks

If a wikilink doesn't resolve (the slug doesn't exist), the markdown is left **as-is** in the rendered output. Readers see the broken `[[slug]]` syntax — which is the right behavior; it's a visible signal that something is wrong.

The build also logs every broken wikilink to stderr:

```
[wikilinks] 4 unresolved target(s):
  en/notes/backlinks → [[like-this]]
  en/notes/backlinks → [[wikilinks]]
  ...
```

The build does not fail on broken wikilinks (intentional — you might be in the middle of authoring). Treat the warning count as a backlog.

## Backlinks

For every entry, the `Backlinks` panel on the right rail shows pages that link **to** the current page.

Implementation in `src/lib/backlinks.ts`:

1. Walk every entry's body, extract all `[[target]]` references.
2. Build `Map<slug, Backlink[]>`. Self-links are ignored. Broken targets are skipped (and logged once).
3. `getBacklinks(slug)` returns the list for one page.

The map is computed once per build (cached in module scope) and consumed by `pages/ArticlePage.tsx`.

## Why no `remark-wiki-link`

The unified / remark / rehype ecosystem is ESM-only. With our SSR build (CJS-friendly so `vite-react-ssg`'s SSG step can require it on Windows... well, *was* — see `architecture.md § Patches`), every additional remark plugin was a fresh interop incident. A regex-based pre-pass is ~25 lines, has no dependencies, gives us better diagnostics for broken targets, and lets us express CN/EN convention precisely.

## Future work

- **Tag-aware backlinks**: today we treat all wikilinks the same. Could group by tag or filter by entry type if backlink lists grow large.
- **Outgoing-link panel**: a "what this links to" complement to backlinks.
- **Anchor wikilinks**: `[[posts/foo#section]]` for deep-links into another page's heading. Would need to integrate with the slug-id generator in `lib/markdown.tsx`.
