---
title: "Nginx Security Headers: CSP, HSTS, & X-Frame"
layout: default
category: "Cybersecurity"
date: 2026-10-03
tags:
  - nginx
  - security
status: "Published"
challenge: "What header prevents your website from being embedded in an external `<iframe>` to block clickjacking?"
answer: "`X-Frame-Options: SAMEORIGIN` (or `frame-ancestors 'self'` in CSP)."
---

### 💡 WHY (The Concept)
Browsers enforce security policies via HTTP response headers. Setting strict headers mitigates XSS, clickjacking, and MIME-type sniffing.

### ⚖️ THE LOGICAL DECISION
Add standard OWASP security headers to all reverse proxy configurations.

### ⚙️ HOW (Implementation Code)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```
