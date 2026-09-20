---
title: "Nginx Load Balancing: Upstream Clustering"
layout: default
category: "DevOps"
date: 2026-10-02
tags:
  - nginx
  - scaling
status: "Published"
challenge: "What load balancing algorithm does Nginx use by default in an `upstream` block?"
answer: "Round Robin (sequential distribution across all listed servers)."
---

### 💡 WHY (The Concept)
Nginx can distribute incoming HTTP traffic across a pool of backend servers using algorithms like Round Robin, Least Connections (`least_conn`), and IP Hash (`ip_hash`).

### ⚖️ THE LOGICAL DECISION
Load balancing eliminates single points of failure: if one backend server goes down, Nginx routes traffic to healthy nodes instantly.

### ⚙️ HOW (Implementation Code)
```nginx
upstream cms_cluster {
    least_conn;
    server 192.168.1.10:3000 max_fails=3 fail_timeout=10s;
    server 192.168.1.11:3000 max_fails=3 fail_timeout=10s;
}

server {
    listen 80;
    server_name cms.mrmahesh.com;
    location / {
        proxy_pass http://cms_cluster;
    }
}
```
