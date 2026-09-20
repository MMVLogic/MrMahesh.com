---
title: "Journalctl: Querying Systemd Logs Like a Pro"
layout: default
category: "DevOps"
date: 2026-09-22
tags:
  - systemd
  - logs
  - linux
status: "Published"
challenge: "How do you view logs for a specific service since the current system boot only?"
answer: "`journalctl -u service-name -b`"
---

### 💡 WHY (The Concept)
Systemd's `journald` collects system, kernel, and service output into a structured binary journal.

### ⚖️ THE LOGICAL DECISION
Use `journalctl` with filters to quickly isolate errors across boots, service units, and time windows.

### ⚙️ HOW (Implementation Code)
```bash
# Follow logs for custom CMS service in real time:
journalctl -u mrmahesh-cms -f

# Show only errors (priority 3 or higher):
journalctl -p 3 -xb

# Show logs from the last 1 hour:
journalctl --since "1 hour ago"
```
