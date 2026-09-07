---
title: "Pod Disruption Budgets (PDB) for Zero-Downtime Node Upgrades"
layout: default
category: "DevOps"
date: 2027-01-14
tags:
  - kubernetes
  - reliability
  - devops
status: "Published"
challenge: "What is the purpose of a PodDisruptionBudget (PDB) in Kubernetes during `kubectl drain` maintenance? A PDB specifies the minimum number of healthy replicas that must remain online simultaneously, preventing cluster maintenance from taking down all application pods at once."
answer: "When upgrading Kubernetes worker nodes, `kubectl drain` evicts pods. A **PDB** ensures high-availability services retain quorum during rolling node restarts."
---

### 💡 WHY (The Concept)
When upgrading Kubernetes worker nodes, `kubectl drain` evicts pods. A **PDB** ensures high-availability services retain quorum during rolling node restarts.

### ⚖️ THE LOGICAL DECISION
Define PDBs for all multi-replica deployments (databases, APIs) to guarantee zero downtime during cluster kernel upgrades.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: cms-pdb
  namespace: media
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: mrmahesh-cms
```
