---
title: "Local DNS Routing with Pi-hole / AdGuard Home"
layout: default
category: "Homelab"
date: 2026-08-17
tags:
  - dns
  - homelab
  - pihole
status: "Published"
challenge: "If you change a local DNS record, why do devices sometimes still resolve the old IP address for a few minutes?"
answer: "Because of **DNS Caching**. The operating system and web browser cache DNS records locally based on the TTL (Time To Live) value of the record. You can clear this by running `ipconfig /flushdns` on Windows or flushing browser DNS caches."
---

### 💡 WHY (The Concept)
When you type a domain (like `google.com`), your computer asks a **DNS (Domain Name System)** server to convert it into a machine-readable IP address (like `142.250.190.46`). In a homelab, you don’t want to type `http://192.168.1.10:3000` to load your services. Setting up a local DNS server like **Pi-hole** or **AdGuard Home** lets you intercept DNS queries, block ad domains, and map custom domain names (like `cms.mrmahesh.com`) directly to your home server's local IP.

### ⚖️ THE LOGICAL DECISION
Rather than editing the `/etc/hosts` file on every single computer, phone, and tablet in your house, the AI implements central DNS redirection at the router level. This maps local hosts network-wide.

### ⚙️ HOW (Implementation Code)
#### 1. Adding a Local DNS Record in Pi-hole:
You can do this in the web interface, or programmatically via the command line on your Pi-hole host:
```bash
# Add a custom host mapping to the dnsmasq config file
echo "address=/cms.mrmahesh.com/192.168.20.182" | sudo tee -a /etc/dnsmasq.d/05-custom-domains.conf
```

#### 2. Restarting the DNS Service to Apply:
```bash
# Restart the pihole DNS service to reload configurations
pihole restartdns
```

#### 3. Testing Local Resolution:
```bash
# Query your local Pi-hole to verify it returns the correct home server IP
dig @192.168.1.2 cms.mrmahesh.com
```
* **`@192.168.1.2`**: Forces the query to hit your local DNS server specifically, bypassing the default upstream DNS (like Cloudflare or Google).
