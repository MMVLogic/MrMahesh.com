---
title: "Systemd Service Sandboxing: ProtectSystem & PrivateTmp"
layout: default
category: "Cybersecurity"
date: 2026-11-24
tags:
  - systemd
  - security
  - linux
status: "Published"
challenge: "What happens when you add `ProtectSystem=strict` and `PrivateTmp=true` to a systemd service unit?"
answer: "`ProtectSystem=strict` mounts the entire filesystem as read-only for that process (except `/dev`, `/proc`, and explicitly allowed folders), and `PrivateTmp=true` gives the service an isolated `/tmp` directory invisible to other processes."
---

### 💡 WHY (The Concept)
Even if an application running as a systemd service is compromised by an exploit, **Systemd Sandboxing** locks the process inside an isolated filesystem namespace, preventing attackers from modifying binaries or tampering with system libraries.

### ⚖️ THE LOGICAL DECISION
Add systemd security hardening directives to all web services (Node.js, Python, CMS) to contain exploits automatically.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/systemd/system/mrmahesh-cms.service
[Unit]
Description=MrMahesh Custom CMS

[Service]
ExecStart=/usr/bin/node /app/server.js
User=www-data

# Security Sandboxing
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
NoNewPrivileges=true
ReadWritePaths=/app/data /app/uploads
```
