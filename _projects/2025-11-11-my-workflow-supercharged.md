---
title: All about MrMahesh.com
layout: project_post
status: In Progress
tags: Gemini-CLI, workflow, Automation, CI/CD
---

* auto-gen TOC:
{:toc}
<br>
## **My Workflow Supercharged:** How Gemini CLI Revolutionized My Vibe Coding
<sub>November 11, 2025</sub>
<br>

I don't consider myself a traditional coder who builds or knows everything to build from scratch. I like to be the orchestrator, the one who has the vision and directs the tools to bring it to life. For a while, my process for building this website was anything but grave. It was a slow, boring, and manual grind.

It started with an idea and a conversation with the Gemini web chat. I'd get a block of code, copy it into VS Code, make some minor changes, and then manually upload the files to my server. Every single change, no matter how small, required the same tedious process. It was a workflow that killed momentum and pushed creative ideas to "tomorrow."

Then, everything changed. I stumbled upon a Network Chuck video about running Gemini directly in the terminal. This wasn't just a small improvement; it was a paradigm shift.

This is what I call "supercharged vibe coding."

My new workflow is built on a simple philosophy: **the best way to learn quickly is to fail fast.** The Gemini CLI, combined with Git, has become the engine for this philosophy. Now, I can have an idea, conceptualize it, prototype it, deploy it, test it, find the issues, and repair them at a speed I never thought possible. The frustration is gone, replaced by a dopamine rush that has me coding at 1 AM, excited to build out my homelab and website through the night.

My process is a continuous loop:

1.  **Local Changes:** I make changes to the site on my local machine.
2.  **Local Preview:** I run a local Jekyll server to see how it looks and feels.
3.  **Push to Git:** Once I like what I see, I ask my Gemini agent to commit and push the code to GitHub.
4.  **Automated Checks & Deployment:** A GitHub Actions workflow automatically tests the build. If everything is working as it should, it deploys the site directly to my hosting server.

Of course, sometimes things don't go as planned. A build fails, and an error pops up. But that's no longer a roadblock. I copied the error log, pasted it into my Gemini-CLI, and asked, "What's happening here?" Most of the time, it's something silly that gets solved right there and then.

It hasn't all been smooth sailing. I hit a major wall when I tried to implement a web-based Content Management System (CMS) so I could write posts from a web interface. I spent a lot of time with my agent trying to figure out why it wouldn't work. I still suspect it has to do with the limitations of my basic hosting plan, but it was a valuable lesson in understanding the boundaries of my environment. We also wrestled with a search bar that initially appeared on every page before we managed to isolate it to just the projects page.

Each challenge, however, is just another lap in this rapid-fire learning cycle. With an AI system that can keep up with my ideas, I'm no longer just a user—I'm an orchestrator, turning concepts into reality at the speed of thought.

Alright, the dopamine is wearing off, and my bed is calling. It's time to sign off.
<br>
## 🚀 **My Journey from Blog Post Headache to a Homemade CMS:** Embracing the "Good Enough" Solution
<sub>November 19, 2025</sub>
<br>

Hey everyone!
If you've been following my little corner of the internet, you know this site's main mission is simple: to share my IT adventures and homelab hiccups. I'm a firm believer in documenting the real process—thoughts, actions, and especially the mistakes and fixes. Lately, I've had to press the pause button on my actual homelab projects, and here’s why: I needed to make the process of uploading these write-ups as easy as humanly possible.

### **The "Before": A CMS Nightmare**
My core issue is that I’m a CNC Machinist by day and a wannabe DevOps engineer by night, not a professional website builder! I don't have the time—or the patience—to dive down endless rabbit holes to figure out simple tasks.

### **The Initial Plan (and Why it Failed)**
My original thought, bless its naive heart, was to just use an existing solution. The first suggestion, courtesy of Gemini, was to explore Netlify CMS.

**🤦‍♂️ The Problem:** 
It was the same reason I prefer using gemini-cli to design my site over a drag-and-drop builder: I don't want to spend my precious few hours of "night-shift" learning concepts I might only use once or twice. When I'm forced to use a pre-built tool, I end up spending all my time asking an AI how to make that specific software do what I want. That time could be spent on my actual projects! Plus, what if the software gets a new version? My trusty AI might not even know the new commands yet.
For me, the best way to work is asking Gemini for how to do something according to industry standards, then I choose the path, and finally, I write a script for repeated tasks.

### **The Pivot to "Good Enough": My Hand-Curated CMS**
Failing to get Netlify to work in a way that didn't feel like a time-suck, I decided the solution had to be homegrown and minimalist. I needed something that let me spend 90% of my time writing the post and 10% on publishing it.
I didn't create a CMS—I curated one. It’s a simple system that logs into my admin dashboard, where I can manage existing posts and draft new ones. Since all the webpage design is stored in a layouts folder, every new post automatically gets the same look, even if I publish a thousand of them! My job is now just to focus on the Markdown.

### **Building Security: A Tangent on Hashing and Salt**
My first version had the username and password stored in plain text. It was only running on my private server, but the moment I thought, "What if this gets pushed to Git?" I spiraled into a new learning rabbit hole (a fun one this time!).

Here is my simplified, amateur-level understanding of what I implemented:
• Before: username: password (😱)
• After: The Magic of Hashing and Salt
1. When I set my password, a unique, random salt is generated.
2. The salt is combined with my password, and the resulting mess is turned into a one-way hash (using bcrypt). This hash (which includes the salt) is what gets saved.
3. When I log in, the system grabs the stored salt from the hash, combines it with my entered password, and re-hashes it.
4. If the new hash matches the stored hash, I'm authenticated! Sprinkling that salt makes a massive difference in preventing dictionary attacks.

I also set up JSON Web Tokens (JWT) for session management. Now, once I'm logged in, that token handles subsequent requests, so I don't have to keep re-entering credentials. It all runs off a single .env file since I'm the only user. Simple, secure (enough!), and effective.

### **The Final Messy Lesson (and a Reminder about CI/CD)**
After all that security work, I made a classic mistake: I forgot to add the .env file to my .gitignore list. 🤦‍♂️ That's the beauty and the curse of a CI/CD pipeline—it lets you roll back mistakes, but anyone can also go into your old workflow runs to see past errors.

So, tonight’s agenda includes running BFG Repo-Cleaner to wipe the old repository's history clean.

It's been a long night of coding and fixing my own mistakes. Being a CNC machinist by day and trying to be a DevOps engineer by night is exhausting. I’m certainly not cash-loaded like Bruce Wayne to be a vigilante all night, but every little solved problem feels like a small win!

See you in the next post (which, thankfully, will be much easier to write and publish!).

And I'm back at square one, I accidently removed my root directory I was working from, so thanks to rm -rf mrmahesh I had to edit and commit directly on github repo mobile app- why the app? because I'm at my day job and I'm surprised how much you can get done on this app. 
