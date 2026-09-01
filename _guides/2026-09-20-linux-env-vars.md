---
title: "Environment Variables: export, ~/.bashrc & /etc/environment"
layout: default
category: "DevOps"
date: 2026-09-20
tags:
  - linux
  - devops
status: "Published"
challenge: "Where should system-wide environment variables for all users and background services be defined in Linux?"
answer: "`/etc/environment`."
---

### 💡 WHY (The Concept)
Environment variables pass configurations (API keys, ports, database credentials) to applications without modifying source code.

### ⚖️ THE LOGICAL DECISION
Use `export` for the active shell session, `~/.bashrc` (or `~/.zshrc`) for your user login profile, and `/etc/environment` for system-wide services.

### ⚙️ HOW (Implementation Code)
```bash
# Set temporary environment variable in current shell:
export DATABASE_URL="sqlite:///app/data/cms.db"

# Check value of variable:
echo $DATABASE_URL

# Print all active environment variables:
printenv
```
