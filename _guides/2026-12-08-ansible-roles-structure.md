---
title: "Structuring Large Automation Projects with Ansible Roles"
layout: default
category: "DevOps"
date: 2026-12-08
tags:
  - ansible
  - automation
status: "Published"
challenge: "What directory in an Ansible Role contains the main execution tasks? `tasks/main.yml`"
answer: "**Ansible Roles** provide a standard directory structure (`tasks`, `handlers`, `vars`, `defaults`, `templates`) to decompose massive playbooks into reusable components."
---

### 💡 WHY (The Concept)
**Ansible Roles** provide a standard directory structure (`tasks`, `handlers`, `vars`, `defaults`, `templates`) to decompose massive playbooks into reusable components.

### ⚖️ THE LOGICAL DECISION
Use roles (e.g. `roles/docker`, `roles/k8s`, `roles/security`) for modular server configuration.

### ⚙️ HOW (Implementation Code)
```text
roles/docker/
├── defaults/main.yml  # Overridable default variables
├── handlers/main.yml  # Restart service handlers
├── tasks/main.yml     # Core installation commands
└── templates/daemon.json.j2 # Jinja2 configuration template
```
