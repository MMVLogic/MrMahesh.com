---
title: "Server-Side Request Forgery (SSRF) Attacks & Cloud Metadata"
layout: default
category: "Cybersecurity"
date: 2027-02-10
tags:
  - security
  - web
  - api
status: "Published"
challenge: "How do attackers exploit SSRF vulnerabilities to steal IAM credentials from cloud instances? If a web server fetches a user-supplied URL without validation, an attacker inputs `http://169.254.169.254/latest/meta-data/` (the internal Cloud Metadata Service IP) to extract temporary root credentials."
answer: "**SSRF** occurs when a backend web application fetches a remote resource requested by a user without validating whether the target IP is an internal private network address (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`)."
---

### 💡 WHY (The Concept)
**SSRF** occurs when a backend web application fetches a remote resource requested by a user without validating whether the target IP is an internal private network address (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`).

### ⚖️ THE LOGICAL DECISION
Block private IP ranges and require strict hostname whitelisting in any backend service that makes outbound HTTP requests.

### ⚙️ HOW (Implementation Code)
```javascript
// Safe URL Fetch Validator
const ipaddr = require('ipaddr.js');

function isSafeUrl(targetUrl) {
    const ip = resolveDns(targetUrl.hostname);
    const addr = ipaddr.parse(ip);
    // Reject private and loopback IP addresses
    if (addr.range() === 'private' || addr.range() === 'loopback') {
        throw new Error('SSRF Attempt Blocked: Internal IP address requested');
    }
    return true;
}
```
