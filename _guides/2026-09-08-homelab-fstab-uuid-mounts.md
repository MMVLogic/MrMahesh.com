---
title: "Persistent Storage: Locking Disks with UUID in /etc/fstab"
layout: default
category: "Homelab"
date: 2026-09-08
tags:
  - storage
  - linux
  - homelab
  - backup
status: "Published"
challenge: "Why should you NEVER use device path names like `/dev/sdb1` in `/etc/fstab` for external USB storage or secondary hard drives?"
answer: "Linux kernel device letters (`/dev/sda`, `/dev/sdb`, `/dev/sdc`) are assigned dynamically at boot depending on which device responds first. If you plug in a new USB drive or reboot, `/dev/sdb1` might become `/dev/sdc1`, causing mount failures or writing backup data to the wrong disk."
---

### 💡 WHY (The Concept)
If you attach an external SSD or backup hard drive (like an Immich photo backup drive) to your Linux home server, mounting it manually via `/dev/sdb1` works temporarily. But when the server reboots:
1. The kernel re-probes hardware.
2. The drive might be assigned `/dev/sdc1` instead of `/dev/sdb1`.
3. If `/etc/fstab` has a hardcoded `/dev/sdb1` mount, systemd halts the boot process in emergency mode.

**UUIDs (Universally Unique Identifiers)** are permanent 128-bit cryptographic IDs embedded directly into the disk filesystem header. Mounting by `UUID=` guarantees the OS always mounts the exact physical drive to the exact target folder, regardless of USB port or boot order.

### ⚖️ THE LOGICAL DECISION
Always identify disks by `UUID` (found using `lsblk -f` or `blkid`) in `/etc/fstab`. Add the `nofail` mount option for external USB drives so that if the drive is unplugged during reboot, the server boots smoothly without hanging.

### ⚙️ HOW (Implementation Code)
#### 1. Find the permanent filesystem UUID:
```bash
# List all block devices with their permanent UUIDs and filesystems
lsblk -f
# Example Output:
# sdb
# └─sdb1  ext4  PHOTO_BACKUP  4a8c1234-5678-90ab-cdef-1234567890ab  /mnt/photos
```

#### 2. Configure `/etc/fstab` safely:
```ini
# /etc/fstab entry for persistent USB storage
UUID=4a8c1234-5678-90ab-cdef-1234567890ab  /mnt/photos  ext4  defaults,nofail,x-systemd.device-timeout=5s  0  2
```
* `UUID=...`: Permanent hardware ID.
* `nofail`: Prevents boot crashes if the USB drive is unplugged.
* `x-systemd.device-timeout=5s`: Waits max 5s for the drive before continuing boot.

#### 3. Test mount configuration without rebooting:
```bash
# Test all fstab entries (if syntax is broken, it will report errors immediately)
sudo mount -a
```
