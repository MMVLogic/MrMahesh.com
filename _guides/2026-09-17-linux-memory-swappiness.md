---
title: "Linux RAM & Swappiness Tuning"
layout: default
category: "DevOps"
date: 2026-09-17
tags:
  - linux
  - performance
status: "Published"
challenge: "What does a `vm.swappiness` value of `10` mean compared to default `60`?"
answer: "It instructs the Linux kernel to prioritize keeping apps in physical RAM and avoid swapping to disk until RAM is almost full."
---

### 💡 WHY (The Concept)
Linux uses RAM aggressively for disk caching. The `free -m` command shows total, used, free, and cached memory.

### ⚖️ THE LOGICAL DECISION
For databases and SSD-backed home servers, lower `vm.swappiness` from 60 to 10 to avoid unnecessary disk I/O latency.

### ⚙️ HOW (Implementation Code)
```bash
# Check memory and swap usage in MB:
free -h

# Check current swappiness value:
cat /proc/sys/vm/swappiness

# Set swappiness to 10 persistently:
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
