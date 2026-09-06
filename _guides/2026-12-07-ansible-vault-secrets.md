---
title: "Ansible Vault: Encrypting Passwords & Keys"
layout: default
category: "Cybersecurity"
date: 2026-12-07
tags:
  - ansible
  - security
  - devops
status: "Published"
challenge: "How do you run an Ansible playbook that contains encrypted Ansible Vault variables? Pass the `--ask-vault-pass` flag or `--vault-password-file ~/.vault_pass`."
answer: "**Ansible Vault** encrypts sensitive variables and entire YAML files with AES-256, allowing you to safely store configuration secrets in version control."
---

### 💡 WHY (The Concept)
**Ansible Vault** encrypts sensitive variables and entire YAML files with AES-256, allowing you to safely store configuration secrets in version control.

### ⚖️ THE LOGICAL DECISION
Never store raw server passwords in plain text playbooks; encrypt variable files with Ansible Vault.

### ⚙️ HOW (Implementation Code)
```bash
# 1. Encrypt a sensitive variables file:
ansible-vault encrypt group_vars/all/vault.yml

# 2. View or edit encrypted variables in-place:
ansible-vault edit group_vars/all/vault.yml

# 3. Run playbook with password prompt:
ansible-playbook -i hosts site.yml --ask-vault-pass
```
