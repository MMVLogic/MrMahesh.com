---
title: "Portainer: Web UI for Docker Containers"
layout: default
category: "Homelab"
date: 2026-10-24
tags:
  - docker
  - self-hosting
status: "Published"
challenge: "What volume socket must be mounted into Portainer so it can control host Docker containers?"
answer: "`/var/run/docker.sock:/var/run/docker.sock`."
---

### 💡 WHY (The Concept)
**Portainer** provides a web-based dashboard to manage Docker containers, inspect logs, deploy Compose stacks, and monitor resource usage.

### ⚖️ THE LOGICAL DECISION
Deploy Portainer for visual container health inspections on home servers.

### ⚙️ HOW (Implementation Code)
```bash
docker run -d -p 9000:9000 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```
