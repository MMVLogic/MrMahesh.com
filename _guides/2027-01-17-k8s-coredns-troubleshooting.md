---
title: "Debugging CoreDNS Resolution Failures in Kubernetes"
layout: default
category: "DevOps"
date: 2027-01-17
tags:
  - kubernetes
  - dns
  - networking
status: "Published"
challenge: "Why does the default `ndots:5` configuration in Linux Kubernetes pods cause slow DNS resolution times? `ndots:5` forces the resolver to append internal cluster search domains (`.media.svc.cluster.local`, `.svc.cluster.local`) before querying public external domains (`google.com`), generating 4 failed DNS lookups per external request."
answer: "**CoreDNS** handles internal DNS lookups for Kubernetes Services. Understanding DNS search paths helps troubleshoot service discovery timeouts."
---

### 💡 WHY (The Concept)
**CoreDNS** handles internal DNS lookups for Kubernetes Services. Understanding DNS search paths helps troubleshoot service discovery timeouts.

### ⚖️ THE LOGICAL DECISION
Inspect CoreDNS logs and adjust `dnsConfig` in Pod specs to optimize external API latency.

### ⚙️ HOW (Implementation Code)
```yaml
spec:
  dnsConfig:
    options:
      - name: ndots
        value: "2"
```
