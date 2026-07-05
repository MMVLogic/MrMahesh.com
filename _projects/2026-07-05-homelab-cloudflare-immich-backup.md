---
title: "Homelab Evolution: Securing Remote Access with Cloudflare Tunnels & Redundant Storage"
layout: project_post
status: Complete
tags:
  - Homelab
  - Kubernetes
  - Cloudflare
  - Tailscale
  - Immich
  - Storage
  - AI-Assisted
key_focus:
  - Infrastructure
  - Network-Security
  - Container-Orchestration
  - Storage-Redundancy
  - AI-Debugging
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: The Machinist's View of a Private Cloud**

I’m a CNC Machinist by day and a self-taught homelab builder by night. I don't consider myself a professional IT wizard who has memorized every Linux man page or network protocol. I’m a **problem solver**. On the factory floor, if a machine stops running, you don't sit around reading theoretical manuals for weeks—you find the bottleneck, leverage your tools, and get the spindle spinning again. 

I treat my homelab with the exact same philosophy. When I set out to build a secure, redundant private cloud to host my family's image vault using **Immich**, I didn't want a fragile toy. I wanted a production-grade factory. And when I hit roadblocks—like database corruption, container memory starvation, or secure remote routing—I didn't tackle them alone. I used **AI (Gemini CLI)** as a strategic partner to debug, troubleshoot, and get results fast. 

Here is how my "Frankenstein" cluster is architected, how I secured the front gate using **Cloudflare Tunnels**, and how my redundant storage setup keeps our memories safe.

---

## **The Hardware & Orchestration: Building the Factory Floor**

Instead of renting expensive, public cloud space, my cluster runs entirely on recycled consumer hardware. It’s a distributed brain built from old laptops and a desktop PC:
- **Dell Latitude E5450** (Ubuntu Server 24.04 LTS)
- **HP ProBook 640 G1** (Ubuntu Server 24.04 LTS)
- **H97M-XA Desktop PC** (Ubuntu Server 24.04 LTS)

Using **Ansible**, I automated the baseline server configuration (such as disabling laptop lid sleep settings) and deployed **MicroK8s** to run containerized services. To prevent a "split-brain" disaster, all three nodes act as masters to maintain **Quorum**—ensuring the cluster stays online even if one laptop is suddenly shut down or unplugged.

<figure class="project-post-figure">
  <img src="/assets/Screenshot03.png" alt="A physical view of the homelab Battle-Station with HP ProBook and Dell Latitude laptops sitting next to the desktop tower.">
  <figcaption>
    The "Frankenstein" Cluster: HP ProBook, Dell Latitude, and H97M-XA desktop. Recycled consumer hardware turned into a high-availability Kubernetes cluster.
  </figcaption>
</figure>

---

## **The Gateways: Front Door (Cloudflare) vs. Back Door (Tailscale)**

Accessing my services from outside my house was the first major hurdle. Traditionally, you'd open ports on your home router and configure Dynamic DNS. But poking holes in your home firewall is a security nightmare.

Instead, I implemented a dual-gateway system:

### 1. The Secure Back Door: Tailscale
For administrative access (SSH, `kubectl`, managing Ceph), I use **Tailscale**. It builds a peer-to-peer Zero Trust mesh VPN in seconds. No router configuration is required. When I’m away from home, Tailscale makes my MacBook feel like it's plugged directly into the local server switch.

### 2. The Polished Front Door: Cloudflare Tunnels
While Tailscale is perfect for me, I can't ask my family members to install a VPN client just to view their photos on Immich. I needed a public "front door."

I deployed a **Cloudflare Tunnel (`cloudflared`)** inside my Kubernetes cluster. Here's how it works:
1. The `cloudflared` daemon running inside my cluster establishes an encrypted outbound connection to Cloudflare's nearest edge server.
2. Cloudflare routes public requests for `photos.mrmahesh.com` directly through this secure tunnel into the cluster's internal Ingress controller.
3. **The result:** I get a fully public, HTTPS-secured endpoint without opening a single port on my home router. All traffic is proxied through Cloudflare, shielding my home IP address from the public internet.

---

## **The Storage Engine: Redundancy, Speed, and 1:1 Backups**

Resilient storage is the heart of a photo vault. I built the storage backend using **Rook-Ceph** to aggregate hard drive space across all nodes into a unified, self-healing pool.

To balance speed and capacity without spending a fortune, I designed a hybrid storage strategy:

| Component | Storage Type | Details |
|---|---|---|
| **Database & Cache** | Fast SSDs | PostgreSQL and Valkey queues run on SSDs to ensure rapid UI rendering and fast photo queries. |
| **Media Library** | High-Capacity HDDs | The raw photos and videos are stored in a distributed Ceph pool running on mechanical HDDs (cheap capacity). |
| **1:1 Backup** | Independent SSD | A cron-triggered mirroring script replicates the entire HDD media pool to an independent SSD storage system daily. |

If a mechanical HDD in the Ceph pool fails, the cluster automatically reconstructs the data on the remaining active drives. If the entire main storage pool experiences a catastrophic failure, the independent **1:1 SSD backup** ensures that not a single photo is lost.

<figure class="project-post-figure">
  <img src="/assets/Screenshot08.png" alt="Immich Stats Dashboard showing photos, videos, storage space used, and server online status.">
  <figcaption>
    The Immich Admin Dashboard showing server health and active storage utilization across the cluster.
  </figcaption>
</figure>

---

## **Debugging the Gauntlet: How AI Kept Me Moving**

Self-hosting complex applications like Immich on Kubernetes is a trial by YAML. I ran into several major technical roadblocks that would have taken days to solve manually, but I used AI as a debugging partner to identify the root cause in minutes:

### 1. The Valkey Crash Loop (RAM Starvation)
While uploading a large batch of photos, my Valkey (redis) cache container fell into a death loop of 230 restarts. 
* **The Issue:** I had set the container memory limits too low (192MB), starving the database when processing heavy workloads.
* **The AI Fix:** I ran `kubectl describe pod` on the failing instance, fed the configuration to my AI assistant, and got the immediate solution: apply a memory patch to increase the limit to 512MB to give Valkey room to breathe.

### 2. Corrupted Append-Only Files (AOF)
A sudden power loss left a "broken sentence" in the database logbook, preventing the database from booting.
* **The AI Fix:** Instead of attempting complex database file surgery, my AI co-pilot suggested utilizing the nature of our distributed system: wipe the local data of the corrupted replica. Like a lizard regrowing a tail, the fresh pod synced with the primary master node and instantly turned healthy.

### 3. Kubernetes Finalizer Deadlocks
While trying to delete a corrupted storage volume, the terminal hung indefinitely.
* **The Issue:** A Kubernetes safety feature (a finalizer) was protecting a disk because it was still technically linked to a stuck pod.
* **The AI Fix:** The AI walked me through executing a force-delete patch on the pod itself, breaking the deadlock and clearing the path for volume recreation.

---

## **How You Can Do the Same: A Roadmap for Tinkerers**

If you want to build a similar secure private cloud, don't let the complexity intimidate you. You don't need to be a systems architect. Here is the step-by-step path:

1. **Start Small:** Gather a couple of old PCs or laptops. Install Ubuntu Server.
2. **Automate the Setup:** Use Ansible to configure the nodes. It saves you from SSHing into each machine individually to run the same commands.
3. **Use Tailscale First:** Establish secure access before you do anything else. It's free, takes minutes, and secures your workspace.
4. **Deploy a Lightweight K8s:** MicroK8s or K3s are perfect for learning container orchestration without the overhead of enterprise setups.
5. **Add Cloudflare Tunnels:** Use a free Cloudflare account to proxy your web services to the public. It handles SSL certificates and routing automatically.
6. **Partner with AI:** Don't get discouraged by error logs. Treat terminal errors as prompts, explain your setup to your AI, and focus on the results.

Building a homelab is a journey of continuous troubleshooting. Every broken pipe is just an invitation to understand your system better. Back to the terminal!
