---
title: "Wake-on-LAN (WoL): Powering On Remote Homelab Nodes"
layout: default
category: "Homelab"
date: 2026-12-21
tags:
  - networking
  - hardware
  - linux
status: "Published"
challenge: "What network packet triggers a computer to power on via Wake-on-LAN? A **Magic Packet** (a broadcast frame containing 6 bytes of `0xFF` followed by the target machine's MAC address repeated 16 times)."
answer: "**Wake-on-LAN** allows you to remotely power on powered-down servers and PCs across your local network without physical access."
---

### 💡 WHY (The Concept)
**Wake-on-LAN** allows you to remotely power on powered-down servers and PCs across your local network without physical access.

### ⚖️ THE LOGICAL DECISION
Enable WoL in motherboard BIOS and send magic packets from your router or primary home server.

### ⚙️ HOW (Implementation Code)
```bash
# Install wakeonlan tool:
sudo apt install wakeonlan -y

# Wake remote server using its MAC address:
wakeonlan 00:11:22:33:44:55
```
