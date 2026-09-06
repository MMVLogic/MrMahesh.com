---
title: "Online PVC Expansion: Resizing Kubernetes Disks"
layout: default
category: "DevOps"
date: 2026-11-29
tags:
  - kubernetes
  - storage
  - devops
status: "Published"
challenge: "Can you shrink an existing Kubernetes PersistentVolumeClaim (PVC) from 50GB down to 20GB?"
answer: "No. Kubernetes and underlying storage CSI drivers only support expanding volume capacity, never shrinking."
---

### 💡 WHY (The Concept)
When a database or media volume runs low on disk space in Kubernetes, you can expand its **PersistentVolumeClaim (PVC)** dynamically without deleting pods or stopping cluster operations if the StorageClass supports `allowVolumeExpansion: true`.

### ⚖️ THE LOGICAL DECISION
Resize storage in-place by editing the PVC manifest (`spec.resources.requests.storage`) and applying it directly.

### ⚙️ HOW (Implementation Code)
```bash
# Edit PVC storage size directly:
kubectl patch pvc cms-db-pvc -n media -p '{"spec":{"resources":{"requests":{"storage":"30Gi"}}}}'

# Verify expanded volume size:
kubectl get pvc cms-db-pvc -n media
```
