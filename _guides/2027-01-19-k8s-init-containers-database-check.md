---
title: "Pre-Flight Checks with Kubernetes Init Containers"
layout: default
category: "DevOps"
date: 2027-01-19
tags:
  - kubernetes
  - devops
status: "Published"
challenge: "How do Init Containers guarantee that an application web server does not boot before its backend PostgreSQL database is ready to accept connections? Init Containers run sequentially to completion *before* main app containers start. If the init container script loops waiting for port 5432, the main app will not start until the database responds."
answer: "**Init Containers** perform pre-flight setup (running schema migrations, downloading assets, waiting for dependencies)."
---

### 💡 WHY (The Concept)
**Init Containers** perform pre-flight setup (running schema migrations, downloading assets, waiting for dependencies).

### ⚖️ THE LOGICAL DECISION
Add an init container with `nc` or `pg_isready` to prevent crash-looping web apps during cluster boot.

### ⚙️ HOW (Implementation Code)
```yaml
spec:
  initContainers:
    - name: wait-for-postgres
      image: busybox:latest
      command: ['sh', '-c', 'until nc -z postgres-service 5432; do echo waiting for db; sleep 2; done;']
  containers:
    - name: app
      image: mrmahesh-cms:latest
```
