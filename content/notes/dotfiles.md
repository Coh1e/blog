---
title: dotfiles
date: 2026-04-12
status: evergreen
tags: [tools, programming]
summary: 我整套 shell + editor 配置的源
---

GitHub: `https://github.com/example/dotfiles`（占位）

> [!note]
> 占位项目页。真实仓库还没建。

## 包含

- `zsh` 配置 + 一些 functions
- `nvim` 配置（lua-based，约 200 行）
- `tmux` 配置
- `git` global config + alias
- `kitty` 终端配置
- 一个 `bootstrap.sh` 在新机器上一键应用

## 设计原则

1. **小而完整**：不超过 1000 行总配置
2. **不依赖外部 plugin manager**：vim plugins 用 `nvim` 自带的 packpath
3. **跨 OS**：mac / linux 通用，没有 platform-specific hacks
4. **每年清一次**：unused config 删掉

[[posts/keyboard-shortcuts-as-thinking|快捷键作为思考]] 那篇是这个项目的 motivation。
