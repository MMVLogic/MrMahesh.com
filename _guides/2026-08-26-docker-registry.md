---
title: "Self-Hosting a Private Docker Registry"
layout: default
category: "Homelab"
date: 2026-08-26
tags:
  - docker
  - homelab
  - self-hosting
status: "Published"
challenge: "Why do custom docker image tags pushed to a local registry require the registry address as part of the image tag name?"
answer: "Docker uses the domain/IP prefix of the image tag (e.g. `192.168.1.100:5000/my-app`) to determine which remote registry server to push to or pull from."
---

### 💡 WHY (The Concept)
When you build custom Docker images for your homelab apps (like your CNC geometry solver or custom CMS), pushing them to public Docker Hub means your code and images are public (or requires paid private repos). Running a **Private Docker Registry** on your home server gives you a private store to push, pull, and distribute images across all your home servers and Kubernetes clusters.

### ⚖️ THE LOGICAL DECISION
Deploy the official `registry:2` container in your homelab. It takes under 30MB of RAM and lets your local servers share custom images without uploading them over your internet connection.

### ⚙️ HOW (Implementation Code)
#### 1. Starting the Private Registry container:
```bash
docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name local-registry \
  -v /var/lib/registry:/var/lib/registry \
  registry:2
```

#### 2. Tagging and Pushing a custom image to your local registry:
```bash
# Tag your local build with your registry IP and port
docker tag mrmahesh-cms:latest 192.168.1.100:5000/mrmahesh-cms:latest

# Push the image to your private registry
docker push 192.168.1.100:5000/mrmahesh-cms:latest
```

#### 3. Pulling it on another home server:
```bash
docker pull 192.168.1.100:5000/mrmahesh-cms:latest
```
