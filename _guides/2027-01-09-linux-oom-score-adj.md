---
title: "Linux OOM Killer Priority & oom_score_adj"
layout: default
category: "DevOps"
date: 2027-01-09
tags:
  - linux
  - performance
  - memory
status: "Published"
challenge: "How do you protect a critical process (like SSH daemon or a master database) from ever being killed by the Linux Out-Of-Memory (OOM) killer?"
answer: "Set its `oom_score_adj` value to `-1000`. A value of `-1000` completely immunizes the process from OOM termination."
---

### 💡 WHY (The Concept)
When system RAM is completely exhausted, the Linux kernel **OOM Killer** assigns a score (0 to 1000) to every process based on memory usage. The process with the highest score is terminated with `SIGKILL` (exit code 137).

### ⚖️ THE LOGICAL DECISION
Lower the `oom_score_adj` on SSHD and your primary database, while increasing it (+500) on dispensable background video transcoding workers.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Check a process's current OOM score:
cat /proc/1234/oom_score

# 2. Immunize critical process from OOM kills:
echo -1000 | sudo tee /proc/1234/oom_score_adj

# 3. Configure via Systemd Unit:
# In [Service] block:
OOMScoreAdjust=-500
```
