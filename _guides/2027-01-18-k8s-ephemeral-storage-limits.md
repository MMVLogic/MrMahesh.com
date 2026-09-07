---
title: "Protecting Nodes with Ephemeral Storage Limits"
layout: default
category: "DevOps"
date: 2027-01-18
tags:
  - kubernetes
  - storage
  - devops
status: "Published"
challenge: "What happens to a Pod when its container writes 20GB of temporary files to unmounted `/tmp` and exceeds its `ephemeral-storage` limit? The kubelet evicts the Pod immediately to protect the host node's root filesystem from running out of disk space."
answer: "**Ephemeral Storage** encompasses container rootfs writable layers, emptyDir volumes, and container logs."
---

### 💡 WHY (The Concept)
**Ephemeral Storage** encompasses container rootfs writable layers, emptyDir volumes, and container logs.

### ⚖️ THE LOGICAL DECISION
Always specify ephemeral storage requests and limits alongside CPU and Memory limits.

### ⚙️ HOW (Implementation Code)
```yaml
resources:
  requests:
    ephemeral-storage: "500Mi"
  limits:
    ephemeral-storage: "2Gi"
```
