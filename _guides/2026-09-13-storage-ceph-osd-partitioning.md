---
title: "Storage Architecture: Why Never Partition One Disk into Multiple OSDs"
layout: default
category: "Homelab"
date: 2026-09-13
tags:
  - storage
  - ceph
  - proxmox
  - homelab
status: "Published"
challenge: "Why does creating two Ceph OSDs on partitions of the SAME physical spinning hard drive severely degrade cluster performance and risk total data loss?"
answer: "Ceph assumes every OSD is on independent physical hardware and replicates data chunks across them. If two OSDs share one physical spindle, replication triggers brutal head contention (halving I/O speed), and a single hardware failure instantly destroys multiple replicas simultaneously."
---

### 💡 WHY (The Concept)
When setting up distributed storage systems (like **Ceph** in Proxmox or ZFS storage pools), you might be tempted to take a large 4TB HDD and split it into two 2TB partitions (e.g. `OSD 7` and `OSD 8`) to fulfill a cluster requirement for 'multiple OSDs'.

This is an anti-pattern:
1. **Mechanical I/O Deadlock**: Ceph sends simultaneous read/write requests to both OSDs. Because both partitions share a single mechanical actuator arm, the drive head thrashes between partition tracks, dropping read/write speeds to a crawl.
2. **False Redundancy**: If Ceph writes Replica 1 to OSD 7 and Replica 2 to OSD 8, it believes your data is safe across 2 separate failure domains. When the single 4TB drive dies, **both replicas vanish at once**, causing permanent data loss.

### ⚖️ THE LOGICAL DECISION
**One Physical Drive = One OSD (or VDEV)**. If you need more storage in Ceph or ZFS, add another physical disk or replace existing drives with larger capacities. Never partition a single mechanical drive into multiple storage pool daemons.

### ⚙️ HOW (Implementation Code)
#### 1. Identify Physical Disks vs Partitions:
```bash
# Verify whether OSDs are sharing parent physical disks
lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS
# Example Anti-Pattern:
# sda      3.7T  disk
# ├─sda1   1.8T  part  -> Ceph OSD.1
# └─sda2   1.8T  part  -> Ceph OSD.2  (DANGEROUS SHARED SPINDLE)
```

#### 2. Best Practice Raw Disk OSD Creation (Proxmox/Ceph):
```bash
# Always pass the entire unpartitioned physical drive to Ceph:
pveceph osd create /dev/sdb
```
