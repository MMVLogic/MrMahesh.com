---
title: "Kubernetes ConfigMaps & Secrets"
layout: default
category: "DevOps"
date: 2026-08-29
tags:
  - kubernetes
  - security
status: "Published"
challenge: "Are Kubernetes Secrets encrypted at rest by default inside etcd?"
answer: "No. Standard Kubernetes Secrets are only base64-encoded strings, not encrypted. To secure secrets at rest in etcd, you must enable EncryptionAtRest in your cluster control plane or use external secret managers (like HashiCorp Vault)."
---

### 💡 WHY (The Concept)
Hardcoding passwords, API keys, or configuration URLs inside Docker container images is a massive security risk. Kubernetes decouples application code from runtime configuration using two resources:
* **ConfigMaps**: Store non-sensitive configuration parameters (like port numbers, environment names, or HTML templates).
* **Secrets**: Store sensitive credentials (like database passwords, SSH keys, or JWT tokens).

### ⚖️ THE LOGICAL DECISION
Never store credentials in ConfigMaps. Inject Secrets as environment variables or volume mounts into your Deployment pods, allowing you to update credentials without rebuilding container images.

### ⚙️ HOW (Implementation Code)
#### 1. Creating a Secret (`01-secret.yaml`):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cms-app-secrets
type: Opaque
stringData:
  JWT_SECRET: "super_secret_jwt_key_2026"
  DB_PASSWORD: "homelab_secure_db_pass"
```

#### 2. Injecting Secret keys into a Deployment manifest:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cms-deployment
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: cms-server
          image: mrmahesh-cms:latest
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: cms-app-secrets
                  key: JWT_SECRET
```
