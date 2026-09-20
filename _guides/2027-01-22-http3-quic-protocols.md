---
title: "HTTP/3 & QUIC: Zero-RTT Handshakes over UDP"
layout: default
category: "DevOps"
date: 2027-01-22
tags:
  - networking
  - http3
  - performance
status: "Published"
challenge: "Why does HTTP/3 run over UDP instead of TCP? TCP connections suffer from **Head-of-Line (HoL) Blocking**\u2014if one packet is lost, all streams stall. QUIC runs over UDP with independent multiplexed streams, so packet loss in one stream never blocks other streams."
answer: "**HTTP/3** replaces TCP and TLS with **QUIC (Quick UDP Internet Connections)**, offering faster connection establishment (0-RTT) and smooth mobile Wi-Fi-to-cellular IP roaming."
---

### 💡 WHY (The Concept)
**HTTP/3** replaces TCP and TLS with **QUIC (Quick UDP Internet Connections)**, offering faster connection establishment (0-RTT) and smooth mobile Wi-Fi-to-cellular IP roaming.

### ⚖️ THE LOGICAL DECISION
Enable HTTP/3 in Nginx or Cloudflare to accelerate mobile asset delivery.

### ⚙️ HOW (Implementation Code)
```nginx
# Enable HTTP/3 (QUIC) in Nginx
listen 443 quic reuseport;
listen 443 ssl;
add_header Alt-Svc 'h3=":443"; ma=86400';
```
