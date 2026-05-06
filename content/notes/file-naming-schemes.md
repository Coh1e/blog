---
title: 文件命名方案
date: 2026-03-18
type: note
status: evergreen
tags: [tools, work, meta]
summary: 命名是设计的第一道
---

我用的几条规则：

1. **小写连字符**（`my-essay.md` 不是 `My Essay.md`）—— 跨平台不出问题，URL 友好
2. **不带日期前缀**——日期变迁不该影响文件名 + URL
3. **slug 永不变**——一旦发布，命名固定。改标题不改 slug
4. **中文文件名只在内部 vault**——发布时映射到英文 slug
5. **descriptive 而不是 categorical**——`why-i-deleted-twitter` 不是 `social-media-thoughts`

[[notes/permalinks|永久链接]] 那一篇展开讲了 URL 设计的承诺感。文件名是 URL 的源——错的文件名会污染下游。

## 反例

- `notes-1.md`、`notes-2.md`：永远不知道哪个是哪个
- `final.md`、`final-final.md`、`final-final-actually.md`：你笑，但我见过
- `untitled-2.md`：编辑器默认值的地狱
