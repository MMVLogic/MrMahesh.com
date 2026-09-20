---
title: "HAProxy Stick Tables: Distributed Rate Limiting"
layout: default
category: "Cybersecurity"
date: 2027-01-27
tags:
  - haproxy
  - security
  - networking
status: "Published"
challenge: "How do HAProxy Stick Tables track abusive IP addresses across millions of concurrent requests in memory? Stick Tables store client IP keys and request counters directly in in-memory hash tables, evaluating request rates in sub-microseconds."
answer: "**Stick Tables** provide stateful in-memory tracking in HAProxy for sticky sessions, rate limiting, and DDoS mitigation."
---

### 💡 WHY (The Concept)
**Stick Tables** provide stateful in-memory tracking in HAProxy for sticky sessions, rate limiting, and DDoS mitigation.

### ⚖️ THE LOGICAL DECISION
Drop abusive scraping bots before they reach backend Kubernetes pods.

### ⚙️ HOW (Implementation Code)
```haproxy
frontend http_in
    bind *:80
    stick-table type ip size 100k expire 10s store http_req_rate(10s)
    tcp-request content track-sc0 src
    tcp-request content reject if { sc_http_req_rate(0) gt 50 }
```
