---
title: 为什么我把评论搬到 GitHub
date: 2026-04-26
type: post
tags: [meta, tools, writing]
summary: Disqus、原生数据库、Giscus，三选一
---

博客评论系统的三种选项：

1. **第三方托管**（Disqus / commento / 各种 SaaS）。免费版有广告，付费版要钱，所有方案都要把读者的 cookie 交给你不控制的服务。
2. **自托管**（数据库 + 后端）。多一个要维护的系统，多一个要打补丁的攻击面，多一个要备份的东西。
3. **基于 GitHub Discussions / Issues**（Giscus / utterances）。读者用 GitHub 账号登录评论，评论存在 GitHub。

我选 3，理由是没有一个新东西要维护。

## 这意味着什么

- 评论的"数据库"是我已经在维护的 GitHub 仓库
- 通知通过我已经在用的 GitHub email 通知
- 攻击面/反垃圾是 GitHub 的事

> [!caution]
> 代价：评论门槛拉高了。不会用 GitHub 的人不会评论。这对我来说是 feature 不是 bug——我希望评论的人是带着"愿意注册一个开发者账号"那种程度的诚意来。

## 实际效果

切到 Giscus 三个月，评论数掉了 70%。但每一条留下的评论都比以前的有信息量得多。最近三十条里我回了二十多。换以前用 Disqus 的时候，三十条里大概十条是垃圾、十条是"很棒，关注了"那种、剩下十条值得回的，我累了不想回。

> [!tip]
> 想看怎么接 Giscus，[[notes/permalinks|这篇 note]] 末尾有最小步骤。

如果你来了博客想留言，没看到评论框——那是因为我还没填 Giscus 配置（`src/lib/site-config.ts`）。框架接好了，等我有耐心去 GitHub 那边把 Discussions 设起来。
