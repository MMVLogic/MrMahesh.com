---
title: "Linux Text Filtering: grep, egrep, and fgrep"
layout: default
category: "DevOps"
date: 2026-09-11
tags:
  - linux
  - regex
  - cli
status: "Published"
challenge: "Which grep flag searches recursively through all subdirectories and prints line numbers for every match?"
answer: "`-rn` (Recursive + Line Number). Example: `grep -rn 'DATABASE_URL' .`"
---

### 💡 WHY (The Concept)
**`grep`** (Global Regular Expression Print) searches plain-text data sets for lines matching a regular expression. `egrep` enables Extended Regex (ERE) without escaping `+`, `?`, or `|`, while `fgrep` (Fast grep) performs fixed literal string searches without regex interpretation.

### ⚖️ THE LOGICAL DECISION
Use `grep -rn` for codebase searches, `grep -i` for case-insensitive matching, and `grep -v` to invert matching (filtering out noisy healthcheck logs).

### ⚙️ HOW (Implementation Code)
```bash
# 1. Search recursively for an environment variable:
grep -rn "DATABASE_URL" .

# 2. Invert match to exclude noisy lines:
grep -v "GET /healthz" access.log

# 3. Match using Extended Regex (finding IP addresses):
grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log
```
