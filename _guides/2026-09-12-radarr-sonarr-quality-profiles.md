---
title: "Radarr/Sonarr Pipelines: Quality Profiles & Size Limits"
layout: default
category: "Homelab"
date: 2026-09-12
tags:
  - homelab
  - automation
  - media
  - storage
status: "Published"
challenge: "Why do automated media downloaders accidentally pull 60GB 4K REMUX files that fill your entire hard drive unless strict Size Limits are set in Quality Profiles?"
answer: "By default, quality profiles like 'HD-1080p' or 'Ultra-HD' prioritize maximum bitrate without hard file size limits. Setting Min/Max MB-per-minute size limits constrains downloads to realistic sizes (e.g. 2GB–8GB per movie)."
---

### 💡 WHY (The Concept)
Automated managers (Radarr for movies, Sonarr for TV shows) search indexers and automatically grab releases matching your target format. Without tuning:
1. **Bloat**: It grabs 75GB uncompressed BluRay REMUXes that consume all storage in a week.
2. **Junk**: It grabs 300MB overly-compressed cam-rips with unreadable audio.
3. **Dead Downloads**: It queues torrents with 0 seeders that sit permanently stagnant in your client.

### ⚖️ THE LOGICAL DECISION
Configure strict **Quality Profiles** with min/max MB-per-hour size limits (e.g. target 1080p Web-DL / x265 at 1.5GB to 4GB per 2-hour movie), enforce minimum seeder thresholds (e.g. $\ge 5$ seeders), and use Custom Formats to prefer modern efficient codecs (`x265 / HEVC`).

### ⚙️ HOW (Implementation Code)
#### Optimal Quality Settings (Radarr/Sonarr):
* **Settings > Quality > 1080p Web-DL**:
  * **Min Size**: `10 MB/min` ($\approx 1.2\text{ GB}$ per 2hr movie)
  * **Preferred Size**: `25 MB/min` ($\approx 3.0\text{ GB}$ per 2hr movie)
  * **Max Size**: `45 MB/min` ($\approx 5.4\text{ GB}$ per 2hr movie)

#### Custom Format Codec Scoring:
* Under **Settings > Custom Formats**, create score rules to prioritize `x265` over bloated `x264`:
```json
{
  "name": "x265 / HEVC Preferred",
  "includeCustomFormatWhenRenaming": false,
  "specifications": [
    {
      "name": "HEVC or x265",
      "implementation": "ReleaseTitleSpecification",
      "negate": false,
      "required": false,
      "fields": {
        "value": "\\b(x265|hevc|h265)\\b"
      }
    }
  ]
}
```
* Assign a Score of `+100` to this format to automatically choose modern, compact encoding.
