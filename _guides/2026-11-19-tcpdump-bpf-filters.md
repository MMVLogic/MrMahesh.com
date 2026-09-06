---
title: "Advanced Network Packet Captures with tcpdump & BPF"
layout: default
category: "Cybersecurity"
date: 2026-11-19
tags:
  - networking
  - security
  - linux
  - tcpdump
status: "Published"
challenge: "How do you capture only SYN packets (new TCP connection attempts) on interface `eth0` using tcpdump?"
answer: "`sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'`"
---

### 💡 WHY (The Concept)
**`tcpdump`** uses **Berkeley Packet Filters (BPF)** to capture and analyze raw network traffic traversing network interfaces directly in the Linux kernel without performance degradation.

### ⚖️ THE LOGICAL DECISION
Use `tcpdump` to capture live network payloads on headless servers, write `.pcap` files, and download them for visual inspection in Wireshark.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Capture traffic on port 443 excluding SSH traffic on port 22:
sudo tcpdump -i any -nn 'port 443 and not port 22'

# 2. Capture and save 10,000 packets to a Wireshark PCAP file:
sudo tcpdump -i eth0 -w /tmp/traffic.pcap -c 10000

# 3. Filter only DNS queries:
sudo tcpdump -i eth0 -nn 'udp port 53'
```
