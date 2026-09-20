---
title: "Redis Sentinel: Automated Master-Replica Failover"
layout: default
category: "DevOps"
date: 2027-01-30
tags:
  - redis
  - database
  - clustering
status: "Published"
challenge: "How does Redis Sentinel detect that a master Redis node has crashed and execute a failover? Sentinel nodes continuously ping the master. When a quorum of Sentinels agree the master is unresponsive (ODOWN), they elect a leader to promote a replica to new master automatically."
answer: "**Redis Sentinel** provides automated monitoring, notifications, and master failover for Redis clusters."
---

### 💡 WHY (The Concept)
**Redis Sentinel** provides automated monitoring, notifications, and master failover for Redis clusters.

### ⚖️ THE LOGICAL DECISION
Deploy 3 Sentinel instances in Kubernetes to ensure caching layers survive pod crashes.

### ⚙️ HOW (Implementation Code)
```ini
# sentinel.conf
sentinel monitor mymaster 192.168.20.182 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
```
