---
title: "Prometheus Alertmanager: Discord & Telegram Webhooks"
layout: default
category: "Homelab"
date: 2026-12-14
tags:
  - monitoring
  - alerting
  - devops
status: "Published"
challenge: "What role does Alertmanager play in a Prometheus monitoring stack? Prometheus evaluates alert rules (e.g. `HighCPUUsage > 90%`) and fires alerts to **Alertmanager**, which deduplicates, groups, and routes notifications to webhooks (Discord, Telegram, PagerDuty)."
answer: "**Alertmanager** prevents notification spam by silencing known maintenance windows and grouping related alerts into single messages."
---

### 💡 WHY (The Concept)
**Alertmanager** prevents notification spam by silencing known maintenance windows and grouping related alerts into single messages.

### ⚖️ THE LOGICAL DECISION
Route critical homelab alerts (server down, disk >90% full) directly to a private Discord or Telegram channel.

### ⚙️ HOW (Implementation Code)
```yaml
# alertmanager.yml
route:
  receiver: 'discord_webhook'

receivers:
  - name: 'discord_webhook'
    webhook_configs:
      - url: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'
        send_resolved: true
```
