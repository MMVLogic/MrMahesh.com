---
title: "CPU Profiling: Load Averages & htop"
layout: default
category: "DevOps"
date: 2026-09-19
tags:
  - linux
  - performance
status: "Published"
challenge: "On a 4-core CPU server, what does a 1-minute load average of `4.0` indicate?"
answer: "The system CPU is at 100% capacity (all 4 cores are busy without queue backlog)."
---

### 💡 WHY (The Concept)
Linux **Load Average** measures the number of processes running or waiting for CPU/disk I/O over 1, 5, and 15 minute intervals.

### ⚖️ THE LOGICAL DECISION
Use `htop` for visual per-core CPU graphs, memory meters, and kill management. If load is high but CPU % is low, your system is waiting on slow disk I/O.

### ⚙️ HOW (Implementation Code)
```bash
# View system uptime and 1, 5, 15 minute load averages:
uptime

# Interactive visual system monitor:
htop
```
