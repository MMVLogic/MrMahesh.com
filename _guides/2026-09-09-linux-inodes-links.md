---
title: "Linux Inodes: Soft Links (Symlinks) vs. Hard Links"
layout: default
category: "DevOps"
date: 2026-09-09
tags:
  - linux
  - filesystem
  - storage
status: "Published"
challenge: "If you delete the original target file, what happens to a Soft Link vs. a Hard Link pointing to it?"
answer: "The **Soft Link** breaks (becomes a dangling link). The **Hard Link** continues to work and preserves the file data completely until all hard links pointing to that inode are deleted."
---

### 💡 WHY (The Concept)
Every file on a Linux filesystem is represented by an **inode** (a data structure storing file metadata, permissions, and disk block pointers).
* **Hard Link**: Another direct filename pointer to the *same* inode number. It cannot cross filesystems or point to directories.
* **Symbolic Link (Soft Link)**: A tiny special file containing the path string to another file. Can point to directories and across different hard drives.

### ⚖️ THE LOGICAL DECISION
Use symlinks (`ln -s`) for web app directory pointing, config switching, and version aliasing. Use hard links when you need indestructible secondary references on the same disk.

### ⚙️ HOW (Implementation Code)
```bash
# Create a symbolic link (Soft link):
ln -s /var/www/releases/v2.1 /var/www/current

# Check inodes of files:
ls -li /var/www/current

# Create a hard link:
ln /data/critical.db /backup/critical-hardlink.db
```
