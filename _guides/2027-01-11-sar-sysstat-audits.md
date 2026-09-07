---
title: "Historical Performance Audits with sar & sysstat"
layout: default
category: "DevOps"
date: 2027-01-11
tags:
  - linux
  - monitoring
  - performance
status: "Published"
challenge: "How do you use `sar` to inspect what CPU utilization was yesterday at 3:00 PM during an unmonitored crash?"
answer: "`sar -u -f /var/log/sysstat/sa$(date -d 'yesterday' +%d) -s 14:30:00 -e 15:30:00`"
---

### 💡 WHY (The Concept)
While `top` shows live CPU metrics, **`sysstat` (`sar`)** records historical CPU, RAM, disk I/O, and network activity in the background every 10 minutes, saving daily binary logs for 30+ days.

### ⚖️ THE LOGICAL DECISION
When a server crashes overnight and reboots, use `sar` to reconstruct the exact CPU, memory, and disk load leading up to the crash.

### ⚙️ HOW (Implementation Code)
```bash
# 1. View today's CPU usage timeline in 10-minute increments:
sar -u

# 2. View historical memory and swap usage:
sar -r

# 3. View network interface bandwidth usage:
sar -n DEV
```
