---
title: "Building a Custom CMS: From an rm -rf Debacle to Secure SQLite Authentication"
layout: project_post
status: Complete
tags:
  - Node.js
  - Express
  - Security
  - SQLite
  - Jekyll
  - Custom-CMS
key_focus:
  - Backend-Development
  - Database-Design
  - Password-Hashing
  - Session-Management
  - Disaster-Recovery
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: Why Build a Homegrown CMS?**

As a CNC Machinist by day and a DevOps hobbyist by night, my main goal for this website was simple: write about my homelab adventures. But publishing a new post was a manual grind—formatting markdown, copying files via FTP, and pushing updates. I needed a Content Management System (CMS) to write and publish from a clean web interface.

Naturally, the first suggestion from AI was to use an established solution like Netlify CMS. But I quickly ran into a wall. Using pre-built tools often means spending all your time figuring out *their* proprietary configuration files, schemas, and quirks. If the tool updates, your setup breaks, and your knowledge becomes obsolete.

I wanted to learn core industry standards, not a specific tool's configurations. So I decided to build a custom, minimalist CMS backend using **Node.js, Express, and SQLite3**, integrated directly with my Jekyll frontend.

Then, during a routine code clean-up, I fumbled a terminal command and deleted the entire project. Here is the story of the disaster, the rebuild, and the security architecture of my custom CMS.

---

## **The War Story: The `rm -rf` Debacle**

It was a late night, and I was running a clean-up script to wipe history from my repository. I wanted to recursively delete a `.git` subfolder in my directory. The command was supposed to target `mrmahesh.com/.git`.

Instead, my fingers fumbled, and the terminal executed:
```bash
rm -rf mrmahesh
```

When you drag a file to the desktop trash bin, you get a safety net. When you execute `rm -rf` (remove recursively and forcefully) in a Linux terminal, the operating system does exactly what it's told. The file system deletes the directory entry, and the pointers are wiped. 

In a fraction of a second, the entire project—months of code, CMS backend scripts, custom styling, database configs—evaporated.

### **The Recovery**
After a brief moment of panic, I realized the power of version control. The last committed version of the site was safely hosted on my remote GitHub repository. 
I ran:
```bash
git clone git@github.com:MMVLogic/MrMahesh.com.git
```

I was back online in minutes. But because the CMS was in an early, raw prototype state when it was wiped, I decided not to just restore it, but to rebuild it from the ground up to be more secure, robust, and structured.

<figure class="project-post-figure">
  <img src="/assets/Screenshot01.png" alt="A macOS desktop showing the Custom CMS Markdown editor on the left and a terminal window with a Gemini plan on the right.">
  <figcaption>
    My local development workspace: editing the custom CMS backend on the left, with the AI-generated project logs open in the terminal on the right.
  </figcaption>
</figure>

---

## **The CMS Architecture**

The system is split into two clean components: a lightweight Express backend and a Bootstrap frontend dashboard.

```
+-----------------------------------+
|       Bootstrap 5 Frontend        |
|  (SPA, Markdown Editor, Preview)  |
+-----------------+-----------------+
                  | (JSON API)
                  v
+-----------------+-----------------+
|      Node.js + Express API        |
|   (Auth, File I/O, Preview API)   |
+-----------------+-----------------+
                  | (Read/Write)
                  v
+-----------------+-----------------+
|   Local Filesystem & SQLite3      |
|  (_projects/, _posts/, cms.db)    |
+-----------------------------------+
```

### **1. The Express API Backend**
The backend is a Node.js server running Express. It serves two primary roles:
- **File Management:** It exposes REST endpoints (`GET`, `POST`, `DELETE`) to read and write markdown files directly in the Jekyll `_projects/` and `_posts/` directories.
- **Markdown Parsing:** It runs the `marked` library to render markdown text into clean HTML dynamically for the editor's live preview tab.

### **2. The Bootstrap 5 Frontend**
The editor is a Single Page Application (SPA) styled with Bootstrap. It features:
- A directory browser showing all posts and projects.
- A split-screen Markdown editor.
- A live preview pane.
- Frontmatter parser logic that separates YAML frontmatter from the markdown content body so you can edit tags and status badges in form fields.

---

## **Security Overhaul: Moving Beyond Plaintext**

In my first prototype, the login username and password were hardcoded in plaintext. But the moment you push code to GitHub, plaintext credentials are a glaring vulnerability. During the rebuild, I implemented proper security best practices:

### **1. Hashing and Salting with Bcrypt**
Storing passwords in plaintext, or even using simple hashes like MD5, leaves your database vulnerable to rainbow table attacks. Instead, my SQLite database stores passwords processed by **bcrypt**:
- **Salting:** When a user is created, a unique, random string (the salt) is generated.
- **Hashing:** The salt is combined with the plaintext password, and run through a one-way hashing function multiple times.
- **Verification:** During login, the database retrieves the stored hash, extracts the salt, hashes the entered password with that salt, and verifies if the hashes match.

### **2. Session Security with JWT & HttpOnly Cookies**
To manage user sessions without requiring database checks on every request, I implemented **JSON Web Tokens (JWT)**:
- After a successful login, the server signs a JWT containing the user's metadata.
- This token is sent back to the client inside an **HttpOnly cookie**. 
- **Why HttpOnly?** Setting the `httpOnly: true` flag prevents client-side JavaScript from accessing the cookie. This shields the session token from Cross-Site Scripting (XSS) attacks.

---

## **Local Integration & The Jekyll Poll Issue**

The last hurdle was making the local frontend and backend work together. The Jekyll site runs on port `4000`, while the Node.js CMS API runs on port `3000`. 

To prevent browsers from blocking communication due to security constraints, I configured **CORS (Cross-Origin Resource Sharing)** in my Express app:
```javascript
app.use(cors({
  origin: ['http://localhost:4000', 'http://localhost:3000'],
  credentials: true
}));
```

### **The Jekyll Rebuild Bug**
During testing, I noticed that saving a markdown file in the CMS didn't trigger Jekyll to rebuild the static site. Jekyll was watching the directory, but the filesystem notifications from the Node.js writer weren't registering.
- **The Solution:** Restarting the Jekyll server with the `--force_polling` flag forces Jekyll to scan the directory for changes manually at set intervals, rather than relying on filesystem events.

---

## **Key Lessons Learned**

1. **Fail Fast, Rebuild Better:** Losing my code to `rm -rf` was frustrating, but the rebuild forced me to clean up technical debt, implement proper SQLite databases, and secure my authentication flows.
2. **Git is Your Lifejacket:** Commit early, commit often. Never leave uncommitted experimental work lying around without a branch.
3. **Avoid Tool Bloat:** Building a custom Express server with less than 250 lines of code gave me a faster, more configurable CMS than fighting third-party tools for weeks.

The CMS is currently running smoothly in my local homelab environment, serving as the primary control panel for publishing the post you are reading right now!
