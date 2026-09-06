---
title: "Debugging Hanging Binaries with strace"
layout: default
category: "DevOps"
date: 2026-11-18
tags:
  - linux
  - debugging
  - troubleshooting
status: "Published"
challenge: "What command allows you to attach `strace` to an already running frozen process with PID 1420 to see what system call it is stuck on?"
answer: "`sudo strace -p 1420` (or `sudo strace -T -p 1420` to measure time spent in each system call)."
---

### 💡 WHY (The Concept)
**`strace`** (System Call Tracer) intercepts and records the system calls made by a process and the signals it receives. It reveals what files a program is attempting to open, what network sockets it is waiting on, and where it is deadlocked.

### ⚖️ THE LOGICAL DECISION
When a command hangs with no log output or fails with a vague error like 'File not found', `strace` reveals the exact missing file path or hanging socket instantly.

### ⚙️ HOW (Implementation Code)
```bash
# Trace file opening and network calls for a command:
strace -e trace=openat,connect,read,write ./my-app

# Count system calls and time spent per syscall:
strace -c ./my-app

# Attach to a running hung process and log output to file:
sudo strace -p 2480 -o /tmp/debug.log
```
