---
title: "Site-to-Site WireGuard VPN: Linking Physical Homelabs"
layout: default
category: "Homelab"
date: 2027-01-24
tags:
  - vpn
  - networking
  - homelab
status: "Published"
challenge: "How does a Site-to-Site VPN allow all devices in Location A (`192.168.10.0/24`) to reach devices in Location B (`192.168.20.0/24`) without installing VPN software on individual clients? The gateway routers at both locations maintain a persistent WireGuard tunnel and route entire subnet IP ranges across the tunnel."
answer: "**Site-to-Site VPN** joins two separate physical networks into a single cohesive routing domain."
---

### 💡 WHY (The Concept)
**Site-to-Site VPN** joins two separate physical networks into a single cohesive routing domain.

### ⚖️ THE LOGICAL DECISION
Connect your home server lab to a remote backup server at a family member's house for off-site backups.

### ⚙️ HOW (Implementation Code)
```ini
# Gateway A /etc/wireguard/wg0.conf
[Peer]
PublicKey = <Gateway_B_PublicKey>
Endpoint = remote-location.duckdns.org:51820
AllowedIPs = 192.168.20.0/24, 10.100.0.2/32
PersistentKeepalive = 25
```
