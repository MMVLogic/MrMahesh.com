---
title: "Reconnaissance: WHOIS & DNS Zone Transfers"
layout: default
category: "Cybersecurity"
date: 2026-11-04
tags:
  - recon
  - security
status: "Published"
challenge: "What is a DNS Zone Transfer (AXFR) vulnerability?"
answer: "When a DNS server misconfiguration allows anyone on the internet to download the entire private DNS record database of a domain."
---

### 💡 WHY (The Concept)
Reconnaissance gathers information about target infrastructure before security audits. WHOIS provides registrar contact details; DNS enumeration discovers subdomains.

### ⚖️ THE LOGICAL DECISION
Audit your authoritative DNS servers to ensure AXFR zone transfers are restricted to secondary nameservers only.

### ⚙️ HOW (Implementation Code)
```bash
# Lookup domain ownership and nameservers:
whois mrmahesh.com

# Test for insecure DNS Zone Transfer (AXFR):
dig AXFR @ns1.nameserver.com mrmahesh.com
```
