---
title: "Log Rotation with Logrotate: Preventing Full Disks"
layout: default
category: "DevOps"
date: 2026-10-12
tags:
  - linux
  - monitoring
status: "Published"
challenge: "What does the `compress` directive in a logrotate configuration file do?"
answer: "It compresses rotated historical log files with gzip (`.gz`), saving up to 90% disk space."
---

### 💡 WHY (The Concept)
`logrotate` is a Linux system utility designed to automatically rotate, compress, truncate, and mail system log files.

### ⚖️ THE LOGICAL DECISION
Create custom logrotate configuration blocks in `/etc/logrotate.d/` for all custom apps to prevent log files from growing to 50+ GB.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/logrotate.d/custom-cms
/Users/m/mrmr/mrmahesh/custom-cms/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    copytruncate
}
```
