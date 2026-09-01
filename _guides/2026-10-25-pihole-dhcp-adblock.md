---
title: "Pi-hole: Network-Wide Ad Blocking & Local DNS"
layout: default
category: "Homelab"
date: 2026-10-25
tags:
  - dns
  - ad-block
status: "Published"
challenge: "How does Pi-hole block ads for all smart TVs and mobile phones on a home network without installing browser extensions?"
answer: "It acts as your local DNS server and responds with `0.0.0.0` (sinkhole) to ad/tracker domain queries."
---

### 💡 WHY (The Concept)
**Pi-hole** intercepts DNS queries and blocks tracking domains network-wide. It also serves as a custom local DNS resolver.

### ⚖️ THE LOGICAL DECISION
Map all internal homelab subdomains (`qbittorrent.mrmahesh.com`, `cms.mrmahesh.com`) directly in Pi-hole Local DNS records.

### ⚙️ HOW (Implementation Code)
```bash
# Query Pi-hole stats via CLI:
pihole -c

# Add custom domain mapping:
pihole -a addcustomdns 192.168.20.182 cms.mrmahesh.com
```
