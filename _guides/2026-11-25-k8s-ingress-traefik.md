---
title: "Traefik Ingress Controller: Routing & Automatic TLS"
layout: default
category: "DevOps"
date: 2026-11-25
tags:
  - kubernetes
  - traefik
  - networking
  - ssl
status: "Published"
challenge: "What custom resource does Traefik use in Kubernetes to provide advanced routing (like header matching and rate limiting) beyond standard Ingress manifests?"
answer: "`IngressRoute` (Traefik Custom Resource Definition / CRD)."
---

### 💡 WHY (The Concept)
An **Ingress Controller** acts as the front gate of a Kubernetes cluster, routing external HTTP/HTTPS traffic to internal cluster Services. **Traefik** dynamically discovers services and automatically manages Let's Encrypt certificates.

### ⚖️ THE LOGICAL DECISION
Use Traefik for homelab and edge Kubernetes clusters (like K3s) for built-in dashboard metrics and automated TLS.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: cms-ingress
  namespace: media
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`cms.mrmahesh.com`)
      kind: Rule
      services:
        - name: mrmahesh-cms-service
          port: 80
  tls:
    certResolver: cloudflare
```
