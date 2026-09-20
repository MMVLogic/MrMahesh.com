---
title: "Reverse Proxies with Nginx & SSL Encryption"
layout: default
category: "Homelab"
date: 2026-08-14
tags:
  - nginx
  - ssl
  - self-hosting
status: "Published"
challenge: "What is the primary security benefit of exposing apps through a reverse proxy instead of opening port 3000/4000 directly to the internet?"
answer: "A reverse proxy acts as a buffer: it handles SSL decryption, blocks raw access to backend services, isolates internal IP schemes, and allows you to enforce centralized access logs and firewalls (WAF) in one location."
---

### 💡 WHY (The Concept)
If you run five web applications on your home server (like qBittorrent, your portfolio website, and your custom CMS), they each listen on separate ports (like `8080`, `4000`, `3000`). Having users type `http://your-ip:3000` is ugly, insecure, and requires exposing multiple firewall ports. A **Reverse Proxy** listens on standard ports (80/443), receives incoming domain requests (like `cms.mrmahesh.com`), decrypts the SSL, and passes the traffic internally to the correct port.

### ⚖️ THE LOGICAL DECISION
Rather than making multiple services handle SSL cert renewals locally, we route all subdomains through Nginx. This aggregates SSL terminations in one location, allowing `certbot` to manage renewals seamlessly.

### ⚙️ HOW (Implementation Code)
#### 1. Example Nginx Configuration (`/etc/nginx/sites-available/cms.mrmahesh.com`):
```nginx
server {
    listen 80;
    server_name cms.mrmahesh.com;
    
    # Redirect all HTTP requests to secure HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name cms.mrmahesh.com;

    ssl_certificate /etc/letsencrypt/live/mrmahesh.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mrmahesh.com/privkey.pem;

    location / {
        # Forward requests to your Node.js server running on port 3000
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 2. Creating SSL Certificates with Certbot:
```bash
# Obtain and install Let's Encrypt certificates automatically for Nginx
sudo certbot --nginx -d cms.mrmahesh.com
```
