---
title: "Kubernetes DaemonSets: Node-Level Services"
layout: default
category: "DevOps"
date: 2026-11-27
tags:
  - kubernetes
  - monitoring
  - devops
status: "Published"
challenge: "When you add a new physical node to a Kubernetes cluster, what happens to Pods managed by a `DaemonSet`?"
answer: "Kubernetes automatically schedules and runs an instance of the DaemonSet Pod onto the newly added node without manual intervention."
---

### 💡 WHY (The Concept)
A **DaemonSet** guarantees that an exact copy of a Pod runs on *all* (or selected) physical nodes in the cluster. When nodes are added or removed, the DaemonSet scales automatically.

### ⚖️ THE LOGICAL DECISION
Use DaemonSets for node-level infrastructure services: Prometheus Node Exporter, Fluentbit log collectors, and storage plugins.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
```
