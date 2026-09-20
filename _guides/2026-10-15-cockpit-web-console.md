---
title: "Cockpit Web Console: Server Management GUI"
layout: default
category: "Homelab"
date: 2026-10-15
tags:
  - linux
  - self-hosting
status: "Published"
challenge: "What port does the Cockpit Linux administration web panel run on by default?"
answer: "Port `9090` (`https://server-ip:9090`)."
---

### 💡 WHY (The Concept)
**Cockpit** is an official Red Hat/Debian browser-based administration tool for Linux servers. It provides real-time CPU/RAM meters, terminal access, disk storage graphs, and system update buttons.

### ⚖️ THE LOGICAL DECISION
Install Cockpit on headless home servers for quick mobile browser checks and hardware inspections.

### ⚙️ HOW (Implementation Code)
```bash
# Install and start Cockpit on Ubuntu/Debian:
sudo apt install cockpit -y
sudo systemctl enable --now cockpit.socket
# Visit https://your-server-ip:9090
```
