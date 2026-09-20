---
title: "Distributed Consensus: How etcd Uses the Raft Protocol"
layout: default
category: "DevOps"
date: 2027-02-04
tags:
  - etcd
  - kubernetes
  - clustering
status: "Published"
challenge: "Why must an etcd cluster ALWAYS contain an odd number of nodes (3, 5, 7)? Raft consensus requires a strict majority **Quorum** ($N/2 + 1$) to elect leaders and commit writes. A 3-node cluster can survive 1 failure ($3/2 + 1 = 2$). A 4-node cluster also requires 3 nodes for quorum, adding hardware without improving fault tolerance."
answer: "**etcd** is the distributed, reliable key-value store that holds the entire configuration state of every Kubernetes cluster."
---

### 💡 WHY (The Concept)
**etcd** is the distributed, reliable key-value store that holds the entire configuration state of every Kubernetes cluster.

### ⚖️ THE LOGICAL DECISION
Maintain 3-node etcd topologies to guarantee quorum survivability during server maintenance.

### ⚙️ HOW (Implementation Code)
```bash
# Check etcd cluster health and member list:
etcdctl endpoint health --write-out=table
etcdctl member list
```
