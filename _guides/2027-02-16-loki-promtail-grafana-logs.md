---
title: "Grafana Loki & Promtail: Lightweight Log Aggregation"
layout: default
category: "Homelab"
date: 2027-02-16
tags:
  - monitoring
  - logs
  - grafana
status: "Published"
challenge: "Why does Grafana Loki consume 90% less RAM and disk storage than Elasticsearch for log aggregation? Loki does not build full-text inverted indexes on log contents; it only indexes metadata stream labels (like Prometheus), storing raw compressed log chunks in object storage."
answer: "**Grafana Loki** is a horizontally scalable, multi-tenant log aggregation system paired with **Promtail** log collectors."
---

### 💡 WHY (The Concept)
**Grafana Loki** is a horizontally scalable, multi-tenant log aggregation system paired with **Promtail** log collectors.

### ⚖️ THE LOGICAL DECISION
Deploy Loki and Promtail in your homelab to search logs across all Docker containers in Grafana using LogQL.

### ⚙️ HOW (Implementation Code)
```yaml
# Promtail config to scrape Docker container logs
scrape_configs:
  - job_name: docker
    static_configs:
      - targets: ['localhost']
        labels:
          job: docker_logs
          __path__: /var/lib/docker/containers/*/*-json.log
```
