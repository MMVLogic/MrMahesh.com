---
title: "Docker Multi-stage Builds"
layout: default
category: "Homelab"
date: 2026-08-23
tags:
  - docker
  - devops
  - build
status: "Published"
challenge: "Why is a multi-stage Docker build much smaller than a single-stage Docker build for compiled languages like Go or Rust?"
answer: "Single-stage builds leave compiler toolchains, SDKs, build caches, and heavy header files inside the final container. Multi-stage builds compile in stage 1, then copy *only* the final compiled binary into a tiny base image (like Alpine or Scratch) for stage 2."
---

### 💡 WHY (The Concept)
Building a production Docker container often requires heavy toolchains (GCC, Python headers, npm build tools). But once your app is compiled, those build tools are useless bloat that waste disk space and increase security vulnerability surfaces. **Multi-stage builds** let you use multiple `FROM` statements in a single `Dockerfile` to separate the **build stage** from the **runtime stage**.

### ⚖️ THE LOGICAL DECISION
Always use multi-stage builds for compiled apps (Node.js builds, Go, Rust, React frontends). You get a clean, tiny final image (e.g. 15MB instead of 800MB) without needing complex external build scripts.

### ⚙️ HOW (Implementation Code)
#### Example `Dockerfile` for a compiled app:
```dockerfile
# STAGE 1: Build Environment
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Lightweight Production Runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only production dependencies and built assets from Stage 1
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
```
