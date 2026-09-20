---
title: "SSH Config Profiles: ~/.ssh/config Mastery"
layout: default
category: "DevOps"
date: 2026-09-26
tags:
  - ssh
  - linux
status: "Published"
challenge: "How do you configure an SSH alias so typing `ssh lab` connects to `m@192.168.20.182 -p 2222 -i ~/.ssh/lab_key` automatically?"
answer: "Refer to the concept breakdown and commands below."
---

### 💡 WHY (The Concept)
Create a `Host lab` block in `~/.ssh/config` specifying `HostName`, `User`, `Port`, and `IdentityFile`.

### ⚖️ THE LOGICAL DECISION
Stop memorizing IP addresses, ports, and key paths. A single `~/.ssh/config` file simplifies multi-server management.

### ⚙️ HOW (Implementation Code)
```ini
# ~/.ssh/config
Host homelab
    HostName 192.168.20.182
    User m
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_remote
    ServerAliveInterval 60
```
