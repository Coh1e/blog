---
title: 衬线还是无衬线
date: 2026-05-03
type: post
tags: [design, 排版, 写作]
summary: 简短答案：长文用 serif
---

你只需要决定一次。

## 经验法则

- **长文 (>500 词)**：用衬线 (serif)
- **短 UI 文本、按钮、表单**：用无衬线 (sans-serif)
- **代码**：等宽 (monospace)，绝对不要 serif

这就是 95% 的情况下的答案。

## 为什么长文用 serif

衬线提供了字符顶部的"水平线索"，让眼睛沿着行扫描时容易跟踪。在长段落里，这种小帮助累积成显著的疲劳差异。

研究[^research]显示，serif 字体在打印（>2400 dpi）的连续阅读中略快。屏幕（96-220 dpi）的差异更小，但仍然存在。

## 为什么 UI 用 sans

UI 文本通常很短（按钮三个字、菜单项一个词、错误提示一句话）。Sans 在小尺寸下保留更多 readable 像素，serif 的细节会被消除得不规则。

## 中文怎么办

中文字符没有"衬线 vs 无衬线"的对应。最接近的是：

- **宋体** ≈ serif（横细竖粗，有撇捺尖端）
- **黑体** ≈ sans-serif（笔画统一粗细）
- **楷书 / 行书** ≈ humanist serif（带书写感）

| 用途 | 中文选 | 拉丁文配 |
|---|---|---|
| 长文 | 宋体 / 楷体 | EB Garamond / Newsreader |
| UI | 黑体 / 思源黑 | Inter / Helvetica |
| 标题 | 黑体粗 | Sans bold |

这个站的 body 配的是 **LXGW WenKai (霞鹭文楷, 楷体风) + Newsreader (拉丁衬线)**。两者在 humanist 风格上合得上。详见 [[posts/cjk-line-breaks|中英文混排]] 那篇。

## 不要做的事

- 用 sans 设长文（除非你确定读者要在 mobile 上短时阅读）
- 用 serif 做按钮（细笔画在小尺寸下崩）
- 混用三种以上字体家族（视觉混乱）
- 用 Comic Sans（除非是给五岁儿童的内容）

> [!tip]
> 选不出来？默认 serif body + sans heading + monospace code，三家。一辈子用不腻。

[^research]: 不是想找学术争论。Karen Schriver, *Dynamics in Document Design* (1997) 是最 cited 的来源；Hartley & Burnhill 1971 给了原始数据。具体差异在 5%-15% 区间，依赖字体、阅读环境、个体差异。
