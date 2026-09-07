---
title: "Network Intrusion Detection (IDS) with Suricata"
layout: default
category: "Cybersecurity"
date: 2027-02-09
tags:
  - security
  - networking
  - firewall
status: "Published"
challenge: "What is the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)? An **IDS** inspects a mirror of network traffic and alerts on threats without interfering. An **IPS** sits inline in the network path and actively drops malicious packets in real time."
answer: "**Suricata** is an open-source threat detection engine capable of multi-gigabit network intrusion detection (IDS), inline intrusion prevention (IPS), and network security monitoring."
---

### 💡 WHY (The Concept)
**Suricata** is an open-source threat detection engine capable of multi-gigabit network intrusion detection (IDS), inline intrusion prevention (IPS), and network security monitoring.

### ⚖️ THE LOGICAL DECISION
Deploy Suricata on your router/gateway to detect Cobalt Strike beacons and port scan probes across your LAN.

### ⚙️ HOW (Implementation Code)
```bash
# Run Suricata inspecting interface eth0:
sudo suricata -c /etc/suricata/suricata.yaml -i eth0

# View live threat alerts:
sudo tail -f /var/log/suricata/fast.log
```
