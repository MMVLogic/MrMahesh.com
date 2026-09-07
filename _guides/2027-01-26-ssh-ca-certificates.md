---
title: "Enterprise SSH: Replacing authorized_keys with an SSH CA"
layout: default
category: "Cybersecurity"
date: 2027-01-26
tags:
  - ssh
  - security
  - devops
status: "Published"
challenge: "Why is an SSH Certificate Authority (CA) vastly easier to manage than copying public keys to hundreds of servers? Instead of editing `authorized_keys` on every server, you sign user keys with your private SSH CA. Servers trust any key signed by the CA, with built-in certificate expiration."
answer: "**SSH Certificates** allow short-lived, role-based SSH access with automated expiration (e.g. valid for 8 hours)."
---

### 💡 WHY (The Concept)
**SSH Certificates** allow short-lived, role-based SSH access with automated expiration (e.g. valid for 8 hours).

### ⚖️ THE LOGICAL DECISION
Deploy Step-CA or Smallstep SSH CA for zero-touch credential revocation across homelab fleets.

### ⚙️ HOW (Implementation Code)
```bash
# Sign user public key with CA key for 8 hours:
ssh-keygen -s ca_key -I mahesh -V +8h -n m,root id_ed25519.pub

# Configure servers in /etc/ssh/sshd_config:
# TrustedUserCAKeys /etc/ssh/ca.pub
```
