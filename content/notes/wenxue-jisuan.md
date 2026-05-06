---
title: 文学计算
date: 2026-04-25
status: growing
tags: [programming, writing, knowledge]
summary: 用程序分析中文文学的小工具集
---

GitHub: `https://github.com/example/wenxue-jisuan`（占位）

一些**业余玩**性质的中文文学分析脚本：

## 已经实现的

1. **句长分布** —— 一段中文文本，画出句子长度的直方图
2. **字频统计** —— 找出某作家用得最多/最少的字
3. **段落 cohesion** —— 段间连接词检测
4. **TF-IDF 词汇画像** —— 比较两个作家的"标志性"用词

## 想做但没做的

- 韵律分析（古诗词的平仄、押韵）
- 风格转移检测（一个文本是否像某个作家写的）
- 长篇小说的"情绪曲线"

## 用什么

Python + jieba 分词。可视化用 matplotlib（够用，丑）。

代码风格遵循 [[posts/the-cost-of-features|功能的成本]] 那一套：每个 script 不超过 200 行，没有 framework。
