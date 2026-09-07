---
title: "Linux bcache: Accelerating HDDs with NVMe SSD Caching"
layout: default
category: "Homelab"
date: 2027-01-04
tags:
  - storage
  - linux
  - performance
  - homelab
status: "Published"
challenge: "What is the difference between bcache's `writethrough` and `writeback` caching modes?"
answer: "`writethrough` writes data to both the fast SSD cache and the slow backing HDD simultaneously (safe against SSD failure, but slower writes). `writeback` writes data to the SSD immediately and flushes to HDD later (maximum write speed, requires battery/UPS protection)."
---

### 💡 WHY (The Concept)
**bcache** is a Linux kernel block layer cache. It allows fast SSDs or NVMe drives to act as read/write caches for large, slow mechanical hard drives, delivering SSD-like random I/O speeds on multi-terabyte storage arrays.

### ⚖️ THE LOGICAL DECISION
Pair a cheap 256GB NVMe SSD with a 16TB HDD using bcache writeback mode to eliminate Plex media library and torrent random I/O lag without buying expensive all-flash storage.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Format caching device (SSD) and backing device (HDD):
sudo make-bcache -B /dev/sdb -C /dev/nvme0n1p1

# 2. Attach cache set to backing disk:
echo <CACHE_SET_UUID> | sudo tee /sys/block/bcache0/bcache/attach

# 3. Set writeback caching mode:
echo writeback | sudo tee /sys/block/bcache0/bcache/cache_mode
```
