---
title: "Docker Buildx: Multi-Arch (ARM64/AMD64) Builds with GitHub Cache"
layout: default
category: "DevOps"
date: 2027-02-18
tags:
  - docker
  - cicd
  - devops
status: "Published"
challenge: "How does Docker Buildx build images for both Apple Silicon (ARM64) and Intel/AMD servers (AMD64) on a single build machine? Buildx uses QEMU CPU emulation and BuildKit to compile multi-architecture container manifests simultaneously."
answer: "**Docker Buildx** compiles multi-platform container images and pushes multi-arch manifest lists to registries."
---

### 💡 WHY (The Concept)
**Docker Buildx** compiles multi-platform container images and pushes multi-arch manifest lists to registries.

### ⚖️ THE LOGICAL DECISION
Use Buildx in CI/CD pipelines to ensure containers run natively on Raspberry Pis, Apple M-series chips, and x86 servers.

### ⚙️ HOW (Implementation Code)
```bash
# Build and push multi-arch image:
docker buildx build --platform linux/amd64,linux/arm64 -t 192.168.20.182:5000/mrmahesh-cms:latest --push .
```
