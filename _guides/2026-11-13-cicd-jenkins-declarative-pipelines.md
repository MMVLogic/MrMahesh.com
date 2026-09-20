---
title: "CI/CD: Jenkins Declarative Pipelines"
layout: default
category: "DevOps"
date: 2026-11-13
tags:
  - cicd
  - jenkins
  - devops
status: "Published"
challenge: "What file in a Git repository defines an automated pipeline for Jenkins?"
answer: "`Jenkinsfile`"
---

### 💡 WHY (The Concept)
**Jenkins** is an established open-source automation server. Declarative Pipelines define stages (`Build`, `Test`, `Deploy`) in a readable Groovy DSL format.

### ⚖️ THE LOGICAL DECISION
Use Jenkins when managing on-premise infrastructure behind strict corporate firewalls with air-gapped network policies.

### ⚙️ HOW (Implementation Code)
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}
```
