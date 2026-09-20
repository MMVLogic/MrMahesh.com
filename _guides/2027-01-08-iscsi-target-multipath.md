---
title: "Enterprise Storage: iSCSI Targets & Multipath I/O"
layout: default
category: "Homelab"
date: 2027-01-08
tags:
  - storage
  - networking
  - homelab
  - iscsi
status: "Published"
challenge: "What is the key difference between NFS file shares and iSCSI block storage?"
answer: "NFS shares files over the network (file-level storage). iSCSI presents remote server storage as raw physical unformatted hard drive blocks (block-level storage), allowing the client to format it with its own native filesystem (e.g. ext4, ZFS)."
---

### 💡 WHY (The Concept)
**iSCSI (Internet Small Computer Systems Interface)** transports raw block commands over IP networks. **Multipath I/O** bonds multiple Ethernet cables between server and NAS, providing failover redundancy and aggregated bandwidth.

### ⚖️ THE LOGICAL DECISION
Use iSCSI with TrueNAS or Proxmox to give virtual machines high-speed block storage over a dedicated 10GbE network.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Discover iSCSI targets on NAS:
sudo iscsiadm -m discovery -t sendtargets -p 192.168.20.182

# 2. Log in and attach iSCSI block device:
sudo iscsiadm -m node -T iqn.2026-01.com.mrmahesh:storage.target1 -p 192.168.20.182 --login

# 3. Check attached block disk:
lsblk
```
