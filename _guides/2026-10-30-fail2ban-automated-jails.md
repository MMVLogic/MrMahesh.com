---
title: "Fail2ban: Automating IP Bans for Hackers"
layout: default
category: "Cybersecurity"
date: 2026-10-30
tags:
  - linux
  - security
status: "Published"
challenge: "How does Fail2ban detect and ban malicious IP addresses?"
answer: "It monitors log files (like `/var/log/auth.log`) using regex patterns. When an IP exceeds max failed attempts within a time window, Fail2ban adds an `iptables` drop rule."
---

### 💡 WHY (The Concept)
**Fail2ban** protects servers against brute-force password cracking attacks automatically.

### ⚖️ THE LOGICAL DECISION
Configure jails for SSH and Nginx to ban offending IPs for 24 hours after 5 failed password attempts.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 5
findtime = 600
bantime = 86400 # 24 hour ban
```
