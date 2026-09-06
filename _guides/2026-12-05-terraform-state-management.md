---
title: "Terraform State Management & Remote Backends"
layout: default
category: "DevOps"
date: 2026-12-05
tags:
  - terraform
  - iac
  - devops
status: "Published"
challenge: "Why must Terraform state files (`terraform.tfstate`) NEVER be committed to a public Git repository? State files contain raw unencrypted infrastructure secrets (database passwords, private keys, API tokens) and metadata."
answer: "**Terraform** records the mapping between your code and real-world cloud resources in a **State File**. Using remote backends (like AWS S3 with DynamoDB locking or GitLab HTTP backend) ensures team synchronization and state locking."
---

### 💡 WHY (The Concept)
**Terraform** records the mapping between your code and real-world cloud resources in a **State File**. Using remote backends (like AWS S3 with DynamoDB locking or GitLab HTTP backend) ensures team synchronization and state locking.

### ⚖️ THE LOGICAL DECISION
Always configure a remote backend with encryption and state locking before collaborating on Terraform projects.

### ⚙️ HOW (Implementation Code)
```hcl
terraform {
  backend "s3" {
    bucket         = "homelab-tf-state"
    key            = "prod/state.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-state-locks"
  }
}
```
