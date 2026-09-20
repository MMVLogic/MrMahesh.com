---
title: "Kubernetes Services: ClusterIP vs. NodePort vs. LoadBalancer"
layout: default
category: "DevOps"
date: 2026-08-30
tags:
  - kubernetes
  - networking
status: "Published"
challenge: "Which Kubernetes Service type is selected by default if you don't specify a `type:` field in your service manifest?"
answer: "`ClusterIP` (Internal-only IP address)."
---

### 💡 WHY (The Concept)
Pods in Kubernetes are ephemeral—they can be destroyed, recreated, or rescheduled on different physical cluster nodes at any moment, changing their IP addresses. A **Kubernetes Service** provides a static, reliable DNS name and IP address that load-balances incoming network traffic across a dynamic set of Pods.

### ⚖️ THE LOGICAL DECISION
* **ClusterIP**: Use for 95% of internal services (databases, backend APIs) that should only be accessible from inside the cluster.
* **NodePort**: Opens a high port (30000–32767) directly on every cluster node IP. Great for simple homelabs.
* **LoadBalancer**: Integrates with cloud providers or local metallb load balancers to assign a dedicated external IP address.

### ⚙️ HOW (Implementation Code)
#### Example `Service` Manifest (`ClusterIP`):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mrmahesh-cms-service
  labels:
    app: mrmahesh-cms
spec:
  type: ClusterIP
  selector:
    app: mrmahesh-cms # Routes traffic to pods matching label app=mrmahesh-cms
  ports:
    - name: http
      port: 80         # Internal cluster port
      targetPort: 3000 # Container port running inside the pod
      protocol: TCP
```
Other pods in the cluster can now reach the CMS using the reliable internal DNS address `http://mrmahesh-cms-service.default.svc.cluster.local`.
