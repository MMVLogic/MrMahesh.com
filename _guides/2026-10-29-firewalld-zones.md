---
title: "Firewalld Zones & Rich Rules in RHEL/CentOS"
layout: default
category: "DevOps"
date: 2026-10-29
tags:
  - linux
  - security
status: "Published"
challenge: "What flag makes changes in Firewalld persistent across server reboots?"
answer: "`--permanent` (e.g. `firewall-cmd --permanent --add-port=443/tcp`)."
---

### 💡 WHY (The Concept)
**Firewalld** uses network **zones** (`public`, `internal`, `trusted`, `dmz`) to apply different security levels to different network interfaces.

### ⚖️ THE LOGICAL DECISION
Assign your home LAN interface to `internal` and your WAN interface to `public` to enforce zone-based security.

### ⚙️ HOW (Implementation Code)
```bash
# Open port 80 and 443 permanently:
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Reload firewall rules to apply:
sudo firewall-cmd --reload
```
