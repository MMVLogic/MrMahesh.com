---
title: "DNS Troubleshooting with dig, host, and nslookup"
layout: default
category: "DevOps"
date: 2026-09-29
tags:
  - dns
  - networking
status: "Published"
challenge: "How do you query a specific public DNS server (e.g. Cloudflare 1.1.1.1) using dig?"
answer: "`dig @1.1.1.1 cms.mrmahesh.com`"
---

### 💡 WHY (The Concept)
When DNS records don't update, `dig` queries nameservers directly, inspecting TTL, response codes, and authoritative zones.

### ⚖️ THE LOGICAL DECISION
Use `dig +trace` to follow the entire recursive lookup from root nameservers down to your local homelab zone.

### ⚙️ HOW (Implementation Code)
```bash
# Lookup A record with clean concise output:
dig +short cms.mrmahesh.com

# Trace full DNS resolution path:
dig +trace mrmahesh.com

# Query TXT records (DKIM/SPF):
dig TXT mrmahesh.com
```
