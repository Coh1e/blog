---
title: 设计系统验证 · Kitchen Sink
date: 2026-05-05
tags: [meta, design, markdown, testing]
summary: 用一篇文章把 design system 里每个 markdown 元素都跑一遍，看渲染是否跟 Figma 稿一致。
status: evergreen
---

这篇文章是测试用的。它存在的唯一意义是把网站 markdown pipeline 支持的**所有**元素塞进一篇文章，让我能用 `npm run build` 之后的真实页面去比对 Figma 稿。

## 段落里的内联元素

一段普通正文，里面塞各种东西：**粗体强调**、~~删除线~~、`inline code`、[外链到 Wikipedia](https://en.wikipedia.org/wiki/Markdown)、[[notes/digital-garden|站内链接（wikilink）]]。

中文段落不用斜体（LXGW 字体没斜体 style，且 CN 排版传统也不用），需要强调用**粗体**或着重号代替。

行内 `code` 应该用 JetBrains Mono、有 `var(--code-bg)` 浅灰背景，跟正文 Newsreader/LXGW 形成对比。

### 三级小标题 (H3)

> "**软件是手段，不是爱好。**"
> — 某人，大概

引用块左边一条 2px 边框，文字用 muted 色调（不是 body 色），跟正文区分开。多行引用时换行不影响左边框延续。

## 列表

无序列表（嵌套一层）：

- 第一项
- 第二项，带嵌套：
  - 嵌套子项 a
  - 嵌套子项 b
- 第三项

有序列表：

1. 步骤一：写下想法
2. 步骤二：把它放着发酵
3. 步骤三：回头修剪

任务列表（GFM 扩展）：

- [x] 写完 design system kitchen sink
- [x] 验证 callouts / math / kbd 渲染
- [ ] 跑 dark mode 视觉巡检
- [ ] 让朋友帮看看排版

## 代码块

行间代码：

```js
// 把 markdown 转成 HTML，加 wikilinks 和 callouts
const html = remark()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkCallouts)
  .use(transformWikilinks)
  .processSync(markdown)

console.log(html.value)
```

```bash
# Pipeline 一行：写完就 push
$ vim content/posts/some-thought.md
$ git commit -am "essay: some thought"
$ git push
```

代码块默认 1px `var(--lightgray)` 边框、padding 14/16，**没有**背景色填充——这跟内联代码的浅灰背景不同。

## 表格

| 元素 | 渲染规则 |
|------|----------|
| 代码块 | 1px 边框 + JetBrains Mono 13px |
| 引用块 | 2px 左边框 + muted 字色 |
| 注脚 | 上标数字 + 文末说明 |
| 行内代码 | 14px JetBrains Mono + code-bg 背景 |

表格需要：表头加粗、每行底部 hairline、居中或左对齐看上下文。

## Callouts (admonition)

> [!NOTE]
> 这是中性 NOTE 提示。用 muted 色左边框，跟普通引用块的语义略不同——这是站内 chrome 而非引文。

> [!TIP]
> TIP 提示用 link 蓝色左边框，语义偏正面。"试试看"那种感觉。

> [!WARNING]
> WARNING 用 link-hover 红色左边框，给读者较强的视觉信号。不要忽略。

## 数学公式

行内公式：当 $x^2 + y^2 = r^2$ 时，所有点位于半径为 $r$ 的圆上。

块级公式：

$$
a^2 + b^2 = c^2
$$

或者写得复杂点：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

KaTeX 渲染，斜体 mathit 字体，居中显示。

## 键盘按键 (kbd)

按 <kbd>⌘</kbd> + <kbd>K</kbd> 打开搜索覆盖层。按 <kbd>esc</kbd> 关闭。

`<kbd>` 应该有 1px 边框、圆角 3、padding 1/6，字体 JetBrains Mono 13px。

## 高亮

==高亮文本==的 mark 标记。背景色固定黄色 `#fff7d6`（dark mode 下也保持黄底，因为 mark 的语义就是黄色，跟 mode 无关）。

## 图片 (with caption)

![一张示例图片](/avatar.png "图：作者头像，作为图片渲染参考")

图片下面应该有 caption（13px italic muted），hover 时 cursor 变 zoom-in，点击打开 lightbox。移动端 long-press 唤出 action sheet。

## 注脚

正文里写到一个观点，需要补充说明[^1]。再写一段，引用第二条注脚[^lookup]。

[^1]: 注脚渲染在文章底部，编号是上标数字。点击注脚回链可以跳回正文。
[^lookup]: 命名注脚也支持，渲染时数字会自动重排。

## 定义列表

数字花园
:   持续修剪生长的笔记网络，区别于一次性发布的博客文章。

成熟度 (status)
:   一条笔记的生长状态：seedling（想法）、growing（在长）、evergreen（成熟）、archived（封存）。

枢纽 (MOC)
:   Map of Content。手工挑选的主题入口页，连向相关多条笔记。

## 水平分隔线

上下两段意思不连贯时用 ---：

---

下面是新的一段，跟上面没直接关系，但同属一篇文章。水平分隔线是 1px `var(--lightgray)` 满宽。

## Wikilinks

链接到站内其它内容用 `[[posts/markdown-blog]]` 这种语法：[[posts/markdown-blog|为什么我用 Markdown 写博客]]、[[notes/digital-garden]]、[[notes/note-taking]]。

构建时反向链接会被自动收集，显示在每篇文章底部 rail 的 Backlinks 区。

## 结尾

如果以上每个元素都看起来跟 Figma 一致，那 design system 这一轮算交付了。如果哪里不对，看一眼 Figma 文件 `FIGMA_FILE_ID` 的 `Markdown Samples` section。
