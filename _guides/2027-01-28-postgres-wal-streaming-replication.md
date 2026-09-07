---
title: "PostgreSQL Streaming Replication & WAL Shipping"
layout: default
category: "DevOps"
date: 2027-01-28
tags:
  - database
  - postgres
  - backup
status: "Published"
challenge: "What is the role of the Write-Ahead Log (WAL) in PostgreSQL replication? Every database change is recorded sequentially to WAL files before being applied to data pages. Primary servers stream WAL records to replicas, which replay the exact transactions in real time."
answer: "**Streaming Replication** provides byte-for-byte read replicas and automated hot-standby failovers."
---

### 💡 WHY (The Concept)
**Streaming Replication** provides byte-for-byte read replicas and automated hot-standby failovers.

### ⚖️ THE LOGICAL DECISION
Set up a streaming replica on a secondary homelab node for zero-downtime database maintenance.

### ⚙️ HOW (Implementation Code)
```bash
# Take a physical base backup from replica node:
pg_basebackup -h 192.168.20.182 -D /var/lib/postgresql/data -U replicator -P -v -R
```
