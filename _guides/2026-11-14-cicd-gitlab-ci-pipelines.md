---
title: "CI/CD: GitLab CI Configurations (.gitlab-ci.yml)"
layout: default
category: "DevOps"
date: 2026-11-14
tags:
  - cicd
  - gitlab
  - devops
status: "Published"
challenge: "What key in `.gitlab-ci.yml` controls whether a deployment job executes automatically or waits for manual engineer approval?"
answer: "`when: manual`"
---

### 💡 WHY (The Concept)
**GitLab CI/CD** uses a single `.gitlab-ci.yml` configuration file to coordinate containerized runners across pipelines.

### ⚖️ THE LOGICAL DECISION
Define automated stages with artifact passing to test, package, and deploy applications seamlessly.

### ⚙️ HOW (Implementation Code)
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

unit_tests:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm test

deploy_prod:
  stage: deploy
  script:
    - ./k8s/deploy.sh
  only:
    - main
  when: manual
```
