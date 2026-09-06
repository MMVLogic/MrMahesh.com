---
title: "Proactive Disk Health: ZFS Scrubs & SMART Self-Tests"
layout: default
category: "Homelab"
date: 2026-12-15
tags:
  - zfs
  - storage
  - hardware
status: "Published"
challenge: "What is the difference between a SMART short test and a ZFS scrub? A **SMART test** checks internal drive mechanical health and bad sectors. A **ZFS scrub** reads all stored data blocks, verifies SHA-256 checksums, and repairs silent bit-rot using parity automatically."
answer: "Hard drives degrade silently over time. Routine ZFS scrubbing and SMART self-tests detect failing disks weeks before catastrophic hardware death."
---

### 💡 WHY (The Concept)
Hard drives degrade silently over time. Routine ZFS scrubbing and SMART self-tests detect failing disks weeks before catastrophic hardware death.

### ⚖️ THE LOGICAL DECISION
Schedule bi-weekly ZFS scrubs and daily SMART tests via systemd timers.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Start a ZFS storage pool integrity scrub:
sudo zpool scrub tank

# 2. Check scrub progress and repaired checksum errors:
zpool status tank

# 3. Run a drive SMART health self-test:
sudo smartctl -t short /dev/sda
```
