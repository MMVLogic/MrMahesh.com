---
title: "Semantic Versioning (SemVer) & Automated Release Tags"
layout: default
category: "DevOps"
date: 2026-12-13
tags:
  - git
  - devops
  - versioning
status: "Published"
challenge: "In SemVer `MAJOR.MINOR.PATCH` (e.g. `2.4.1`), when do you increment the `MAJOR` version number? When you make incompatible, breaking API or architecture changes."
answer: "**Semantic Versioning** establishes a universal convention for software version numbers:\n* **PATCH**: Backwards-compatible bug fixes.\n* **MINOR**: New backwards-compatible functionality.\n* **MAJOR**: Breaking changes."
---

### 💡 WHY (The Concept)
**Semantic Versioning** establishes a universal convention for software version numbers:
* **PATCH**: Backwards-compatible bug fixes.
* **MINOR**: New backwards-compatible functionality.
* **MAJOR**: Breaking changes.

### ⚖️ THE LOGICAL DECISION
Tag production releases with Git annotations (`git tag -a v1.0.0`) to trigger automated CI/CD container builds.

### ⚙️ HOW (Implementation Code)
```bash
# Create an annotated signed release tag:
git tag -a v1.2.0 -m "Release version 1.2.0 (Custom CMS & Guides)"

# Push tag to GitHub:
git push origin v1.2.0
```
