---
title: "Cloudflare API Dynamic DNS (DDNS) Updates"
layout: default
category: "Homelab"
date: 2026-10-27
tags:
  - cloudflare
  - dns
  - automation
status: "Published"
challenge: "How does a Dynamic DNS (DDNS) bash script detect if your home public IP has changed?"
answer: "It queries a public IP reflection API (like `icanhazip.com` or `cloudflare.com/cdn-cgi/trace`) and compares it against the existing DNS record IP."
---

### 💡 WHY (The Concept)
Most home internet connections have dynamic IP addresses that change randomly. A **DDNS script** checks your public IP and updates Cloudflare DNS records automatically.

### ⚖️ THE LOGICAL DECISION
Run a lightweight bash script in a cron job to keep your domain pointed to your home server.

### ⚙️ HOW (Implementation Code)
```bash
# Get current public IPv4 address:
CURRENT_IP=$(curl -s https://api.ipify.org)

# Update Cloudflare DNS A record via API:
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
     -H "Authorization: Bearer $CF_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"type":"A","name":"mrmahesh.com","content":"'"$CURRENT_IP"'","ttl":120,"proxied":false}'
```
