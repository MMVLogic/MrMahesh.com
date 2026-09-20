---
title: "Bash Parameter Expansion Tricks"
layout: default
category: "DevOps"
date: 2026-09-24
tags:
  - bash
  - scripting
status: "Published"
challenge: "In Bash, what does `${FILENAME%.*}` do?"
answer: "It strips the shortest matching extension from the end of the string."
---

### 💡 WHY (The Concept)
Parameter expansion manipulates variables directly inside Bash without spawning expensive external sub-processes like `sed` or `cut`.

### ⚖️ THE LOGICAL DECISION
Use `${VAR:-default}` for fallback values and `${VAR//old/new}` for in-memory string replacement in scripts.

### ⚙️ HOW (Implementation Code)
```bash
FILE="report.backup.tar.gz"

# Remove extension:
echo "${FILE%.*}"      # Output: report.backup.tar

# Default fallback value:
PORT="${CUSTOM_PORT:-3000}"

# String replacement:
HOST="127.0.0.1"
echo "${HOST//./_}"    # Output: 127_0_0_1
```
