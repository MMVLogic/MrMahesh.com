---
title: "Supply Chain Security: Signing Images with Cosign"
layout: default
category: "Cybersecurity"
date: 2027-02-07
tags:
  - security
  - docker
  - kubernetes
status: "Published"
challenge: "How does Cosign verify that a Docker container running in Kubernetes was built by your official CI/CD pipeline and not tampered with by an attacker? Cosign signs the cryptographic hash (digest) of the container image using private keypairs. Kubernetes admission controllers verify the signature before allowing the pod to pull the image."
answer: "**Cosign (Sigstore)** provides container signing, verification, and software supply chain integrity."
---

### 💡 WHY (The Concept)
**Cosign (Sigstore)** provides container signing, verification, and software supply chain integrity.

### ⚖️ THE LOGICAL DECISION
Sign all production container images during GitHub Actions builds.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Sign container image with Cosign:
cosign sign --key cosign.key 192.168.20.182:5000/mrmahesh-cms:latest

# 2. Verify signature:
cosign verify --key cosign.pub 192.168.20.182:5000/mrmahesh-cms:latest
```
