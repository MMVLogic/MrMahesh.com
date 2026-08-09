---
title: "The Modern Docker Homelab (Zero-to-Hero)"
layout: default
category: "Homelab"
date: 2026-08-07
tags:
  - docker
  - linux
  - self-hosting
status: "Published"
challenge: "If you want to run your web container on a custom host port (e.g. 8080) instead of 4000, how would you adjust the ports mapping block in the docker-compose config?"
answer: "Change the mapping to `\"8080:4000\"` (Format is `HostPort:ContainerPort`)."
---

### 💡 WHY (The Concept)
Running multiple services (like a database, web dashboard, and markdown editor) on a single home server creates system conflict—conflicting node/python versions, shared port bindings, and database pollution. Containerization packages an application and all its dependencies into an isolated image that runs uniformly on any Linux OS.

### ⚖️ THE LOGICAL DECISION
Instead of bare-metal configuration, we utilize **Docker Compose** to coordinate multiple applications. This allows us to spin up, update, or blow away a service in a single command, keeping the host system completely clean.

### ⚙️ HOW (Implementation Code)
```yaml
version: "3.8"
services:
  learn-dashboard:
    image: node:18-alpine
    container_name: learn_with_me
    working_dir: /app
    volumes:
      - ./website:/app
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
    restart: unless-stopped
```

* **`volumes`**: Binds a directory on your home server host directly to a path inside the container. This makes data *persistent* (so if the container restarts or gets deleted, your data stays safe on your server's disk).
* **`ports`**: Maps port `4000` inside the container to port `4000` on the home server. You can visit `http://your-server-ip:4000` to access the app.
