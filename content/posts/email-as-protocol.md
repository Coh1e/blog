---
title: Email 是协议
date: 2026-04-21
type: post
tags: [tools, web, infrastructure]
summary: 互联网上最被低估的技术
---

Email 是 1971 年发明的。它比万维网早 18 年，比 Twitter 早 35 年，比 Slack 早 42 年。

它今天仍然是地球上最重要的异步通信系统。

## 它做对了什么

- **联邦化**：你在 Gmail，我在 Fastmail，第三个人自己跑 Postfix。所有这些都能互通。没有"中心"
- **协议而非平台**：SMTP / IMAP 是开放协议。任何客户端都能接
- **抗审查**：单一服务商被关掉不影响别的——只要你设置了好的备份
- **可归档**：纯文本（或 MIME-encoded 文本）。30 年前的邮件今天能打开
- **异步**：发了不必等回复

## 它做错了什么

诚实点：

- **垃圾邮件**：因为开放，所以滥用
- **加密缺省关闭**：S/MIME / PGP 太难用，普通人不可能配置
- **HTML email**：让安全模型崩了。一封看似无害的邮件可以带追踪像素 + 钓鱼链接
- **新建一个邮箱地址比记一个 social handle 难**：DNS、MX 记录、SPF / DKIM / DMARC，普通人放弃了自托管

## 为什么这些没杀死它

因为没有更好的替代。Slack / Teams 是 lock-in。WhatsApp 是 lock-in。任何 SaaS 都是 lock-in。

Email 的丑陋是公开的、几十年累积的、所有问题都被讨论过。其他系统的问题被藏在终端用户协议里。

## 我的策略

- 用一个我控制 DNS 的域名做邮箱地址
- 邮箱服务商可换（Gmail → Fastmail → Migadu，三年内换过三次）
- 重要邮件本地备份成 mbox 文件
- 默认纯文本，HTML 只在确实需要排版时用

> [!tip]
> 如果你的"长期身份"绑在 `xxx@gmail.com` 上，你的身份归 Google 所有。绑在自己的域名上，归你所有。

[[notes/permalinks|永久链接]] 那篇是同一个原则在 URL 上的应用：长期承诺的东西不要给第三方做主。
