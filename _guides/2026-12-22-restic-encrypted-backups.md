---
title: "Restic: Encrypted, Deduplicated Cloud Backups"
layout: default
category: "Homelab"
date: 2026-12-22
tags:
  - backup
  - storage
  - security
status: "Published"
challenge: "How does Restic achieve high storage efficiency and security when backing up to cloud providers like Backblaze B2 or AWS S3? Restic uses **Content-Defined Chunking (Deduplication)** to store identical data blocks only once, and encrypts all snapshots client-side using AES-256 before uploading."
answer: "**Restic** is a secure, fast backup program that turns directories into versioned snapshots with zero unencrypted metadata leakage."
---

### 💡 WHY (The Concept)
**Restic** is a secure, fast backup program that turns directories into versioned snapshots with zero unencrypted metadata leakage.

### ⚖️ THE LOGICAL DECISION
Automate nightly Restic backups for all database dumps and configuration files.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Initialize encrypted repository:
restic -r b2:my-backup-bucket:homelab init

# 2. Perform automated snapshot backup:
restic -r b2:my-backup-bucket:homelab backup /Users/m/mrmr/mrmahesh

# 3. Restore files from snapshot:
restic -r b2:my-backup-bucket:homelab restore latest --target /tmp/restore
```
