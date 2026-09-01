---
title: "HAProxy: High-Performance Layer 4 TCP Load Balancing"
layout: default
category: "DevOps"
date: 2026-10-05
tags:
  - haproxy
  - networking
status: "Published"
challenge: "What is the difference between Layer 4 (TCP) and Layer 7 (HTTP) proxying?"
answer: "Layer 4 routes raw TCP packets without decrypting or inspecting HTTP headers, making it faster and able to balance databases and mail servers."
---

### 💡 WHY (The Concept)
HAProxy is an industry-standard load balancer capable of handling tens of thousands of concurrent connections with microsecond latency.

### ⚖️ THE LOGICAL DECISION
Use HAProxy for raw database connection routing (PostgreSQL/MySQL) and non-HTTP protocols.

### ⚙️ HOW (Implementation Code)
```haproxy
frontend postgres_front
    bind *:5432
    mode tcp
    default_backend postgres_back

backend postgres_back
    mode tcp
    balance roundrobin
    server db1 192.168.1.50:5432 check
    server db2 192.168.1.51:5432 check
```
