---
title: "RabbitMQ: Exchanges, Queues & Dead-Letter Exchanges (DLX)"
layout: default
category: "DevOps"
date: 2027-01-31
tags:
  - rabbitmq
  - microservices
  - devops
status: "Published"
challenge: "What happens to a message when it fails processing 3 times in RabbitMQ if a Dead-Letter Exchange (DLX) is configured? RabbitMQ routes the failed message to the DLX, which stores it in a dedicated error quarantine queue for debugging without blocking incoming message processing."
answer: "**RabbitMQ** coordinates asynchronous task queues between microservices using Direct, Topic, and Fanout exchanges."
---

### 💡 WHY (The Concept)
**RabbitMQ** coordinates asynchronous task queues between microservices using Direct, Topic, and Fanout exchanges.

### ⚖️ THE LOGICAL DECISION
Use Dead-Letter Exchanges to handle transient API failures and retry workflows gracefully.

### ⚙️ HOW (Implementation Code)
```json
{
  "x-dead-letter-exchange": "failed_tasks_dlx",
  "x-message-ttl": 60000
}
```
