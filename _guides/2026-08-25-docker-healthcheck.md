---
title: "Docker Container Healthchecks"
layout: default
category: "Homelab"
date: 2026-08-25
tags:
  - docker
  - devops
  - reliability
status: "Published"
challenge: "Why is checking if a container status is 'running' insufficient for verifying that a web app is healthy?"
answer: "A container can be 'running' (its Node/Python process is active), but frozen in a deadlock or failing to connect to its database, resulting in 500 errors. A healthcheck tests if the application inside is actually serving valid responses."
---

### 💡 WHY (The Concept)
Docker checks if a container's main process is running. But what if your web server process is stuck in an infinite loop or can't connect to PostgreSQL? The container will stay "Up", but your website is broken. A **Healthcheck** periodically runs a command *inside* the container (like fetching an API health endpoint) to confirm the app is genuinely functioning.

### ⚖️ THE LOGICAL DECISION
Add healthchecks to all database and backend web service containers. This allows orchestrators (like Docker Compose or Kubernetes) to restart unresponding containers automatically.

### ⚙️ HOW (Implementation Code)
#### 1. Adding a Healthcheck in a `Dockerfile`:
```dockerfile
# Periodically query /api/check-auth every 30 seconds
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/check-auth || exit 1
```

#### 2. Adding a Healthcheck in `docker-compose.yml`:
```yaml
version: "3.8"
services:
  custom-cms:
    image: mrmahesh-cms:latest
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/check-auth"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```
* **`interval`**: How often to run the check.
* **`timeout`**: Maximum time to wait for a response.
* **`retries`**: Consecutive failures required to mark the container `unhealthy`.
