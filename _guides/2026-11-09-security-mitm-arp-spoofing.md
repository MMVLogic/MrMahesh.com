---
title: "Man-in-the-Middle (MitM) Attacks & ARP Spoofing"
layout: default
category: "Cybersecurity"
date: 2026-11-09
tags:
  - networking
  - security
status: "Published"
challenge: "How does ARP Spoofing trick a local network switch?"
answer: "An attacker broadcasts fake ARP replies claiming their MAC address belongs to the default gateway IP, tricking devices into routing all outbound traffic through the attacker's machine."
---

### 💡 WHY (The Concept)
**ARP (Address Resolution Protocol)** maps IP addresses to physical MAC addresses on a local Ethernet/Wi-Fi network. Because ARP has no authentication, attackers can poison local ARP tables.

### ⚖️ THE LOGICAL DECISION
Mitigate ARP spoofing by enforcing HTTPS everywhere (TLS encrypts the payload even if intercepted), enabling Dynamic ARP Inspection (DAI) on managed switches, and using static ARP entries for critical gateways.

### ⚙️ HOW (Implementation Code)
```bash
# View your local system ARP cache table:
arp -a
```
