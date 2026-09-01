---
title: "Let's Encrypt Wildcard SSL with DNS-01 Challenge"
layout: default
category: "Homelab"
date: 2026-09-31
tags:
  - ssl
  - security
status: "Published"
challenge: "Why is a DNS-01 challenge required for Let's Encrypt Wildcard certificates (`*.mrmahesh.com`) instead of an HTTP-01 challenge?"
answer: "Refer to the concept breakdown and commands below."
---

### 💡 WHY (The Concept)
HTTP-01 only proves ownership of a single web server path. DNS-01 proves authoritative control over the entire domain zone by creating a `_acme-challenge` TXT record.

### ⚖️ THE LOGICAL DECISION
Use wildcard certificates in your homelab so all your subdomains (`cms`, `qbittorrent`, `jellyfin`) share one auto-renewing SSL certificate.

### ⚙️ HOW (Implementation Code)
```bash
# Obtain wildcard certificate using Certbot & Cloudflare DNS plugin:
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
  -d "mrmahesh.com" -d "*.mrmahesh.com"
```
