---
title: "Cross-Site Scripting (XSS): Attacks & Defenses"
layout: default
category: "Cybersecurity"
date: 2026-11-07
tags:
  - security
  - web
status: "Published"
challenge: "What is the difference between Stored XSS and Reflected XSS?"
answer: "**Stored XSS** saves malicious JavaScript permanently into a database (affecting every visitor who views the page); **Reflected XSS** reflects malicious script payload off a URL parameter in a single request."
---

### 💡 WHY (The Concept)
**XSS** occurs when a web application outputs untrusted user input directly into HTML without sanitizing or escaping it, allowing attackers to execute JavaScript in the victim's browser and steal session cookies.

### ⚖️ THE LOGICAL DECISION
Always escape HTML special characters (`<`, `>`, `&`, `"`, `'`) before outputting user input, and set `HttpOnly` on session cookies so JavaScript cannot read them.

### ⚙️ HOW (Implementation Code)
```javascript
// Safe HTML Escaping Function
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}
```
