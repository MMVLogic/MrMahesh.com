---
title: "Network Throughput Benchmarking with iPerf3"
layout: default
category: "Homelab"
date: 2026-12-24
tags:
  - networking
  - performance
  - linux
status: "Published"
challenge: "How do you test true local network throughput between two servers without being bottlenecked by slow hard drive read/write speeds? Run `iperf3`, which generates in-memory synthetic TCP/UDP data streams across network sockets without touching disk storage."
answer: "**iPerf3** measures maximum achievable bandwidth on IP networks, reporting transfer speed, packet loss, and jitter."
---

### 💡 WHY (The Concept)
**iPerf3** measures maximum achievable bandwidth on IP networks, reporting transfer speed, packet loss, and jitter.

### ⚖️ THE LOGICAL DECISION
Use iPerf3 to verify 1GbE/10GbE network link performance between homelab nodes.

### ⚙️ HOW (Implementation Code)
```bash
# Server Mode (on Node 1):
iperf3 -s

# Client Mode (on Node 2):
iperf3 -c 192.168.20.182 -t 10 -P 4
# Output: Measures throughput across 4 parallel streams
```
