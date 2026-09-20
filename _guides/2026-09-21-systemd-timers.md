---
title: "Systemd Timers: The Modern Cron Alternative"
layout: default
category: "DevOps"
date: 2026-09-21
tags:
  - systemd
  - linux
  - automation
status: "Published"
challenge: "What two files are required to create a Systemd Timer?"
answer: "A `.service` unit (what to run) and a `.timer` unit (when to run it)."
---

### 💡 WHY (The Concept)
Systemd Timers replace legacy cron jobs. They trigger systemd services with structured logging in `journalctl`, dependency management, and monotonic scheduling (e.g. run 10 mins after boot).

### ⚖️ THE LOGICAL DECISION
Use Systemd Timers when you need clean log tracking and automatic failure retries for server maintenance.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Run nightly backup

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```
