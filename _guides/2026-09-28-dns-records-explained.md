---
title: "DNS Records Demystified: A, CNAME, MX, and TXT"
layout: default
category: "Homelab"
date: 2026-09-28
tags:
  - dns
  - networking
status: "Published"
challenge: "Can a `CNAME` record point directly to an IP address?"
answer: "No. CNAME (Canonical Name) must point to another domain name, never an IP."
---

### 💡 WHY (The Concept)
DNS is the phonebook of the internet:
* **A / AAAA**: Map domain to IPv4 / IPv6 address.
* **CNAME**: Alias domain to another domain.
* **MX**: Mail exchange routing.
* **TXT**: Text metadata (SPF, DKIM, site verification).

### ⚖️ THE LOGICAL DECISION
Use A records for root domains (`mrmahesh.com`) and CNAME records for subdomains (`cms.mrmahesh.com` -> `mrmahesh.com`).

### ⚙️ HOW (Implementation Code)
```ini
# Zone File Examples:
mrmahesh.com.      IN A     192.168.20.182
cms.mrmahesh.com.  IN CNAME mrmahesh.com.
_dmarc.mrmahesh.   IN TXT   "v=DMARC1; p=reject;"
```
