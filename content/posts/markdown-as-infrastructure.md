---
title: Markdown 作为基础设施
date: 2026-05-04
type: post
tags: [meta, markdown, writing, tools]
summary: 我用过的每一个写作工具都死了，markdown 文件还在
series: Markdown 基础设施
---

我十二岁开始写日记。那时候用的是叫 LiveJournal 的东西。后来转去新浪博客，再后来 wordpress.com，再后来 medium，再后来 notion，再后来 obsidian。每一次迁移都丢东西——格式、链接、附件，至少是我对这些东西放在哪儿的记忆。

只有那些我顺手用 markdown 写的纯文本文件——通常作为"草稿"——一篇没丢。十年前在 windows xp 上写的、五年前在 mac 上写的、上周在 linux 上写的，今天在任何一个文本编辑器里都能打开。

## 它为什么活得久

不是因为 markdown 设计得多优雅。它有一堆毛病：表格丑、嵌套列表行为不一致、图片语法和链接语法对称性奇怪。

它活下来是因为它几乎不是一个"格式"——是用 ascii 字符模拟排版意图的一个约定。用 `# title` 表示标题，因为它看起来就像标题。用 `-` 列表，因为 typewriter 时代就这么做。这种"几乎不是格式"的特性意味着：你失去全世界的 markdown 渲染器，文件本身仍然是可读的英文/中文段落。

## 这意味着什么

意味着我可以把"写"和"发布"完全分开。写的时候只关心 markdown 文件——任何编辑器、任何同步工具、任何备份方案都行。发布是一个独立的、可替换的步骤。

> [!note]
> 这是一个三段系列的第一篇。第二篇 [[posts/from-vault-to-site|从 vault 到站点]] 讲具体的 pipeline。第三篇 [[posts/git-as-cms|git 作为 CMS]] 讲发布。

我不关心十年后用什么生成 HTML——我关心十年后这些 markdown 文件还在。
