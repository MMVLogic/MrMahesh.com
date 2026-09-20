---
title: "Homelab Storage: RAID vs. Backups (The Hard Truth)"
layout: default
category: "Homelab"
date: 2026-08-08
tags:
  - storage
  - homelab
  - backup
status: "Published"
challenge: "If you delete a file by accident on a RAID 1 mirror, does the backup on the second drive save it?"
answer: "No. RAID mirrors actions instantly. If you delete a file, it is deleted from both drives immediately. RAID is for system availability, not data recovery!"
---

### 💡 WHY (The Concept)
Let’s get one thing straight: **RAID is not a backup.** 
* **RAID** (Redundant Array of Independent Disks) is about keeping your server *alive* when a hard drive physically dies. If one drive goes up in smoke, your server keeps chugging along without losing uptime.
* **Backups** are copies of your data stored somewhere else. If you accidentally delete a directory, get hit by ransomware, or drop your server down the stairs, backups are what save your bacon. 

### ⚖️ THE LOGICAL DECISION
For a robust homelab, the AI recommends a two-tier approach. Use a software array (like ZFS or `mdadm` RAID 1/5/6) for your active application storage so you don’t have to rebuild your system when a drive fails. Simultaneously, run automated daily backups to an external disk or a separate machine using `rsync` or `restic`.

### ⚙️ HOW (Implementation Code)
#### 1. Creating a simple Software RAID 1 (Mirror) with `mdadm`:
```bash
# Combine two drives (/dev/sdb1 and /dev/sdc1) into a single logical array /dev/md0
sudo mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1
```

#### 2. Running a secure Daily Backup Script:
```bash
# Sync your docker app configuration folder to an external backup mount point
rsync -avz --delete /var/lib/docker/volumes/ /mnt/external_backup/docker_volumes/
```
* **`-a`**: Archive mode (preserves permissions, ownerships, and symlinks).
* **`-v`**: Verbose output (shows what is being copied).
* **`-z`**: Compresses data during transfer.
* **`--delete`**: Deletes files in the backup directory that no longer exist in the source, keeping it clean.
