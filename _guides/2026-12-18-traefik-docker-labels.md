---
title: "Traefik Dynamic Routing via Docker Labels"
layout: default
category: "Homelab"
date: 2026-12-18
tags:
  - docker
  - traefik
  - networking
status: "Published"
challenge: "How does Traefik discover new Docker containers without restarting the proxy? Traefik connects to `/var/run/docker.sock` and reads `traefik.http.routers...` container labels dynamically as containers start and stop."
answer: "Unlike Nginx which requires manual config files and reloads, Traefik routes traffic dynamically using Docker container labels."
---

### 💡 WHY (The Concept)
Unlike Nginx which requires manual config files and reloads, Traefik routes traffic dynamically using Docker container labels.

### ⚖️ THE LOGICAL DECISION
Use Traefik Docker labels for zero-touch SSL and reverse proxy configuration.

### ⚙️ HOW (Implementation Code)
```yaml
services:
  custom-cms:
    image: mrmahesh-cms:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cms.rule=Host(`cms.mrmahesh.com`)"
      - "traefik.http.routers.cms.entrypoints=websecure"
      - "traefik.http.routers.cms.tls.certresolver=letsencrypt"
```
