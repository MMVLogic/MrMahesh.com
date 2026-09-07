---
title: "802.1Q VLANs: Isolating IoT Devices from Servers"
layout: default
category: "Homelab"
date: 2027-01-21
tags:
  - networking
  - security
  - homelab
status: "Published"
challenge: "Why should smart home IoT devices (smart plugs, Chinese cameras) be isolated on a separate VLAN from your NAS and servers? IoT devices often have unpatched vulnerabilities and unverified cloud connections. An isolated IoT VLAN blocks compromised devices from scanning or attacking internal servers."
answer: "**802.1Q VLANs** divide a single physical network switch into multiple isolated virtual networks."
---

### 💡 WHY (The Concept)
**802.1Q VLANs** divide a single physical network switch into multiple isolated virtual networks.

### ⚖️ THE LOGICAL DECISION
Configure router firewall rules to allow one-way established traffic from your trusted LAN to IoT devices, while dropping all initiated connections from IoT to LAN.

### ⚙️ HOW (Implementation Code)
```text
# VLAN Scheme Example:
# VLAN 10 (Trusted Core): 192.168.10.0/24 (Servers, PCs)
# VLAN 20 (IoT Smart Home): 192.168.20.0/24 (Cameras, Thermostats)
# VLAN 30 (Guest): 192.168.30.0/24
```
