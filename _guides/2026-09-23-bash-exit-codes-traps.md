---
title: "Bash Scripting: Exit Codes & Error Traps"
layout: default
category: "DevOps"
date: 2026-09-23
tags:
  - bash
  - scripting
status: "Published"
challenge: "What does `set -euo pipefail` at the start of a Bash script do?"
answer: "It causes the script to exit immediately if any command fails (`-e`), if an undefined variable is used (`-u`), or if any command in a pipeline fails (`pipefail`)."
---

### 💡 WHY (The Concept)
By default, Bash continues executing subsequent lines even if an earlier command fails. In production, this can lead to data deletion or corrupted builds.

### ⚖️ THE LOGICAL DECISION
Always start production automation scripts with `set -euo pipefail` and define `trap` handlers to clean up temp files on exit.

### ⚙️ HOW (Implementation Code)
```bash
#!/usr/bin/env bash
set -euo pipefail

# Cleanup temporary directory automatically on script exit or crash
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"; echo "Cleaned up temp files."' EXIT

echo "Working in $TEMP_DIR..."
```
