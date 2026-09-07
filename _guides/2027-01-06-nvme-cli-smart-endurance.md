---
title: "NVMe SSD Health, Wear-Leveling & TBW with nvme-cli"
layout: default
category: "Homelab"
date: 2027-01-06
tags:
  - hardware
  - storage
  - linux
  - nvme
status: "Published"
challenge: "How do you calculate the remaining lifespan percentage of an NVMe SSD using `nvme-cli`?"
answer: "Run `sudo nvme smart-log /dev/nvme0`. Inspect the `percentage_used` field. A value of `15%` means 15% of the manufacturer's rated endurance has been consumed (85% lifespan remains)."
---

### 💡 WHY (The Concept)
Unlike SATA drives which use `smartctl`, NVMe drives use direct PCIe interfaces managed via **`nvme-cli`**. It reports Total Bytes Written (TBW), temperature thresholds, spare block availability, and unsafe shutdown counts.

### ⚖️ THE LOGICAL DECISION
Monitor NVMe percentage used and critical warnings on homelab nodes to replace failing boot drives before silent data corruption occurs.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Inspect SMART health log and wear percentage:
sudo nvme smart-log /dev/nvme0n1

# 2. List all NVMe namespaces and controller firmwares:
sudo nvme list

# 3. Check for media errors and temperature throttle events:
sudo nvme error-log /dev/nvme0n1
```
