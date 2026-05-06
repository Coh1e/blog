---
title: Design System · Kitchen Sink
date: 2026-05-05
tags: [meta, design, markdown, testing]
summary: One post that exercises every markdown element the design system supports, so I can build the site and visually compare to the Figma file.
status: evergreen
---

This post exists for one reason: to cram **every** markdown element the site supports into a single page so I can run `npm run build` and compare the result side-by-side with the Figma file.

## Inline elements in a paragraph

A regular paragraph mixing a few things: **bold emphasis**, *italic emphasis*, ~~strikethrough~~, `inline code`, an [external link to Wikipedia](https://en.wikipedia.org/wiki/Markdown), and a [[en/notes/digital-garden|wikilink]] to another note in this site.

CN paragraphs deliberately do not italicize (LXGW has no italic style and CN typography traditionally uses bold or text-emphasis dots instead). EN paragraphs use Newsreader Italic normally, as in this *italicized* clause.

Inline `code` should render in JetBrains Mono with a `var(--code-bg)` background tint, distinct from the body Newsreader/LXGW.

### Third-level heading (H3)

> "**Software is a means, not a hobby.**"
> — someone, probably

Blockquote: 2px left border, muted body color (not full body color — quietly distinct from the surrounding body). Multi-line quotes keep the border continuous.

## Lists

Unordered list (with one nested level):

- First item
- Second item, with nesting:
  - Nested child a
  - Nested child b
- Third item

Ordered list:

1. Step one: write down the thought
2. Step two: leave it to ferment
3. Step three: come back and prune

Task list (GFM extension):

- [x] Write design system kitchen sink
- [x] Verify callouts / math / kbd rendering
- [ ] Run dark-mode visual sweep
- [ ] Have a friend look at the typography

## Code blocks

Block code:

```js
// Convert markdown to HTML with wikilinks + callouts
const html = remark()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkCallouts)
  .use(transformWikilinks)
  .processSync(markdown)

console.log(html.value)
```

```bash
# Pipeline in one shot: write, commit, push
$ vim content/en/posts/some-thought.md
$ git commit -am "essay: some thought"
$ git push
```

Code blocks have a 1px `var(--lightgray)` border, padding 14/16, and **no** background fill — distinct from inline code's tinted background.

## Tables

| Element | Rendering rule |
|---------|----------------|
| Code block | 1px border + JetBrains Mono 13px |
| Blockquote | 2px left border + muted text |
| Footnote | Superscript marker + bottom note |
| Inline code | 14px JetBrains Mono + code-bg background |

Tables: header bold, hairline below each row, columns left-aligned by default.

## Callouts (admonitions)

> [!NOTE]
> A neutral side note. Muted-colored left border to differentiate from blockquotes — this is site chrome, not a quoted source.

> [!TIP]
> TIP uses a link-blue left border. Positively-toned. "Try this" energy.

> [!WARNING]
> WARNING uses a link-hover red left border. Stronger visual signal — don't miss this.

## Math

Inline math: when $x^2 + y^2 = r^2$, all the points lie on a circle of radius $r$.

Block math:

$$
a^2 + b^2 = c^2
$$

Or something more involved:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

KaTeX renders these in italic mathit, centered.

## Keyboard keys (kbd)

Press <kbd>⌘</kbd> + <kbd>K</kbd> to open the search overlay. Press <kbd>esc</kbd> to close.

`<kbd>` should have a 1px border, corner radius 3, padding 1/6, and JetBrains Mono 13px.

## Highlight

==Highlighted text== using `<mark>`. Yellow background `#fff7d6` (stays yellow even in dark mode — `<mark>` semantics are mode-independent).

## Image with caption

![A sample image](/avatar.png "Fig: author avatar, used as the image rendering reference")

Captions render in 13px italic muted below the image. On hover the cursor turns to zoom-in; click opens a lightbox. On mobile, long-press triggers an action sheet.

## Footnotes

A point in the body that needs more context[^1]. Another paragraph referencing a second footnote[^lookup].

[^1]: Footnotes render at the bottom of the article. The marker is a superscript digit. Click the back-link to return to the inline reference.
[^lookup]: Named footnotes are supported too — the rendered numbers are auto-renumbered.

## Definition list

Digital garden
:   A continuously tended network of notes, as opposed to a stream of finished blog posts.

Maturity (status)
:   A note's growth stage: seedling (idea), growing, evergreen (settled), archived (filed away).

MOC
:   Map of Content. A hand-curated topic page that links to related notes.

## Horizontal rule

When two paragraphs aren't continuous, use a `---`:

---

This paragraph isn't directly tied to the one above, but it's still part of the same article. Horizontal rule is a 1px `var(--lightgray)` line at full width.

## Wikilinks

To link to other site content, use `[[posts/markdown-first-blog]]` syntax: [[en/posts/markdown-first-blog|Why I write Markdown-first]], [[en/notes/digital-garden]], [[en/notes/note-taking-is-not-knowledge]].

Backlinks get auto-collected at build time and shown in the right rail's Backlinks panel on each page.

## End

If every element above renders as expected, the design system delivery is good. If anything looks off, see the `Markdown Samples` section in the Figma file (key `FIGMA_FILE_ID`).
