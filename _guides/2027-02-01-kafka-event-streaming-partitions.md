---
title: "Apache Kafka: Topics, Partitions & Consumer Groups"
layout: default
category: "DevOps"
date: 2027-02-01
tags:
  - kafka
  - streaming
  - devops
status: "Published"
challenge: "How does Kafka allow 10 consumer instances to process messages from a single topic concurrently? The topic is divided into multiple **Partitions**. Each consumer in a **Consumer Group** is assigned exclusive ownership of a specific partition, enabling parallel stream processing."
answer: "**Apache Kafka** is a distributed event store and stream processing platform designed for high-throughput log ingestion."
---

### 💡 WHY (The Concept)
**Apache Kafka** is a distributed event store and stream processing platform designed for high-throughput log ingestion.

### ⚖️ THE LOGICAL DECISION
Use Kafka partitions to scale event streams across multiple worker microservices.

### ⚙️ HOW (Implementation Code)
```bash
# Create a Kafka topic with 3 partitions and replication factor 2:
kafka-topics.sh --create --topic user-events --partitions 3 --replication-factor 2 --bootstrap-server localhost:9092
```
