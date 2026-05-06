---
title: 未经授权 · Unauthorized（这个站）
date: 2026-05-05
status: evergreen
tags: [meta, writing, tools]
summary: 这个站本身的设计文档
---

这个站点是它自己的话题。

## 栈

- **Vite + React 18 + TypeScript** —— 没有元框架，纯 React，[[posts/markdown-as-infrastructure|为什么 markdown 活得久]] 那个理由也适用：栈简单 = 五年后还能跑
- **react-router-dom 6 + vite-react-ssg** —— 构建时把每条路由 server-render 成完整 HTML，hydration 后变 SPA。SEO 友好，[[posts/from-vault-to-site|pipeline 那篇]] 讲了这个选择
- **CSS Modules** —— 没有 Tailwind，没有 CSS-in-JS。Token 在 `src/styles/tokens.css`，组件级 scope 在各自的 `*.module.css`
- **Pagefind** —— 客户端搜索，构建时索引整个站，按语言分桶
- **Markdown 扩展**：[[notes/callouts-and-math|这一份 cheatsheet]] 列了支持的所有语法

## 主要决定

- **中英 100% 镜像，URL slug 一致**（[[notes/permalinks|永久链接]] 那篇讲的规则）
- **Wikilinks `[[slug]]` 解析在 mdast 层**，不在 component 层 —— 早期我做错过，[[notes/callouts-and-math|cheatsheet]] 引出来的踩坑
- **没有用 `remark-wiki-link`**，自己写了 25 行的预处理。整个 unified/remark 生态都是 ESM-only，每加一个 plugin 都是一次 ESM/CJS interop 故事
- **Comments 选 Giscus 不选 Disqus**（[[posts/why-no-comments|这篇]] 讲为什么）
- **Mermaid 客户端 lazy-load** —— 600KB 的库不进主 bundle，只有有 mermaid block 的页面下载

## 不做什么

- ❌ NoteIR / SiteIR / 多渲染器架构 —— 单一 `Entry` 类型够了
- ❌ LLM Wiki 自动生成
- ❌ Stacked notes（[[posts/the-cost-of-features|那篇文章]] 讲了为什么）
- ❌ 数学/物理 demos 用的复杂图表
- ❌ 邮件订阅（RSS 够了，[[notes/atom-feeds-still-good|这一篇]] 讲为什么）

## 可重现

仓库公开，`npm install && npm run build` 就跑得起。详见 root 的 `README.md` + `docs/architecture.md`。

> [!note]
> 这个 note 是一个不断更新的 living doc。这次更新：2026-05。
