---
title: "Linux Network Routing: ip, route, and link"
layout: default
category: "DevOps"
date: 2026-09-15
tags:
  - linux
  - networking
status: "Published"
challenge: "How do you find your server's default gateway IP using modern iproute2?"
answer: "`ip route show` (or `ip r`)."
---

### 💡 WHY (The Concept)
Modern Linux uses the `iproute2` suite (`ip addr`, `ip route`, `ip link`) replacing legacy `ifconfig`.

### ⚖️ THE LOGICAL DECISION
Use `ip` commands to debug interface status, configure temporary secondary IP aliases, and inspect gateway routes.

### ⚙️ HOW (Implementation Code)
```bash
# Show all network interfaces and assigned IPs:
ip -br a

# Show default routing gateway:
ip route show

# Bring an interface up or down:
sudo ip link set eth0 up
```
