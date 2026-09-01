---
title: "Nginx Rate Limiting: Stopping Brute-Force Attacks"
layout: default
category: "Cybersecurity"
date: 2026-10-01
tags:
  - nginx
  - security
status: "Published"
challenge: "What does `limit_req_zone $binary_remote_addr zone=login:10m rate=5r/s;` do in Nginx?"
answer: "Refer to the concept breakdown and commands below."
---

### 💡 WHY (The Concept)
It creates a 10MB shared memory zone tracking client IPs that restricts incoming requests to a maximum rate of 5 requests per second.

### ⚖️ THE LOGICAL DECISION
Exposing login portals (like your custom CMS or SSH) invites automated password guessing. Rate limiting in Nginx throttles aggressive bots before they reach your Node.js backend.

### ⚙️ HOW (Implementation Code)
```nginx
# /etc/nginx/nginx.conf
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/login {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
    }
}
```
