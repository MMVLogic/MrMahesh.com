---
title: "Wireshark TLS Decryption with SSLKEYLOGFILE"
layout: default
category: "Cybersecurity"
date: 2027-02-26
tags:
  - security
  - wireshark
  - ssl
status: "Published"
challenge: "How do you inspect the decrypted HTTPS payloads of your local browser in Wireshark without breaking TLS certificates? Set the `SSLKEYLOGFILE` environment variable in Chrome or Firefox. Point Wireshark to that key log file to decrypt and inspect all TLS sessions in plain text."
answer: "**SSLKEYLOGFILE** logs client TLS session keys generated during handshakes, allowing packet analyzers to decrypt traffic non-invasively."
---

### 💡 WHY (The Concept)
**SSLKEYLOGFILE** logs client TLS session keys generated during handshakes, allowing packet analyzers to decrypt traffic non-invasively.

### ⚖️ THE LOGICAL DECISION
Use `SSLKEYLOGFILE` to debug encrypted REST APIs and WebSocket streams.

### ⚙️ HOW (Implementation Code)
```bash
# Launch Chrome with TLS session key logging:
export SSLKEYLOGFILE=~/.ssl-keys.log
open -a "Google Chrome"

# In Wireshark: Preferences > Protocols > TLS > (Pre)-Master-Secret log filename -> ~/.ssl-keys.log
```
