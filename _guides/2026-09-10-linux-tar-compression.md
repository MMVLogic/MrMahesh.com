---
title: "Linux Archiving: tar, gzip, and zip"
layout: default
category: "DevOps"
date: 2026-09-10
tags:
  - linux
  - storage
  - backup
status: "Published"
challenge: "What do the flags `-c`, `-z`, `-v`, `-f` stand for in the command `tar -czvf backup.tar.gz /app`?"
answer: "`c` = Create archive, `z` = Compress with gzip, `v` = Verbose output, `f` = File name to write to."
---

### 💡 WHY (The Concept)
In Linux, **archiving** (combining 1,000 files into 1 tape archive file `.tar`) is distinct from **compression** (shrinking data size with gzip/bzip2/xz). `tar` combines both steps seamlessly.

### ⚖️ THE LOGICAL DECISION
Use `tar.gz` for standard backups and server transfers. It preserves Linux file ownership, permissions, and directory trees intact.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Compress a directory into a .tar.gz archive:
tar -czvf homelab-backup-$(date +%F).tar.gz /Users/m/mrmr/mrmahesh

# 2. Extract an archive into the current directory:
tar -xzvf homelab-backup-2026-09-10.tar.gz

# 3. List the contents of an archive without extracting it:
tar -ztvf homelab-backup-2026-09-10.tar.gz
```
