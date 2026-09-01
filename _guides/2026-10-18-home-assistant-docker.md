---
title: "Home Assistant: Docker Deployment & USB Passthrough"
layout: default
category: "Homelab"
date: 2026-10-18
tags:
  - smart-home
  - docker
status: "Published"
challenge: "Why is `--privileged` or `--device /dev/ttyUSB0` needed when running Home Assistant in Docker?"
answer: "To allow the container to communicate directly with physical USB Zigbee/Z-Wave hardware dongles plugged into the home server."
---

### 💡 WHY (The Concept)
**Home Assistant** is the leading open-source smart home platform that automates local IoT devices without cloud lock-in.

### ⚖️ THE LOGICAL DECISION
Run Home Assistant with `network_mode: host` to enable automated local device discovery (mDNS/UPnP).

### ⚙️ HOW (Implementation Code)
```yaml
version: "3.8"
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    network_mode: host
    restart: unless-stopped
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0
    volumes:
      - /home/m/hass_config:/config
```
