---
title: "Finding Slow Queries with PostgreSQL pg_stat_statements"
layout: default
category: "DevOps"
date: 2027-02-22
tags:
  - postgres
  - database
  - performance
status: "Published"
challenge: "What PostgreSQL extension records execution statistics (total time, call count, buffer hits) for all SQL queries executed on the database? **`pg_stat_statements`**"
answer: "`pg_stat_statements` normalizes query parameters (e.g. `WHERE id = ?`) and aggregates runtime metrics, identifying the top 5 queries causing 80% of database CPU load."
---

### 💡 WHY (The Concept)
`pg_stat_statements` normalizes query parameters (e.g. `WHERE id = ?`) and aggregates runtime metrics, identifying the top 5 queries causing 80% of database CPU load.

### ⚖️ THE LOGICAL DECISION
Enable `pg_stat_statements` in `postgresql.conf` across all database servers.

### ⚙️ HOW (Implementation Code)
```sql
-- Find top 5 queries consuming the most cumulative execution time
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```
