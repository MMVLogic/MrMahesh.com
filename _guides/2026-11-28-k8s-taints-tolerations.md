---
title: "Kubernetes Taints, Tolerations & Node Affinity"
layout: default
category: "DevOps"
date: 2026-11-28
tags:
  - kubernetes
  - scheduling
  - devops
status: "Published"
challenge: "What is the difference between a `Taint` on a Node and a `Toleration` on a Pod?"
answer: "A **Taint** allows a Node to repel a set of pods. A **Toleration** applied to a Pod allows (but does not require) the Pod to schedule onto a node with matching taints."
---

### 💡 WHY (The Concept)
**Taints and Tolerations** work together to ensure that sensitive or specialized nodes (like GPU-equipped nodes or master control planes) do not accept unwanted workloads.

### ⚖️ THE LOGICAL DECISION
Taint your server's GPU node so only video transcoding or AI workloads run on it, keeping regular web apps on CPU worker nodes.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Taint a node with GPU hardware:
kubectl taint nodes gpu-node-1 hardware=gpu:NoSchedule
```
Allow a specific pod to schedule on it:
```yaml
tolerations:
  - key: "hardware"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```
