---
title: "Network UPS Tools (NUT): Auto-Shutdown on Power Outage"
layout: default
category: "Homelab"
date: 2026-12-23
tags:
  - hardware
  - power
  - reliability
status: "Published"
challenge: "Why is a Network UPS Tools (NUT) server critical for homelab data safety during a power blackout? When battery backup reaches critical threshold (<20%), NUT broadcasts shutdown commands to all networked servers, cleanly unmounting filesystems and flushing database buffers before power cuts."
answer: "**NUT** provides reliable monitoring of Uninterruptible Power Supply (UPS) hardware (APC, CyberPower) over USB and network."
---

### 💡 WHY (The Concept)
**NUT** provides reliable monitoring of Uninterruptible Power Supply (UPS) hardware (APC, CyberPower) over USB and network.

### ⚖️ THE LOGICAL DECISION
Deploy a master NUT daemon on your primary server to coordinate graceful shutdown of Proxmox nodes and NAS pools during outages.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/nut/ups.conf
[cyberpower]
    driver = usbhid-ups
    port = auto
    desc = "Main Homelab UPS"
```
Monitor UPS status:
```bash
upsc cyberpower
```
