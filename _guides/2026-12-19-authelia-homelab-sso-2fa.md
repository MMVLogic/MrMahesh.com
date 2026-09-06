---
title: "Authelia: Single Sign-On (SSO) & 2FA for Homelabs"
layout: default
category: "Cybersecurity"
date: 2026-12-19
tags:
  - security
  - auth
  - homelab
status: "Published"
challenge: "How does Authelia protect unauthenticated self-hosted apps behind a reverse proxy? The reverse proxy (Nginx/Traefik) intercepts all incoming requests and forwards authentication sub-requests to Authelia (`auth_request /api/verify`)."
answer: "**Authelia** is an open-source authentication server providing Single Sign-On (SSO) and Two-Factor Authentication (Duo, TOTP, FIDO2 WebAuthn keys)."
---

### 💡 WHY (The Concept)
**Authelia** is an open-source authentication server providing Single Sign-On (SSO) and Two-Factor Authentication (Duo, TOTP, FIDO2 WebAuthn keys).

### ⚖️ THE LOGICAL DECISION
Place all admin tools (Portainer, qBittorrent, Grafana) behind Authelia 2FA gatekeeping.

### ⚙️ HOW (Implementation Code)
```yaml
# Traefik ForwardAuth Middleware
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: authelia-auth
spec:
  forwardAuth:
    address: http://authelia:9091/api/verify?rd=https://auth.mrmahesh.com
    trustForwardHeader: true
```
