---
title: "Nextcloud: Self-Hosted Cloud Storage & File Sync"
layout: default
category: "Homelab"
date: 2026-10-22
tags:
  - storage
  - self-hosting
status: "Published"
challenge: "Why should you pair Nextcloud with PostgreSQL and Redis instead of default SQLite for multi-user setups?"
answer: "PostgreSQL handles concurrent database transactions without locking, and Redis handles transactional file locking to prevent sync conflicts."
---

### 💡 WHY (The Concept)
**Nextcloud** provides self-hosted cloud storage, calendar sync, document editing, and mobile photo backup.

### ⚖️ THE LOGICAL DECISION
Deploy Nextcloud in Docker with an external PostgreSQL database and Redis cache for responsive file syncing.

### ⚙️ HOW (Implementation Code)
```yaml
version: "3.8"
services:
  nextcloud:
    image: nextcloud:fpm-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_HOST=db
      - REDIS_HOST=redis
```
