---
title: "Kubernetes CronJobs: Scheduled Batch Workloads"
layout: default
category: "DevOps"
date: 2026-09-04
tags:
  - kubernetes
  - automation
  - cron
status: "Published"
challenge: "What field in a Kubernetes CronJob spec prevents multiple runs from overlapping if a previous backup job takes longer than expected?"
answer: "`concurrencyPolicy: Forbid` (or `Replace`). `Forbid` skips the new run if the previous one is still executing."
---

### 💡 WHY (The Concept)
A **CronJob** in Kubernetes runs Pods on a recurring time-based schedule (like every midnight or every Sunday). When the timer fires, Kubernetes spawns a Job, spins up the container, runs the task to completion, and cleans up.

### ⚖️ THE LOGICAL DECISION
Use CronJobs for periodic maintenance: backing up SQLite databases, renewing dynamic DNS, rotating logs, or scraping external feeds without keeping a container running 24/7.

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-db-backup
  namespace: media
spec:
  schedule: "0 2 * * *" # Runs every day at 2:00 AM
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: alpine:latest
              command: ["sh", "-c", "tar -czf /backup/db-$(date +%F).tar.gz /data/cms.db"]
              volumeMounts:
                - name: db-data
                  mountPath: /data
                - name: backup-vol
                  mountPath: /backup
```
