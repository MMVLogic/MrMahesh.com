---
title: "UFW (Uncomplicated Firewall) Mastery"
layout: default
category: "DevOps"
date: 2026-10-28
tags:
  - linux
  - security
status: "Published"
challenge: "What is the first command you should ALWAYS run before enabling UFW on a remote cloud server?"
answer: "`sudo ufw allow ssh` (or `sudo ufw allow 22`). Otherwise, enabling UFW will instantly lock you out of SSH!"
---

### 💡 WHY (The Concept)
**UFW** is an interface for `iptables`/`nftables` that manages network packet filtering on Linux.

### ⚖️ THE LOGICAL DECISION
Follow a default-deny ingress policy: block all incoming traffic, and selectively open only required ports (SSH, HTTP, HTTPS).

### ⚙️ HOW (Implementation Code)
```bash
# 1. Set default policies:
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 2. Allow SSH, HTTP, and HTTPS:
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 3. Allow traffic only from a specific local subnet:
sudo ufw allow from 192.168.1.0/24 to any port 3000

# 4. Enable firewall:
sudo ufw enable
```
