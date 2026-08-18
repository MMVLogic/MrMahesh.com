---
title: "Linux File Permissions Demystified (chmod & chown)"
layout: default
category: "DevOps"
date: 2026-08-10
tags:
  - linux
  - permissions
  - command-line
status: "Published"
challenge: "What permission values does the command `chmod 755 script.sh` apply to the file for User, Group, and Others?"
answer: "It grants:\n* **User (7)**: Read, Write, and Execute (rwx)\n* **Group (5)**: Read and Execute (r-x)\n* **Others (5)**: Read and Execute (r-x)"
---

### 💡 WHY (The Concept)
Linux is a multi-user operating system. Without strict access controls, any application could read your private keys or hijack system files. Permissions are divided into three groups: **Owner** (User), **Group**, and **Others** (anyone else). Each group has combinations of **Read** (4), **Write** (2), and **Execute** (1).

### ⚖️ THE LOGICAL DECISION
When deploying web servers or services like Nginx/Caddy, you must ensure that sensitive credentials (like SSL private keys or `.env` files) cannot be read by other system services. The AI recommends tightening permissions to `600` (owner-read/write only) for configuration files, and using `chown` to bind file ownership to specific system users.

### ⚙️ HOW (Implementation Code)
#### 1. Restricting SSH Private Key Permissions:
```bash
# Secure the SSH key so only the owner can read or write it
chmod 600 ~/.ssh/id_rsa
```

#### 2. Changing Folder Ownership for Web Apps:
```bash
# Set folder owner and group to 'www-data' recursively
sudo chown -R www-data:www-data /var/www/html
```

#### 3. Setting Execution Permissions:
```bash
# Allow the owner to execute the shell script, keeping it read/write for them
chmod 744 setup_script.sh
```
* **`7 (r+w+x)`**: User can read, write, and execute.
* **`4 (r)`**: Group can only read.
* **`4 (r)`**: Others can only read.
