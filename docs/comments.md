# Comments (Giscus)

The site renders a comments section under each article via [Giscus](https://giscus.app), which mounts an iframe backed by a GitHub Discussions thread. No backend, no email collection. Disabled by default — fill in the config to turn on.

## How it works

- `src/components/Comments.tsx` injects giscus's `client.js` into a mount `div` after React hydrates. The script loads asynchronously and attaches an iframe.
- The component reads `<html data-theme>` and resolves it to a giscus theme name on first mount, based on `siteConfig.giscus.themeBase` (see "Visual style" below). It also installs a `MutationObserver` on `<html data-theme>` and `postMessage`s the new theme to the iframe when the user toggles theme — no remount, the user's draft survives.
- On SPA article-to-article navigation, the existing iframe is wiped (`innerHTML = ""`) and a fresh script is injected so the new article gets its own discussion thread.
- `lang` follows the entry: CN articles get `data-lang="zh-CN"`, EN gets `data-lang="en"`.

## Visual style

`siteConfig.giscus.themeBase` chooses the visual register:

| Value | Result |
|---|---|
| `"custom"` (default) | Loads `themeUrlLight` / `themeUrlDark` (see below). Falls back to `noborder` if a URL is empty. **This is what the repo ships pre-styled.** |
| `"noborder"` | giscus's built-in flat variants — `noborder_light` / `noborder_dark`. No site-token alignment, but no setup needed. |
| `"default"` | giscus's stock boxed style with rounded card outline. |

### Built-in custom CSS (recommended)

The repo ships `public/giscus-light.css` and `public/giscus-dark.css`, which map giscus's GitHub Primer color/font variables onto the site's tokens:

- canvas: `#fafafa` / `#141414` (matches `--bg`)
- text: `#0f0f0f` / `#fafafa` (matches `--dark`)
- link: `#0645ad` / `#7eb6ff` (matches `--link`)
- borders: `#e5e5e5` / `#2a2a2a`, no card frame
- body font: Source Serif 4 + LXGW WenKai Screen (matches article body)
- mono: JetBrains Mono

After deploy, set the public URLs in `src/lib/site-config.ts`:

```ts
themeBase: "custom",
themeUrlLight: "https://your-domain/giscus-light.css",
themeUrlDark:  "https://your-domain/giscus-dark.css",
```

Two files are needed (not one with `prefers-color-scheme`) because the site's dark mode is `<html data-theme>` driven, not media-query driven. `Comments.tsx` `postMessage`s the new URL to the iframe whenever the user toggles theme — same plumbing the built-in `noborder_light/dark` swap uses.

**Dev mode caveat**: the giscus iframe is on `giscus.app` and can't reach `localhost`. In dev, leave the URLs empty (or set them to the prod URLs you'll deploy later); the runtime falls back to `noborder_light/dark` so you can still iterate.

### Tweaking the CSS

If a giscus version bump renames internal classes, recheck against the upstream theme files:

- https://github.com/giscus/giscus/blob/main/styles/themes/light.css
- https://github.com/giscus/giscus/blob/main/styles/themes/dark.css

Both ship as `main { --color-foo: ... }`. The repo's overrides target the same variables — diff them when something looks off.

## Setup (one time, by the site owner)

1. **Enable Discussions** on the GitHub repository: Settings → General → Features → Discussions.
2. **Install the [giscus app](https://github.com/apps/giscus)** on the same repo. This grants giscus.app permission to read/write Discussions on your behalf.
3. **Create a Discussion category** called `Comments` (or reuse `Announcements`). Recommended: a category with the **Announcement** template so only maintainers can create top-level threads. Each article auto-creates its own thread on first visit.
4. **Generate config values** at https://giscus.app:
   - Repository: `<your-user>/<your-repo>`
   - Page ↔ Discussions Mapping: choose `pathname` (default — keyed by URL path).
   - Discussion Category: the one you created.
   - The page generates `data-repo`, `data-repo-id`, `data-category`, `data-category-id`. Copy them.
5. **Paste into `src/lib/site-config.ts`** under `siteConfig.giscus`:

   ```ts
   giscus: {
     repo: "your-user/your-repo",
     repoId: "R_kgDO...",
     category: "Comments",
     categoryId: "DIC_kwDO...",
     // ... rest unchanged
   },
   ```

6. **Verify**: `npm run build && npm run preview`, open any article — a "Comments" / "评论" section should appear at the bottom and load the giscus iframe within ~1s.

## Per-entry override

To suppress comments on a specific article (e.g. a transient announcement), add to its frontmatter:

```yaml
---
title: ...
comments: false
---
```

Anything other than the literal `false` keeps comments enabled. The default (no field) is on.

## Privacy notes shown to readers

The component renders a short note above the iframe:

- CN: "评论审核后显示。不收邮箱，不存 IP。"
- EN: "Comments are moderated. No email, no IP collection."

Giscus itself relies on GitHub OAuth — readers must sign in with GitHub to comment. No tracking pixels, no third-party analytics.

## Disable everything

Leave any of `repo` / `repoId` / `categoryId` empty in `site-config.ts`. The `isGiscusEnabled()` guard short-circuits and the component renders `null`. No iframe, no script load.
