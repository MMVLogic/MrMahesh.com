---
title: "Docker Storage Internals: Upper, Lower & Merged OverlayFS"
layout: default
category: "DevOps"
date: 2027-01-12
tags:
  - docker
  - storage
  - linux
status: "Published"
challenge: "When you edit a file inside a running Docker container, what does OverlayFS do under the hood?"
answer: "OverlayFS performs a **Copy-on-Write (CoW)**: it copies the file from the read-only `lowerdir` (image layer) up into the read-write `upperdir` (container layer) and applies changes there, leaving the base image untouched."
---

### 💡 WHY (The Concept)
**OverlayFS** is a union mount filesystem. It layers multiple directories onto a single mount point:
* **`lowerdir`**: Read-only base container image layers.
* **`upperdir`**: Read-write container layer where changes are written.
* **`merged`**: Unified filesystem view presented inside the container.

### ⚖️ THE LOGICAL DECISION
Understanding OverlayFS helps debug why large file writes inside unmounted container paths cause Docker's `/var/lib/docker/overlay2` to rapidly consume all host disk space.

### ⚙️ HOW (Implementation Code)
```bash
# Inspect Docker container's OverlayFS layers:
docker inspect my-container | grep -A 10 "GraphDriver"

# Manually mount an OverlayFS test:
sudo mount -t overlay overlay -o lowerdir=/base,upperdir=/changes,workdir=/work /merged
```
