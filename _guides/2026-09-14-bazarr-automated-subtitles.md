---
title: "Automated Subtitle Pipelines with Bazarr & OpenSubtitles"
layout: default
category: "Homelab"
date: 2026-09-14
tags:
  - media
  - automation
  - homelab
  - jellyfin
status: "Published"
challenge: "Why are external `.srt` (SubRip) subtitle files strongly preferred over embedded image-based PGS/VOBSUB subtitles in Jellyfin and Plex?"
answer: "Text-based `.srt` subtitles are rendered directly by client browser engines using lightweight CSS fonts (Direct Play). Image-based subtitles (PGS/VOBSUB) force the media server to transcode the entire video stream in real-time to burn subtitles into video frames, causing heavy CPU/GPU loads."
---

### 💡 WHY (The Concept)
Many downloaded movies either have missing subtitles, foreign-language audio tracks without English text, or bloated bitmap subtitles (PGS) that force your server to transcode 4K video.

**Bazarr** is an automated subtitle companion tool for Sonarr and Radarr. It monitors your media library, detects missing subtitles, and downloads synchronized external UTF-8 `.srt` subtitle files automatically from OpenSubtitles, Subscene, and YIFY.

### ⚖️ THE LOGICAL DECISION
Deploy Bazarr alongside Radarr/Sonarr to automatically download external UTF-8 `.srt` subtitle files. This guarantees 100% Direct Play on mobile phones, tablets, and smart TVs without CPU transcoding spikes.

### ⚙️ HOW (Implementation Code)
#### Docker Compose Setup for Bazarr:
```yaml
services:
  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - /home/m/bazarr_config:/config
      - /mnt/media/movies:/movies # Must match Radarr path
      - /mnt/media/tv:/tv         # Must match Sonarr path
    ports:
      - "6767:6767"
    restart: unless-stopped
```

#### Language Profile Configuration:
* Set Default Language: **English (en)**
* Preferred Provider Score: **OpenSubtitles.com (VIP API) + YIFY Subtitles**
* Subtitle Format: **Strictly External UTF-8 `.srt`**
