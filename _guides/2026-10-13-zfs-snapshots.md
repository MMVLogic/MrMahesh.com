---
title: "ZFS Filesystems: Datasets & Instant Snapshots"
layout: default
category: "Homelab"
date: 2026-10-13
tags:
  - storage
  - zfs
status: "Published"
challenge: "Why are ZFS snapshots created almost instantaneously regardless of dataset size?"
answer: "ZFS is a **Copy-on-Write (CoW)** filesystem. A snapshot records the current metadata pointers without duplicating disk data blocks."
---

### 💡 WHY (The Concept)
**ZFS** is an enterprise file system and volume manager with built-in RAID, data integrity verification, and instant snapshot capabilities.

### ⚖️ THE LOGICAL DECISION
Take ZFS snapshots before executing system upgrades so you can roll back your entire server state in seconds if a package breaks.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Create a snapshot of 'tank/media':
sudo zfs snapshot tank/media@before-upgrade

# 2. List all snapshots:
sudo zfs list -t snapshot

# 3. Roll back to the exact snapshot state:
sudo zfs rollback tank/media@before-upgrade
```
