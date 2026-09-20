---
title: "MetalLB: Bare-Metal Load Balancers for Homelabs"
layout: default
category: "Homelab"
date: 2026-12-03
tags:
  - kubernetes
  - networking
  - metallb
  - homelab
status: "Published"
challenge: "Why do Kubernetes Services of `type: LoadBalancer` stay stuck in `<pending>` on bare-metal home servers without MetalLB?"
answer: "Standard Kubernetes does not provide a built-in network load balancer implementation for bare metal (unlike AWS ELB or Google Cloud LB). MetalLB allocates actual local LAN IP addresses to LoadBalancer services."
---

### 💡 WHY (The Concept)
**MetalLB** provides a network load balancer implementation for Kubernetes clusters that do not run on a public cloud provider, using standard routing protocols (Layer 2 ARP or BGP).

### ⚖️ THE LOGICAL DECISION
Install MetalLB in Layer 2 mode to give homelab services (like Nginx Ingress or Pi-hole) dedicated IP addresses on your home router subnet (`192.168.1.200–220`).

### ⚙️ HOW (Implementation Code)
```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: home-lan-pool
  namespace: metallb-system
spec:
  addresses:
    - 192.168.20.200-192.168.20.220
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advert
  namespace: metallb-system
```
