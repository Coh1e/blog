# Theming

Design tokens live in `src/styles/tokens.css` as CSS custom properties on `:root`. **`tokens.css` is authoritative for runtime values.** The Figma `Garden` variable collection mirrors these tokens for design fidelity — keep both in sync when changing values.

## Color tokens

Greyscale-leaning palette with one classic-blue accent for links. Light mode is the default; `data-theme="dark"` on `<html>` flips into dark.

| CSS token (runtime) | Figma name (design) | Light | Dark | Used for |
|---|---|---|---|---|
| `--canvas` | `color/canvas` | `#efefef` | `#0a0a0a` | body background around the card |
| `--bg` | `color/bg` | `#fafafa` | `#141414` | card / page surface |
| `--lightgray` | `color/border` | `#e5e5e5` | `#2a2a2a` | borders, hairline rules |
| `--gray` | `color/muted` | `#b8b8b8` | `#666666` | secondary text, dates, captions |
| `--darkgray` | `color/body` | `#4a4a4a` | `#c8c8c8` | body text |
| `--dark` | `color/heading` | `#0f0f0f` | `#fafafa` | headings, emphasis |
| `--link` | `color/link` | `#0645ad` | `#7eb6ff` | anchor color |
| `--link-hover` | `color/link-hover` | `#8b1a1a` | `#ee8888` | anchor hover |
| _(not in CSS yet)_ | `color/code-bg` | `#f1f1f1` | `#1c1c1c` | inline code background, code block fill |

`tokens.css` is authoritative — read the actual values there. The CSS uses tone names (`--gray`, `--dark`); the Figma collection uses semantic names (`color/muted`, `color/heading`). The mapping is 1:1 for everything except `color/code-bg`, which Figma has but `tokens.css` does not declare explicitly yet (the runtime currently inlines `#f1f1f1` in code-block CSS — TODO: extract).

The single non-tokenized color in the design is the highlight yellow `#fff7d6` used by `<mark>` (in Markdown Samples). It's intentionally raw because `<mark>` is yellow regardless of mode, but it could be tokenized as `color/highlight` for full coverage.

## Spacing and dimension tokens

Mirrored as Figma `Spacing` and `Dimension` collections:

| CSS token | Figma var | Value |
|---|---|---|
| `--space-1` | `space/1` | `4px` |
| `--space-2` | `space/2` | `8px` |
| `--space-3` | `space/3` | `12px` |
| `--space-4` | `space/4` | `16px` |
| `--space-6` | `space/6` | `24px` |
| `--space-8` | `space/8` | `32px` |
| `--article-width` | `dim/article` | `720px` |
| `--sidebar-width` | `dim/sidebar` | `240px` |
| `--right-rail-width` | `dim/rail` | `180px` |
| `--article-indent` | `dim/indent` | `140px` |

## Fonts

Five families. Four are loaded via Google Fonts + jsdelivr in `index.html`; Twemoji is loaded as needed via the emoji font stack.

| Family | Role | CSS token | Used in Figma for |
|---|---|---|---|
| **Newsreader** | Latin body text, Latin italic, optical-sized | `--body-font` (Latin half) | Article body, entry titles, blockquote text |
| **LXGW WenKai (霞鹭文楷)** | CJK body text, CJK heading | `--body-font` (CJK fallback) | CN body + CN heading (gardened over Noto Sans SC) |
| **Inter** | Latin headings, UI labels, navigation | `--header-font` | EN headings, all UI chrome (filter strips, meta, captions) |
| **Noto Sans SC** | Neutral CN sans (rarer) | `--header-font` (CJK fallback) | CN UI labels where LXGW would feel too literary |
| **JetBrains Mono** | Code blocks, inline code | `--code-font` | Code blocks (13px), inline code (14–15px), kbd, dates in some contexts |

`--body-font` is a stack: `Newsreader, "LXGW WenKai", serif`. The browser uses Newsreader for Latin glyphs and falls through to LXGW WenKai for CJK glyphs in the same paragraph. This gives you mixed-script paragraphs without per-character markup.

Newsreader is loaded with the full optical-size axis (`opsz 6..72`) so the same family looks right at small UI captions and at body / display sizes. Italic variants (regular + semibold) are loaded too.

LXGW WenKai is loaded from the jsdelivr CDN — that link is in `index.html`; don't drop it.

### CN typography conventions

CN does **not italicize**. LXGW WenKai TC has no italic style, and the CN typographic convention is to use bold or 着重号 (text-emphasis dots, `text-emphasis: filled circle`) for emphasis. In Markdown Samples, the CN paragraph deliberately substitutes `~~删除线~~` (strikethrough) for the italic example slot, with a footnote explaining the choice. EN samples use Newsreader Italic normally.

### Emoji font (Twemoji)

The emoji font stack is:

```css
--emoji-font:
  "Twemoji Mozilla", "Apple Color Emoji",
  "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
```

Decision rationale: Twemoji ships the same SVG glyphs across Mac / Win / Linux / iOS / Android, where the platform defaults all look different. MIT-licensed (jdecked/twemoji fork). Used by GitHub, Mastodon, etc.

**Not emoji**: the geometric / arrow / symbol glyphs in this design (`○ ◐ ● ▣ ⌕ ☾ ⛶ → ✓ ⤓ ▾` etc) are Unicode Geometric Shapes / Symbols / Arrows blocks rendered by the body fonts, not emoji. Twemoji only kicks in for true emoji codepoints (`🌱 🌳 📦 😊` etc) appearing in user content.

## Dark mode

Implemented in three pieces:

1. **`<html data-theme="...">`**: the truth. `tokens.css` has `:root[data-theme="dark"] { ... }` overrides for every color token.
2. **Inline bootstrap script in `index.html`**: applies `data-theme="dark"` from `localStorage.getItem("theme")` (or `prefers-color-scheme`) *before* React mounts. This avoids a flash of the wrong theme. Don't remove or move into React.
3. **`ThemeToggle.tsx`**: writes both `data-theme` and `localStorage.setItem("theme", ...)` on click.

To add a new color token: add to both blocks in `tokens.css` (light and dark), then add a matching variable to the Figma `Garden` collection (both `Light` and `Dark` modes), then use via `var(--token)` in CSS Modules.

The dark mode has been visually validated end-to-end against every screen, demo, and Markdown element in the Figma file (2026-05-05). All fills are variable-bound; the only non-token color is `<mark>` highlight yellow (intentional).

## Reader mode

Toggled via the `⛶` icon in the top bar (`ReaderToggle.tsx`). Adds a `reader-mode` class on `<html>` that:

- Strips chrome (sidebars, right rail, top-bar controls beyond the exit link)
- Centers the article column at **680px** (vs 720 normal — slightly tighter for reading rhythm)
- Bumps body font to **18px** (vs 16) and line-height to **200%** (vs 180%)
- Bumps H2 to 22px (vs 21)
- **Does not** shift colors — same Light/Dark tokens apply

Stateless — does not persist across reloads (intentional; reader mode is a per-session focus toggle).

Per-page reader behavior:

| Page | Reader rendering |
|---|---|
| Article | Title + meta + body only. No tags, no rail. |
| Home | Avatar (64px) + wordmark + tagline + bio + recent essays + recent notes + map link. No sidebar chrome. |
| Map | Title + count + flat chronological entry list. No filter strip, no tag rail. |

See Figma `Layouts III — Reader Mode` (node `209:341`) for the canonical visual reference.

## Layout dimensions

Sidebar widths, article column max-width, etc. live in `tokens.css` and mirror to the Figma `Dimension` collection (see table above). The home page uses a 240-wide left sidebar; article pages use a top toolbar + indented column + 180-wide right rail; reader mode collapses to a single 680 column with no sidebar/rail.

## Don't

- Don't write inline `style={{}}` for colors or spacing. Use a token.
- Don't add a third theme variant (`data-theme="sepia"` etc.) without designing the tokens for it. Light + dark cover 99% of users.
- Don't `!important` your way out of a cascade problem. Either the selector is wrong or the token value is wrong.
- Don't introduce sepia / warm accents. The palette discipline is greyscale + classic blue, period.
- Don't use Italic on CN text. Use bold or `text-emphasis` instead.
