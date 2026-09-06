---
title: "DNS Rebinding Attacks & Defenses"
layout: default
category: "Cybersecurity"
date: 2026-12-31
tags:
  - security
  - dns
  - web
status: "Published"
challenge: "How does a DNS Rebinding attack bypass a browser's Same-Origin Policy (SOP) to access internal home devices? An attacker's domain returns a public IP initially, then quickly changes its DNS response TTL to `127.0.0.1` or `192.168.1.1`, tricking the victim's browser into executing requests against local intranet services."
answer: "**DNS Rebinding** turns a victim's web browser into an HTTP proxy to attack unauthenticated private services on your local LAN (like router admin panels or transmission torrent clients)."
---

### 💡 WHY (The Concept)
**DNS Rebinding** turns a victim's web browser into an HTTP proxy to attack unauthenticated private services on your local LAN (like router admin panels or transmission torrent clients).

### ⚖️ THE LOGICAL DECISION
Defend against DNS rebinding by requiring strict HTTP `Host` header validation and enabling DNS Rebinding protection in your router/Pi-hole.

### ⚙️ HOW (Implementation Code)
```text
# In Pi-hole / dnsmasq:
stop-dns-rebind
```
