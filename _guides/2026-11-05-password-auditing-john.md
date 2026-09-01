---
title: "Password Auditing with John the Ripper"
layout: default
category: "Cybersecurity"
date: 2026-11-05
tags:
  - security
  - passwords
status: "Published"
challenge: "What is the purpose of the `unshadow` tool before running John the Ripper on Linux password files?"
answer: "It combines `/etc/passwd` (usernames) and `/etc/shadow` (password hashes) into a single file formatted for John to crack."
---

### 💡 WHY (The Concept)
**John the Ripper** is a password security auditing tool that tests cryptographic hash lists against dictionary wordlists and mutation rules.

### ⚖️ THE LOGICAL DECISION
Audit your server password hashes to detect weak passwords (like `password123` or `admin`) before attackers do.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Combine passwd and shadow files:
sudo unshadow /etc/passwd /etc/shadow > unshadowed.txt

# 2. Run John using the rockyou.txt wordlist:
john --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt
```
