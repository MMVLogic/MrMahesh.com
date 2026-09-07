---
title: "Linux Security Auditing: Tracking File Access with auditd"
layout: default
category: "Cybersecurity"
date: 2027-01-13
tags:
  - linux
  - security
  - auditing
status: "Published"
challenge: "How do you configure `auditd` to record every time a user or process modifies `/etc/passwd`?"
answer: "`sudo auditctl -w /etc/passwd -p wa -k passwd_changes` (`w` = watch path, `p wa` = write and attribute change permissions, `k` = search tag)."
---

### 💡 WHY (The Concept)
**`auditd`** (Linux Audit Daemon) is the user-space component of the Linux Auditing System. It logs security-relevant events, system call invocations, file access, and user authentications for compliance and forensics.

### ⚖️ THE LOGICAL DECISION
Configure audit rules on `/etc/shadow`, SSH keys, and system binaries to detect unauthorized file tampering with cryptographic attribution.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Add watch rule for SSH authorized_keys:
sudo auditctl -w /home/m/.ssh/authorized_keys -p wa -k ssh_key_tamper

# 2. Search audit logs for specific key events:
sudo ausearch -k ssh_key_tamper --interpret

# 3. Generate human-readable audit report:
sudo aureport --file
```
