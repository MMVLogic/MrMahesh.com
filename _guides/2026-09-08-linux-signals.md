---
title: "Linux Signals: SIGTERM (15) vs. SIGKILL (9)"
layout: default
category: "DevOps"
date: 2026-09-08
tags:
  - linux
  - processes
  - debugging
status: "Published"
challenge: "Why should you always try `kill -15` (SIGTERM) before using `kill -9` (SIGKILL)?"
answer: "`SIGTERM` gives the application a chance to perform a clean shutdown (close database handles, flush write buffers, delete lock files). `SIGKILL` instantly terminates the process without cleanup, risking database corruption."
---

### 💡 WHY (The Concept)
**Signals** are asynchronous notifications sent by the Linux kernel or user to a process. Common signals include:
* **`SIGTERM (15)`**: Graceful termination request. Application can catch it and clean up.
* **`SIGKILL (9)`**: Immediate, uncatchable process kill.
* **`SIGHUP (1)`**: Hangup signal; often used to reload config files without restarting the app.

### ⚖️ THE LOGICAL DECISION
When stopping hung servers or writing deployment scripts, always send `SIGTERM` first, wait 5 seconds, and escalate to `SIGKILL` only if the process remains stuck.

### ⚙️ HOW (Implementation Code)
```bash
# Gracefully request process with PID 1234 to stop:
kill -15 1234

# Kill all processes matching name 'node':
killall -15 node

# Force kill as a last resort:
kill -9 1234

# Reload Nginx config via SIGHUP:
sudo kill -HUP $(cat /var/run/nginx.pid)
```
