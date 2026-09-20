---
title: "10GbE Network Tuning: 9000 MTU Jumbo Frames"
layout: default
category: "Homelab"
date: 2027-01-25
tags:
  - networking
  - hardware
  - performance
status: "Published"
challenge: "Why do 9000 MTU Jumbo Frames reduce CPU usage and increase throughput on 10GbE storage networks? Standard 1500 MTU requires 830,000 packet interrupts per second for 10Gbps transfer. Jumbo frames increase payload size 6x, reducing packet processing interrupts to 138,000 per second."
answer: "**Jumbo Frames** increase Ethernet Maximum Transmission Unit (MTU) from 1500 to 9000 bytes."
---

### 💡 WHY (The Concept)
**Jumbo Frames** increase Ethernet Maximum Transmission Unit (MTU) from 1500 to 9000 bytes.

### ⚖️ THE LOGICAL DECISION
Enable 9000 MTU exclusively on dedicated storage VLANs (NFS/iSCSI) where all switches and NICs support it.

### ⚙️ HOW (Implementation Code)
```bash
# Set MTU to 9000 on 10GbE interface:
sudo ip link set eth1 mtu 9000

# Verify Jumbo Frames connectivity without fragmentation:
ping -M do -s 8972 192.168.20.182
```
