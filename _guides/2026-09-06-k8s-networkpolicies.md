---
title: "Kubernetes NetworkPolicies: Internal Pod Firewalls"
layout: default
category: "DevOps"
date: 2026-09-06
tags:
  - kubernetes
  - security
  - networking
status: "Published"
challenge: "By default, can any pod in a Kubernetes cluster communicate with any other pod across namespaces?"
answer: "Yes. In default Kubernetes networking (flat network), all pods can communicate with all other pods unless a NetworkPolicy is applied to restrict traffic."
---

### 💡 WHY (The Concept)
**NetworkPolicies** are packet firewalls for Kubernetes Pods. They specify which ingress (incoming) and egress (outgoing) network connections are permitted based on pod labels, namespaces, and IP blocks (CIDR).

### ⚖️ THE LOGICAL DECISION
Isolate backend databases: permit incoming connections *only* from pods with label `app: cms-server`, blocking unauthorized pods or compromised frontend apps from directly querying the database port.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-cms-only
  namespace: media
spec:
  podSelector:
    matchLabels:
      app: postgres-db
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: mrmahesh-cms
      ports:
        - protocol: TCP
          port: 5432
```
