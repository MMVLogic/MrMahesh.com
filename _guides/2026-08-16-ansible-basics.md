---
title: "Ansible Basics: Infrastructure as Code (IaC)"
layout: default
category: "DevOps"
date: 2026-08-16
tags:
  - ansible
  - devops
  - automation
status: "Published"
challenge: "What key feature of Ansible playbooks ensures that running a script multiple times will not make unwanted changes if the system is already configured correctly?"
answer: "**Idempotency**. Ansible tasks are designed to check the system state first and only make updates if the current state doesn't match the desired state."
---

### 💡 WHY (The Concept)
Configuring three servers by SSHing into each, running `apt-get install`, updating configuration files, and starting services manually is tedious. If you rebuild a server, you have to remember every command you ran. **Infrastructure as Code (IaC)** solves this by letting you describe your server configuration in simple text files. **Ansible** reads these files and runs the commands for you over SSH automatically.

### ⚖️ THE LOGICAL DECISION
Rather than custom bash scripts (which can break if they run twice), the AI implements Ansible. Ansible is **idempotent**, meaning you can run the script ten times, and it will only apply changes that haven't been completed yet, keeping system configurations consistent.

### ⚙️ HOW (Implementation Code)
#### 1. Defining your Inventory (`/etc/ansible/hosts`):
```ini
[webservers]
192.168.1.100
192.168.1.101
```

#### 2. Writing a simple configuration Playbook (`setup.yml`):
```yaml
---
- name: Configure Web Servers
  hosts: webservers
  become: yes  # Run commands with sudo permissions
  tasks:
    - name: Ensure Apache is installed
      apt:
        name: apache2
        state: present

    - name: Copy index html file to targets
      copy:
        src: ./local_index.html
        dest: /var/www/html/index.html
        owner: www-data
        group: www-data
        mode: '0644'

    - name: Start and enable Apache service
      service:
        name: apache2
        state: started
        enabled: yes
```

#### 3. Running the Playbook:
```bash
# Execute the playbook on all targeted hosts
ansible-playbook setup.yml
```
