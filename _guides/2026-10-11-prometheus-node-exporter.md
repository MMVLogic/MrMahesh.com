---
title: "Prometheus Node Exporter Setup"
layout: default
category: "Homelab"
date: 2026-10-11
tags:
  - monitoring
  - linux
status: "Published"
challenge: "What port does Prometheus Node Exporter expose its `/metrics` endpoint on by default?"
answer: "Port `9100`."
---

### 💡 WHY (The Concept)
**Node Exporter** is an official Prometheus daemon that measures Linux hardware and OS metrics (CPU usage, disk I/O, network bandwidth, memory).

### ⚖️ THE LOGICAL DECISION
Run Node Exporter as a Systemd service on every physical and virtual server in your homelab.

### ⚙️ HOW (Implementation Code)
```bash
# Download and run Node Exporter:
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvf node_exporter-*.tar.gz
sudo mv node_exporter-*/node_exporter /usr/local/bin/

# Run as background daemon on port 9100
```
