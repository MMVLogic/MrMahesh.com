---
title: "Disk Space Auditing: df, du, and ncdu"
layout: default
category: "Homelab"
date: 2026-09-16
tags:
  - linux
  - storage
status: "Published"
challenge: "What is the difference between `df -h` and `du -sh *`?"
answer: "`df` shows total partition filesystem usage; `du` calculates directory folder sizes."
---

### 💡 WHY (The Concept)
Hard drives fill up unexpectedly from docker logs and database caches. `df` identifies the full partition; `du` and `ncdu` locate the exact offending directories.

### ⚖️ THE LOGICAL DECISION
Always install `ncdu` (NCurses Disk Usage) in your homelab for interactive graphical directory navigation in your terminal.

### ⚙️ HOW (Implementation Code)
```bash
# Check disk space on all mounted filesystems:
df -h

# Find top 10 largest folders in /var:
sudo du -ah /var | sort -rh | head -n 10

# Interactive terminal disk visualizer:
sudo ncdu /
```
