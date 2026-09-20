---
title: "Kubernetes Pod Affinity & Anti-Affinity Rules"
layout: default
category: "DevOps"
date: 2027-02-19
tags:
  - kubernetes
  - scheduling
status: "Published"
challenge: "How do you configure Kubernetes to guarantee that two pods of the same database deployment NEVER run on the same physical server? Add `podAntiAffinity` with `topologyKey: kubernetes.io/hostname` and `requiredDuringSchedulingIgnoredDuringExecution`."
answer: "**Pod Affinity and Anti-Affinity** allow you to constrain which nodes your Pod can schedule on based on the labels of other Pods already running on the node."
---

### 💡 WHY (The Concept)
**Pod Affinity and Anti-Affinity** allow you to constrain which nodes your Pod can schedule on based on the labels of other Pods already running on the node.

### ⚖️ THE LOGICAL DECISION
Keep redundant replicas on separate physical machines for high availability.

### ⚙️ HOW (Implementation Code)
```yaml
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: app
                operator: In
                values:
                  - redis-master
          topologyKey: "kubernetes.io/hostname"
```
