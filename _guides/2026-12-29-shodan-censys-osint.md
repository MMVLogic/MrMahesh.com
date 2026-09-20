---
title: "OSINT Reconnaissance with Shodan & Censys"
layout: default
category: "Cybersecurity"
date: 2026-12-29
tags:
  - security
  - osint
  - recon
status: "Published"
challenge: "How does Shodan discover exposed homelab ports without you ever visiting their website? Shodan runs continuous automated port scans across the entire IPv4 internet address space 24/7, indexing server banners and SSL certificate metadata."
answer: "**Shodan** and **Censys** are search engines for internet-connected devices, indexing exposed web cams, databases, SSH servers, and industrial controls."
---

### 💡 WHY (The Concept)
**Shodan** and **Censys** are search engines for internet-connected devices, indexing exposed web cams, databases, SSH servers, and industrial controls.

### ⚖️ THE LOGICAL DECISION
Query your public home IP on Shodan regularly to ensure no unintended ports (e.g. database port 5432 or unauthenticated web panels) are exposed to the public internet.

### ⚙️ HOW (Implementation Code)
```bash
# Query Shodan CLI for your public IP:
shodan host <YOUR_PUBLIC_IP>
```
