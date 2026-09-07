---
title: "eBPF System Tracing with BCC Tools"
layout: default
category: "DevOps"
date: 2027-01-05
tags:
  - linux
  - ebpf
  - debugging
  - performance
status: "Published"
challenge: "Why are modern eBPF tracing tools significantly safer to run in production than legacy kernel modules or `strace`?"
answer: "eBPF programs are verified by an in-kernel safety checker before execution, guaranteeing they cannot crash the kernel, loop infinitely, or corrupt system memory, with near-zero (<1%) performance overhead."
---

### 💡 WHY (The Concept)
**eBPF (Extended Berkeley Packet Filter)** runs sandboxed programs in the Linux kernel without changing kernel source code. **BCC (BPF Compiler Collection)** provides utilities (`opensnoop`, `execsnoop`, `biolatency`) for real-time kernel observability.

### ⚖️ THE LOGICAL DECISION
Use `execsnoop` to catch short-lived ephemeral processes that spike CPU and disappear before `top` can register them.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Trace all new processes being executed across the system:
sudo execsnoop-bpfcc

# 2. Trace all files being opened in real-time:
sudo opensnoop-bpfcc

# 3. Measure disk I/O latency histogram:
sudo biolatency-bpfcc 1 10
```
