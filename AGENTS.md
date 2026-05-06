# Working in 未经授权 · Unauthorized (for AI coding agents)

This file is for any AI agent in this repo (Codex, Cursor, Gemini-CLI, Aider, etc.).

**The canonical guide is [`CLAUDE.md`](./CLAUDE.md).** Read it first — it covers the stack, commands, conventions, frontmatter spec, and the things you should not touch without thinking. This file used to duplicate that content; the duplicate kept drifting, so it has been collapsed into a pointer.

## Tool-specific notes

- **Codex / Cursor / generic agents**: same conventions as `CLAUDE.md`. No tool-specific exceptions.
- **Aider**: the repo is small; whole-file edits are fine. Use `--no-auto-commits` until `npm run build` passes.
- **Gemini-CLI**: respects `AGENTS.md` natively; follow the link above.

## If you only read this file

The things most likely to bite an agent that skips `CLAUDE.md`:

1. **Don't add `node:fs` calls in `src/`.** The single content reader is `src/lib/content.ts` and it uses `import.meta.glob`. Adding `fs.readFile` elsewhere breaks the client bundle.
2. **`npm run build` is three steps**: `vite-react-ssg build` → `node scripts/generate-seo-files.mjs` → `pagefind --site dist`. Run the full build before declaring a change shipped — the dev server skips the last two steps.
3. **`post` is the internal type name; UI says "Essay / 文章".** Don't expose "post" in user-visible copy. The URL prefix `/posts/<slug>` is kept for external-link stability.
4. **Map (`/map`) is the canonical browse surface.** Browse goes to Map / Tag / Archive (`/all`); there are no type-specific list pages (`/posts`, `/notes`, `/projects` were all removed). There is no `project` type either — it was collapsed into notes with maturity status.
