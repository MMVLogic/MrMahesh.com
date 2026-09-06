---
title: "StatefulSets vs. Deployments: Databases in Kubernetes"
layout: default
category: "DevOps"
date: 2026-11-26
tags:
  - kubernetes
  - database
  - storage
status: "Published"
challenge: "What unique properties do Pods in a `StatefulSet` possess compared to Pods in a standard `Deployment`?"
answer: "StatefulSet pods receive deterministic, sticky ordinal names (e.g. `db-0`, `db-1`), dedicated individual PersistentVolumeClaims that survive pod deletion, and ordered sequential deployment/scaling."
---

### 💡 WHY (The Concept)
While **Deployments** manage interchangeable, stateless web servers, **StatefulSets** manage stateful workloads (databases like PostgreSQL, Redis clusters, or Kafka) that require stable network IDs and dedicated persistent storage disks.

### ⚖️ THE LOGICAL DECISION
Always use StatefulSets for databases to prevent multiple database pods from mounting the same volume concurrently and corrupting data.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres-headless"
  replicas: 2
  template:
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
  volumeClaimTemplates:
    - metadata:
        name: pgdata
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 20Gi
```
