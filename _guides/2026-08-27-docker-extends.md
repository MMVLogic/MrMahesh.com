---
title: "Docker Compose Extends & DRY Configs"
layout: default
category: "Homelab"
date: 2026-08-27
tags:
  - docker
  - compose
  - devops
status: "Published"
challenge: "What does the DRY software engineering principle stand for, and how do YAML anchors (`&` and `*`) enforce it in Docker Compose files?"
answer: "**DRY = Don't Repeat Yourself**. YAML anchors (`&template_name`) define a reusable block of configurations (like environment variables or logging policies), and aliases (`*template_name`) inject that exact block into multiple services, eliminating duplicated code."
---

### 💡 WHY (The Concept)
When managing 10+ services in a single `docker-compose.yml` file, repeating the same logging settings, restart policies, environment variables, and network configurations makes the file massive and hard to maintain. Docker Compose supports **YAML Anchors** (`&`) and **Aliases** (`*`) to create reusable templates across services.

### ⚖️ THE LOGICAL DECISION
Define common service parameters (like `restart: unless-stopped` and log rotation limits) in a single YAML anchor block at the top of your compose file, then inherit them in your service definitions.

### ⚙️ HOW (Implementation Code)
#### Example `docker-compose.yml` using YAML Anchors:
```yaml
version: "3.8"

# Reusable Configuration Templates
x-common-logging: &common-logging
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"

x-common-service: &common-service
  restart: unless-stopped
  networks:
    - homelab_net
  <<: *common-logging

services:
  custom-cms:
    <<: *common-service
    image: mrmahesh-cms:latest
    ports:
      - "3000:3000"

  learn-dashboard:
    <<: *common-service
    image: node:18-alpine
    ports:
      - "4000:4000"

networks:
  homelab_net:
    driver: bridge
```
