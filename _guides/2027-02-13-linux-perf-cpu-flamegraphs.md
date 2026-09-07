---
title: "CPU Profiling with Linux perf & Brendan Gregg's FlameGraphs"
layout: default
category: "DevOps"
date: 2027-02-13
tags:
  - linux
  - performance
  - profiling
status: "Published"
challenge: "What does a FlameGraph visualize during high CPU load? A **FlameGraph** visualizes profiled software call stacks, where the width of each box represents the percentage of total CPU time consumed by that function."
answer: "**`perf`** samples CPU instruction pointers and call stacks at high frequency (99 Hz) to pinpoint CPU hotspots."
---

### 💡 WHY (The Concept)
**`perf`** samples CPU instruction pointers and call stacks at high frequency (99 Hz) to pinpoint CPU hotspots.

### ⚖️ THE LOGICAL DECISION
Generate SVG FlameGraphs to detect memory reallocation or unoptimized loops in production binaries.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Sample CPU call stacks for 10 seconds across all cores:
sudo perf record -F 99 -a -g -- sleep 10

# 2. Generate FlameGraph SVG:
perf script | stackcollapse-perf.pl | flamegraph.pl > flamegraph.svg
```
