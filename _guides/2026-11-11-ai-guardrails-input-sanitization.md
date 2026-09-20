---
title: "AI Security: Input Sanitization & Guardrails"
layout: default
category: "Cybersecurity"
date: 2026-11-11
tags:
  - ai
  - security
status: "Published"
challenge: "Why should AI output never be piped directly into `eval()` or a bash shell execution tool without strict schema validation?"
answer: "If an LLM is tricked into generating malicious shell commands, piping raw output executes the attacker's payload directly on the host server."
---

### 💡 WHY (The Concept)
AI agents require strict input and output guardrails. Redact Personally Identifiable Information (PII) before LLM submission, and enforce structured JSON schemas on all tool call responses.

### ⚖️ THE LOGICAL DECISION
Use schema validators (like Pydantic or JSONSchema) to enforce deterministic argument formats before executing agent actions.

### ⚙️ HOW (Implementation Code)
```python
import re

def sanitize_ai_prompt(prompt):
    # Redact potential API keys
    prompt = re.sub(r'AIzaSy[a-zA-Z0-9_\-]{35}', '[REDACTED_API_KEY]', prompt)
    # Redact private SSH keys
    prompt = re.sub(r'-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----', '[REDACTED_KEY]', prompt)
    return prompt
```
