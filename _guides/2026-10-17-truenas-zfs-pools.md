---
title: "TrueNAS Storage: VDEVs, Pools, and ZVols"
layout: default
category: "Homelab"
date: 2026-10-17
tags:
  - storage
  - truenas
status: "Published"
challenge: "Why can you not easily remove a single drive from a standard RAID-Z1 ZFS VDEV?"
answer: "RAID-Z stripes parity across all disks in the virtual device (VDEV). Disk expansions must be done by adding a new VDEV or replacing all drives one by one."
---

### 💡 WHY (The Concept)
**TrueNAS** is a dedicated storage OS built around OpenZFS. It turns physical hard drives into robust storage pools.

### ⚖️ THE LOGICAL DECISION
Structure storage pools into redundant VDEVs (mirrors or RAID-Z2) to prevent data loss when hard drives inevitably fail.

### ⚙️ HOW (Implementation Code)
```bash
# Check ZFS pool health and disk scrub status:
zpool status
```
