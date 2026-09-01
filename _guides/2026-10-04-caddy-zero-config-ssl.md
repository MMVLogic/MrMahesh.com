---
title: "Caddy Web Server: Zero-Config Automatic HTTPS"
layout: default
category: "Homelab"
date: 2026-10-04
tags:
  - caddy
  - ssl
  - self-hosting
status: "Published"
challenge: "Why is Caddy popular in homelabs compared to Nginx?"
answer: "Caddy automatically provisions, verifies, and renews Let's Encrypt SSL certificates with zero manual certbot configuration."
---

### 💡 WHY (The Concept)
Caddy is a modern, memory-safe web server written in Go. A 3-line `Caddyfile` provides reverse proxying and automated TLS certificates.

### ⚖️ THE LOGICAL DECISION
Use Caddy when you want instant HTTPS without configuring external cron renewal scripts.

### ⚙️ HOW (Implementation Code)
```caddy
# /etc/caddy/Caddyfile
cms.mrmahesh.com {
    reverse_proxy 127.0.0.1:3000
}
```
