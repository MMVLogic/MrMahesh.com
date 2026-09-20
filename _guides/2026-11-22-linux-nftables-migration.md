---
title: "Migrating from iptables to Modern nftables"
layout: default
category: "Cybersecurity"
date: 2026-11-22
tags:
  - linux
  - security
  - firewall
  - networking
status: "Published"
challenge: "Why did the Linux kernel replace `iptables` with `nftables` as the default packet filtering framework?"
answer: "`nftables` provides a unified syntax for IPv4, IPv6, ARP, and bridging in a single table, compiles rules into a lightweight in-kernel bytecode VM, and supports atomic rule replacements with no connection drops."
---

### 💡 WHY (The Concept)
**`nftables`** is the modern Linux firewall and packet classification framework. It replaces the fragmented legacy tools (`iptables`, `ip6tables`, `arptables`, `ebtables`) with a clean, structured grammar.

### ⚖️ THE LOGICAL DECISION
Use `nftables` for modern firewall scripting to define combined IPv4/IPv6 rules with atomic reload safety.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/nftables.conf
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        
        # Allow loopback and established connections
        iif lo accept
        ct state established,related accept
        
        # Allow SSH and HTTPS
        tcp dport { 22, 443 } accept
    }
}
```
Apply rules atomically:
```bash
sudo nft -f /etc/nftables.conf
```
