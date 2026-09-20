---
title: "Nginx HTTP/2 Multiplexing & Stream Tuning"
layout: default
category: "DevOps"
date: 2027-02-14
tags:
  - nginx
  - performance
  - networking
status: "Published"
challenge: "How does HTTP/2 multiplexing eliminate the need for domain sharding and CSS/JS image spriting? HTTP/2 sends hundreds of requests and responses concurrently over a single persistent TCP connection using binary framing, eliminating connection setup latency."
answer: "Enable HTTP/2 in Nginx to accelerate page load times on mobile and high-latency networks."
---

### 💡 WHY (The Concept)
Enable HTTP/2 in Nginx to accelerate page load times on mobile and high-latency networks.

### ⚖️ THE LOGICAL DECISION
Add `http2` to Nginx `listen` directives.

### ⚙️ HOW (Implementation Code)
```nginx
server {
    listen 443 ssl http2;
    server_name mrmahesh.com;
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
}
```
