---
title: "Linux Core Dumps & GDB Crash Debugging"
layout: default
category: "DevOps"
date: 2026-11-17
tags:
  - linux
  - debugging
  - c
  - performance
status: "Published"
challenge: "If a compiled program crashes with 'Segmentation fault (core dumped)', what file does Linux generate and how do you inspect the crash stack trace?"
answer: "Linux generates a memory snapshot file (`core` or inside `coredumpctl`). You inspect it with GDB: `gdb /path/to/binary core` and run `bt` (backtrace) to pinpoint the exact line of code that crashed."
---

### 💡 WHY (The Concept)
A **Core Dump** is a recorded snapshot of a process's memory space, CPU registers, and call stack captured at the exact microsecond the program crashed (e.g. invalid memory access or SIGSEGV).

### ⚖️ THE LOGICAL DECISION
Enable core dumps in production and homelabs so when compiled daemons (like Nginx, Redis, or custom Go/Rust binaries) crash intermittently, you can extract the exact stack trace.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Enable unlimited core dump size:
ulimit -c unlimited

# 2. View recent system crashes with systemd-coredump:
coredumpctl list

# 3. Open the latest crash in GDB debugger:
coredumpctl debug

# Inside GDB, print stack backtrace:
(gdb) bt
(gdb) info locals
```
