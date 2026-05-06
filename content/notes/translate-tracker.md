---
title: translate-tracker
date: 2026-04-30
status: seedling
tags: [tools, writing, programming]
summary: 跟踪我读的英文段落和我的翻译版本
---

> [!note]
> Seedling 阶段。还没真的写代码。

我读英文文章时偶尔会翻译几段练手。这些翻译散落在各处——Notion、Obsidian、纸上、日记里。

想做一个集中的工具：

```
/source/
  2026-04-30-paul-graham-essay.md     # 原文 + URL
/translation/
  2026-04-30-paul-graham-essay.md     # 我的翻译
/diff/
  2026-04-30-paul-graham-essay.md     # 一年后再翻一次的对照
```

意图：看到自己**翻译能力**的成长，比看到"读了多少"更有信号。

## 难点

1. 选什么"原文"——必须有版权友好的来源
2. 多次翻译之间的 diff 怎么 visualize（git 不太合适，因为这是 prose 不是 code）
3. 怎么避免变成另一个我没填的"项目"

[[notes/learning-by-writing|通过写来学]] 是同精神：练习靠 output，不靠 input。
