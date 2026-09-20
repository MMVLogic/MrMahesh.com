---
title: "The SSL/TLS Handshake Explained"
layout: default
category: "Cybersecurity"
date: 2026-09-30
tags:
  - ssl
  - security
status: "Published"
challenge: "In a TLS handshake, why is asymmetric encryption used only at the beginning?"
answer: "Asymmetric encryption (RSA/ECC) is computationally expensive; it is used only to securely exchange a shared session key, after which fast symmetric encryption (AES-GCM) encrypts all data."
---

### 💡 WHY (The Concept)
HTTPS combines HTTP with TLS. The handshake negotiates cipher suites, verifies certificate authenticity with Certificate Authorities (CAs), and establishes session keys.

### ⚖️ THE LOGICAL DECISION
Understanding the handshake helps debug SSL handshake timeout errors, expired certificate chains, and ALPN protocol negotiations.

### ⚙️ HOW (Implementation Code)
```bash
# Inspect live TLS handshake details using openssl:
openssl s_client -connect mrmahesh.com:443 -servername mrmahesh.com
```
