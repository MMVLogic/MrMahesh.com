---
title: "Cloudflare Edge Caching & Cache-Everything Rules"
layout: default
category: "Homelab"
date: 2027-02-27
tags:
  - cloudflare
  - performance
  - web
status: "Published"
challenge: "Why does enabling 'Cache Everything' on Cloudflare without excluding admin routes break CMS dashboards? 'Cache Everything' caches HTML responses on Cloudflare's global edge servers. If admin/login HTML pages are cached, public visitors receive cached admin session pages."
answer: "**Cloudflare Edge Caching** serves static pages from 300+ global edge locations in under 15ms."
---

### 💡 WHY (The Concept)
**Cloudflare Edge Caching** serves static pages from 300+ global edge locations in under 15ms.

### ⚖️ THE LOGICAL DECISION
Set Edge Cache TTL to 7 days for public assets, and create an explicit `Bypass Cache` rule for `/admin/*` and `/api/*`.

### ⚙️ HOW (Implementation Code)
```text
# Cloudflare Page Rules Order:
# Rule 1 (Bypass): cms.mrmahesh.com/admin/* -> Cache Level: Bypass
# Rule 2 (Bypass): cms.mrmahesh.com/api/*   -> Cache Level: Bypass
# Rule 3 (Edge Cache): mrmahesh.com/*        -> Cache Level: Cache Everything, Edge TTL: 7 days
```
