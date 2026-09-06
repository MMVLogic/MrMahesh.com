---
title: "Automated Linting with the pre-commit Framework"
layout: default
category: "DevOps"
date: 2026-12-12
tags:
  - git
  - devops
  - code-quality
status: "Published"
challenge: "What file configures the multi-language `pre-commit` framework in a Git repository? `.pre-commit-config.yaml`"
answer: "The **`pre-commit` framework** manages multi-language git hook scripts (Prettier, ESLint, Black, ShellCheck) without requiring teammates to install toolchains globally."
---

### 💡 WHY (The Concept)
The **`pre-commit` framework** manages multi-language git hook scripts (Prettier, ESLint, Black, ShellCheck) without requiring teammates to install toolchains globally.

### ⚖️ THE LOGICAL DECISION
Install `pre-commit` in your repository to automatically format code and check for syntax errors before every commit.

### ⚙️ HOW (Implementation Code)
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
```
Install hooks:
```bash
pre-commit install
```
