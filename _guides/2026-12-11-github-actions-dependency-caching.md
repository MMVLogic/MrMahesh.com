---
title: "Accelerating CI/CD with GitHub Actions Caching"
layout: default
category: "DevOps"
date: 2026-12-11
tags:
  - cicd
  - github
  - performance
status: "Published"
challenge: "Why should you cache `~/.npm` or `~/.cache/pip` in CI/CD workflows? Downloading hundreds of dependencies over the internet on every commit slows down builds. Caching restores packages locally in seconds, cutting pipeline duration by 70%."
answer: "`actions/cache` stores package directories keyed by a hash of your lockfile (`package-lock.json`)."
---

### 💡 WHY (The Concept)
`actions/cache` stores package directories keyed by a hash of your lockfile (`package-lock.json`).

### ⚖️ THE LOGICAL DECISION
Cache dependencies to speed up deployments and prevent rate-limiting from package registries.

### ⚙️ HOW (Implementation Code)
```yaml
- name: Cache Node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```
