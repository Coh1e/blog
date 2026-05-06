# Figma ↔ Code Gap Report

**Source of truth (design):** `My Garden — Blog Prototype` · `FIGMA_FILE_ID`
**Source of truth (code):** `<repo root>` (Vite + React 18 + react-router-dom 6 + vite-react-ssg, CSS Modules, TypeScript)
**Audit run:** 2026-05-06 — read-only, no code changes.
**Anchor:** CN/EN Article Column (`45:12` / `46:12`) — every other surface measured against the same conventions.

Tag legend on each finding:
- **Token drift** — Figma value vs `tokens.css` value differ
- **Layout drift** — gap, padding, width, breakpoint mismatch
- **Component structure** — DOM hierarchy / slot mismatch
- **Missing** — present in Figma, absent in code
- **Extra** — present in code, absent in Figma
- **State missing** — hover/active/dark/reader variant drift
- **Copy/i18n** — label or vocabulary drift between CN and EN
- **Drift OK?** — likely intentional drift; flag for confirmation

Each finding is a checkbox so you can later turn it into a task list directly.

---

**See full executive summary below in §0.** Quick TL;DR: the site implements ~70% of the design; the missing 30% is concentrated in (1) per-language fonts, (2) page-level "card" wrapper, (3) About/Now routes, (4) reader-mode chrome restructuring, (5) custom-comments-vs-Giscus reconciliation.

---

## §1 Bilingual Layouts — Full Layout Parity (`42:2`)

### §1.A Article Column · `45:12` (CN) / `46:12` (EN)

**Verdict:** Mostly aligned at the structural level (breadcrumb → title → meta → tags → body), with several real value drifts in typography and one significant CN/EN font-stack divergence the design explicitly asks for that the code currently flattens.

#### Tokens

- [ ] **Token drift — body size**: Figma body paragraphs (`45:27`, `46:27`, `45:53`, `46:60`) are **16px**. `tokens.css:35 --body-size: 1.0625rem` = **17px**. Effective everywhere `var(--body-size)` is read (article paragraphs, lists, default body). 1px drift, applies site-wide.
- [ ] **Token drift — EN body line-height**: Figma EN body uses `leading-[1.65]` (`46:27`, `46:31`, etc.). `tokens.css:36 --body-line: 1.8`; `tokens.css:37 --body-line-cjk: 1.8`. Code applies 1.8 to both languages. CN line-height of 1.8 matches Figma, but **EN should be 1.65** per the design.
- [ ] **Token drift — title size**: Figma title (`45:15`, `46:15`) is **28px / 1.25 (EN), 28px / 1.3 (CN)**. `ArticleLayout.module.css:66 .title { font-size: 1.85rem }` = **29.6px / 1.25**. ~1.6px drift.
- [ ] **Token drift — H2 size**: Figma H2 (`45:29`, `46:29`) is **21px / 1.3**. `ArticleLayout.module.css:122 .body h2 { font-size: 1.3rem }` = **20.8px**, `line-height` inherits from `tokens.css:36 = 1.8` → effectively `global.css:96 line-height: 1.25` for h*. Either way, line-height differs from Figma's 1.3. Minor.
- [ ] **Token drift — H3 size**: `global.css:102 h3 { font-size: 1.05rem }` (16.8px) but `ArticleLayout.module.css:135 .body h3 { font-size: 1.1rem }` (17.6px). Two different H3 sizes; Figma sample doesn't show H3 explicitly but consistency would prefer one source of truth.
- [ ] **Token drift — code-block text size**: Figma code blocks (`45:46`, `46:46`) are **13px / 1.55** with JetBrains Mono. `ArticleLayout.module.css:158 .body pre { font-size: 0.92em }` ≈ 15.6px (when body is 17px). And `global.css:136 pre { font-size: 0.88em }` ≈ 15px. Both are larger than Figma's 13px.

#### Component structure / fonts

- [ ] **Component structure — EN body font is wrong**: Figma EN body uses **Source Serif 4** (`Source_Serif_4:Regular`, `46:27` etc). `tokens.css:22-24 --body-font` = `"Newsreader", "LXGW WenKai Screen", ...`. Code uses **Newsreader** for EN body. This is a deliberate per-language design choice (CN uses LXGW WenKai TC, EN uses Source Serif 4) that the current single-font-stack approach can't express. → Suggests a `--body-font-cn` / `--body-font-en` split, or `[lang="en"] { --body-font: ... }` override.
- [ ] **Component structure — Code-block visual style**: Figma code blocks are **white/canvas with a 1px `var(--lightgray)` border, no fill, radius 2px** (`45:46`, `46:46`). `ArticleLayout.module.css:159` and `global.css:134` both render code blocks with **`background: var(--lightgray)` fill and no border**. Real visual difference: outlined vs filled card.
- [ ] **Component structure — TagPill font size**: Figma tag chip (`45:21`, `46:21`) is **11px Inter**. `TagPill.module.css:4 font-size: 0.75rem` = **12px**. 1px drift.
- [ ] **Component structure — TagPill spacing**: Figma tag list (`45:19`) uses `gap-[6px]` between chips. `TagPill.module.css:11 margin-right: 0.25rem` = **4px** between adjacent chips (and there's no `gap` on the parent `.tags` in `ArticleLayout.module.css:104`). Minor; same idea, different mechanism.
- [ ] **Component structure — Blockquote color**: Figma blockquote text (`45:58`, `46:58`) is `var(--color/muted)` = `#b8b8b8` (i.e. `--gray`). `global.css:118 blockquote { color: var(--darkgray) }` (#4a4a4a), and `ArticleLayout.module.css:144 .body blockquote { color: var(--gray) }` (#b8b8b8). The article-scoped rule matches Figma; the global default is darker. **Drift OK?** — they target different surfaces (article body vs everything else); confirm intent.
- [ ] **Component structure — Blockquote italics**: `ArticleLayout.module.css:145 font-style: italic` is set. Figma blockquote is **not italic** (`not-italic` in `45:58`, `46:58`). Italic was likely a Tufte-ish editorial choice; Figma overruled it.
- [ ] **Component structure — H1 weight (CN title)**: Figma CN title (`45:15`) is **LXGW WenKai TC Bold (700)**. Code does `:global([lang="zh-CN"]) .title { font-family: var(--body-font); font-weight: 700 }` (`ArticleLayout.module.css:73-76`). Resolves correctly via font fallback to LXGW Wenkai weight 700, but the stack is `"Newsreader, LXGW WenKai Screen, LXGW WenKai, ..."` — Figma specifies "LXGW WenKai TC" (Traditional Chinese cut). CSS stack uses "LXGW WenKai Screen" first. **Drift OK?** — different cuts, both LXGW family; verify which the user wants.

#### Layout (vertical rhythm)

Figma's gaps (heights of explicit `Gap` frames in `45:14`–`45:59`, mirrored in `46:*`):

| Position | Figma gap | Code equivalent | Drift |
|---|---|---|---|
| Breadcrumb → Title | 6px (`45:14`) | `.breadcrumb { margin: 0 0 0.4rem 0 }` ≈ 6.4px | ~OK |
| Title → Meta | 8px (`45:16`) | `.title { margin: 0 0 0.5rem 0 }` = 8px | ✓ |
| Meta → Tags | 10px (`45:18`) | `.meta { margin: 0 0 0.5rem 0 }` = 8px | **2px short** |
| Tags → Body | 28px (`45:26`) | `.tags { margin: 0 0 1.5rem 0 }` = 24px | **4px short** |
| Paragraph → next H2 | 28px (`45:28`) | `.body p { margin: 0 0 1.4em 0 }` ≈ 23.8px (at 17px body) + `h2 { margin: 2rem 0 1rem 0 }` top 32px = collapsed 32px | **4px over** |
| H2 → next content | 12px (`45:30`) | `h2 { margin-bottom: 1rem }` = 16px | **4px over** |
| Code block → next paragraph | 20px (`45:52`) | `.body pre { margin: 0 0 1.2em 0 }` ≈ 20.4px | ✓ |
| Section gap (h2-to-h2 area) | 28px (`45:43`, `45:54`) | mixed; depends on collapsed margins | **drift OK?** |
| Quote → next paragraph | 20px (`45:59`) | `.body blockquote { margin: 0 0 1.2em 0 }` ≈ 20.4px | ✓ |

- [ ] **Layout drift — meta-to-tags 8px vs 10px**, **tags-to-body 24px vs 28px**, **h2-bottom 16px vs 12px**. Small but consistent under-spacing of 2–4px in the article column.

#### Copy / i18n

- [ ] **Copy/i18n — reading-time CN suffix**: Figma CN meta reads `2026/05/03  ·  3 分钟阅读` (`45:17`). Code outputs `${date} · ${readingTime} ${minLabel}` with `minLabel = "分钟"` (`ArticleLayout.tsx:56`), producing `… · 3 分钟`. Figma adds **阅读** ("read") after the unit. EN matches: Figma `3 min read` (`46:17`), code emits `3 min` — also missing "read".
- [ ] **Copy/i18n — meta separator**: Figma uses double-space-bullet-double-space `  ·  ` (`45:17`, `46:17`). Code uses `" · "` (single spaces) in `ArticleLayout.tsx:74-78`. Visually subtle; sturdier hairline in design.

#### Date format

- ✓ `formatDate` (`content.ts:234`) emits `YYYY/MM/DD` matching Figma `2026/05/03`. No drift.

#### Anchor-local items not surfaced in 45:12 / 46:12 but worth noting

- [ ] **Missing — "last edited" stamp on evergreen notes**: `ArticleLayout.tsx:89-94` renders `{tendedLabel} {tendedDays} {dayUnit}` (`最近修剪 N 天前` / `Last tended N days ago`). The anchor frames don't show this — they're posts, not evergreen notes. Need to verify the design covers this state: probably surfaced in the markdown-sample or a separate frame. Flag for §4 (markdown samples) follow-up.
- [ ] **Extra — evergreen status glyph `· ●`**: `ArticleLayout.tsx:95-99` renders a bullet glyph for evergreen status. Not visible in `45:17` / `46:17` (post, not evergreen). Same flag as above — confirm in samples.

---

### §1.B Article full screen · `45:2` (CN) / `46:2` (EN)

**Verdict:** A significant structural mismatch — the design wraps the entire screen in a "card" (lighter `--bg` rectangle on the darker `--canvas`), and the body lays out as a centered flex row; code has no card and uses a 4-column grid with a left indent gutter. The two-tone canvas/card split is even called out in `tokens.css:5-7` as design intent but never implemented.

#### Component structure

- [ ] **Missing — page-level "card" wrapper**: Figma `45:2` wraps everything in a `bg-[var(--color/bg)] border border-[var(--color/border)]` rectangle with `pt-32 pb-80 px-40` and `gap-32` between top bar and body. Code (`ArticleLayout.tsx:64-118`) renders Toolbar + `.row` directly on `body { background: var(--canvas) }` with no inner card. The `--canvas` / `--bg` distinction in `tokens.css:5-7` ("centered card on a slightly darker canvas") exists in tokens but is unused at the page level.
- [ ] **Layout drift — body grid model**: Figma `45:11 .Body Grid` is `flex gap-[60px] items-start justify-center` — two children (article + rail) centered with 60px gap. Code (`ArticleLayout.module.css:1-6`) uses a 4-column CSS grid `var(--article-indent) var(--article-width) 1fr var(--right-rail-width)` with `column-gap: 0`. Different mental model: Figma centers the pair, code anchors the article via a fixed left gutter (`--article-indent: 140px`). Visually similar at the default viewport but very different under width changes.
- [ ] **Layout drift — top-bar widths/borders**: Figma TopBar (`141:2`) is `w-[1240px] h-[43px] pb-[14px] border-b 1px lightgray` and lives **inside the card**. Code `Toolbar.module.css:1-8` is a `flex` with `padding: 32px 80px 14px 80px` and a `border-bottom: 1px solid var(--lightgray)`. The `pb-14px` matches; the rest of the structure differs because the card wrapper is missing.
- [ ] **Component structure — Toolbar buttons show text in code, icon-only in Figma**: `ThemeToggle.tsx:27-30` and `ReaderToggle.tsx:13-16` always render `<span aria-hidden>icon</span><span>label</span>` (e.g. "☾ 深色"). Figma TopBar IconButton (`140:18`) shows **only the glyph** for theme (`☾`) and reader (`⛶`) — search keeps "⌕  搜索". The same buttons in Home sidebar (`47:10`, `47:12`) DO show icon+label. So Figma intends two variants; code only has the icon+label one and uses it everywhere.
- [ ] **Component structure — Toolbar button gap**: Figma toolbar (`141:6`) uses `gap-[6px]` between icon buttons; code `Toolbar.module.css:31 gap: 0.5rem` = 8px. Minor.
- [ ] **Component structure — TopBar control-group divider position**: Figma puts the vertical divider (`140:5`) between the icon-button group and the LangToggle, with `gap-[12px]` outer / `gap-[6px]` inner. Code `Toolbar.tsx:26 <span vrule>` is between ReaderToggle and LangToggle but outer gap is `0.5rem` — same idea, slightly different proportions.

#### Right rail (TOC + Backlinks)

- [ ] **Component structure — TOC + Backlinks divider**: Figma `45:68 .Backlinks` has `border-t 1px var(--color/border) pt-14` separating it from the TOC above it, plus a 24px gap on the parent rail (`45:61 gap-24`). Need to confirm `TableOfContents.module.css` and `Backlinks.module.css` reproduce this. Flagging for follow-up read.
- [ ] **Token drift — TOC heading**: Figma `45:63` "目录" / `46:63` "Contents" is **12px Inter Semi Bold, tracking 0.72px, color muted**, with `leading-[1.5]`. This matches `--label-size: 0.75rem` and `--label-tracking: 0.06em` — confirm `TableOfContents.module.css` uses these tokens.
- [ ] **Token drift — TOC items**: Figma uses **13px LXGW WenKai TC Regular, line 1.45, color body** (`45:65-67`). No standard token at 13px exists in `tokens.css` (closest are `--row-meta-size: 0.75rem` = 12px and `--row-title-size: 1rem` = 16px). Audit will flag whatever value the TOC component uses.
- [ ] **Token drift — Backlink rows**: Figma `45:71-73` is **14px link-color title (LXGW Regular)** + **11px summary (Inter Regular muted, line 1.5)**, with `gap-[2px]` between title and summary. No 11px or 14px token in `tokens.css`. Audit will flag what `Backlinks.module.css` actually uses.

---

### §1.C Home · `47:3` (CN) / `48:2` (EN)

**Verdict:** Sidebar order matches; main-column rhythm matches the existing tokens (this is where 17px body lives, so `--body-size: 17px` is *correct* here and *wrong* on the article column). The right rail with social links + RSS is entirely missing from code, and the sidebar gap to Avatar is wrong.

#### Component structure

- [ ] **Missing — page-level "card" wrapper**: Same as §1.B. Figma `47:3` is `bg-[var(--color/bg)] border-1 border-lightgray p-80 gap-80`. Code `HomeLayout.module.css:1-6` matches the **inner padding/gap** (80px each ✓) but has no card; the page sits on `--canvas`.
- [ ] **Missing — Home right rail (`119:2` "External Elsewhere & RSS")**: Figma shows a **120px right column** with "别处" / "Elsewhere" → Instagram / GitHub / Email links (14px Inter, `link` color, line 1.7), a divider, and "订阅" / "Subscribe" → RSS link (14px) + sub-line "订阅更新" / "Subscribe to updates" (12px muted). Code `HomeLayout.tsx` has a 2-column grid (`sidebar-width 1fr`) with no third rail. Major missing feature.
- [ ] **Layout drift — Sidebar internal gaps**: Figma sidebar (`47:4`) uses `gap-[16px]` for everything except a **24px spacer (`47:20`)** before the Avatar (with the Avatar Caption directly under it). Code `HomeLayout.module.css:11 .sidebar { gap: 16px }` for *all* children. Result: sidebar→Avatar spacing is 16px in code vs 24px in design.
- [ ] **Layout drift — Sidebar utility-button text**: Figma `47:10`/`47:12` shows `☾ 深色` / `⛶ 阅读` with text + icon. Same as `ThemeToggle.tsx:27-30` and `ReaderToggle.tsx:13-16`. ✓ matches HERE; but the Article toolbar context wants icon-only (see §1.B).
- [ ] **Token drift — Sidebar utility-button padding**: Figma sidebar buttons (`47:10`, `47:12`) use `px-[8px] py-[5px]`; Article toolbar buttons (`140:18`) use `px-[9px] py-[5px]`. Code currently has one `IconButton` style for both. Minor.

#### Main column

- [ ] **Token usage — intro paragraph**: Figma `47:47` body intro is **17px LXGW Regular line 1.8** = exactly what `--body-size`/`--body-line` resolve to. ✓ This is the surface those tokens were sized for.
- [ ] **Token drift — section gap "Intro → Recent Essays"**: Figma `47:50 h-[36px]` = 36px gap. Need to confirm `HomePage.module.css` matches; there's no `--space-9` (36px) in the spacing scale (`tokens.css:50-56` jumps from `--space-8` 32px to nothing).
- [ ] **Token usage — section heading**: `最近的文章` / "Recent Essays" is `12px Inter Semi Bold, tracking 0.72px, color muted`. ✓ matches `--label-size` and `--label-tracking`.
- [ ] **Token usage — Essay row**: Figma `47:53-57` row uses `date 96px JetBrains Mono 14px muted` (✓ `--date-size`), `title 16px LXGW link` (✓ `--row-title-size`), `summary 12px muted` (✓ `--row-meta-size`), gap-2 between title and summary, gap-16 between date and body, `py-[4px]` row padding, `h-[2px]` between rows.
- [ ] **Token usage — Note row**: Figma `47:80-84` is `title 16px LXGW link + status pill 11px + summary 12px muted` all in one line with `gap-[8px]`. Status pill: `border-1 lightgray, rounded-2, px-6 py-px, text-11`. Note: `evergreen`, `growing`, `seedling`, `archived` — strings only, no glyph. Need `StatusPill.module.css` to verify (it likely has a glyph; design doesn't).
- [ ] **Component structure — Note row status pill: glyph?** Figma `47:83`/`47:89` shows the literal word `evergreen` only — no `●` glyph next to the word. Code `NoteRow.tsx` (not yet read in this audit) likely uses `StatusPill` which may include a glyph. Flag for §2 (Components Library) follow-up.
- [ ] **Missing — Avatar caption**: Figma `174:167` shows tagline "记录想法，写慢一点。" 13px Noto Sans SC body color line 1.5 + "关于我 →" 12px link color. Code `Avatar.tsx:37-44` renders both; sizes need to be checked in `Avatar.module.css`. **Functionality matches**.
- [ ] **Missing — "索引" / Index section + footer**: Figma `47:99-104` shows section "索引" → "→ 内容地图 · 全部 36 条" (16px link, line 1.75), then `h-[64px]` spacer, then footer with `border-t pt-16` and "© 2026" (12px muted Inter). Code's `HomePage.tsx` (not yet read) likely renders an "Index" link to the map; need to confirm. Flag for follow-up.

---

### §1.D Map · `124:2` (CN) / `124:165` (EN)

**Verdict:** Major interaction-model gap on the right rail. Header structure differs slightly. Date format on entry rows differs. Time-range filter is missing.

#### Component structure

- [ ] **Missing — page-level "card" wrapper**: Same pattern as §1.B / §1.C. `MapPage.tsx` renders Toolbar + `.row` directly on canvas.
- [ ] **Missing — Time/year filter dropdown**: Figma `164:161` shows a "任意年份 ▾" / "Any year ▾" dropdown trigger after the maturity strip. Code `MapPage.tsx:106-127` only has the maturity filter strip — no time/year filter.
- [ ] **Component structure — Maturity tab format**: Figma `MaturityTab` (`142:27`, instances `162:199`) renders `glyph + label + count` in a single inline group (no border, `gap-[6px]`). Code `MapPage.tsx:178-195 FilterPill` renders the same fields but wrapped in a `<button>` with `aria-pressed`. Visually equivalent; behavior matches; check that `MapPage.module.css .pill` doesn't add a border or background that Figma doesn't show in default state.
- [ ] **Copy/i18n drift — subtitle**: Figma `164:159` shows `"36 条"` (CN) / `"36 entries"` (EN). Code `MapPage.tsx:31` emits `\`全 ${n} 条\`` (`全` prefix). Minor — Figma is more terse.
- [ ] **Token drift — title size on Map**: Figma `148:95` "内容地图" is **28px LXGW Bold** — same as Article title. Code `MapPage.module.css .title` (not yet read) — flag to verify.

#### Entry rows

- [ ] **Component structure — Entry row vs ArchiveRow**: Figma `Entry Row` (`143:18`, instances `148:121` etc.) is `title (LXGW Bold 17px heading, FILL) + date (Inter Medium 14px muted, HUG)` line 1, `meta (Inter Regular 12px muted line 1.45)` line 2, with a 1px lightgray rule below. Meta string format: `tag · tag · status · ↗ N` where `↗ N` is backlink count. Code uses `ArchiveRow` (not yet read) — need to verify it renders title in **Bold weight** and includes **backlink count**.
- [ ] **Layout drift — Entry row date format**: Figma `148:121` date is `"4/20"` (M/D, single-digit when applicable). `formatDate` (`content.ts:234`) produces `"YYYY/MM/DD"`. ArchiveRow likely uses `formatDate`, which would render `"2026/04/20"` instead. → Map needs a different date formatter (or the design needs to change).
- [ ] **Token drift — Entry row title**: Figma uses **17px LXGW Bold heading-color**. No 17px standard token (`--body-size` is 17px, but the body comes in regular not bold). Confirm what `ArchiveRow` / `MapPage.module.css` actually uses.

#### Right rail (Tags)

- [ ] **Missing — Selected-tags chip row** (`169:160` "已选 (2)"): Figma rail starts with **active-filter chips with × buttons** showing currently selected tags, plus a "清空" / "Clear" link. Code `MapPage.tsx:149-164` rail has only a passive tag list (each `<Link>` to `/tags/<tag>/`). No multi-select filter UI.
- [ ] **Missing — Tag search input**: Figma `169:172` shows a search input "⌕ 搜索标签" / "search tags" inside the rail. Code rail has no search.
- [ ] **Component structure — Tag list interaction**: Figma renders tags as `<p>name count</p>` with **active/inactive emphasis** (`writing 7` and `markdown 5` are SemiBold heading-color, others are Regular muted) — meaning click-to-filter, not link-to-tag-page. Code `MapPage.tsx:152-157` renders `<Link>` per tag → goes to `/tags/<tag>/`. Different interaction: Figma filters in place; code navigates away.
- [ ] **Missing — backlink count (↗ N) on Map entries**: Figma meta line includes `↗ 3` etc. Code `ArchiveRow` (not yet read) needs verification.

---

### §1.E Comments demo · `200:342` (CN) / `200:375` (EN)

**Verdict:** Major implementation-vs-design mismatch. Figma designed a **fully custom comments UI** with avatars, threading, "no email / no IP" privacy note, and an RSS feed for comments. Code uses **Giscus** (a third-party GitHub Discussions iframe) which is visually isolated and cannot be styled to match. This is the single biggest "do we keep the design or the code?" question in the audit.

- [ ] **Drift OK? — Comments implementation philosophy**: Figma `200:342` is a custom comments UI; `Comments.tsx` mounts a Giscus iframe (`Comments.tsx:24-43`). The visual designs are not reconcilable: Giscus enforces its own typography, button styles, login flow, and uses GitHub Discussions as backend. Decision needed:
  1. Replace Giscus with a self-hosted comments backend that can render the Figma design (large engineering investment).
  2. Update Figma to a screenshot/mock of Giscus (faster, but loses the privacy-note + RSS-comment-feed features the design includes).
  3. Hybrid: keep Giscus but add a custom heading row above the iframe (count + RSS link).
- [ ] **Missing — Comment count in heading**: Figma `200:344` shows `"评论 · 2"` / `"Comments · 2"` (with count). Code `Comments.tsx:49` emits just `"评论"` / `"Comments"`. Even if Giscus stays, the heading wrapper around it could show `data-emit-metadata` count — currently `siteConfig.giscus.emitMetadata` is set but unused in the heading.
- [ ] **Missing — RSS comments-feed link**: Figma `200:345` shows `"RSS 订阅评论"` / `"RSS — comment feed"` 12px link. Code has no per-post comment RSS feed (and Giscus doesn't expose one).
- [ ] **Missing — Privacy note**: Figma `200:372` shows `"评论审核后显示。不收邮箱，不存 IP。"` / equivalent. This is a copy-only addition above/below the Giscus widget (no backend change needed).
- [ ] **Token usage — Comment text**: Figma `200:355` body is **15px LXGW Regular line 1.65** for CN and **Source Serif 4 line 1.65** for EN (matching the article body language treatment from §1.A). No 15px standard token. Same per-language font issue from §1.A applies here.

---

*(§2 Components Library — pending Batch 4)*
*(§3 Design Notes — pending Batch 4)*
## §4 Markdown Samples — Article Body Rendering (`181:167`)

**Verdict:** This is the section that reveals the most missing styling. The sample documents 14 distinct markdown surfaces — about half of them have no corresponding rule in `global.css` or `ArticleLayout.module.css`. The biggest visible mismatch is the callout system (Figma's 3 conservative tokens vs code's 7 semantic Tailwind colors) and unstyled task lists / kbd / mark / definition lists.

### §4.A Inline elements (`185:167`, `185:168`)

- [ ] **Token drift — inline code size**: Figma `185:167` shows inline code at **14px JetBrains Mono Regular**. Code uses `0.92em` (`ArticleLayout.module.css:151`) → ~15.6px at 17px body, or `0.9em` (`global.css:127`) → ~15.3px. Both are larger than 14px. Should likely be a fixed `0.875rem` or anchored to a token.
- [ ] **Designer note — CJK italics**: Figma `185:168` includes a verbatim designer annotation: `（注：中文不真做斜体——LXGW 等 CJK 字体无 italic style；强调约定俗成用粗体或着重号 text-emphasis。）`. Means: don't render italic on CN text — use bold or `text-emphasis`. Currently `global.css` and `ArticleLayout.module.css:145` apply `font-style: italic` on `blockquote` (already flagged in §1.A). No `[lang^="zh"]` override exists. → Reinforces §1.A blockquote-italic finding; broader rule: any `font-style: italic` should be locale-gated.

### §4.B Headings (`181:200`, `187:231`)

- [ ] **Token drift — H3 size**: Figma `181:200` H3 is **18px LXGW Bold line 1.3 heading-color**. Code H3 in `global.css:102` is `1.05rem` (16.8px); in `ArticleLayout.module.css:135` is `1.1rem` (17.6px). Both under 18px and inconsistent with each other.
- [ ] **Missing — heading anchor `#` link on hover**: Figma `187:231-235` shows the anchor as a 16px `#` next to the H2 with `opacity-50` (hover → 100%). Code `MdH2`/`MdH3` (`markdown.tsx`) generate the `id` attribute but render no visible anchor element. Need either a `<a className="anchor">#</a>` slot or a `:hover ::before { content: " #" }` CSS rule.
- [ ] **Designer note — anchor interaction**: `187:235` annotates: `（hover 在标题上时 # 显示满色 + cursor pointer，点击 → URL hash 跳到该锚点）`. Implementation would need both: render the `#` always (opacity 0.5) and target the hash on click.

### §4.C Lists (`181:188-212`, `181:202-208`)

- [ ] **Component structure — unordered list bullet glyph**: Figma `181:203` uses `·` (middle dot) as the bullet, not the browser default `•`. Code does not customize `<ul>` markers (`global.css:149-150` only sets padding/margin). Drift.
- [ ] **Token usage — ordered list**: Figma renders ordered lists by hand (numbers as separate `<p>` elements: `1.`, `2.`, `3.`) — implies the design wants the **number visually separated** from the item text with `gap-[8px]`. Browser-default `<ol>` lays out the marker close to the text. Likely OK; matches list-style if `<ol>` is left alone, but the design intent has more breathing room.
- [ ] **Token drift — list item gaps**: Figma uses `8px` between list items (`181:191, 181:195`); `ArticleLayout.module.css:174 .body ul li, ol li { margin: 0.25rem 0 }` = 4px. Half the gap.

### §4.D Callouts (`186:167-180`) — significant

- [ ] **Token drift / Component structure — callout color system**: Figma `186:169-179` shows **only 3 callouts** styled with site-palette colors:
  - `NOTE` → `var(--color/muted)` (`#b8b8b8`) left border
  - `TIP` → `var(--color/link)` (`#0645ad`) left border
  - `WARNING` → `var(--color/link-hover)` (`#8b1a1a`) left border
  
  Code `global.css:178-187` defines **7 callouts** with semantic Tailwind colors:
  - `note/info` → `#3b82f6` (blue)
  - `tip` → `#10b981` (green)
  - `warning` → `#f59e0b` (amber)
  - `caution/important` → `#ef4444` (red)
  - `quote` → `var(--gray)`
  - `abstract/example/question` → `#8b5cf6` (purple)
  
  Two completely different design languages. Decision needed: collapse to 3 site-tone callouts (Figma) or expand Figma to cover 7 obsidian-style variants.
- [ ] **Component structure — callout shape**: Figma callouts have **no background tint, 2px left border, gap-4 between title and body, py-2 padding**. Code callouts have **background tint** (e.g. `rgba(59,130,246,0.06)`), **3px left border**, **0.75rem 1rem padding**, **2px border-radius**. Different visual weight.
- [ ] **Token drift — callout title size**: Figma `186:170` callout title is **11px Inter Semi Bold uppercase, no letter-spacing**. Code `global.css:170` `.callout-title { font-size: 0.85rem; letter-spacing: 0.02em }` = 13.6px. Larger and more spaced.

### §4.E Images (`186:183-188`) — significant

- [ ] **Missing — image lightbox / zoom interaction**: Figma `186:188` annotates: `↳ hover: 鼠标变 zoom-in；click: 弹 lightbox 全屏；移动端 long-press: 长按弹 sheet 选择保存。`. `markdown.tsx MdImg` only sets `loading="lazy"` + `decoding="async"` and wraps in `<figure>` when title attr present. No lightbox. New feature: needs a click-to-zoom / lightbox component.
- [ ] **Token drift — figcaption typography**: Figma `186:187` caption is **13px LXGW Regular line 1.6 muted**. Code `global.css:223 .md-figure figcaption { font-family: var(--header-font); font-size: 0.85rem; font-style: italic; color: var(--gray) }` — 13.6px Inter italic. Font family AND size AND style differ.

### §4.F Tables (`187:169-181`)

- [ ] **Token drift — table typography**: Figma table is **15px LXGW (Bold for th, Regular for td) line 1.6**. Code `global.css:141 table { font-size: 0.95em }` ≈ 16px at 17px body, `ArticleLayout.module.css:207 .body table { font-size: 0.95rem }` = 15.2px. Close but not 15px exact, and font family is body-font (not LXGW-specific) — same EN/CN font issue.
- [ ] **Layout drift — table header divider**: Figma `187:170` header row uses `border-b-2 var(--color/border)` (2px lightgray); code `global.css:147 th { border-bottom-color: var(--darkgray) }` (1px **darkgray** = #4a4a4a). Both divider weight and color differ.
- [ ] **Token drift — cell padding**: Figma `py-[10px]`; code `global.css:144 padding: 0.4rem 0.75rem` = 6.4px / 12px. Less vertical breathing.

### §4.G Task lists (`187:185-201`) — significant

- [ ] **Missing — custom task-list checkbox styling**: Figma `187:186-201` shows custom 14×14px checkboxes with **filled heading-color background + white ✓** (checked) or **1px heading-color border, transparent** (unchecked). Checked rows have **`line-through` + muted color**. Code's `global.css` has **no `.task-list-item` or `input[type="checkbox"]` rules** — markdown-rendered task lists fall back to native browser checkboxes (which look very different cross-browser).

### §4.H kbd (`187:205-212`) — significant

- [ ] **Missing — kbd element styling**: Figma `187:207-211` renders `<kbd>` as **1px lightgray border, rounded-3, JetBrains Mono 13px heading-color, px-6 py-px**, with `gap-6` and a `+` separator (12px muted). Code `global.css` has **no `kbd` rule**. Browser default is browser-specific monospace.

### §4.I mark / highlight (`187:215-220`) — missing

- [ ] **Missing — mark element styling**: Figma `187:218` renders `<mark>` as `bg-[#fff7d6] px-4 py-px`. Code `global.css` has no `mark` rule. The hex `#fff7d6` is also not in the token palette — would need a new token (`--mark-bg`) or stay hardcoded.

### §4.J Math (`187:223-227`)

- [ ] **Drift OK? — block math placeholder vs KaTeX**: Figma `187:227` shows block math as **18px Newsreader Italic** in a dashed border block. KaTeX (loaded via jsDelivr in `index.html`) renders math in its own KaTeX_Main font, NOT Newsreader. The Figma design is a mockup; actual KaTeX output won't match. Either: accept that math diverges, or replace KaTeX with a serif-driven renderer.
- [ ] **Drift OK? — inline math styling**: Figma uses Unicode-style math (`x² + y² = r²`); KaTeX renders proper LaTeX glyphs. Different.

### §4.K Definition list (`189:169-181`)

- [ ] **Missing — `dl/dt/dd` styling**: Figma `189:170-181` renders dt as **16px LXGW Bold heading-color** + dd as **`pl-24` 16px LXGW Regular body-color**, with `gap-12` between definitions. Code `global.css` has no `dl/dt/dd` rules. Note: standard Markdown doesn't have a definition-list syntax; need either remark-deflist or HTML passthrough — and matching CSS.

### §4.L Footnotes (`181:232-236`)

- [ ] **Token drift — footnote text size**: Figma `181:236` footnote text is **13px LXGW Regular line 1.6 muted**. Code `global.css:194 .footnotes { font-size: 0.9rem }` ≈ 14.4px Inter (header-font). Size and family differ.
- [ ] **Component structure — "FOOTNOTES" heading**: Code `global.css:197-205 .footnotes h2` renders an explicit "FOOTNOTES" uppercase heading at 0.75rem. Figma footnote section starts directly with a **horizontal rule + numbered footnote**, no visible heading. Either drop the h2 in CSS or have remark/rehype not emit it.
- [ ] **Layout — separator before footnotes**: Figma `181:232` shows a 1px lightgray hr above footnotes. Code's `global.css:191 .footnotes { border-top: 1px solid var(--lightgray); padding-top: 1rem }` ✓ matches.

---

## §5 Layouts II — Static & Index Pages (`193:167`)

**Verdict:** Two of five pages (About, Now) are not implemented at all (already known from Batch 1). 404 doesn't follow the Figma's 64px hero layout — code uses `ListLayout` with inline-styled paragraphs. Tag and Archive entry rows go through `ArchiveRow` which has different visual structure than Figma's row design.

### §5.A 404 · `193:169` (CN) / `193:198` (EN)

- [ ] **Layout drift — 404 hero design**: Figma `193:169` uses a custom hero shape — `gap-[120px]` top spacer, then **64px LXGW Bold "404"** + 16px gap + **21px LXGW Bold "页面没找到" subhead** + 12px gap + body paragraph + 28px gap + link row. Code `NotFoundPage.tsx:32-58` uses `ListLayout` with `title="404"` rendered as the layout's standard h1 + inline-styled `<p>` elements. The 64px hero number and 120px top spacer are not present.
- [ ] **Component structure — 404 uses ListLayout**: `ListLayout` likely places title in a list-page header style, not a centered hero. The 404 page deserves its own component or a ListLayout `variant="hero"`.
- [ ] **Layout drift — 404 link row**: Figma `193:197` shows links as `→ 回首页 · → 内容地图 · → 全部条目` with `var(--color/link)` color, all on one line. Code (`NotFoundPage.tsx:47-56`) uses inline-styled spans with `var(--gray)` for the `·` separator — close but uses inline styles instead of a CSS Module class.

### §5.B About · `193:227` (CN) / `193:264` (EN) — missing route

- [ ] **Missing — About route handler**: `routes.tsx` does not include `/about` or `/en/about`. Content files exist at `content/pages/about.md` and `content/en/pages/about.md` but never get rendered. Need a new page component (e.g. `PagesPage` or reuse `ArticlePage`) and a route entry. Confirmed from Batch 1.
- [ ] **Component structure — About uses indented single-column layout**: Figma `193:227` is `pl-[140px]` 720-wide single column with no right rail (same shape as 404, Now, Archive). This is a **second layout pattern** the code should support: indented-no-rail vs centered-with-rail. Potentially a `<StaticPage>` layout component or a variant of ArticleLayout that hides the rail.
- [ ] **Token usage — About content**: Figma uses standard heading/body/link tokens correctly. The "Email · GitHub · Instagram · RSS" link line at `193:263` is 16px LXGW Regular link-color — could just be regular markdown body text in `about.md` once the page is wired.

### §5.C Now · `193:296` (CN) / `193:339` (EN) — missing route

- [ ] **Missing — Now route handler**: Same as About. Content files at `content/pages/now.md`, `content/en/pages/now.md`. No route in `routes.tsx`.
- [ ] **Component structure — Now uses different meta line**: Figma `193:326` shows a meta line `更新于 2026/05/03  ·  每月修剪一次` / `Updated 2026/05/03  ·  trimmed monthly`. This is **distinct from Article meta** which is `date · reading-time`. The Now page wants an "updated" prefix and a cadence string. If Now reuses `ArticleLayout`, those need to be parameterized; or Now needs its own page component.
- [ ] **Token usage — Now structure**: H2 sections "在做什么" / "在读什么" / "在地" are standard 21px LXGW Bold. Body is standard. Mostly the existing markdown rendering would work IF the page is wired up.

### §5.D Tag · `194:269` (CN) / `194:332` (EN)

- [ ] **Component structure — Tag title font is Inter for both languages**: Figma `194:292` shows the tag title (`#writing`) in **Inter Semi Bold 28px** for both CN and EN. Because the tag content is Latin (`writing`, `markdown` etc.). Code `TagPage.module.css` (not yet read) likely uses the same body-font/header-font split as Article. Verify it doesn't apply LXGW Bold to the `#tag` title on CN pages.
- [ ] **Copy/i18n drift — subtitle hashprefix**: Figma `194:294` `7 条带 writing 标签的内容` (no `#`). Code `TagPage.tsx:22 subtitle: (n, t) => \`${n} 条带 #${t} 标签的内容\`` (with `#`). Minor.
- [ ] **Copy/i18n drift — clear link**: Figma `194:300` `清空 · 回到全部条目`. Code `TagPage.tsx:23 clearLabel: "清空 · 全部条目"` (missing 回到 = "back to"). Minor.
- [ ] **Component structure — Right rail tag list as plain text vs links**: Figma `194:323-331` shows tag list as plain `<p>name count</p>` 12px Inter Regular muted — visually NOT links (no link color). Code `TagPage.tsx:95-100` renders each as a `<Link>` with link-color styling. **Drift OK?** — clicking should navigate to that tag's page (useful), but the visual style should still appear as muted text not blue links. Probably means: keep the `<Link>` element but style it `color: var(--gray)` not `var(--link)`.
- [ ] **Layout drift — Right rail width**: Figma `194:320` rail is **180px** wide. Code TagPage rail width is in `TagPage.module.css` — verify (likely matches `--right-rail-width` 180px ✓).
- [ ] **Layout drift — entry rows on tag page**: Same row shape as Map/Archive (LXGW Bold 17px title + 14px Inter Medium date + meta line). Date format on tag page is **inconsistent** in the design itself: Figma shows `4/1`, `2/12`, `2026/4/22` (mixed M/D vs YYYY/M/D). Likely a Figma authoring inconsistency the user should resolve.

### §5.E Archive · `194:400` (CN) / `194:481` (EN)

- [ ] **Component structure — Archive doesn't group by year in Figma**: Figma `194:419-480` is a flat list of entries with `<hr>` between them — no year groupings. Code `ArchivePage.tsx:27-37` groups entries with `<h2 className={styles.year}>{year}</h2>` per year. **Information architecture mismatch**: Figma is a chronological flat list; code adds year subheaders. Decision needed.
- [ ] **Component structure — Archive entry meta includes `type` token first**: Figma `194:431` meta is `post · writing · markdown · evergreen` (type first, then tags, then status). Code `ArchiveRow.tsx:16-32` renders date in its own slot and uses `TypePill` as a separate prop'd component **before** the title (in a `.type` span). Different DOM structure.
- [ ] **Layout drift — Archive subtitle copy**: Figma `194:425` `全部 36 条 · 按时序 · 不带筛选` ("All 36 entries · chronological · no filter"). Code `ArchivePage.tsx:14` uses `全部内容，按年份倒序` ("All entries, by year descending"). Different phrasing — Figma is more terse and includes the "no filter" reassurance.
- [ ] **Layout — Archive uses indented-no-rail pattern**: Like 404/About/Now, Figma uses `pl-[140px]` no rail. Confirms the dual layout pattern.

### §5.F Cross-cutting layout pattern observation

- [ ] **Component structure — Two distinct layout patterns**: Figma uses two patterns systematically:
  - **Pattern A — Indented, no rail**: 404, About, Now, Archive (`pl-[140px]` + 720 column)
  - **Pattern B — Centered with rail**: Article, Home, Map, Tag (`flex gap-[60px] justify-center` with article column + ~180px rail)
  
  Code currently has separate `.module.css` per page (each does its own grid). A unifying decision (e.g. an `<IndentedLayout>` component for Pattern A) would reduce drift. Flagging as architectural rather than per-finding.
## §6 Layouts III — Reader Mode (`209:341`)

**Verdict:** Reader mode in Figma is essentially a **different page** (replaces the Toolbar with a centered exit bar; replaces the Home sidebar with a centered hero; replaces the Map filter+rail with a flat link list). Code's reader mode (`global.css:37-90`) is CSS-only — it dims and hides chrome but does NOT restructure the page. Designer marks Reader mode as "DONE" in `166:216` (P1 #9), but the code implementation only covers ~60% of the design. This is the second-biggest "design vs. implementation philosophy" question after Comments.

The shared spec from `166:216` (Design Notes, verbatim): *"Reader mode: chrome removal + typography bump (16→18 body, 21→22 H2, 720→680 column). NO color shift (no sepia). Color stays in same Light/Dark tokens."*

### §6.A Reader common chrome — exit bar (all 3 reader frames)

- [ ] **Missing — Reader exit bar**: All three reader frames (`209:344`, `209:392`, `209:460`) replace the Toolbar with a 3-column header: `← 退出阅读` / `← Exit reader` link (left, link color, 12px Inter) + centered muted Wordmark (19px CN bold + 18px EN semi-bold, **muted color**) + invisible spacer (right, for symmetry). Code keeps the regular Toolbar visible at 0.4 opacity (`global.css:50-55`). Different UX entirely.
- [ ] **Token drift — Reader top-bar layout**: Figma uses `pt-[24px] px-[40px]` for the exit bar, then `pt-[80px]` to the body (so 80px gap from header to title). Code's reader-mode `.row` doesn't change vertical spacing (just compresses to single column).
- [ ] **State missing — Reader-mode link in toolbar**: Code's `ReaderToggle.tsx:8-10` is `document.documentElement.classList.toggle("reader-mode")` — no localStorage. Theme is persisted (`ThemeToggle.tsx:21`) but reader mode resets on every navigation. Inconsistency. Designer notes mark Reader as DONE; the inconsistent persistence is likely a missed refinement.

### §6.B Reader Article · `209:343` (CN) / `209:367` (EN)

- [ ] **Token drift — Reader title size**: Figma `209:350` reader title is **30px LXGW Bold line 1.3** (vs normal article 28px). Code does not bump title size in reader mode — `ArticleLayout.module.css:66 .title { font-size: 1.85rem }` = 29.6px renders in both modes. Close but not 30px.
- [ ] **Token usage — Reader body**: Figma `209:354` is **18px LXGW line 2.0**. Code `global.css:38-40 html.reader-mode { --body-size: 1.125rem; --body-line: 2.0 }` ✓ matches.
- [ ] **Token usage — Reader H2**: Figma `209:356` is **22px LXGW Bold line 1.3**. Code `global.css:46 html.reader-mode .body h2 { font-size: 1.375rem }` = 22px ✓.
- [ ] **Layout drift — Reader vertical rhythm**: Figma reader uses bigger gaps: 40px after meta (`209:353`), 36px before next H2 (`209:355`), 14px between H2 and content (`209:357`), 12px between list items (`209:359`). Code's reader mode doesn't adjust paragraph margins; they're inherited from regular article.
- [ ] **Component structure — Reader hides breadcrumb + tags + comments**: Figma `209:343` reader article has **no breadcrumb, no tag pills, no comments** in the layout (only title + meta + body). Code `global.css:76-82` hides breadcrumb / tags / nav / comments via `display: none`. ✓ behaviorally correct, but these elements are still in the DOM (slow paint, longer SSR HTML).

### §6.C Reader Home · `209:391` (CN) / `209:425` (EN)

- [ ] **Component structure — Reader Home hero is completely different**: Figma `209:391` shows: `Avatar 64×64` → `Wordmark 24px LXGW Bold` → `Tagline 16px muted line 1.65` → `40px gap` → intro paragraphs `18px / 2.0` → `40px` → flat link lists. Code `HomeLayout.tsx` keeps the Home grid (sidebar + main) and applies CSS-only reader hides. **Cannot be achieved with current implementation** — needs a Reader-Home component variant or route.
- [ ] **Token drift — Reader Home wordmark size**: Figma `209:400` Reader-Home wordmark is **24px** (vs Toolbar wordmark **19px**). Different size variant.
- [ ] **Token drift — Reader Home section heading**: Figma `209:408` "最近的文章" is **14px LXGW Bold muted line 1.45** — different from regular Home sections which are 12px Inter Semi Bold tracking-0.72. Reader uses a softer, larger label.
- [ ] **Component structure — Reader Home essay row simplified**: Figma reader essay row is one line: `→ {title} · {date}` 17px LXGW link color line 1.8. Regular Home essay row is two lines (title + summary) with date in left column. Reader collapses both into a one-line link. Code's `RecentEssayRow.tsx` (not yet read) renders the 2-line version always — no reader variant.
- [ ] **Component structure — Reader Home note row simplified**: Figma reader note row is `→ {title} · {status}` 17px LXGW link line 1.8 — drops summary, drops status pill chrome. Plain text status. Code's `NoteRow.tsx` renders status pill with glyph. Reader needs a different render path.

### §6.D Reader Map · `209:459` (CN) / `209:497` (EN)

- [ ] **Component structure — Reader Map drops filter strip + rail**: Figma `209:459` is just a centered 680-wide column with title + subtitle + flat list of `title (17px LXGW Regular link) + date (13px Inter Medium muted)` in a `flex justify-between py-[8px]` row. **No maturity filter**, **no time dropdown**, **no tag rail**, **no entry-meta line** (no tags / no status / no backlink count). Pure index. Code's reader mode hides the rail (`global.css:58 aside[class*="_rail_"] { display: none }`) but keeps the filter strip and the verbose entry rows.
- [ ] **Token drift — Reader Map row format**: Figma uses **17px LXGW Regular** for titles (NOT bold like Map proper's 17px LXGW Bold). Code can't switch entry-row title weight via reader-mode CSS without restructuring `ArchiveRow`.

---

## §2 Components Library (`140:2`)

**Verdict:** Most atoms exist in code with the right names and roles, but several have **size drift** (TagPill, IconButton padding) and **state-variant gaps** (StatusPill needs glyph-less variant, IconButton needs icon-only variant for toolbar context). The Design Notes (`166:216`) document 12 component groups; what follows is a per-group audit.

### §2.01 Brand

- [ ] ✓ **Wordmark — sizes match**: Figma `140:3` spec (CN 19px LXGW Bold + EN 18px Inter SemiBold + " · " separator). Code `Wordmark.module.css:18-25` matches: `.zh { font-size: 1.1875rem; font-weight: 700 }` (19px) and `.en { font-size: 1.125rem; font-weight: 600 }` (18px) ✓.
- [ ] ✓ **Wordmark — separator color**: Figma `<span> · </span>`; code `.sep { color: var(--gray); margin: 0 0.35em }` ✓ visually correct.
- [ ] **Component structure — Wordmark in reader/exit-bar context**: Figma reader `209:346` shows the wordmark in **muted color** (whole thing, including CN range). Code Wordmark always uses `var(--dark)` (`Wordmark.module.css:11`). No reader variant. Already covered in §6.A.
- [ ] **Avatar — match**: Figma `168:159` defines master 56px square 4px corner with real photo. Code `Avatar.tsx:30-35` renders `<img src="/avatar.png" width={size === "hero" ? 240 : 64}>` with size variants `hero` (240) and `compact` (64). Figma has 3 size instances: 240 (Home Sidebar), 56 (Hover demo), 64 (Reader). Code missing the 56px hover-demo size — the hover popover isn't implemented at all.
- [ ] **Missing — Avatar hover popover demo**: Figma `166:216` mentions `Avatar Hover State` demo (group 06). Avatar component doc says: *"Hover → show bio popover (see 'Avatar — Hover State' demo)."* Code `Avatar.tsx` has only the link + image — no hover popover.

### §2.02 Chrome

- [ ] **Toolbar Divider — match**: Figma `140:5` is 1×18px lightgray hairline. Code `Toolbar.module.css:34-40 .vrule { width: 1px; height: 18px; background: var(--lightgray) }` ✓.
- [ ] **State missing — Icon Button has 6 variants in Figma (3 kinds × 2 states)**: Designer notes specify `kind ∈ {search, theme, reader} × state ∈ {default, active}`. Code `IconButton.module.css` has only one default state — no `:hover` border, no active/pressed state styling. The reader-toggle pressed state is hand-rolled in `global.css:84-90` via attribute selector on `aria-label`; theme has no pressed state at all. Should be a single `state="active"` variant on the button class.
- [ ] **Token drift — Icon Button padding (Toolbar context)**: Figma toolbar `140:18` uses `px-[9px] py-[5px]`. Code `IconButton.module.css:5 padding: 5px 8px` (px-[8px] py-[5px]). 1px less horizontal in code.
- [ ] **State missing — Icon Button label visibility**: Figma toolbar context shows **icon-only** for theme/reader (`☾`, `⛶`); sidebar context shows **icon+label** (`☾ 深色`, `⛶ 阅读`). Code `ThemeToggle.tsx:27-30` / `ReaderToggle.tsx:13-16` always render both icon and label. Already covered in §1.B.
- [ ] **Lang Toggle — match**: Figma `140:31` shows active variant with `border var(--color/heading)` + heading color text, inactive with `border var(--color/border)` + muted text. Code `LangToggle` (not deeply audited but used everywhere) — verify it inverts border when locale flips. Likely OK.

### §2.04 Map filters

- [ ] **Maturity Tab — implementation drift**: Figma `142:27` is a plain inline group (`gap-[6px]`, no border, no background, just glyph + label + count). Code `MapPage.tsx:178-195 FilterPill` wraps in `<button>` with possible `pillActive` class — extra wrapper. Visual default state likely matches Figma; need to verify `MapPage.module.css` doesn't add a border in default state.
- [ ] **Drift OK? — "all" pill exists in code, not in design**: Figma maturity strip is `seedling · growing · evergreen · archived` (4 tabs). Code `MapPage.tsx:107-112` adds an "all" pill at the start. Designer notes (`166:216`) explicitly state: *"Toggle behavior (click active to clear), no separate 'all' pill — subtitle '36 entries' carries total count."* → Code violates this design rule. Drop the "all" pill, keep the toggle-to-clear behavior.
- [ ] **Tag Chip — 3 variants**: Figma `142:35` has `default` (no border, used in row meta), `active` (border + heading color, used when filtering), `removable` (border + ×, used in active filter chip row). Code `TagPill` is one component (border + muted label, always linked). Missing the `removable` variant (used on Tag page filter chip — `TagPage.tsx:73-83` hand-rolls it instead of using a TagPill variant). Code's `MapPage` rail also doesn't render any chip variant — uses plain `<Link>`s.
- [ ] **Token drift — Tag Chip size**: Figma `142:32 px-[6px] py-[3px] text-[12px]` (note: this is the chip-on-tag-page; the article tag-pill at `45:20` is `px-[7px] py-px text-[11px]` — two slightly different sizes). Code `TagPill.module.css:5 padding: 0.05rem 0.45rem` (~0.85px / 7.2px) `font-size: 0.75rem` (12px). Closer to the chip size, but article tag-pill should be 11px. Already covered in §1.A.

### §2.05 Map content

- [ ] **Section Heading — variants**: Figma `143:17` has `h1 (28px Semi Bold)` / `h2 (21px Semi Bold)` / `eyebrow (13px Regular muted)`. Designer notes: *"For CN screens, override font to LXGW WenKai TC Bold on instances."* Code uses ad-hoc styles per page (`MapPage.module.css`, `TagPage.module.css`, etc.) rather than a shared Section-Heading component. Opportunity for unification.
- [ ] **Entry Row — match-ish**: Figma `143:18` is `title (LXGW Bold 17px heading, FILL) + date (Inter Medium 14px muted, HUG)` line 1, `meta (Inter Regular 12px muted)` line 2. Code `ArchiveRow.tsx:14-34` renders date + type-pill + title + status-pill + summary in flex flow — different DOM structure (date is left-column not right-aligned). Already covered in §1.D and §5.E.
- [ ] **Right Rail Group — match-ish**: Figma defines a generic rail-group composition (heading + contents). Code each page reimplements it. OK.

### §2.06 Demos (in Figma, no code)

- [ ] **Missing — Year Filter Dropdown Open (with sparkline)**: Figma demo. Already flagged in §1.D (no time/year filter in code).
- [ ] **Missing — Avatar Hover State**: Figma demo. Bio popover on Avatar hover. Not implemented.
- [ ] **Missing — Show All Tags Modal**: Figma demo. Modal that opens when the rail's "Show all 23 →" link is clicked. Code's `MapPage` has the link (in `showAll`) but it goes to `/tags/` not a modal.

### §2.07 Status

- [ ] ✓ **Status Pill — glyphs match**: Figma `seedling/growing/evergreen/archived` use `○ ◐ ● ▣`. Code `StatusPill.tsx:4-9` has the same glyphs ✓.
- [ ] ✓ **Status Pill — sizing matches**: Figma 11px Inter Regular muted with border. Code `StatusPill.module.css:5-13 font-size: 11px; padding: 1px 6px; border: 1px solid var(--lightgray); color: var(--gray)` ✓ all matches Figma.
- [ ] **State missing — Status Pill glyph-less variant**: Figma `47:83` Home Note row shows status as bare text `evergreen` with no glyph (the glyph is on the Map filter only). Code `StatusPill.tsx:13-15` always renders `<span className={styles.glyph}>{GLYPH[status]}</span>` first. Need a `showGlyph={false}` prop or split into two components. Already covered in §1.C.

### §2.08 Series Nav, §2.09 Last-tended, §2.10 Audio Player

- [ ] **Verify — Series Nav**: Figma group exists; code `SeriesNav.tsx` exists. Not deeply audited; defer to per-frame audit.
- [ ] **Verify — Last-tended meta variant**: Figma group exists; code `ArticleLayout.tsx:89-99` renders `{tendedLabel} {tendedDays} {dayUnit}` plus a `· ●` glyph. Already in §1.A as Extra. Confirm against Figma's group spec.
- [ ] **Verify — Audio Player**: Designer notes describe: *"720 expanded bar (Plan B). Collapsed state = meta-line link '▶ 配读 12:34' / '▶ Listen 12:34'. ✕ closes back."* Code `ArticleLayout.tsx:79-87` renders `▶ {listenLabel}` (no duration `12:34`). And the AudioPlayer expanded state spec (Plan B 720-wide bar) needs to be verified against `AudioPlayer.tsx`.
- [ ] **Missing — Audio Player duration in collapsed link**: Figma collapsed link includes `· 12:34` after the listen label. Code only has `▶ {listenLabel}` (e.g. `▶ Listen` or `▶ 配读`). No duration display.

### §2.11 Search

- [ ] **Verify — Cmd+K search modal**: Designer notes: *"Cmd+K modal (input + grouped results + keyboard hint footer)."* Code has `Search.tsx` and `SearchButton.tsx`. The keyboard shortcut binding (Cmd+K) and the keyboard-hint footer in the modal would need a focused audit. Note: `markdown.tsx`'s sample at `187:205-212` shows `按 ⌘ + K 打开搜索` — confirms Cmd+K is the canonical binding.

### §2.12 Comments

- [ ] **Already covered in §1.E**. Custom design vs Giscus iframe — irreconcilable.

### §2.x Cross-cutting Components findings

- [ ] **Component structure — TypePill localization**: Figma Archive entries `194:431` show `post · writing · markdown · evergreen` — type token is the literal English word. Code `TypePill.tsx:5-6` translates to `文章 / Essay`, `笔记 / Note`. Designer's intent appears to be: keep type tokens as terse English (post/note/project) regardless of language, as part of the meta line's data-language. → Code over-translates; should leave type tokens as English.

---

## §3 Design Notes — Read Me First (`166:215` / `166:216`)

The full text is captured verbatim in **Appendix A**. The most actionable items that aren't already split into other sections:

- [ ] **Designer rule — color philosophy**: *"Restrained aesthetic: greyscale + classic-blue (#0645ad) palette only. No sepia, no warm accents — color is reserved for links."* → Code's callout palette violates this (Tailwind blue/green/amber/red/purple). Already in §4.D.
- [ ] **Designer rule — variable-bound fills**: *"All fills variable-bound except 1 raw #fff7d6 (yellow mark/highlight, intentional)."* → `ArticleLayout.module.css` and `global.css` hardcode several spacings (32/80/24/48/16/20/14 px) outside `--space-*` scale, and callouts hardcode 5 hex colors. Drift from the design intent's variable-binding rule.
- [ ] **Designer rule — Index strategy**: *"Index reduced from 5 nav links … to 1 entry '→ Content map · 36 entries' — Map page handles all browse facets."* → Code likely respects this in HomePage; verify HomePage.tsx doesn't render Posts/Notes/Projects/About/Now nav links.
- [ ] **Designer rule — Tag rail behavior**: *"frequency-sorted (not alphabetical), top-N (default 9) + search input + 'Show all 23 →' link + Selected chips region."* → Code MapPage.tsx:50 `TAG_RAIL_LIMIT = 12` (Figma says **9**), no search, no Selected chips. Already in §1.D.
- [ ] **Designer rule — Filter toggle**: *"Filters use TOGGLE: clicking active item clears it. No global 'all' reset visible."* → Code MapPage adds an "all" pill — direct violation. Already in §2.04.
- [ ] **Designer status — Reader Mode marked DONE (P1 #9)**: But §6 audit found significant chrome/structural gaps. → The "DONE" likely refers to the design being finalized, not the implementation. Communicate to designer that code lags design.
- [ ] **Designer note — Mobile responsive DEFERRED**: *"#10 Mobile responsive — DEFERRED (375 viewport adapt of all screens; sidebar → hamburger; rail → below content)."* → Code DOES have @media queries in `ArticleLayout.module.css:9-42` and `HomeLayout.module.css:24-53`. **Code is ahead of design on mobile.** Drift OK?

---

## §0 Executive summary

The site implements ~70% of what the Figma file specifies, with the remaining 30% concentrated in five areas. Listed in priority of visible impact:

1. **Per-language body fonts and line-height** (§1.A) — Figma EN body is **Source Serif 4 / 1.65 lh**; Figma CN body is **LXGW WenKai TC / 1.8 lh**. Code's `tokens.css:22-37` uses one stack `Newsreader, LXGW WenKai Screen, ...` and one line-height `1.8` for both. Every page is affected.
2. **Page-level "card" wrapper missing** (§1.B–D) — Figma wraps Article / Home / Map / 404 / About / Now / Tag / Archive in a `--bg` rectangle on `--canvas`. The token comment in `tokens.css:5-7` literally describes this two-tone design but no component implements it. Site-wide visual gap.
3. **About + Now pages have content but no route** (§5.B, §5.C) — `content/{,en/}pages/{about,now}.md` exist; `routes.tsx` has no entry. Two designed pages that simply don't render.
4. **Reader mode is partial** (§6) — Code dims and hides chrome; design replaces the page (exit bar, Home hero, simplified Map). About 40% of the design intent shipped.
5. **Comments — design vs. Giscus mismatch** (§1.E) — Figma designed a fully custom comments UI; code uses Giscus iframe. Irreconcilable without a backend swap. Needs a product call.

**Honorable mentions** (also high-impact but smaller surface):
6. **Map filter rail interaction model** (§1.D) — Figma has selected-chip row + tag search + filter-in-place; code has passive `<Link>`s that navigate away.
7. **Markdown surfaces with no styling** (§4) — task lists, kbd, mark, definition lists, heading-anchor `#`, image lightbox.
8. **Callout color system mismatch** (§4.D) — code uses 7 Tailwind-colored callouts; design says only 3 site-tone callouts (greyscale + classic-blue rule).

**What's right** (no findings — celebrate these):
- Token color values match Figma exactly (light + dark mode); only the variable names differ semantically (Figma `color/muted` vs code `--gray`).
- Wordmark sizing (19/18 CN/EN) and separator are pixel-perfect.
- Status Pill glyphs and sizing match exactly.
- Date format `YYYY/MM/DD` from `formatDate` matches Figma's article meta.
- Reader-mode body size (17→18) and line-height (1.8→2.0) are correct.
- Comments are functional via Giscus (just visually different from design).
- Two-language route structure (`/foo` ↔ `/en/foo`) is faithfully implemented.

---

## Appendix A — Designer read-me notes (verbatim, `166:216`)

```
DESIGN INTENT — UNAUTHORIZED · 未经授权
(Figma file FIGMA_FILE_ID)
Last updated: 2026-05-05

OVERVIEW
A bilingual (CN/EN) digital garden site, written in Markdown, with maturation-based
content lifecycle (seedling / growing / evergreen / archived). Restrained aesthetic:
greyscale + classic-blue (#0645ad) palette only. No sepia, no warm accents — color
is reserved for links.

FILE STRUCTURE (sections in Figma)
01. Bilingual Layouts — Full Layout Parity (42:2): the 6 main screens
    CN/EN Article (45:2 / 46:2), CN/EN Home (47:3 / 48:2), CN/EN Map (124:2 / 124:165)
02. Components — Library (140:2): 12 grouped sets of atoms + composites + demos
03. Markdown Samples — Article Body Rendering (181:167): CN+EN reference for every markdown element
04. Layouts II — Static & Index Pages (193:167): 404 / About / Now / Tag / Archive (CN+EN) + Empty state demo
05. Layouts III — Reader Mode (209:341): reader variants of Article / Home / Map (CN+EN)
06. Design Notes — Read Me First (this section)

PURPOSE (per page)
HOME    /                  Personal landing: Avatar (240 photo) + bio + recent essays/notes + single Map link. No sidebar graph.
ARTICLE /posts/<slug>      Full markdown rendering, top bar chrome, 720 body column, right rail (TOC + Backlinks).
MAP     /map               Linkding-style archive: maturity filter + time dropdown + flat chronological entries + inline-wrap tag rail.
TAG     /tags/<name>       Map pre-filtered to that tag. Active chip + other-tags rail.
ARCHIVE /all               Pure chronological flat list. No filter chrome.
ABOUT, NOW                 Article-style single column. No tags, no rail.
404                        Minimal: 404 + short message + 3 nav links.
READER  (any of above + ⛶) Strips chrome, centers 680-wide column, body bumps to 18px / 200% lh.

DESIGN SYSTEM
COLOR (Garden collection, 9 vars × 2 modes)
  bg, canvas, border, muted, body, heading, link, link-hover, code-bg
  Light: ranges from #fafafa (bg) to #0f0f0f (heading) + #0645ad (link)
  Dark:  ranges from #141414 (bg) to #fafafa (heading) + #7eb6ff (link)
  Validated in dark mode 2026-05-05. All fills variable-bound except 1 raw #fff7d6 (yellow mark/highlight, intentional).

SPACING (6 vars): space/1=4, /2=8, /3=12, /4=16, /6=24, /8=32

DIMENSION (4 vars): article=720, sidebar=240, rail=180, indent=140

TYPOGRAPHY
  Body:    Newsreader (EN serif) + LXGW WenKai TC (CN calligraphic), 16px / 180% lh.
  Header:  Inter Bold (EN) + LXGW WenKai TC Bold (CN, gardened) / Noto Sans SC Bold (when neutral CN needed).
  Wordmark: LXGW WenKai TC Bold for CN range + Inter Semi Bold for EN range.
  UI labels: Inter Regular (filter strips, meta, count, captions).
  Code: JetBrains Mono 13px (block), 14-15px (inline).
  Emoji: Twemoji (cross-platform consistency, MIT). NOT to be confused with Geometric Shapes (○◐●▣) and Symbols (⌕☾⛶ → ✓ ⤓ ▾) — those are Unicode chars rendered by body fonts.
  CN italic: skipped. LXGW has no italic style. Convention: 着重号 or bold for emphasis.

COMPONENTS (Components — Library section)
  01 Brand:        Wordmark (mixed font), Avatar (real photo embedded, hash 22a8f8d3..., 56 master square 4px corner)
  02 Chrome:       Toolbar Divider, Icon Button (6 variants kind × state), Lang Toggle (2 variants)
  03 Composite:    Top Bar (Wordmark + Controls + Toolbar + Divider + Lang Toggle)
  04 Map filters:  Maturity Tab (4 status variants), Tag Chip (3 state variants: default/active/removable)
  05 Map content:  Section Heading (3 size variants h1/h2/eyebrow), Entry Row, Right Rail Group
  06 Demos:        Year Filter Dropdown Open (sparkline), Avatar Hover State, Show All Tags Modal
  07 Status:       4 variants seedling/growing/evergreen/archived (○◐●▣ + label)
  08 Series Nav:   Prev/Next cells (Article footer)
  09 Last-tended:  Article meta variant for evergreen notes
  10 Audio Player: 720 expanded bar (Plan B). Collapsed state = meta-line link "▶ 配读 12:34" / "▶ Listen 12:34". ✕ closes back.
  11 Search:       Cmd+K modal (input + grouped results + keyboard hint footer)
  12 Comments:     header + list + form (CN+EN demos)

KEY DESIGN DECISIONS
- Home Avatar replaces sidebar MAP graph (the graph was decorative; click affordance to /map preserved as Index entry).
- Index reduced from 5 nav links (Posts/Notes/Projects/About/Now) to 1 entry "→ Content map · 36 entries" — Map page handles all browse facets.
- Tags rail: frequency-sorted (not alphabetical), top-N (default 9) + search input + "Show all 23 →" link + Selected chips region. Modal demo for full overflow.
- Time filter: dropdown trigger (scales to many years; flat strip would explode at 10+ years). Open panel includes 12-bar monthly sparkline per year + count + "any year (36)" reset.
- Maturity filter: inline single-row strip (only 4 stages — small enough to stay flat). Toggle behavior (click active to clear), no separate "all" pill — subtitle "36 entries" carries total count.
- Filters use TOGGLE: clicking active item clears it. No global "all" reset visible. Selected state is bold + heading color.
- Markdown: standard elements + GFM (strikethrough, task list, table) + admonition (NOTE/TIP/WARNING with muted/link/link-hover left borders) + math (inline + block, italic Newsreader for formulas) + heading anchor (#) on hover + kbd (bordered pill) + highlight (mark, raw yellow) + image + caption + hover hint.
- Reader mode: chrome removal + typography bump (16→18 body, 21→22 H2, 720→680 column). NO color shift (no sepia). Color stays in same Light/Dark tokens.
- Status badges use geometric circle progression: empty/half/filled/boxed (○ → ◐ → ● → ▣). Box for archived intentionally breaks the round-growth metaphor — signals "out of active garden".

KNOWN LIMITATIONS / TODOs
- File rename "Document → Unauthorized — Blog Prototype" not supported by Figma Plugin API. Rename manually in Figma UI tab.
- Highlight color #fff7d6 is the only raw (unbound) hex on a content surface. Consider adding color/highlight + dark equivalent (#3a3120 or similar) for full token coverage.
- Status (P1):
  - #9 Reader Mode — DONE
  - #32 Dark Mode validation — DONE
  - #10 Mobile responsive — DEFERRED (375 viewport adapt of all screens; sidebar → hamburger; rail → below content)

EMOJI FONT (decided)
Twemoji (jdecked/twemoji fork, MIT). Stack:
  "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif

AVATAR
Real photo embedded in Figma (image hash 22a8f8d3...). Source file at public/avatar.png (480×480 PNG, 516KB — recommend re-encoding to WebP/JPG q85 ~50KB for production). Master is square cornerRadius 4. Instances: Home Sidebar 240×240 (Hero), Hover demo 56, Reader mode 64.

NODE-ID INDEX (key references for future edits)
  Section "Bilingual Layouts": 42:2
  CN Article: 45:2, body grid 45:11, column 45:12, top bar 144:11, right rail 45:61 (TOC + Backlinks)
  EN Article: 46:2
  CN Home: 47:3, sidebar 47:4
  EN Home: 48:2, sidebar 48:3
  CN Map: 124:2, body grid 124:20, main col 148:91, rail 148:160
  EN Map: 124:165, body grid 124:183, main col 150:145, rail 150:214
  Components Library: 140:2
  Markdown Samples: 181:167 (CN 181:169 / EN 181:237)
  Layouts II: 193:167
  Layouts III (Reader): 209:341
  Avatar Component: 168:159
  Top Bar Component: 141:2
  This document: 166:215 / text 166:216
```

---

---

## Appendix A — Designer read-me notes (verbatim)
*(filled in Batch 4 from `166:215`)*

## Appendix B — Figma node ID → code path lookup
*(expanded incrementally)*

| Figma node | Code path | Audited in |
|---|---|---|
| `45:12` CN Article Column | `src/components/ArticleLayout.{tsx,module.css}` + `src/styles/global.css` | §1.A |
| `46:12` EN Article Column | (same as above) | §1.A |
| `45:19` Tag list | `src/components/TagPill.{tsx,module.css}` + `ArticleLayout.module.css` `.tags` | §1.A |
| `45:46` Code block | `ArticleLayout.module.css .body pre` + `global.css pre` | §1.A |
| `45:2` CN Article Screen | `src/pages/ArticlePage.tsx` + `ArticleLayout.tsx` + `Toolbar.tsx` | §1.B |
| `46:2` EN Article Screen | (same) | §1.B |
| `45:11` Article Body Grid | `ArticleLayout.module.css .row` | §1.B |
| `141:2` Top Bar | `src/components/Toolbar.{tsx,module.css}` | §1.B |
| `45:61` Article Right Rail | `src/components/{TableOfContents,Backlinks}.{tsx,module.css}` | §1.B |
| `47:3` CN Home Screen | `src/pages/HomePage.tsx` + `HomeLayout.{tsx,module.css}` | §1.C |
| `48:2` EN Home Screen | (same) | §1.C |
| `47:4` Home Sidebar | `HomeLayout.module.css .sidebar` + `Wordmark`, `Avatar`, `LangToggle`, `ThemeToggle`, `ReaderToggle`, `SearchButton` | §1.C |
| `119:2` Home Right Rail (Elsewhere/RSS) | **NOT IMPLEMENTED** | §1.C |
| `124:2` CN Map Screen | `src/pages/MapPage.{tsx,module.css}` | §1.D |
| `124:165` EN Map Screen | (same) | §1.D |
| `162:199` Maturity filter strip | `MapPage.tsx FilterPill` | §1.D |
| `164:161` Time/year dropdown | **NOT IMPLEMENTED** | §1.D |
| `148:121` Entry row | `src/components/ArchiveRow.{tsx,module.css}` | §1.D |
| `148:160` Map Right Rail | `MapPage.tsx aside.rail` (partial — missing search + selected-chips) | §1.D |
| `200:342` Comments demo CN | `src/components/Comments.{tsx,module.css}` (Giscus — design mismatch) | §1.E |
| `200:375` Comments demo EN | (same) | §1.E |
| `181:169` CN Markdown Sample | `src/lib/markdown.tsx` + `src/styles/global.css` (markdown rules) + `ArticleLayout.module.css .body` | §4 |
| `181:237` EN Markdown Sample | (same — EN uses Source Serif 4 per §1.A) | §4 |
| `186:167-180` Callouts | `global.css:159-187 .callout*` | §4.D |
| `186:181-188` Image block | `markdown.tsx MdImg` + `global.css:212-228 .md-figure` | §4.E |
| `187:167-181` Tables | `global.css:141-147 table/th/td` + `ArticleLayout.module.css:203-222` | §4.F |
| `187:183-201` Task list | **NOT STYLED** | §4.G |
| `187:203-212` kbd | **NOT STYLED** | §4.H |
| `187:214-220` mark | **NOT STYLED** | §4.I |
| `187:222-227` Math | KaTeX (loaded in `index.html`); design diverges from KaTeX rendering | §4.J |
| `187:229-235` Heading anchors | `markdown.tsx MdH2/MdH3` (id only, no visible `#`) | §4.B |
| `189:167-181` Definition list | **NOT STYLED** | §4.K |
| `181:232-236` Footnotes | `global.css:189-209 .footnotes` | §4.L |
| `193:169` CN 404 | `src/pages/NotFoundPage.tsx` + `ListLayout` | §5.A |
| `193:198` EN 404 | (same) | §5.A |
| `193:227` CN About | **NOT IMPLEMENTED** — content at `content/pages/about.md` | §5.B |
| `193:264` EN About | **NOT IMPLEMENTED** — content at `content/en/pages/about.md` | §5.B |
| `193:296` CN Now | **NOT IMPLEMENTED** — content at `content/pages/now.md` | §5.C |
| `193:339` EN Now | **NOT IMPLEMENTED** — content at `content/en/pages/now.md` | §5.C |
| `194:269` CN Tag | `src/pages/TagPage.{tsx,module.css}` + `ArchiveRow` | §5.D |
| `194:332` EN Tag | (same) | §5.D |
| `194:400` CN Archive | `src/pages/ArchivePage.{tsx,module.css}` + `ArchiveRow` | §5.E |
| `194:481` EN Archive | (same) | §5.E |
| `209:343` CN Article Reader | `global.css:37-90 html.reader-mode` (CSS-only — partial) | §6.B |
| `209:367` EN Article Reader | (same) | §6.B |
| `209:391` CN Home Reader | (no dedicated path — needs reader-Home variant) | §6.C |
| `209:425` EN Home Reader | (same) | §6.C |
| `209:459` CN Map Reader | (no dedicated path — needs reader-Map variant) | §6.D |
| `209:497` EN Map Reader | (same) | §6.D |
| `209:344` Reader exit bar | **NOT IMPLEMENTED** | §6.A |
| `140:2` Components Library | `src/components/*` | §2 |
| `140:3` Wordmark | `src/components/Wordmark.{tsx,module.css}` | §2.01 |
| `140:18` Icon Button | `src/components/IconButton.module.css` + `ThemeToggle.tsx` + `ReaderToggle.tsx` + `SearchButton.tsx` | §2.02 |
| `140:31` Lang Toggle | `src/components/LangToggle.tsx` | §2.02 |
| `141:2` Top Bar | `src/components/Toolbar.{tsx,module.css}` | §2.03 |
| `142:27` Maturity Tab | `MapPage.tsx FilterPill` | §2.04 |
| `142:35` Tag Chip | `src/components/TagPill.{tsx,module.css}` (only 1 of 3 variants) + ad-hoc in `TagPage.tsx` | §2.04 |
| `143:17` Section Heading | (no shared component — inline in each page module) | §2.05 |
| `143:18` Entry Row | `src/components/ArchiveRow.{tsx,module.css}` | §2.05 |
| `168:159` Avatar | `src/components/Avatar.{tsx,module.css}` | §2.01 |
| Status group | `src/components/StatusPill.{tsx,module.css}` | §2.07 |
| Series Nav | `src/components/SeriesNav.tsx` | §2.08 |
| Last-tended meta | `ArticleLayout.tsx:89-99` | §2.09 |
| Audio Player | `src/components/AudioPlayer.tsx` | §2.10 |
| Search modal | `src/components/{Search,SearchButton}.tsx` | §2.11 |
| `166:215` / `166:216` Design Notes | (verbatim in Appendix A) | §3 |
