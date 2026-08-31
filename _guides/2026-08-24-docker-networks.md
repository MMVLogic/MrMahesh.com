---
title: "Docker Networks: Bridge vs. Host vs. Macvlan"
layout: default
category: "Homelab"
date: 2026-08-24
tags:
  - docker
  - networking
  - homelab
status: "Published"
challenge: "When should you use `network_mode: host` instead of standard container port mapping?"
answer: "Use `host` mode when a container requires ultra-low network latency or needs to handle network broadcasts/multicasts (such as Home Assistant discovering local smart devices or Plex media servers)."
---

### 💡 WHY (The Concept)
How containers communicate with each other and your home network depends on their network driver:
* **Bridge (Default)**: Creates an isolated internal virtual network on your server. Containers talk to each other by name, and you selectively expose ports (`-p 8080:80`) to the host machine.
* **Host (`network_mode: host`)**: Removes network isolation. The container shares your home server's IP address and network stack directly.
* **Macvlan**: Assigns a unique MAC address and IP address directly from your home router to the container, making it look like a physical machine on your local Wi-Fi/Ethernet.

### ⚖️ THE LOGICAL DECISION
Use **Bridge** networks for 90% of web apps and databases to keep them isolated. Use **Host** for broadcast/multicast services (Home Assistant, Pi-hole). Use **Macvlan** if a service requires its own dedicated IP on your home router.

### ⚙️ HOW (Implementation Code)
#### Example `docker-compose.yml` demonstrating network modes:
```yaml
version: "3.8"
services:
  # Isolated Bridge Network (Standard)
  custom-cms:
    image: mrmahesh-cms:latest
    ports:
      - "3000:3000"
    networks:
      - internal_net

  # Shared Host Network (Zero Overhead)
  home-assistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    network_mode: host
    restart: unless-stopped

networks:
  internal_net:
    driver: bridge
```
