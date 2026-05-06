---
title: "为什么我用 Markdown 写博客"
date: 2026-05-03
updated: 2026-05-03
type: post
lang: zh-CN
featured: true
tags: [meta, markdown, 写作]
summary: "纯文本比任何 CMS 都活得更久。"
audio: "/audio/markdown-blog.mp3"
---

我反复回到同一个事实：用过的每一个 CMS 都死了，十年前写的每一个 Markdown 文件至今仍能被任何文本编辑器打开。所以这个网站建立在三条规则之上。

## 三条规则

1. **纯 Markdown 是真相之源。** 没有数据库，没有后台。
2. **链接是一等公民。** 一篇与另外两篇相连的笔记，比三篇孤立的笔记更有价值。[^1]
3. **发布只是 `git push`。** 如果比这更复杂，我就会停笔。

[^1]: 这是 [[notes/digital-garden|数字花园]]背后的核心想法，也是反向链接比时间顺序更重要的原因。

## 实际操作

```bash
# 写一篇新文章
$ touch content/posts/some-thought.md
$ vim content/posts/some-thought.md
$ git commit -am "essay: some thought"
$ git push
```

整个流程就这些。网站会自己重新构建。

## 我放弃了什么

> 软件是手段，不是爱好。 — _某人，大概_

我放弃了无穷无尽的主题、插件、评论系统、数据看板，以及"这些东西能让写作变得更好"的幻想。它们不能。从来都不能。

中英文混排在 serif 字体下表现并不完美，但够好。代码块、引用、脚注都按照学术排版的习惯来处理。

## 接下来

- 笔记多过文章。笔记便宜，文章昂贵。
- 反向链接显示在每一页底部。
- 图谱只放在首页，别的页面都不放——图谱很诱人，但大多数时候没用。

就这样。剩下的就只是写。
