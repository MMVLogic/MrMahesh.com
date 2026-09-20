---
title: "Network Hardware Audits with ethtool"
layout: default
category: "Homelab"
date: 2026-11-21
tags:
  - linux
  - networking
  - hardware
status: "Published"
challenge: "How do you verify whether a physical network cable is negotiated at Gigabit (1000Mb/s Full Duplex) or degraded to 100Mb/s?"
answer: "`sudo ethtool eth0` (Check the `Speed:` and `Duplex:` fields)."
---

### 💡 WHY (The Concept)
**`ethtool`** queries and controls network interface controllers (NICs) and their hardware device drivers. It inspects physical link speeds, auto-negotiation, ring buffer sizes, and hardware offloading capabilities (like TSO and GSO).

### ⚖️ THE LOGICAL DECISION
When LAN transfer speeds drop mysteriously, run `ethtool` to verify if a damaged Ethernet cable or switch port dropped your connection to 100 Mbps.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Check physical link status, speed, and duplex:
sudo ethtool eth0

# 2. View hardware dropped packets and CRC errors:
sudo ethtool -S eth0 | grep -E "drop|error"

# 3. Blink physical NIC LED light to identify the cable port in a server rack:
sudo ethtool -p eth0 10
```
