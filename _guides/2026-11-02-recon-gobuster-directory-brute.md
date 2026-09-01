---
title: "Gobuster: Web Directory & File Brute Forcing"
layout: default
category: "Cybersecurity"
date: 2026-11-02
tags:
  - recon
  - security
status: "Published"
challenge: "What wordlist is considered the industry standard for web directory brute forcing in Kali Linux?"
answer: "The SecLists `common.txt` or `directory-list-2.3-medium.txt`."
---

### 💡 WHY (The Concept)
**Gobuster** is a high-speed command-line tool written in Go that brute-forces hidden URIs (directories, files, subdomains) by hammering a web server with dictionary lists.

### ⚖️ THE LOGICAL DECISION
Run Gobuster during audits to discover exposed `.git` folders, backup `.tar.gz` files, and hidden admin panels.

### ⚙️ HOW (Implementation Code)
```bash
# Brute force web paths looking for php, html, and txt files:
gobuster dir -u http://192.168.1.50 \
  -w /usr/share/wordlists/dirb/common.txt \
  -x php,html,txt,json -t 30
```
