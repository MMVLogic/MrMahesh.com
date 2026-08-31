---
title: "Kubernetes Pod Lifecycle & Restart Policies"
layout: default
category: "DevOps"
date: 2026-08-28
tags:
  - kubernetes
  - devops
status: "Published"
challenge: "What is the difference between `restartPolicy: Always` and `restartPolicy: OnFailure` in Kubernetes Pod specifications?"
answer: "`Always` restarts the container whenever it stops (even if it exits cleanly with code 0). `OnFailure` only restarts the container if it exits with an error code (non-zero), making it ideal for batch jobs or database migration tasks."
---

### 💡 WHY (The Concept)
In Kubernetes, a **Pod** is the smallest deployable unit of computing. A Pod moves through distinct lifecycle phases:
* **Pending**: The cluster is downloading images or waiting to assign the Pod to a node.
* **Running**: All containers in the Pod have been created and at least one is active.
* **Succeeded**: All containers in the Pod completed execution cleanly (code 0) and will not restart.
* **Failed**: At least one container terminated in failure (non-zero exit code).
* **CrashLoopBackOff**: A container keeps crashing repeatedly, so Kubernetes pauses before trying to restart it again.

### ⚖️ THE LOGICAL DECISION
Use `restartPolicy: Always` for long-running services (web apps, APIs, proxies) to guarantee high availability. Use `restartPolicy: OnFailure` for batch jobs or initialization tasks.

### ⚙️ HOW (Implementation Code)
#### Example Pod manifest with explicit restart policy:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cms-db-migration
  labels:
    app: cms-migration
spec:
  restartPolicy: OnFailure
  containers:
    - name: db-migrator
      image: mrmahesh-cms:latest
      command: ["node", "scripts/migrate-db.js"]
      env:
        - name: NODE_ENV
          value: "production"
```
* If `migrate-db.js` succeeds (code 0), the Pod transitions to `Succeeded` and stops.
* If it fails (code 1), Kubernetes retries the migration until it succeeds.
