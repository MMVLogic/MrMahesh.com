---
title: "Cert-Manager: Automating TLS with Let's Encrypt"
layout: default
category: "DevOps"
date: 2026-12-04
tags:
  - kubernetes
  - ssl
  - security
  - devops
status: "Published"
challenge: "How does Cert-Manager renew Kubernetes TLS secrets automatically before expiration?"
answer: "Cert-Manager monitors Certificate resources and automatically triggers ACME challenge orders (HTTP-01 or DNS-01) 30 days before expiration, updating the Secret without service downtime."
---

### 💡 WHY (The Concept)
**cert-manager** adds certificates and certificate issuers as resource types in Kubernetes clusters, automating the creation, verification, and renewal of SSL/TLS certificates.

### ⚖️ THE LOGICAL DECISION
Deploy cert-manager with Cloudflare DNS API tokens to automatically issue wildcard TLS certificates for all internal and public ingress domains.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: mahesh@mrmahesh.com
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token-secret
              key: api-token
```
