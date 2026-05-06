---
title: 关于 Tab 键
date: 2026-04-12
type: post
tags: [tools, programming, design]
summary: 一个键能引发的圣战
---

Tab 键不是为缩进设计的。它是 1900 年代打字机做表格用的——按一下，光标跳到预设的列位。后来程序员把它重新发明了一次，给了它"层级缩进"的语义。

然后人类就开始在 tab vs spaces 上吵了半个世纪。

## 实际的差异

```python
# Tabs
def foo():
\tif True:
\t\treturn "tabs"

# Spaces (4)
def foo():
    if True:
        return "spaces"
```

视觉上看起来一样。技术上：tabs 是 1 个字符，spaces 是 4 个字符。每个程序员的编辑器里 tab 显示成几个字符是个人配置——所以你的 4-tab 在我这里可能是 8。

## 为什么不能"两边都对"

实践中的麻烦：

| 场景 | tabs | spaces |
|---|---|---|
| 团队对齐 | 不一致（每人配置不同） | 一致 |
| 字节大小 | 小 | 大 |
| 屏幕阅读器适配 | 好（用户控制宽度） | 差 |
| 复制粘贴到 web | 经常崩 | 稳 |

没有标准答案。Python 选了 spaces，Go 选了 tabs，JavaScript 各家自己定。

## 我的妥协

- Python / shell / Go：用工具默认（black, gofmt）
- JavaScript / TypeScript：prettier 默认 = 2 spaces
- Markdown：4 spaces，给嵌套列表留余地
- Makefile：必须是 tab，不接受讨论

> [!quote]
> A foolish consistency is the hobgoblin of little minds.
> —— Emerson

我以前在 tab vs spaces 上花过太多脑力。现在的态度：用工具默认值，不要去改别人的，不要让它阻挡你写代码。

[[posts/the-cost-of-features|功能的成本]] 那篇精神：默认接受工具的选择，把脑力留给真正的问题。
