---
title: "Redis Caching & Key Eviction Policies"
layout: default
category: "DevOps"
date: 2026-10-09
tags:
  - redis
  - performance
status: "Published"
challenge: "What Redis eviction policy automatically removes the least recently used keys when memory is full?"
answer: "`allkeys-lru`"
---

### 💡 WHY (The Concept)
**Redis** is an in-memory key-value data structure store used for caching database queries, session tokens, and pub/sub messaging.

### ⚖️ THE LOGICAL DECISION
Always set a `maxmemory` cap and `maxmemory-policy` in Redis to prevent it from consuming all host RAM.

### ⚙️ HOW (Implementation Code)
```bash
# Set a key with 60 second Time-To-Live (TTL):
redis-cli SET session_token "user_123" EX 60

# Check remaining TTL in seconds:
redis-cli TTL session_token

# Monitor active commands in real-time:
redis-cli MONITOR
```
