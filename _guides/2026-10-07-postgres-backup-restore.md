---
title: "PostgreSQL Backup & Restore with pg_dump"
layout: default
category: "DevOps"
date: 2026-10-07
tags:
  - postgres
  - database
  - backup
status: "Published"
challenge: "Which `pg_dump` format option creates a compressed custom archive suitable for parallel restoration?"
answer: "`-F c` (Custom format)."
---

### 💡 WHY (The Concept)
`pg_dump` extracts a PostgreSQL database into a set of SQL statements or a custom binary archive for restoration with `pg_restore`.

### ⚖️ THE LOGICAL DECISION
Always automate nightly `pg_dump` jobs for all containerized homelab database services.

### ⚙️ HOW (Implementation Code)
```bash
# Backup database to custom compressed format:
pg_dump -U postgres -F c -d myapp_db -f /backups/myapp_$(date +%F).dump

# Restore into target database:
pg_restore -U postgres -d myapp_db --clean /backups/myapp_2026-10-07.dump
```
