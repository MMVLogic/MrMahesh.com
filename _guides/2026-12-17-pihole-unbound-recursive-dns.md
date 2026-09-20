---
title: "Recursive DNS: Pairing Pi-hole with Unbound"
layout: default
category: "Homelab"
date: 2026-12-17
tags:
  - dns
  - security
  - homelab
status: "Published"
challenge: "How does a recursive DNS resolver like Unbound differ from standard upstream DNS (like Google 8.8.8.8 or Cloudflare 1.1.1.1)? Unbound queries authoritative root nameservers directly (`.` -> `.com` -> `mrmahesh.com`), eliminating third-party DNS logging and upstream tracking completely."
answer: "**Unbound** is a validating, recursive, caching DNS resolver. Pairing it with Pi-hole provides network-wide ad blocking combined with total DNS privacy."
---

### 💡 WHY (The Concept)
**Unbound** is a validating, recursive, caching DNS resolver. Pairing it with Pi-hole provides network-wide ad blocking combined with total DNS privacy.

### ⚖️ THE LOGICAL DECISION
Deploy Unbound as Pi-hole's sole upstream DNS provider on `127.0.0.1#5335`.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/unbound/unbound.conf.d/pi-hole.conf
server:
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    harden-glue: yes
    harden-dnssec-stripped: yes
    hide-identity: yes
```
