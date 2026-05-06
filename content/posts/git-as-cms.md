---
title: Git 作为 CMS
date: 2026-05-06
type: post
tags: [meta, markdown, tools, workflow]
summary: git push 是我的"发布"按钮
series: Markdown 基础设施
---

[[posts/markdown-as-infrastructure|系列开头]] 说 markdown 是真相之源，[[posts/from-vault-to-site|第二篇]] 讲 pipeline。这篇讲发布的最后一公里。

我没有"发布"按钮。我有 `git push`。

## 这意味着什么

- **草稿就是 commit**。在 main 上写到一半 commit、push、想想、改、再 push。每一次构建都把当前 main 的状态部署上去。
- **回滚是 `git revert`**。删错了？写崩了？revert 那个 commit。
- **历史是版本**。每一篇文章的全部修改痕迹都在 git log 里。我能看到我三年前怎么想的、改了什么、为什么。
- **没有 admin 后台**。没有需要维护的"博客系统"，没有 wp-login.php 这种被全世界扫描的攻击面。

## 不能做什么

- 没有调度发布。如果一篇文章必须周二早上 9 点发，我得周二早上 9 点 `git push`。我不在乎。
- 没有协作编辑。但我一个人写。
- 没有评论的"通知中心"。Giscus 把评论扔到 GitHub Discussions 里，我把 Discussions 的通知配置成 email。够了。

## 真正发生的事

```
$ vim content/posts/some-thought.md
$ git add content/posts/some-thought.md
$ git commit -m 'essay: some thought'
$ git push
```

四秒。Cloudflare 在大约 30 秒后构建完毕、推到 CDN。文章上线。

> [!quote]
> 软件是手段，不是爱好。
> —— 大概是某个我想当成的人

整个发布流程里没有一个 GUI。这就是它能活下去的原因。
