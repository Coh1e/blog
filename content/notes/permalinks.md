---
title: 永久链接
date: 2026-03-30
type: note
status: evergreen
tags: [meta, tools, web]
summary: URL 是一种长期承诺
---

URL 是博客最严肃的部分——比设计、比字体、比"评论系统"严肃十倍。

> [!important]
> URL 一旦发出去，**就再也不能改了**。任何人转发、收藏、引用都是在赌它会一直在那。改 URL 等于背叛。

## 我的规则

- **slug 永不改**。哪怕标题改了。
- **没有日期 prefix**（比如 `/2024/05/...`）——日期变迁不应该影响 URL。
- **没有 .html 后缀**。`/posts/foo/` 而不是 `/posts/foo.html`。
- **末尾带 `/`**。这样静态主机更容易处理（写 `dist/posts/foo/index.html`）。
- **没有 query string**。`?utm_source=...` 之类的东西从来不进我的 canonical URL。

## 中英镜像

CN 在 `/posts/<slug>/`，EN 在 `/en/posts/<slug>/`。slug 一致。这样 [[posts/markdown-as-infrastructure]] 在 CN 文件里写就是 CN，在 EN 文件里写 `[[en/posts/markdown-as-infrastructure]]` 就是 EN。规则简单到不会忘。

## 接 Giscus 的最小步骤

（[[posts/why-no-comments|为什么换到 Giscus]] 那篇文章末尾提到要补这一段。）

1. 去 https://giscus.app
2. 输入 repo 名（必须是 public，且开了 Discussions）
3. 选 "Discussion Category" — 推荐建一个新的叫 "Comments"
4. Mapping 选 `pathname`（每条 URL 对应一条 discussion）
5. 把页面给的 4 个 ID（`data-repo`, `data-repo-id`, `data-category`, `data-category-id`）填进 `src/lib/site-config.ts`

填了就自动启用。没填则 `<Comments>` 组件返回 null，构建零警告。
