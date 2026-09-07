---
title: "Full Disk Encryption with LUKS & cryptsetup"
layout: default
category: "Cybersecurity"
date: 2027-01-07
tags:
  - security
  - encryption
  - storage
  - linux
status: "Published"
challenge: "What happens to data on a LUKS-encrypted drive if someone steals the physical hard drive from your server rack?"
answer: "All sectors on the physical disk appear as high-entropy random noise. Without the master decryption passphrase or keyfile, the data cannot be read or mounted."
---

### 💡 WHY (The Concept)
**LUKS (Linux Unified Key Setup)** is the standard for Linux block-device encryption. Using **`cryptsetup`**, it maps raw encrypted disk partitions to decrypted virtual block devices in `/dev/mapper/` using AES-XTS-256.

### ⚖️ THE LOGICAL DECISION
Encrypt all backup drives and off-site NAS disks with LUKS so that disposed or stolen hardware cannot expose personal data or server secrets.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Format partition with LUKS AES-256 encryption:
sudo cryptsetup luksFormat /dev/sdb1

# 2. Unlock and open encrypted volume:
sudo cryptsetup open /dev/sdb1 secure_storage

# 3. Format and mount decrypted virtual block device:
sudo mkfs.ext4 /dev/mapper/secure_storage
sudo mount /dev/mapper/secure_storage /mnt/secure

# 4. Lock and close volume when unmounted:
sudo umount /mnt/secure
sudo cryptsetup close secure_storage
```
