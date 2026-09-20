---
title: "Linux cgroups v2: CPU & Memory Throttling"
layout: default
category: "DevOps"
date: 2026-11-15
tags:
  - linux
  - cgroups
  - performance
  - containers
status: "Published"
challenge: "What is the primary architectural improvement of cgroups v2 over cgroups v1 in Linux?"
answer: "cgroups v1 had separate, conflicting controller hierarchies for CPU, memory, and I/O. cgroups v2 provides a unified single-hierarchy tree where a single process group has consistent resource limits across all controllers simultaneously."
---

### 💡 WHY (The Concept)
**cgroups (Control Groups)** is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network) of a collection of processes. It is the underlying engine that makes Docker and Kubernetes container limits possible.

### ⚖️ THE LOGICAL DECISION
Use systemd and cgroups v2 to throttle resource-heavy batch scripts or runaway background jobs directly on the host without needing a Docker container.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Check if system is running unified cgroups v2:
mount -t cgroup2

# 2. Run a resource-capped command using systemd-run:
sudo systemd-run --scope -p MemoryMax=500M -p CPUQuota=50% ./heavy-indexer.sh

# 3. Inspect active cgroup limits:
cat /sys/fs/cgroup/system.slice/memory.max
```
