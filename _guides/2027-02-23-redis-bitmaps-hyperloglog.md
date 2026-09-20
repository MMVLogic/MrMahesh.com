---
title: "Redis Advanced Structures: Bitmaps & HyperLogLog"
layout: default
category: "DevOps"
date: 2027-02-23
tags:
  - redis
  - performance
  - analytics
status: "Published"
challenge: "How can Redis count 100 million unique daily website visitors with only 12KB of memory? Using **HyperLogLog (`PFADD`, `PFCOUNT`)**, a probabilistic cardinality estimation algorithm with a standard error rate of under 0.81%."
answer: "**Redis Bitmaps** track binary states (e.g. daily user logins) in single bits, and **HyperLogLog** estimates massive distinct set counts in constant memory."
---

### 💡 WHY (The Concept)
**Redis Bitmaps** track binary states (e.g. daily user logins) in single bits, and **HyperLogLog** estimates massive distinct set counts in constant memory.

### ⚖️ THE LOGICAL DECISION
Use HyperLogLog for real-time analytics dashboards without scaling database memory.

### ⚙️ HOW (Implementation Code)
```bash
# Add user IDs to HyperLogLog:
redis-cli PFADD unique_visitors user_101 user_102 user_103

# Get approximate unique count:
redis-cli PFCOUNT unique_visitors
```
