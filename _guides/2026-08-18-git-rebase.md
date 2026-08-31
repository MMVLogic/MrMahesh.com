---
title: "Git Rebase vs. Merge"
layout: default
category: "DevOps"
date: 2026-08-18
tags:
  - git
  - devops
  - vcs
status: "Published"
challenge: "Why should you NEVER run `git rebase` on a public branch (like `main`) that other developers are actively pushing to?"
answer: "Rebasing rewrites commit history (creating new commit hashes). If you rebase a shared public branch, you force everyone else's local history out of sync, causing massive merge conflicts and duplicate commit histories for the rest of the team."
---

### 💡 WHY (The Concept)
When combining changes from one branch into another in Git, you have two choices: **Merge** or **Rebase**.
* **Git Merge** creates a new "merge commit" that ties the histories of two branches together. It preserves the exact chronological history of every branch, but can leave your Git log looking like a tangled web of train tracks.
* **Git Rebase** takes all the commits you made on your feature branch, removes them temporarily, moves your branch point to the tip of the target branch (e.g. `main`), and replays your commits one by one on top. This creates a completely **linear commit history**.

### ⚖️ THE LOGICAL DECISION
Use `git rebase` on your local feature branches before creating a pull request so your commits sit cleanly on top of `main`. Use `git merge` when integrating a completed feature into production to preserve audit trails.

### ⚙️ HOW (Implementation Code)
#### 1. Linearizing your local feature branch onto `main`:
```bash
# While on your feature branch:
git fetch origin
git rebase origin/main
```

#### 2. Interactive Rebase (Squashing messy local commits):
```bash
# Squash the last 3 messy commits into 1 clean commit
git rebase -i HEAD~3
```
* In the interactive editor, change `pick` to `squash` (or `s`) for the 2nd and 3rd commits to merge them into the first commit.
