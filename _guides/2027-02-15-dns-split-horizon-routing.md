---
title: "Split-Horizon DNS: Internal LAN IP vs. External Public IP"
layout: default
category: "Homelab"
date: 2027-02-15
tags:
  - dns
  - networking
  - homelab
status: "Published"
challenge: "Why is Split-Horizon (Hairpin NAT alternative) DNS used in homelabs? When inside your house, `cms.mrmahesh.com` resolves directly to the local LAN IP (`192.168.20.182`). When outside, it resolves to your public WAN IP, avoiding router hairpin NAT slowdowns."
answer: "**Split-Horizon DNS** returns different IP addresses for the same domain name based on the client's source IP."
---

### 💡 WHY (The Concept)
**Split-Horizon DNS** returns different IP addresses for the same domain name based on the client's source IP.

### ⚖️ THE LOGICAL DECISION
Configure local DNS overrides in Pi-hole/Unbound for all your public domain names.

### ⚙️ HOW (Implementation Code)
```text
# In Pi-hole Local DNS Records:
192.168.20.182 cms.mrmahesh.com
192.168.20.182 jellyfin.mrmahesh.com
```
