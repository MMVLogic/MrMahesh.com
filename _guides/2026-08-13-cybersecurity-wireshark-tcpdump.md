---
title: "Network Sniffing & Traffic Analysis with tcpdump"
layout: default
category: "Cybersecurity"
date: 2026-08-13
tags:
  - networking
  - tcpdump
  - cybersecurity
status: "Published"
challenge: "How do you capture traffic specifically going to port 443 (HTTPS) using a tcpdump filter?"
answer: "Use the `port 443` filter: `sudo tcpdump -i eth0 port 443`"
---

### 💡 WHY (The Concept)
Every communication on your network is split into packets. When debugging why an API request fails, or auditing if an application is transmitting passwords in plain text, you need a way to inspect the actual raw network packets. **tcpdump** is a command-line utility that taps directly into your network interface to capture and analyze network flows.

### ⚖️ THE LOGICAL DECISION
While GUI interfaces like Wireshark are great, you can't run a graphical interface easily on a headless server. The AI recommends capturing raw traffic using the lightweight command-line tool `tcpdump` into a `.pcap` file, then transferring it to your workstation to analyze it in Wireshark.

### ⚙️ HOW (Implementation Code)
#### 1. Sniffing live HTTP (port 80) packets:
```bash
# Capture packets on interface 'eth0' looking only for port 80 traffic
sudo tcpdump -i eth0 -n -c 10 port 80
```
* **`-i eth0`**: Target interface.
* **`-n`**: Shows numerical IP addresses and ports instead of resolving domain names (makes it much faster).
* **`-c 10`**: Captures exactly 10 packets and exits.

#### 2. Saving captures to a file for Wireshark analysis:
```bash
# Capture all traffic on interface 'eth0' and write it to home_network.pcap
sudo tcpdump -i eth0 -w home_network.pcap
```
* **`-w file.pcap`**: Writes the raw packet capture to disk. Open this file later inside Wireshark.
