---
title: "Hardening Pod Security Contexts"
layout: default
category: "Cybersecurity"
date: 2027-01-20
tags:
  - kubernetes
  - security
status: "Published"
challenge: "What three security settings should be enabled in every production Kubernetes `securityContext`? `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, and `allowPrivilegeEscalation: false`."
answer: "**Security Contexts** define privilege and access control settings for Pods and Containers in Kubernetes."
---

### 💡 WHY (The Concept)
**Security Contexts** define privilege and access control settings for Pods and Containers in Kubernetes.

### ⚖️ THE LOGICAL DECISION
Enforce non-root execution and drop all default Linux capabilities (`capabilities: drop: ['ALL']`) to prevent container breakout exploits.

### ⚙️ HOW (Implementation Code)
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```
