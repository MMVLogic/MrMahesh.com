---
title: "Proxmox PCIe GPU Passthrough for VMs"
layout: default
category: "Homelab"
date: 2026-12-16
tags:
  - proxmox
  - virtualization
  - gpu
status: "Published"
challenge: "What Linux kernel feature must be enabled in BIOS/UEFI to isolate PCIe hardware for GPU passthrough in Proxmox? **IOMMU** (`intel_iommu=on` or `amd_iommu=on`)."
answer: "**PCIe Passthrough** bypasses the hypervisor host and gives a Virtual Machine direct, exclusive access to physical PCIe hardware (NVIDIA/AMD GPUs, 10GbE NICs)."
---

### 💡 WHY (The Concept)
**PCIe Passthrough** bypasses the hypervisor host and gives a Virtual Machine direct, exclusive access to physical PCIe hardware (NVIDIA/AMD GPUs, 10GbE NICs).

### ⚖️ THE LOGICAL DECISION
Pass a physical GPU into a Windows VM for remote cloud gaming or an Ubuntu VM for local LLM inference.

### ⚙️ HOW (Implementation Code)
```ini
# /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```
Bind GPU to vfio stub driver:
```ini
# /etc/modprobe.d/vfio.conf
options vfio-pci ids=10de:1f02,10de:10f9
```
