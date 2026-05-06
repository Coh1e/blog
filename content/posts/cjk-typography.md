---
title: "中英文混排的那些细节"
date: 2026-04-02
updated: 2026-04-02
type: post
lang: zh-CN
tags: [写作, 排版, design]
summary: "一些我学到的、关于中英文一起出现时的小毛病和解法。"
---

中英文混排是中文长文写作里被讨论得最少、踩坑最多的问题之一。我把过去几年踩过的坑整理在这里，作为一份给未来自己的备忘。

## 字间距

英文里的句号、问号、感叹号已经自带了一个空格的视觉间距。中文标点没有，所以很多人手动在中英之间加空格——`Markdown 是一个很好的格式` 比 `Markdown是一个很好的格式` 显得舒服很多。

我现在的规则：

- 中英之间始终加半角空格。
- 中文与数字之间也加半角空格。
- 中英标点不混用。中文段落用全角逗号、句号；英文段落用半角逗号、句号。
- 引号统一用直引号（`"..."`），不用全角。

## 字体回退

CJK 字符如果用纯 Latin 字体（比如 Source Serif 4）会自动 fallback 到系统字体。但 fallback 选哪个字体常常出乎意料：Mac 上是 PingFang SC，Windows 上是微软雅黑，Linux 上不一定有。

解决方案：在字体栈里显式列出 CJK 字体作为 fallback。这个网站用的是：

```css
--bodyFont: "Source Serif 4", "Noto Serif SC", "PingFang SC", serif;
```

浏览器会逐字符尝试匹配。Latin 字符走 Source Serif 4，CJK 字符走 Noto Serif SC。无需 `:lang()` 选择器。

## 行高

中文字符比 Latin 字符在视觉上"密"——同样的 line-height 在中文段落里会显得拥挤。我对 `:lang(zh)` 元素单独提高了 line-height 到 1.8（Latin 段落是 1.65）。差别小但能感觉到。

## 标点挤压

[Gwern](https://gwern.net/) 网站启用了 CSS 的 `text-spacing-trim` 属性来挤压相邻的标点。这是一个尚不普及但很优雅的方案。我没有启用——简单的字距已经够用，对古典排版的执念有害无益。

相关：[[posts/markdown-blog]], [[notes/note-taking]]。
