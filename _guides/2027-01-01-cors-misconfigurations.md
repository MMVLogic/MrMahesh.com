---
title: "CORS Security: Preventing Cross-Origin Exploits"
layout: default
category: "Cybersecurity"
date: 2027-01-01
tags:
  - security
  - web
  - api
status: "Published"
challenge: "Why is setting `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` dangerous on authenticated APIs? Wildcard origins with credentials allow malicious external websites to make authenticated AJAX requests on behalf of logged-in users and steal private data."
answer: "**CORS (Cross-Origin Resource Sharing)** is a browser mechanism that restricts how resources on a web page can be requested from another domain."
---

### 💡 WHY (The Concept)
**CORS (Cross-Origin Resource Sharing)** is a browser mechanism that restricts how resources on a web page can be requested from another domain.

### ⚖️ THE LOGICAL DECISION
Always whitelist specific, trusted origin domains (`https://mrmahesh.com`) instead of reflecting arbitrary `Origin` request headers.

### ⚙️ HOW (Implementation Code)
```javascript
// Secure CORS Origin Whitelist (Express.js)
const allowedOrigins = ['https://mrmahesh.com', 'https://cms.mrmahesh.com'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
});
```
