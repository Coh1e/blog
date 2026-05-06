---
title: Sidenote 还是 footnote
date: 2026-04-10
type: note
status: growing
tags: [design, writing, 排版]
summary: 两个不同的工具，不要互相替代
---

读者点击行内的脚注 `[1]`，跳到文章底部，看完，跳回来。这种来回 = friction。

旁注（sidenote）是把脚注内容放到正文旁边的 margin 里<aside class="sidenote">就像这一条。窄屏会折叠为内联斜体。</aside>视线不需要离开正文流。

## 该用哪个

- **脚注**：补充信息相对独立，引用了来源、加了限定条件、给个数据。读者*可以*跳过去看，但不看也不影响理解主线。
- **旁注**：你想让读者在读到这一句的瞬间看到的旁白。Tufte 那种"图旁的注释"或者"作者的喃喃自语"。

最大的错误是把旁注当 footnote 用——把一长段细节塞到 margin，结果窄屏读者看到一个内联斜体的怪物把段落撑断。

## 写法

`[^1]` + `[^1]: ...`。markdown 标准（GFM）就支持，[[notes/callouts-and-math|那篇 cheatsheet]] 里写了。

旁注没有标准 markdown 语法，我用 raw HTML 直写：`<aside class="sidenote">text</aside>`。`rehype-raw` 把这段 HTML 透传到渲染。

> [!tip]
> 一个段落里超过两个旁注就太多了。Tufte 自己也很克制——一页平均也就 1-2 条。
