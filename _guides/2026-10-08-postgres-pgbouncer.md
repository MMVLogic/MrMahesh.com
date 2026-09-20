---
title: "PostgreSQL Connection Pooling with PgBouncer"
layout: default
category: "DevOps"
date: 2026-10-08
tags:
  - postgres
  - scaling
status: "Published"
challenge: "Why does opening 500 direct connections to PostgreSQL slow down query performance?"
answer: "Each PostgreSQL connection forks a heavy backend OS process consuming ~10MB RAM. Connection pooling recycles a small pool of persistent connections across hundreds of client requests."
---

### 💡 WHY (The Concept)
**PgBouncer** is a lightweight connection pooler that sits between your web app and PostgreSQL database.

### ⚖️ THE LOGICAL DECISION
Deploy PgBouncer in Kubernetes or Docker whenever your web app scales to multiple worker threads.

### ⚙️ HOW (Implementation Code)
```ini
# pgbouncer.ini
[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
pool_mode = transaction
max_client_conn = 500
default_pool_size = 20
```
