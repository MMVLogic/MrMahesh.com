---
title: "Jellyfin Media Server: GPU Hardware Transcoding"
layout: default
category: "Homelab"
date: 2026-10-19
tags:
  - media
  - docker
status: "Published"
challenge: "What device path must be mapped into a Docker container to enable Intel QuickSync (VA-API) hardware video transcoding?"
answer: "`/dev/dri`."
---

### 💡 WHY (The Concept)
**Jellyfin** is a free software media system. When streaming 4K video to mobile devices, CPU transcoding causes 100% CPU spikes. **Hardware Transcoding** offloads video encoding to GPU silicon (Intel QuickSync, NVIDIA NVENC).

### ⚖️ THE LOGICAL DECISION
Map `/dev/dri` into Docker to transcode 4K streams smoothly with under 5% CPU usage.

### ⚙️ HOW (Implementation Code)
```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    devices:
      - /dev/dri:/dev/dri # Intel QuickSync VA-API
    ports:
      - "8096:8096"
```
