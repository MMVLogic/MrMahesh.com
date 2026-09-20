---
title: "Kubernetes Namespaces & Resource Isolation"
layout: default
category: "DevOps"
date: 2026-08-31
tags:
  - kubernetes
  - devops
status: "Published"
challenge: "How do you specify a target namespace when running `kubectl` commands without changing your default context?"
answer: "Pass the `-n` (or `--namespace`) flag. Example: `kubectl get pods -n media`."
---

### 💡 WHY (The Concept)
If you deploy 30 different applications into a single Kubernetes cluster (media servers, blog engines, databases, monitoring tools), listing all pods becomes overwhelming. A **Namespace** acts as a virtual sub-cluster inside your physical cluster. It provides a distinct boundary for naming, security policies, and resource allocations.

### ⚖️ THE LOGICAL DECISION
Organize your homelab or enterprise cluster into distinct functional namespaces (e.g. `media`, `monitoring`, `web`, `databases`). This prevents name collisions and allows you to wipe or restart entire environments cleanly.

### ⚙️ HOW (Implementation Code)
#### 1. Creating a Namespace manifest (`namespace.yaml`):
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: media
  labels:
    environment: production
```

#### 2. Deploying resources directly into a namespace:
```bash
# Apply a manifest to the 'media' namespace
kubectl apply -f deployment.yaml -n media

# View all pods inside the 'media' namespace
kubectl get pods -n media
```

#### 3. Setting your default kubectl namespace context:
```bash
# Avoid typing '-n media' on every command by changing context default
kubectl config set-context --current --namespace=media
```
