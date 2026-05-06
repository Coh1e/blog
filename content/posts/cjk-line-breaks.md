---
title: 中英文混排的细节
date: 2026-04-02
type: post
tags: [meta, design, 排版, 写作]
summary: 字间距、字体回退、行高、断行——常见坑
---

> [!abstract]
> 这篇早一些发过短笔记版本。这是展开版。

这个站点的 body 字体栈是 `Newsreader, "LXGW WenKai", serif`。浏览器的 per-glyph fallback 机制会让"在 markdown 里写 `Why I'm building a blog`"和"为什么我开始写博客"在同一段里渲染成两种不同的字体——拉丁字符走 Newsreader、中文字符走文楷。无需任何标签。

## 行高

CJK 字符的视觉高度比拉丁字符的 x-height 大。同一个 `line-height: 1.5` 对拉丁文很舒展，对中文挤得喘不过气。这个站的 token 是：

- `--body-line: 1.7`（拉丁默认）
- `--body-line-cjk: 1.85`（CJK 段落覆盖）

通过 `:lang(zh-CN) p { line-height: var(--body-line-cjk) }` 区分。

## 字间距

CJK 字符之间天然有视觉空隙，不需要 letter-spacing。但段落整体加 `letter-spacing: 0.01em` 能让中英混排的过渡更顺——拉丁字符稍微"撑开"了一点，和 CJK 的方块之间不那么挤。

## 断行

CJK 默认按字断行（每个字符都可以是一个断行点），拉丁按词断行。混排里这两个规则会打架——一段 75% 中文 + 25% 英文的段落，英文单词会被推到下一行的开头，行尾被中文撑得没了空间。

我没有完美方案。一个折衷：让 `word-break: normal`、`overflow-wrap: break-word`，长 URL 在窄屏上能折断，但正常段落不被撕开。

## 标点

中文的句号 `。` 是全角，比拉丁的 `.` 占的视觉空间大。在英文逗号 `,` 后面跟中文的话，`,` 看起来太挤；用全角逗号 `，` 又突兀。我的策略是：完整中文句子用全角，引用英文短语保持半角。

> [!warning]
> 不要追求 perfect。中英混排有 100 个细节会让人不爽，你修 10 个之后剩下的 90 个加起来不会让一个真实读者注意到。把时间花在写上。

字号、行高、字体栈这种宏观的设了就行，断行/标点的微观问题——容忍。
