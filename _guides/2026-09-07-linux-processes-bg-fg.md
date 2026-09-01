---
title: "Linux Process Control: Foreground, Background & Jobs"
layout: default
category: "DevOps"
date: 2026-09-07
tags:
  - linux
  - processes
  - cli
status: "Published"
challenge: "What keyboard shortcut pauses an active foreground process and returns control to your terminal shell?"
answer: "`Ctrl + Z` (sends `SIGTSTP`). You can then run `bg` to resume it in the background or `fg` to bring it back to the foreground."
---

### 💡 WHY (The Concept)
When you run a long command (like a large file copy or compilation), it locks your terminal in the foreground. Linux lets you push tasks to the **background** so you can keep working in the same shell.

### ⚖️ THE LOGICAL DECISION
Mastering backgrounding saves you from opening 10 SSH windows. Add `&` to start a task in the background, check active jobs with `jobs`, and pull them back when needed.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Start a command in the background:
rsync -avz /large_data /backup &

# 2. View running shell jobs:
jobs
# Output: [1]+ Running rsync -avz /large_data /backup &

# 3. Bring job 1 back to the foreground:
fg %1

# 4. If a command is running in foreground, pause it:
# Press Ctrl+Z
# Resume it running in the background:
bg %1
```
