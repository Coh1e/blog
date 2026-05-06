---
title: "Dispatch from Wang: six months in"
date: 2025-04-02
updated: 2025-04-02
type: post
tags: [networking, wang]
summary: "What I've learned running my own networking infrastructure for six months."
---

[[en/notes/wang|Wang]] has been running for six months now. The full setup is still embarrassingly amateur — three nodes, one dynamic DNS provider, and a tangle of Wireguard configs I check in to a private repo. But it's been useful, in ways I didn't expect.

Three observations from running personal infrastructure:

**1. The maintenance overhead is the feature, not the bug.** Each time something breaks, I have to actually understand what broke. After six months I have a much better mental model of how the underlying tools work than I did from years of just using them. This is exactly the kind of learning that managed services prevent — for good reason at scale, for bad reason at the personal level.

**2. The uptime expectations are different.** When the corporate VPN goes down, I'm furious. When Wang goes down, I shrug, fix it that evening, and go on with my day. Nobody is depending on it. The lower stakes make tinkering possible.

**3. Most of what I "needed" turned out to be optional.** The original Wang spec had ten requirements. After six months, I use four of them. The other six were imagined needs. This is consistent with everything else I've ever built for myself.

Next: a small writeup on how I version the configs and roll back when I break things. That'll go in a follow-up.

Related: [[en/notes/wang]].
