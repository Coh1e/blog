---
title: 为什么不只用 RSS
date: 2026-05-04
type: post
tags: [tools, reading, web]
summary: 反 [[notes/atom-feeds-still-good]] 的辩论。RSS 的代价
---

我之前那篇 [[notes/atom-feeds-still-good|RSS 还是好]] 是给 RSS 唱赞歌的。这篇相反——讲为什么我**没有**只用 RSS。

公平点。

## RSS 的实际问题

### 1. 发现新东西很难

算法 timeline 的好处之一：偶然发现你不知道你想看的东西。RSS 是订阅式——你必须先知道某个 source 的存在，才能 subscribe。

我每年通过 Twitter 发现的好作者大概是通过 RSS 的 5 倍。我承认。

### 2. 没有社交回音

读完一篇好文章想转发给朋友？RSS 没有这个动作。你得复制 URL、打开聊天工具、粘贴、加备注。

四步。Twitter 是一步。

### 3. 长尾问题

我订了 80 个 RSS source。其中 5 个产出 80% 的好内容。剩下 75 个产出 20%。

我无法 batch unsubscribe 那 75 个，因为偶尔它们会贡献一篇神作。

### 4. 死链接

很多 blog 死了或迁移了，但 feed URL 还在那。我的 reader 里有 12 个 feed 永远不更新——是心理负担。

## 我现在的混合策略

| 用法 | 工具 |
|---|---|
| 长期订阅、稳定来源 | RSS |
| 发现新作者 | 偶尔翻 Hacker News + 朋友推荐 |
| 实时新闻 | 不看（或专门一周一次开个新闻 app） |
| 朋友的随手分享 | 一个小群 |
| 偶尔好奇某个领域 | Google + 几篇文章一次性看完 |

RSS 占 60% 的阅读时间。不是 100%。

## 关键洞见

**RSS 是把"决定看什么"的成本前置**。算法 timeline 是把它后置（你不决定，算法替你决定）。

前置成本高但可控。后置成本低但失控。

如果你已经知道你想读什么，RSS 完胜。如果你还在探索阶段，需要"撞见"内容，RSS 不够。

## 这个站

提供 [/feed.xml](/feed.xml)（中文）和 [/en/feed.xml](/en/feed.xml)（英文），按 [[notes/permalinks|永久链接]] 的规则做的。如果你的 reader 还活着，欢迎订。
