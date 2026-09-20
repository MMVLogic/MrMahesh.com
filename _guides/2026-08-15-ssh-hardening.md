---
title: "Securing Linux Servers: SSH Hardening"
layout: default
category: "Cybersecurity"
date: 2026-08-15
tags:
  - ssh
  - security
  - linux
status: "Published"
challenge: "If you change your SSH port to 2222, what configuration file do you edit to make the change persistent on boot?"
answer: "The main SSH server configuration file: `/etc/ssh/sshd_config`."
---

### 💡 WHY (The Concept)
If you leave a Linux server connected to the internet on port 22, it will get hammered by brute-force bots within minutes. Bots constantly run scripts scanning for simple passwords. Securing SSH access is the single most important step in protecting your homelab.

### ⚖️ THE LOGICAL DECISION
The AI recommends a three-layered defense. First, disable password authentication entirely, forcing the system to require cryptographic **SSH keys**. Second, change the default port from `22` to a high custom port (like `2222` or `48222`) to avoid 99% of simple bot scans. Third, configure a connection limit threshold using tools like `fail2ban`.

### ⚙️ HOW (Implementation Code)
#### 1. Hardening `/etc/ssh/sshd_config`:
Open the configuration file (`sudo nano /etc/ssh/sshd_config`) and ensure these parameters are set:
```ini
# Change default port (pick a custom number between 1024 and 65535)
Port 48222

# Disable root login over SSH
PermitRootLogin no

# Disable standard password logins (forces SSH keys)
PasswordAuthentication no

# Limit connection attempts to prevent memory exhaustion
MaxAuthTries 3
```

#### 2. Restarting the SSH daemon:
```bash
# Test the configuration for syntax errors first
sudo sshd -t

# Apply the changes by restarting the service
sudo systemctl restart ssh
```
* **WARNING**: Do NOT close your current SSH terminal window after applying these changes. Open a *new* window and verify you can connect before logging out, otherwise you risk locking yourself out of the server!
