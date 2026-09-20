---
title: "Horizontal Pod Autoscaler (HPA): Auto-Scaling"
layout: default
category: "DevOps"
date: 2026-11-30
tags:
  - kubernetes
  - scaling
  - performance
status: "Published"
challenge: "What cluster component must be installed for Horizontal Pod Autoscalers to read CPU and Memory metrics?"
answer: "**Metrics Server** (`metrics-server`)."
---

### 💡 WHY (The Concept)
The **Horizontal Pod Autoscaler (HPA)** automatically scales the number of Pod replicas in a Deployment based on observed CPU utilization, memory pressure, or custom metrics.

### ⚖️ THE LOGICAL DECISION
Configure HPA on public APIs to automatically scale from 1 pod to 5 pods during traffic spikes, and scale down when traffic subsides to conserve RAM.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cms-hpa
  namespace: media
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mrmahesh-cms-deployment
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
```
