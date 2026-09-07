---
title: "Linux Capabilities: Rootless Port Binding with CAP_NET_BIND_SERVICE"
layout: default
category: "Cybersecurity"
date: 2027-02-20
tags:
  - linux
  - security
status: "Published"
challenge: "How do you allow a non-root Node.js web server process to bind to privileged low ports (port 80 / 443) without running the app as `root`? Assign the `CAP_NET_BIND_SERVICE` capability to the binary using `setcap`."
answer: "**Linux Capabilities** divide root privileges into distinct distinct units (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN`, `CAP_NET_BIND_SERVICE`), eliminating the need for `sudo`."
---

### 💡 WHY (The Concept)
**Linux Capabilities** divide root privileges into distinct distinct units (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN`, `CAP_NET_BIND_SERVICE`), eliminating the need for `sudo`.

### ⚖️ THE LOGICAL DECISION
Apply `CAP_NET_BIND_SERVICE` to web server binaries to run them as unprivileged users.

### ⚙️ HOW (Implementation Code)
```bash
# Grant capability to bind ports <1024 without root:
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/node
```
