---
title: "SSH Port Forwarding: Local (-L) vs. Remote (-R)"
layout: default
category: "Cybersecurity"
date: 2026-09-27
tags:
  - ssh
  - networking
status: "Published"
challenge: "How do you forward remote server port 8080 to your local machine on port 3000 via SSH?"
answer: "`ssh -L 3000:localhost:8080 user@remote-ip`"
---

### 💡 WHY (The Concept)
**SSH Tunneling** encrypts and routes arbitrary TCP traffic through an encrypted SSH connection.
* **Local (-L)**: Access a remote private port locally.
* **Remote (-R)**: Expose a local dev port to a remote server.

### ⚖️ THE LOGICAL DECISION
Use SSH Local forwarding to securely manage remote databases or web panels without opening firewall ports to the internet.

### ⚙️ HOW (Implementation Code)
```bash
# Forward remote internal PostgreSQL (5432) to localhost:5432:
ssh -L 5432:127.0.0.1:5432 user@homelab.local

# Access it locally at localhost:5432
```
