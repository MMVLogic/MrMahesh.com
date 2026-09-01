---
title: "Network Storage: NFS vs. Samba/SMB Shares"
layout: default
category: "Homelab"
date: 2026-10-14
tags:
  - storage
  - networking
status: "Published"
challenge: "Which network file protocol is faster and native to Linux-to-Linux server mounts?"
answer: "**NFS (Network File System)**."
---

### 💡 WHY (The Concept)
Network file sharing connects shared storage to multiple servers:
* **NFS**: Native Linux protocol with minimal overhead. Ideal for Kubernetes PersistentVolumes.
* **SMB/Samba**: Microsoft protocol compatible with Windows, macOS, and Linux.

### ⚖️ THE LOGICAL DECISION
Use NFS for Linux-to-Linux Kubernetes storage volumes. Use SMB for shared folders accessed by personal laptops and phones.

### ⚙️ HOW (Implementation Code)
```bash
# Mount an NFS share on Linux:
sudo mount -t nfs 192.168.1.100:/mnt/tank/media /mnt/nas_media
```
