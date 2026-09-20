---
title: "Ansible Idempotency: Writing Re-runnable Automation"
layout: default
category: "DevOps"
date: 2027-02-25
tags:
  - ansible
  - devops
  - automation
status: "Published"
challenge: "What does it mean for an Ansible playbook to be strictly Idempotent? Running the playbook 10 times in a row produces the exact same system state as running it once, making 0 changes (`changed: 0`) on subsequent runs if the system is already configured correctly."
answer: "**Idempotency** guarantees automation safety. Avoid using raw `shell:` or `command:` modules without `creates:` or `changed_when:` guards."
---

### 💡 WHY (The Concept)
**Idempotency** guarantees automation safety. Avoid using raw `shell:` or `command:` modules without `creates:` or `changed_when:` guards.

### ⚖️ THE LOGICAL DECISION
Use native Ansible modules (`apt`, `copy`, `systemd`) instead of shell scripts to preserve idempotency.

### ⚙️ HOW (Implementation Code)
```yaml
# Idempotent task: copies file only if checksum changed
- name: Deploy custom Nginx config
  ansible.builtin.template:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Reload Nginx
```
