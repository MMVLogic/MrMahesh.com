---
title: "Building Reusable Terraform Modules"
layout: default
category: "DevOps"
date: 2026-12-06
tags:
  - terraform
  - iac
status: "Published"
challenge: "What three core files make up standard Terraform module architecture? `main.tf` (resources), `variables.tf` (inputs), and `outputs.tf` (return values)."
answer: "Terraform modules package related infrastructure components into reusable building blocks, avoiding copy-pasted configuration code."
---

### 💡 WHY (The Concept)
Terraform modules package related infrastructure components into reusable building blocks, avoiding copy-pasted configuration code.

### ⚖️ THE LOGICAL DECISION
Organize complex infrastructure into modular components (e.g. `modules/k8s_cluster`, `modules/cloudflare_dns`).

### ⚙️ HOW (Implementation Code)
```hcl
module "cloudflare_records" {
  source      = "./modules/dns"
  zone_id     = var.cf_zone_id
  subdomains  = ["cms", "qbittorrent", "jellyfin"]
  server_ip   = "192.168.20.182"
}
```
