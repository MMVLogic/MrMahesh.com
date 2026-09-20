---
title: "GraphQL Security: Query Depth Limiting & Cost Analysis"
layout: default
category: "Cybersecurity"
date: 2027-02-24
tags:
  - security
  - api
  - web
status: "Published"
challenge: "How can an attacker trigger a Denial of Service (DoS) attack on a GraphQL server using circular nested queries? By crafting a deeply nested circular query (e.g. `author { books { author { books { ... } } } }`), forcing the server to execute thousands of recursive database queries."
answer: "**Query Depth Limiting** rejects incoming GraphQL queries that exceed a maximum nesting depth (e.g. max depth 5)."
---

### 💡 WHY (The Concept)
**Query Depth Limiting** rejects incoming GraphQL queries that exceed a maximum nesting depth (e.g. max depth 5).

### ⚖️ THE LOGICAL DECISION
Configure query complexity and depth analyzers in Apollo Server / Express GraphQL backends.

### ⚙️ HOW (Implementation Code)
```javascript
const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(5)] // Reject queries deeper than 5 levels
});
```
