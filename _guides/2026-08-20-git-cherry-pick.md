---
title: "Git Cherry-Pick: Snipping Specific Commits"
layout: default
category: "DevOps"
date: 2026-08-20
tags:
  - git
  - devops
status: "Published"
challenge: "If you cherry-pick a commit from `feature-branch` into `main`, does it delete the commit from `feature-branch`?"
answer: "No. `git cherry-pick` creates a duplicate copy of the commit (with a new commit hash) on your current branch. The original commit remains intact on `feature-branch`."
---

### 💡 WHY (The Concept)
Sometimes a teammate fixes a bug or writes a useful utility function inside an experimental feature branch containing 50 other commits you don't want yet. Instead of merging the entire messy branch, **`git cherry-pick`** lets you select a single specific commit by its SHA hash and pluck it directly onto your active branch.

### ⚖️ THE LOGICAL DECISION
Use `cherry-pick` sparingly for urgent hotfixes or isolated utility sharing. Avoid relying on it as a standard workflow, as duplicating commits across multiple branches can complicate future branch merges.

### ⚙️ HOW (Implementation Code)
#### 1. Finding the commit hash:
```bash
# View the commit log on the target branch to find the 7-character hash
git log --oneline feature-branch
```

#### 2. Plucking the commit onto your active branch:
```bash
# Switch to your active target branch (e.g. main)
git checkout main

# Pluck the single commit using its hash
git cherry-pick a1b2c3d
```
