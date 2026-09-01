---
title: "Prometheus & Grafana: Homelab Metric Scraping"
layout: default
category: "Homelab"
date: 2026-10-10
tags:
  - monitoring
  - grafana
status: "Published"
challenge: "Does Prometheus use a 'push' or 'pull' model to collect metrics from servers?"
answer: "Pull (Prometheus scrapes HTTP `/metrics` endpoints on target servers periodically)."
---

### 💡 WHY (The Concept)
**Prometheus** scrapes and stores time-series metrics. **Grafana** connects to Prometheus as a datasource to build graphical dashboards tracking CPU, RAM, and network traffic.

### ⚖️ THE LOGICAL DECISION
Deploy Prometheus and Grafana in your homelab to detect resource spikes and disk failures before they cause outages.

### ⚙️ HOW (Implementation Code)
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['192.168.20.182:9100']
```
