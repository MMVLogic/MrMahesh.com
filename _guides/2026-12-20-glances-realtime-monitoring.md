---
title: "Glances: Lightweight Real-Time Server Monitoring"
layout: default
category: "Homelab"
date: 2026-12-20
tags:
  - monitoring
  - linux
  - performance
status: "Published"
challenge: "What makes Glances more comprehensive than standard `htop` for server monitoring? Glances monitors CPU, RAM, disk I/O, network bandwidth, GPU temperatures, Docker container stats, and exposes a REST API / web UI simultaneously."
answer: "**Glances** is an open-source system monitoring tool written in Python with a curses terminal UI and built-in web server."
---

### 💡 WHY (The Concept)
**Glances** is an open-source system monitoring tool written in Python with a curses terminal UI and built-in web server.

### ⚖️ THE LOGICAL DECISION
Run Glances as a systemd service or Docker container for rapid terminal or web-based hardware inspection.

### ⚙️ HOW (Implementation Code)
```bash
# Run Glances in terminal:
glances

# Run Glances with web UI on port 61208:
glances -w
```
