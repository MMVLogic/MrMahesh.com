---
title: "Cluster Hardening with kube-bench & CIS Benchmarks"
layout: default
category: "Cybersecurity"
date: 2027-01-16
tags:
  - kubernetes
  - security
  - devops
status: "Published"
challenge: "What standard does `kube-bench` test against to verify Kubernetes security posture? The **Center for Internet Security (CIS) Kubernetes Benchmark**."
answer: "**kube-bench** runs automated security checks against master and worker node configurations (checking etcd encryption, anonymous auth flags, file permissions)."
---

### 💡 WHY (The Concept)
**kube-bench** runs automated security checks against master and worker node configurations (checking etcd encryption, anonymous auth flags, file permissions).

### ⚖️ THE LOGICAL DECISION
Run `kube-bench` as a Kubernetes Job to generate automated security compliance scorecards.

### ⚙️ HOW (Implementation Code)
```bash
# Run kube-bench on master control plane node:
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs job/kube-bench
```
