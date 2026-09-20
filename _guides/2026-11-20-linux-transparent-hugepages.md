---
title: "Linux Transparent Huge Pages (THP) & Memory Latency"
layout: default
category: "DevOps"
date: 2026-11-20
tags:
  - linux
  - performance
  - redis
  - database
status: "Published"
challenge: "Why do databases like Redis and PostgreSQL strongly recommend disabling Transparent Huge Pages (THP) in Linux?"
answer: "THP uses 2MB memory pages instead of standard 4KB pages. For fine-grained, high-frequency database writes, memory compaction and copy-on-write overhead causes massive latency spikes and memory fragmentation."
---

### 💡 WHY (The Concept)
Standard x86-64 Linux architectures manage RAM in 4KB chunks (pages). **Huge Pages** increase page size to 2MB or 1GB to reduce Translation Lookaside Buffer (TLB) CPU misses for compute workloads.

### ⚖️ THE LOGICAL DECISION
Keep THP enabled for heavy video transcoding/HPC apps, but disable it (`madvise` or `never`) on database nodes running Redis or MongoDB to eliminate write latency spikes.

### ⚙️ HOW (Implementation Code)
```bash
# Check current THP status:
cat /sys/kernel/mm/transparent_hugepage/enabled
# Output: [always] madvise never

# Disable THP dynamically:
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag
```
