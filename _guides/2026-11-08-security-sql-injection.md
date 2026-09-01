---
title: "SQL Injection (SQLi) & Parameterized Queries"
layout: default
category: "Cybersecurity"
date: 2026-11-08
tags:
  - security
  - database
status: "Published"
challenge: "Why do Parameterized Statements (Prepared Queries) completely prevent SQL Injection attacks?"
answer: "They separate SQL command logic from user data. The database treats user input strictly as literal values, never interpreting input characters (like `' OR 1=1--`) as executable SQL syntax."
---

### 💡 WHY (The Concept)
**SQL Injection** happens when user input is concatenated directly into SQL query strings, allowing attackers to bypass authentication or dump entire database tables.

### ⚖️ THE LOGICAL DECISION
Never use string concatenation (`SELECT * FROM users WHERE user = '" + input + "'`). Always use parameterized queries (`SELECT * FROM users WHERE user = ?`).

### ⚙️ HOW (Implementation Code)
```javascript
// VULNERABLE TO SQLi:
// db.query("SELECT * FROM users WHERE user = '" + req.body.user + "'");

// SECURE PARAMETERIZED QUERY:
db.get("SELECT * FROM users WHERE user = ?", [req.body.user], (err, row) => {
    // Database treats req.body.user strictly as a string value
});
```
