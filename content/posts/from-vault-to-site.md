---
title: 从 vault 到站点
date: 2026-05-05
type: post
tags: [meta, markdown, tools, workflow]
summary: 一篇 obsidian 笔记从写完到上线之间发生了什么
series: Markdown 基础设施
---

承接 [[posts/markdown-as-infrastructure|上一篇]]：markdown 文件是真相之源，那它怎么变成网站？

我的 pipeline 长这样：

```mermaid
graph LR
  Obsidian[本地 Obsidian vault] -->|手动整理| Repo[git 仓库的 content/]
  Repo -->|git push| GH[GitHub remote]
  GH -->|webhook| CF[Cloudflare Pages 触发构建]
  CF -->|npm run build| Static[dist/ 静态 HTML]
  Static --> CDN[CDN 边缘缓存]
```

每一段都是可替换的：

- Obsidian 可以换成 vim、vscode、随便什么编辑文本的东西
- GitHub 可以换成 GitLab、自托管 gitea
- Cloudflare 可以换成 Vercel、Netlify、甚至自己的 nginx
- 整条 pipeline 可以崩——markdown 文件还在 vault 里

## 为什么不全自动同步

最早我想把 Obsidian vault 直接 mount 到 git 仓库，让所有变更都触发构建。试了一周放弃了：vault 里有一堆"草稿"、"梦境片段"、"情绪日记"，我不想这些被网站的 search 收录。

现在的"手动整理"步骤其实就是把 `vault/published/` 里的东西 cp 到 `repo/content/`。十秒的 friction，换一个我控制得了的发布边界。

## 频率

平均每周 1-2 篇，有时连发三天，有时空两个月。这个 pipeline 对节奏没有意见。
