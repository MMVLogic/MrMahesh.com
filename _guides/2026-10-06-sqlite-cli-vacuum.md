---
title: "SQLite CLI: VACUUM, Integrity Checks & Backups"
layout: default
category: "DevOps"
date: 2026-10-06
tags:
  - sqlite
  - database
status: "Published"
challenge: "Why does deleting rows from an SQLite database not shrink the `.db` file size on disk?"
answer: "SQLite marks deleted pages as free for reuse without returning space to the OS. Run `VACUUM;` to reclaim unused disk space."
---

### 💡 WHY (The Concept)
SQLite powers applications (like our Custom CMS). Regular maintenance keeps file sizes small and prevents database corruption.

### ⚖️ THE LOGICAL DECISION
Use `.backup` in the SQLite CLI to take live online backups without locking active read/write queries.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Run database integrity check:
sqlite3 cms.db "PRAGMA integrity_check;"

# 2. Reclaim free space and defragment database:
sqlite3 cms.db "VACUUM;"

# 3. Take a live consistent backup:
sqlite3 cms.db ".backup '/backup/cms-$(date +%F).db'"
```
