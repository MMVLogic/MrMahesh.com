---
title: "Linux Performance Profiles with tuned-adm"
layout: default
category: "DevOps"
date: 2027-01-10
tags:
  - linux
  - performance
  - tuning
status: "Published"
challenge: "What `tuned-adm` profile optimizes Linux for low-latency network packet handling and CPU governor throughput?"
answer: "`throughput-performance` (or `network-latency`)."
---

### 💡 WHY (The Concept)
**TuneD** is a dynamic adaptive system tuning daemon for Linux. It monitors system components and adjusts kernel scheduler parameters, CPU governors, disk elevator algorithms, and power states using pre-tested profiles.

### ⚖️ THE LOGICAL DECISION
Apply `throughput-performance` on virtualization hosts and compute nodes, or `powersave` on low-power Intel NUC home servers.

### ⚙️ HOW (Implementation Code)
```bash
# 1. List available tuning profiles:
tuned-adm list

# 2. Switch to throughput-performance profile:
sudo tuned-adm profile throughput-performance

# 3. Verify active profile settings:
tuned-adm active
```
