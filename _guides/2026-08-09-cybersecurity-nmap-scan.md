---
title: "Port Scanning & Reconnaissance with Nmap"
layout: default
category: "Cybersecurity"
date: 2026-08-09
tags:
  - nmap
  - cybersecurity
  - networking
status: "Published"
challenge: "Which Nmap scan type is faster and quieter because it doesn't open a full TCP connection? (Hint: It only sends a SYN packet and waits for a SYN/ACK)."
answer: "The TCP SYN Scan (Stealth Scan), triggered with the `-sS` flag."
---

### 💡 WHY (The Concept)
Before you can secure your network, you have to know what is exposed. Think of your server like a house. A **port scan** is walking around the house and checking every door and window to see if it’s unlocked. Systems use port numbers (0 to 65535) to route traffic. For example, web servers listen on port 80 and 443, while SSH sits on port 22.

### ⚖️ THE LOGICAL DECISION
When auditing a homelab network, we want to know what software and versions are running on each open port. The AI chose an active reconnaissance scan that queries service banners. This helps pinpoint outdated packages or vulnerable services exposed to the network.

### ⚙️ HOW (Implementation Code)
```bash
# Scan a target IP to detect open ports, running service versions, and the host OS
sudo nmap -sS -sV -O 192.168.1.50
```

* **`-sS`**: Runs a "SYN Scan" (stealth scan). It sends a connection request but cuts it off before establishing a full three-way handshake, making it fast and less prone to logging by basic firewalls.
* **`-sV`**: Service Version Detection. Probes open ports to find out exactly what software (and version) is listening (e.g., Apache 2.4.41).
* **`-O`**: Enables OS Detection. Analyzes TCP packet patterns to guess whether the target is Linux, Windows, or a router.
