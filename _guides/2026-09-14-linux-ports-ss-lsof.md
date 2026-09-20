---
title: "Port Auditing: ss vs. netstat vs. lsof"
layout: default
category: "DevOps"
date: 2026-09-14
tags:
  - linux
  - networking
  - security
status: "Published"
challenge: "Find which process PID is holding a port open: `sudo lsof -i :3000` or `ss -tulpn | grep 3000`."
answer: "Refer to the concept breakdown and commands below."
---

### 💡 WHY (The Concept)
When an app fails to start with 'Address already in use', `ss` and `lsof` inspect system network sockets to identify the culprit process.

### ⚖️ THE LOGICAL DECISION
Use `ss` (Socket Statistics) over deprecated `netstat` because `ss` queries kernel socket tables directly, making it vastly faster.

### ⚙️ HOW (Implementation Code)
```bash
# List all listening TCP/UDP ports with process IDs:
sudo ss -tulpn

# Check what is listening on port 3000 specifically:
sudo lsof -i :3000
```
