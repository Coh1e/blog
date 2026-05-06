---
title: CSS Modules 在 2026
date: 2026-05-03
type: note
status: growing
tags: [tools, web, programming]
summary: 没死，还很好用
---

2017 年大家说 CSS-in-JS 会取代 CSS Modules。
2020 年大家说 Tailwind 会取代两者。
2024 年大家说 atomic CSS 是未来。

2026 年我做这个站还在用 CSS Modules，活得很好。

## 它的优势

1. **scope 自动**：`styles.foo` 编译成 `_foo_a3b8`，不会和别的组件冲突
2. **零运行时**：纯静态 CSS，浏览器只解析一次
3. **TypeScript 友好**：编辑器能补全 class name
4. **不强加意见**：CSS 还是 CSS，不需要学新 syntax
5. **打包友好**：tree-shake 没用到的 styles

## 它的缺点

1. 不能动态生成（不像 CSS-in-JS 那样基于 props 改 className）—— 用 `cx()` 或 inline style 折衷
2. 全局 styles 要单独处理（global.css）
3. 跨组件复用 token 要靠 CSS variables（这个站用的方案）

## 为什么没用 Tailwind

Tailwind 把 CSS 的复杂度从"找哪个 class 定义在哪"变成"找这个 class name 是哪个工具类组合"。**复杂度没减，只是搬了个地方**。

对小项目（个人站）来说，CSS Modules + 一组手写 token 比 Tailwind 简单。对大团队的设计系统，可能 Tailwind 赢。

[[notes/xie|这个站]] 选了 CSS Modules。1 年后它仍是对的决定。
