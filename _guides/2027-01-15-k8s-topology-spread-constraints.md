---
title: "Kubernetes Topology Spread Constraints"
layout: default
category: "DevOps"
date: 2027-01-15
tags:
  - kubernetes
  - scheduling
  - scaling
status: "Published"
challenge: "How do Topology Spread Constraints differ from Pod Anti-Affinity? Pod Anti-Affinity is binary (schedule or don't schedule). Topology Spread Constraints evenly distribute pods across failure domains (nodes, racks, zones) based on a configured `maxSkew` ratio."
answer: "**Topology Spread Constraints** prevent Kubernetes from accidentally placing all 4 replicas of a service on the same physical server."
---

### 💡 WHY (The Concept)
**Topology Spread Constraints** prevent Kubernetes from accidentally placing all 4 replicas of a service on the same physical server.

### ⚖️ THE LOGICAL DECISION
Use topology spreading across multi-node homelabs so pods are evenly balanced across physical hardware.

### ⚙️ HOW (Implementation Code)
```yaml
spec:
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          app: mrmahesh-cms
```
