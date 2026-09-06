#!/usr/bin/env python3
import os
import json

WEBSITE_ROOT = "/Users/m/mrmr/mrmahesh"
GUIDES_DIR = os.path.join(WEBSITE_ROOT, "_guides")
os.makedirs(GUIDES_DIR, exist_ok=True)

NEW_50_GUIDES = [
    # 1-10: Linux Systems & Kernel Tuning
    {
        "filename": "2026-11-15-linux-cgroups-v2.md",
        "title": "Linux cgroups v2: CPU & Memory Throttling",
        "category": "DevOps",
        "tags": ["linux", "cgroups", "performance", "containers"],
        "challenge": "What is the primary architectural improvement of cgroups v2 over cgroups v1 in Linux?",
        "answer": "cgroups v1 had separate, conflicting controller hierarchies for CPU, memory, and I/O. cgroups v2 provides a unified single-hierarchy tree where a single process group has consistent resource limits across all controllers simultaneously.",
        "concept": "**cgroups (Control Groups)** is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network) of a collection of processes. It is the underlying engine that makes Docker and Kubernetes container limits possible.",
        "reasoning": "Use systemd and cgroups v2 to throttle resource-heavy batch scripts or runaway background jobs directly on the host without needing a Docker container.",
        "how": "```bash\n# 1. Check if system is running unified cgroups v2:\nmount -t cgroup2\n\n# 2. Run a resource-capped command using systemd-run:\nsudo systemd-run --scope -p MemoryMax=500M -p CPUQuota=50% ./heavy-indexer.sh\n\n# 3. Inspect active cgroup limits:\ncat /sys/fs/cgroup/system.slice/memory.max\n```"
    },
    {
        "filename": "2026-11-16-systemd-journal-remote.md",
        "title": "Centralized Logging with systemd-journal-remote",
        "category": "DevOps",
        "tags": ["systemd", "logs", "monitoring", "linux"],
        "challenge": "Why is streaming binary logs via `systemd-journal-remote` over HTTPS safer than legacy syslog UDP forwarding?",
        "answer": "Legacy UDP syslog sends plain-text unencrypted log packets that can be dropped or intercepted. `systemd-journal-remote` uses encrypted HTTPS/TLS with structured binary metadata, guaranteeing log delivery and tamper resistance.",
        "concept": "When managing multiple nodes, logging into each machine individually with `journalctl` is inefficient. **`systemd-journal-remote`** streams binary systemd logs over HTTPS to a central log server, preserving structured fields (like `_PID`, `_SYSTEMD_UNIT`, and `_HOSTNAME`).",
        "reasoning": "Deploy `systemd-journal-upload` on homelab nodes to ship all service logs to your main monitoring server with zero third-party agent dependencies.",
        "how": "```ini\n# /etc/systemd/journal-upload.conf (Client Node)\n[Upload]\nURL=https://logserver.homelab.local:19532\nServerKeyFile=/etc/ssl/client.key\nServerCertificateFile=/etc/ssl/client.crt\nTrustedCertificateFile=/etc/ssl/ca.pem\n```\nEnable log shipping daemon:\n```bash\nsudo systemctl enable --now systemd-journal-upload\n```"
    },
    {
        "filename": "2026-11-17-linux-core-dumps-gdb.md",
        "title": "Linux Core Dumps & GDB Crash Debugging",
        "category": "DevOps",
        "tags": ["linux", "debugging", "c", "performance"],
        "challenge": "If a compiled program crashes with 'Segmentation fault (core dumped)', what file does Linux generate and how do you inspect the crash stack trace?",
        "answer": "Linux generates a memory snapshot file (`core` or inside `coredumpctl`). You inspect it with GDB: `gdb /path/to/binary core` and run `bt` (backtrace) to pinpoint the exact line of code that crashed.",
        "concept": "A **Core Dump** is a recorded snapshot of a process's memory space, CPU registers, and call stack captured at the exact microsecond the program crashed (e.g. invalid memory access or SIGSEGV).",
        "reasoning": "Enable core dumps in production and homelabs so when compiled daemons (like Nginx, Redis, or custom Go/Rust binaries) crash intermittently, you can extract the exact stack trace.",
        "how": "```bash\n# 1. Enable unlimited core dump size:\nulimit -c unlimited\n\n# 2. View recent system crashes with systemd-coredump:\ncoredumpctl list\n\n# 3. Open the latest crash in GDB debugger:\ncoredumpctl debug\n\n# Inside GDB, print stack backtrace:\n(gdb) bt\n(gdb) info locals\n```"
    },
    {
        "filename": "2026-11-18-linux-strace-syscalls.md",
        "title": "Debugging Hanging Binaries with strace",
        "category": "DevOps",
        "tags": ["linux", "debugging", "troubleshooting"],
        "challenge": "What command allows you to attach `strace` to an already running frozen process with PID 1420 to see what system call it is stuck on?",
        "answer": "`sudo strace -p 1420` (or `sudo strace -T -p 1420` to measure time spent in each system call).",
        "concept": "**`strace`** (System Call Tracer) intercepts and records the system calls made by a process and the signals it receives. It reveals what files a program is attempting to open, what network sockets it is waiting on, and where it is deadlocked.",
        "reasoning": "When a command hangs with no log output or fails with a vague error like 'File not found', `strace` reveals the exact missing file path or hanging socket instantly.",
        "how": "```bash\n# Trace file opening and network calls for a command:\nstrace -e trace=openat,connect,read,write ./my-app\n\n# Count system calls and time spent per syscall:\nstrace -c ./my-app\n\n# Attach to a running hung process and log output to file:\nsudo strace -p 2480 -o /tmp/debug.log\n```"
    },
    {
        "filename": "2026-11-19-tcpdump-bpf-filters.md",
        "title": "Advanced Network Packet Captures with tcpdump & BPF",
        "category": "Cybersecurity",
        "tags": ["networking", "security", "linux", "tcpdump"],
        "challenge": "How do you capture only SYN packets (new TCP connection attempts) on interface `eth0` using tcpdump?",
        "answer": "`sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'`",
        "concept": "**`tcpdump`** uses **Berkeley Packet Filters (BPF)** to capture and analyze raw network traffic traversing network interfaces directly in the Linux kernel without performance degradation.",
        "reasoning": "Use `tcpdump` to capture live network payloads on headless servers, write `.pcap` files, and download them for visual inspection in Wireshark.",
        "how": "```bash\n# 1. Capture traffic on port 443 excluding SSH traffic on port 22:\nsudo tcpdump -i any -nn 'port 443 and not port 22'\n\n# 2. Capture and save 10,000 packets to a Wireshark PCAP file:\nsudo tcpdump -i eth0 -w /tmp/traffic.pcap -c 10000\n\n# 3. Filter only DNS queries:\nsudo tcpdump -i eth0 -nn 'udp port 53'\n```"
    },
    {
        "filename": "2026-11-20-linux-transparent-hugepages.md",
        "title": "Linux Transparent Huge Pages (THP) & Memory Latency",
        "category": "DevOps",
        "tags": ["linux", "performance", "redis", "database"],
        "challenge": "Why do databases like Redis and PostgreSQL strongly recommend disabling Transparent Huge Pages (THP) in Linux?",
        "answer": "THP uses 2MB memory pages instead of standard 4KB pages. For fine-grained, high-frequency database writes, memory compaction and copy-on-write overhead causes massive latency spikes and memory fragmentation.",
        "concept": "Standard x86-64 Linux architectures manage RAM in 4KB chunks (pages). **Huge Pages** increase page size to 2MB or 1GB to reduce Translation Lookaside Buffer (TLB) CPU misses for compute workloads.",
        "reasoning": "Keep THP enabled for heavy video transcoding/HPC apps, but disable it (`madvise` or `never`) on database nodes running Redis or MongoDB to eliminate write latency spikes.",
        "how": "```bash\n# Check current THP status:\ncat /sys/kernel/mm/transparent_hugepage/enabled\n# Output: [always] madvise never\n\n# Disable THP dynamically:\necho never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled\necho never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag\n```"
    },
    {
        "filename": "2026-11-21-linux-ethtool-nic-tuning.md",
        "title": "Network Hardware Audits with ethtool",
        "category": "Homelab",
        "tags": ["linux", "networking", "hardware"],
        "challenge": "How do you verify whether a physical network cable is negotiated at Gigabit (1000Mb/s Full Duplex) or degraded to 100Mb/s?",
        "answer": "`sudo ethtool eth0` (Check the `Speed:` and `Duplex:` fields).",
        "concept": "**`ethtool`** queries and controls network interface controllers (NICs) and their hardware device drivers. It inspects physical link speeds, auto-negotiation, ring buffer sizes, and hardware offloading capabilities (like TSO and GSO).",
        "reasoning": "When LAN transfer speeds drop mysteriously, run `ethtool` to verify if a damaged Ethernet cable or switch port dropped your connection to 100 Mbps.",
        "how": "```bash\n# 1. Check physical link status, speed, and duplex:\nsudo ethtool eth0\n\n# 2. View hardware dropped packets and CRC errors:\nsudo ethtool -S eth0 | grep -E \"drop|error\"\n\n# 3. Blink physical NIC LED light to identify the cable port in a server rack:\nsudo ethtool -p eth0 10\n```"
    },
    {
        "filename": "2026-11-22-linux-nftables-migration.md",
        "title": "Migrating from iptables to Modern nftables",
        "category": "Cybersecurity",
        "tags": ["linux", "security", "firewall", "networking"],
        "challenge": "Why did the Linux kernel replace `iptables` with `nftables` as the default packet filtering framework?",
        "answer": "`nftables` provides a unified syntax for IPv4, IPv6, ARP, and bridging in a single table, compiles rules into a lightweight in-kernel bytecode VM, and supports atomic rule replacements with no connection drops.",
        "concept": "**`nftables`** is the modern Linux firewall and packet classification framework. It replaces the fragmented legacy tools (`iptables`, `ip6tables`, `arptables`, `ebtables`) with a clean, structured grammar.",
        "reasoning": "Use `nftables` for modern firewall scripting to define combined IPv4/IPv6 rules with atomic reload safety.",
        "how": "```ini\n# /etc/nftables.conf\nflush ruleset\n\ntable inet filter {\n    chain input {\n        type filter hook input priority 0; policy drop;\n        \n        # Allow loopback and established connections\n        iif lo accept\n        ct state established,related accept\n        \n        # Allow SSH and HTTPS\n        tcp dport { 22, 443 } accept\n    }\n}\n```\nApply rules atomically:\n```bash\nsudo nft -f /etc/nftables.conf\n```"
    },
    {
        "filename": "2026-11-23-linux-kernel-sysctl-hardening.md",
        "title": "Linux Kernel Network Hardening with sysctl",
        "category": "Cybersecurity",
        "tags": ["linux", "security", "sysctl"],
        "challenge": "What sysctl parameter protects Linux servers from TCP SYN Flood Denial of Service (DoS) attacks?",
        "answer": "`net.ipv4.tcp_syncookies = 1`",
        "concept": "**`sysctl`** modifies Linux kernel parameters at runtime. Configuring network security parameters in `/etc/sysctl.d/` hardens the TCP/IP stack against spoofing, ICMP redirect hijacking, and buffer exhaustion.",
        "reasoning": "Deploy standard kernel hardening configuration files across all public-facing servers and homelab nodes to block network attacks at the kernel level.",
        "how": "```ini\n# /etc/sysctl.d/99-security.conf\n# Disable IP packet forwarding (unless routing router/VPN)\nnet.ipv4.ip_forward = 0\n\n# Protect against SYN flood attacks\nnet.ipv4.tcp_syncookies = 1\n\n# Ignore ICMP broadcast ping requests (Smurf attacks)\nnet.ipv4.icmp_echo_ignore_broadcasts = 1\n\n# Disable acceptance of ICMP redirects (prevents MitM route tampering)\nnet.ipv4.conf.all.accept_redirects = 0\n```\nApply changes:\n```bash\nsudo sysctl --system\n```"
    },
    {
        "filename": "2026-11-24-systemd-service-sandboxing.md",
        "title": "Systemd Service Sandboxing: ProtectSystem & PrivateTmp",
        "category": "Cybersecurity",
        "tags": ["systemd", "security", "linux"],
        "challenge": "What happens when you add `ProtectSystem=strict` and `PrivateTmp=true` to a systemd service unit?",
        "answer": "`ProtectSystem=strict` mounts the entire filesystem as read-only for that process (except `/dev`, `/proc`, and explicitly allowed folders), and `PrivateTmp=true` gives the service an isolated `/tmp` directory invisible to other processes.",
        "concept": "Even if an application running as a systemd service is compromised by an exploit, **Systemd Sandboxing** locks the process inside an isolated filesystem namespace, preventing attackers from modifying binaries or tampering with system libraries.",
        "reasoning": "Add systemd security hardening directives to all web services (Node.js, Python, CMS) to contain exploits automatically.",
        "how": "```ini\n# /etc/systemd/system/mrmahesh-cms.service\n[Unit]\nDescription=MrMahesh Custom CMS\n\n[Service]\nExecStart=/usr/bin/node /app/server.js\nUser=www-data\n\n# Security Sandboxing\nProtectSystem=strict\nProtectHome=true\nPrivateTmp=true\nNoNewPrivileges=true\nReadWritePaths=/app/data /app/uploads\n```"
    },

    # 11-20: Kubernetes & Cloud Native Deep Dive
    {
        "filename": "2026-11-25-k8s-ingress-traefik.md",
        "title": "Traefik Ingress Controller: Routing & Automatic TLS",
        "category": "DevOps",
        "tags": ["kubernetes", "traefik", "networking", "ssl"],
        "challenge": "What custom resource does Traefik use in Kubernetes to provide advanced routing (like header matching and rate limiting) beyond standard Ingress manifests?",
        "answer": "`IngressRoute` (Traefik Custom Resource Definition / CRD).",
        "concept": "An **Ingress Controller** acts as the front gate of a Kubernetes cluster, routing external HTTP/HTTPS traffic to internal cluster Services. **Traefik** dynamically discovers services and automatically manages Let's Encrypt certificates.",
        "reasoning": "Use Traefik for homelab and edge Kubernetes clusters (like K3s) for built-in dashboard metrics and automated TLS.",
        "how": "```yaml\napiVersion: traefik.io/v1alpha1\nkind: IngressRoute\nmetadata:\n  name: cms-ingress\n  namespace: media\nspec:\n  entryPoints:\n    - websecure\n  routes:\n    - match: Host(`cms.mrmahesh.com`)\n      kind: Rule\n      services:\n        - name: mrmahesh-cms-service\n          port: 80\n  tls:\n    certResolver: cloudflare\n```"
    },
    {
        "filename": "2026-11-26-k8s-statefulsets.md",
        "title": "StatefulSets vs. Deployments: Databases in Kubernetes",
        "category": "DevOps",
        "tags": ["kubernetes", "database", "storage"],
        "challenge": "What unique properties do Pods in a `StatefulSet` possess compared to Pods in a standard `Deployment`?",
        "answer": "StatefulSet pods receive deterministic, sticky ordinal names (e.g. `db-0`, `db-1`), dedicated individual PersistentVolumeClaims that survive pod deletion, and ordered sequential deployment/scaling.",
        "concept": "While **Deployments** manage interchangeable, stateless web servers, **StatefulSets** manage stateful workloads (databases like PostgreSQL, Redis clusters, or Kafka) that require stable network IDs and dedicated persistent storage disks.",
        "reasoning": "Always use StatefulSets for databases to prevent multiple database pods from mounting the same volume concurrently and corrupting data.",
        "how": "```yaml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: \"postgres-headless\"\n  replicas: 2\n  template:\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:15-alpine\n  volumeClaimTemplates:\n    - metadata:\n        name: pgdata\n      spec:\n        accessModes: [ \"ReadWriteOnce\" ]\n        resources:\n          requests:\n            storage: 20Gi\n```"
    },
    {
        "filename": "2026-11-27-k8s-daemonsets.md",
        "title": "Kubernetes DaemonSets: Node-Level Services",
        "category": "DevOps",
        "tags": ["kubernetes", "monitoring", "devops"],
        "challenge": "When you add a new physical node to a Kubernetes cluster, what happens to Pods managed by a `DaemonSet`?",
        "answer": "Kubernetes automatically schedules and runs an instance of the DaemonSet Pod onto the newly added node without manual intervention.",
        "concept": "A **DaemonSet** guarantees that an exact copy of a Pod runs on *all* (or selected) physical nodes in the cluster. When nodes are added or removed, the DaemonSet scales automatically.",
        "reasoning": "Use DaemonSets for node-level infrastructure services: Prometheus Node Exporter, Fluentbit log collectors, and storage plugins.",
        "how": "```yaml\napiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: node-exporter\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: node-exporter\n  template:\n    metadata:\n      labels:\n        app: node-exporter\n    spec:\n      hostNetwork: true\n      containers:\n        - name: node-exporter\n          image: prom/node-exporter:latest\n```"
    },
    {
        "filename": "2026-11-28-k8s-taints-tolerations.md",
        "title": "Kubernetes Taints, Tolerations & Node Affinity",
        "category": "DevOps",
        "tags": ["kubernetes", "scheduling", "devops"],
        "challenge": "What is the difference between a `Taint` on a Node and a `Toleration` on a Pod?",
        "answer": "A **Taint** allows a Node to repel a set of pods. A **Toleration** applied to a Pod allows (but does not require) the Pod to schedule onto a node with matching taints.",
        "concept": "**Taints and Tolerations** work together to ensure that sensitive or specialized nodes (like GPU-equipped nodes or master control planes) do not accept unwanted workloads.",
        "reasoning": "Taint your server's GPU node so only video transcoding or AI workloads run on it, keeping regular web apps on CPU worker nodes.",
        "how": "```bash\n# 1. Taint a node with GPU hardware:\nkubectl taint nodes gpu-node-1 hardware=gpu:NoSchedule\n```\nAllow a specific pod to schedule on it:\n```yaml\ntolerations:\n  - key: \"hardware\"\n    operator: \"Equal\"\n    value: \"gpu\"\n    effect: \"NoSchedule\"\n```"
    },
    {
        "filename": "2026-11-29-k8s-pvc-online-expansion.md",
        "title": "Online PVC Expansion: Resizing Kubernetes Disks",
        "category": "DevOps",
        "tags": ["kubernetes", "storage", "devops"],
        "challenge": "Can you shrink an existing Kubernetes PersistentVolumeClaim (PVC) from 50GB down to 20GB?",
        "answer": "No. Kubernetes and underlying storage CSI drivers only support expanding volume capacity, never shrinking.",
        "concept": "When a database or media volume runs low on disk space in Kubernetes, you can expand its **PersistentVolumeClaim (PVC)** dynamically without deleting pods or stopping cluster operations if the StorageClass supports `allowVolumeExpansion: true`.",
        "reasoning": "Resize storage in-place by editing the PVC manifest (`spec.resources.requests.storage`) and applying it directly.",
        "how": "```bash\n# Edit PVC storage size directly:\nkubectl patch pvc cms-db-pvc -n media -p '{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"30Gi\"}}}}'\n\n# Verify expanded volume size:\nkubectl get pvc cms-db-pvc -n media\n```"
    },
    {
        "filename": "2026-11-30-k8s-hpa-autoscaling.md",
        "title": "Horizontal Pod Autoscaler (HPA): Auto-Scaling",
        "category": "DevOps",
        "tags": ["kubernetes", "scaling", "performance"],
        "challenge": "What cluster component must be installed for Horizontal Pod Autoscalers to read CPU and Memory metrics?",
        "answer": "**Metrics Server** (`metrics-server`).",
        "concept": "The **Horizontal Pod Autoscaler (HPA)** automatically scales the number of Pod replicas in a Deployment based on observed CPU utilization, memory pressure, or custom metrics.",
        "reasoning": "Configure HPA on public APIs to automatically scale from 1 pod to 5 pods during traffic spikes, and scale down when traffic subsides to conserve RAM.",
        "how": "```yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: cms-hpa\n  namespace: media\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: mrmahesh-cms-deployment\n  minReplicas: 1\n  maxReplicas: 5\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 75\n```"
    },
    {
        "filename": "2026-12-01-k8s-service-mesh-linkerd.md",
        "title": "Service Meshes Explained: Linkerd vs. Istio",
        "category": "DevOps",
        "tags": ["kubernetes", "networking", "security"],
        "challenge": "What is the primary security benefit of deploying a lightweight Service Mesh like Linkerd in Kubernetes?",
        "answer": "Automatic mutual TLS (mTLS) encryption for all pod-to-pod network traffic with zero application code changes.",
        "concept": "A **Service Mesh** adds transparent proxy sidecars (Envoy or Linkerd-proxy) to every Pod. It manages pod-to-pod encryption (mTLS), traffic telemetry, latency tracing, and retries.",
        "reasoning": "Deploy lightweight Linkerd (written in Rust) when you require zero-trust internal encryption and microservice traffic metrics with minimal CPU overhead.",
        "how": "```bash\n# Inject Linkerd sidecar proxy into a namespace:\nkubectl get namespace media -o yaml | linkerd inject - | kubectl apply -f -\n\n# View live pod-to-pod latency and success rates:\nlinkerd viz stat deployment -n media\n```"
    },
    {
        "filename": "2026-12-02-k8s-argocd-gitops.md",
        "title": "GitOps Continuous Delivery with ArgoCD",
        "category": "DevOps",
        "tags": ["kubernetes", "gitops", "cicd", "argocd"],
        "challenge": "What is the core principle of the GitOps deployment methodology?",
        "answer": "A Git repository is the single source of truth for the entire cluster state. Changes are made via Git commits, and an automated agent (like ArgoCD) continuously reconciles cluster state to match the repository.",
        "concept": "**ArgoCD** is a declarative GitOps continuous delivery tool for Kubernetes. It monitors your Git repository for manifest changes and automatically deploys or syncs them to the cluster, preventing configuration drift.",
        "reasoning": "Eliminate manual `kubectl apply` commands from local machines. Commit YAML manifests to GitHub and let ArgoCD sync them automatically.",
        "how": "```yaml\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: custom-cms-app\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: 'https://github.com/MMVLogic/MrMahesh.com.git'\n    targetRevision: HEAD\n    path: k8s\n  destination:\n    server: 'https://kubernetes.default.svc'\n    namespace: media\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n```"
    },
    {
        "filename": "2026-12-03-k8s-metallb-baremetal.md",
        "title": "MetalLB: Bare-Metal Load Balancers for Homelabs",
        "category": "Homelab",
        "tags": ["kubernetes", "networking", "metallb", "homelab"],
        "challenge": "Why do Kubernetes Services of `type: LoadBalancer` stay stuck in `<pending>` on bare-metal home servers without MetalLB?",
        "answer": "Standard Kubernetes does not provide a built-in network load balancer implementation for bare metal (unlike AWS ELB or Google Cloud LB). MetalLB allocates actual local LAN IP addresses to LoadBalancer services.",
        "concept": "**MetalLB** provides a network load balancer implementation for Kubernetes clusters that do not run on a public cloud provider, using standard routing protocols (Layer 2 ARP or BGP).",
        "reasoning": "Install MetalLB in Layer 2 mode to give homelab services (like Nginx Ingress or Pi-hole) dedicated IP addresses on your home router subnet (`192.168.1.200–220`).",
        "how": "```yaml\napiVersion: metallb.io/v1beta1\nkind: IPAddressPool\nmetadata:\n  name: home-lan-pool\n  namespace: metallb-system\nspec:\n  addresses:\n    - 192.168.20.200-192.168.20.220\n---\napiVersion: metallb.io/v1beta1\nkind: L2Advertisement\nmetadata:\n  name: l2-advert\n  namespace: metallb-system\n```"
    },
    {
        "filename": "2026-12-04-k8s-cert-manager.md",
        "title": "Cert-Manager: Automating TLS with Let's Encrypt",
        "category": "DevOps",
        "tags": ["kubernetes", "ssl", "security", "devops"],
        "challenge": "How does Cert-Manager renew Kubernetes TLS secrets automatically before expiration?",
        "answer": "Cert-Manager monitors Certificate resources and automatically triggers ACME challenge orders (HTTP-01 or DNS-01) 30 days before expiration, updating the Secret without service downtime.",
        "concept": "**cert-manager** adds certificates and certificate issuers as resource types in Kubernetes clusters, automating the creation, verification, and renewal of SSL/TLS certificates.",
        "reasoning": "Deploy cert-manager with Cloudflare DNS API tokens to automatically issue wildcard TLS certificates for all internal and public ingress domains.",
        "how": "```yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-prod\nspec:\n  acme:\n    server: https://acme-v02.api.letsencrypt.org/directory\n    email: mahesh@mrmahesh.com\n    privateKeySecretRef:\n      name: letsencrypt-prod-account-key\n    solvers:\n      - dns01:\n          cloudflare:\n            apiTokenSecretRef:\n              name: cloudflare-api-token-secret\n              key: api-token\n```"
    }
]

# Generate items 21-50
REMAINING_30 = [
    # 21-30: DevOps, CI/CD, Terraform, Ansible
    ("2026-12-05-terraform-state-management.md", "Terraform State Management & Remote Backends", "DevOps", ["terraform", "iac", "devops"],
     "Why must Terraform state files (`terraform.tfstate`) NEVER be committed to a public Git repository? State files contain raw unencrypted infrastructure secrets (database passwords, private keys, API tokens) and metadata.",
     "**Terraform** records the mapping between your code and real-world cloud resources in a **State File**. Using remote backends (like AWS S3 with DynamoDB locking or GitLab HTTP backend) ensures team synchronization and state locking.",
     "Always configure a remote backend with encryption and state locking before collaborating on Terraform projects.",
     "```hcl\nterraform {\n  backend \"s3\" {\n    bucket         = \"homelab-tf-state\"\n    key            = \"prod/state.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    dynamodb_table = \"tf-state-locks\"\n  }\n}\n```"),

    ("2026-12-06-terraform-reusable-modules.md", "Building Reusable Terraform Modules", "DevOps", ["terraform", "iac"],
     "What three core files make up standard Terraform module architecture? `main.tf` (resources), `variables.tf` (inputs), and `outputs.tf` (return values).",
     "Terraform modules package related infrastructure components into reusable building blocks, avoiding copy-pasted configuration code.",
     "Organize complex infrastructure into modular components (e.g. `modules/k8s_cluster`, `modules/cloudflare_dns`).",
     "```hcl\nmodule \"cloudflare_records\" {\n  source      = \"./modules/dns\"\n  zone_id     = var.cf_zone_id\n  subdomains  = [\"cms\", \"qbittorrent\", \"jellyfin\"]\n  server_ip   = \"192.168.20.182\"\n}\n```"),

    ("2026-12-07-ansible-vault-secrets.md", "Ansible Vault: Encrypting Passwords & Keys", "Cybersecurity", ["ansible", "security", "devops"],
     "How do you run an Ansible playbook that contains encrypted Ansible Vault variables? Pass the `--ask-vault-pass` flag or `--vault-password-file ~/.vault_pass`.",
     "**Ansible Vault** encrypts sensitive variables and entire YAML files with AES-256, allowing you to safely store configuration secrets in version control.",
     "Never store raw server passwords in plain text playbooks; encrypt variable files with Ansible Vault.",
     "```bash\n# 1. Encrypt a sensitive variables file:\nansible-vault encrypt group_vars/all/vault.yml\n\n# 2. View or edit encrypted variables in-place:\nansible-vault edit group_vars/all/vault.yml\n\n# 3. Run playbook with password prompt:\nansible-playbook -i hosts site.yml --ask-vault-pass\n```"),

    ("2026-12-08-ansible-roles-structure.md", "Structuring Large Automation Projects with Ansible Roles", "DevOps", ["ansible", "automation"],
     "What directory in an Ansible Role contains the main execution tasks? `tasks/main.yml`",
     "**Ansible Roles** provide a standard directory structure (`tasks`, `handlers`, `vars`, `defaults`, `templates`) to decompose massive playbooks into reusable components.",
     "Use roles (e.g. `roles/docker`, `roles/k8s`, `roles/security`) for modular server configuration.",
     "```text\nroles/docker/\n├── defaults/main.yml  # Overridable default variables\n├── handlers/main.yml  # Restart service handlers\n├── tasks/main.yml     # Core installation commands\n└── templates/daemon.json.j2 # Jinja2 configuration template\n```"),

    ("2026-12-09-docker-swarm-vs-standalone.md", "Docker Swarm: Lightweight Clustering for Homelabs", "Homelab", ["docker", "clustering"],
     "How does Docker Swarm provide high availability across 3 servers compared to standalone Docker Compose? Swarm turns multiple physical Docker nodes into a single clustered swarm, routing traffic via an ingress overlay network and rescheduling containers automatically if a node dies.",
     "**Docker Swarm** is built directly into the Docker engine. It requires zero additional binaries and uses existing Compose files with a `deploy:` block.",
     "Use Docker Swarm when Kubernetes is too resource-heavy but you still need multi-node high availability.",
     "```bash\n# Initialize Swarm on node 1:\ndocker swarm init\n\n# Deploy a multi-node stack:\ndocker stack deploy -c docker-compose.yml homelab-stack\n```"),

    ("2026-12-10-github-actions-matrix-builds.md", "GitHub Actions Matrix Builds for Multi-Platform Testing", "DevOps", ["cicd", "github", "testing"],
     "What does a matrix build strategy do in GitHub Actions? It runs your test/build workflow across multiple combinations of OS versions (Ubuntu, macOS, Windows) and language runtimes (Node 18, 20, 22) in parallel.",
     "**Matrix builds** prevent platform-specific bugs by executing tests concurrently across diverse target environments.",
     "Use matrix strategies in open-source repositories to guarantee compatibility across Node/Python versions.",
     "```yaml\nstrategy:\n  matrix:\n    os: [ubuntu-latest, macos-latest]\n    node-version: [18.x, 20.x, 22.x]\nruns-on: ${{ matrix.os }}\nsteps:\n  - uses: actions/setup-node@v4\n    with:\n      node-version: ${{ matrix.node-version }}\n```"),

    ("2026-12-11-github-actions-dependency-caching.md", "Accelerating CI/CD with GitHub Actions Caching", "DevOps", ["cicd", "github", "performance"],
     "Why should you cache `~/.npm` or `~/.cache/pip` in CI/CD workflows? Downloading hundreds of dependencies over the internet on every commit slows down builds. Caching restores packages locally in seconds, cutting pipeline duration by 70%.",
     "`actions/cache` stores package directories keyed by a hash of your lockfile (`package-lock.json`).",
     "Cache dependencies to speed up deployments and prevent rate-limiting from package registries.",
     "```yaml\n- name: Cache Node modules\n  uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}\n    restore-keys: |\n      ${{ runner.os }}-node-\n```"),

    ("2026-12-12-git-pre-commit-framework.md", "Automated Linting with the pre-commit Framework", "DevOps", ["git", "devops", "code-quality"],
     "What file configures the multi-language `pre-commit` framework in a Git repository? `.pre-commit-config.yaml`",
     "The **`pre-commit` framework** manages multi-language git hook scripts (Prettier, ESLint, Black, ShellCheck) without requiring teammates to install toolchains globally.",
     "Install `pre-commit` in your repository to automatically format code and check for syntax errors before every commit.",
     "```yaml\n# .pre-commit-config.yaml\nrepos:\n  - repo: https://github.com/pre-commit/pre-commit-hooks\n    rev: v4.5.0\n    hooks:\n      - id: trailing-whitespace\n      - id: end-of-file-fixer\n      - id: check-yaml\n```\nInstall hooks:\n```bash\npre-commit install\n```"),

    ("2026-12-13-semantic-versioning-git-tags.md", "Semantic Versioning (SemVer) & Automated Release Tags", "DevOps", ["git", "devops", "versioning"],
     "In SemVer `MAJOR.MINOR.PATCH` (e.g. `2.4.1`), when do you increment the `MAJOR` version number? When you make incompatible, breaking API or architecture changes.",
     "**Semantic Versioning** establishes a universal convention for software version numbers:\n* **PATCH**: Backwards-compatible bug fixes.\n* **MINOR**: New backwards-compatible functionality.\n* **MAJOR**: Breaking changes.",
     "Tag production releases with Git annotations (`git tag -a v1.0.0`) to trigger automated CI/CD container builds.",
     "```bash\n# Create an annotated signed release tag:\ngit tag -a v1.2.0 -m \"Release version 1.2.0 (Custom CMS & Guides)\"\n\n# Push tag to GitHub:\ngit push origin v1.2.0\n```"),

    ("2026-12-14-prometheus-alertmanager-webhooks.md", "Prometheus Alertmanager: Discord & Telegram Webhooks", "Homelab", ["monitoring", "alerting", "devops"],
     "What role does Alertmanager play in a Prometheus monitoring stack? Prometheus evaluates alert rules (e.g. `HighCPUUsage > 90%`) and fires alerts to **Alertmanager**, which deduplicates, groups, and routes notifications to webhooks (Discord, Telegram, PagerDuty).",
     "**Alertmanager** prevents notification spam by silencing known maintenance windows and grouping related alerts into single messages.",
     "Route critical homelab alerts (server down, disk >90% full) directly to a private Discord or Telegram channel.",
     "```yaml\n# alertmanager.yml\nroute:\n  receiver: 'discord_webhook'\n\nreceivers:\n  - name: 'discord_webhook'\n    webhook_configs:\n      - url: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'\n        send_resolved: true\n```"),

    # 31-40: Homelab, Self-Hosting & Storage
    ("2026-12-15-zfs-scrub-smart-health.md", "Proactive Disk Health: ZFS Scrubs & SMART Self-Tests", "Homelab", ["zfs", "storage", "hardware"],
     "What is the difference between a SMART short test and a ZFS scrub? A **SMART test** checks internal drive mechanical health and bad sectors. A **ZFS scrub** reads all stored data blocks, verifies SHA-256 checksums, and repairs silent bit-rot using parity automatically.",
     "Hard drives degrade silently over time. Routine ZFS scrubbing and SMART self-tests detect failing disks weeks before catastrophic hardware death.",
     "Schedule bi-weekly ZFS scrubs and daily SMART tests via systemd timers.",
     "```bash\n# 1. Start a ZFS storage pool integrity scrub:\nsudo zpool scrub tank\n\n# 2. Check scrub progress and repaired checksum errors:\nzpool status tank\n\n# 3. Run a drive SMART health self-test:\nsudo smartctl -t short /dev/sda\n```"),

    ("2026-12-16-proxmox-gpu-passthrough.md", "Proxmox PCIe GPU Passthrough for VMs", "Homelab", ["proxmox", "virtualization", "gpu"],
     "What Linux kernel feature must be enabled in BIOS/UEFI to isolate PCIe hardware for GPU passthrough in Proxmox? **IOMMU** (`intel_iommu=on` or `amd_iommu=on`).",
     "**PCIe Passthrough** bypasses the hypervisor host and gives a Virtual Machine direct, exclusive access to physical PCIe hardware (NVIDIA/AMD GPUs, 10GbE NICs).",
     "Pass a physical GPU into a Windows VM for remote cloud gaming or an Ubuntu VM for local LLM inference.",
     "```ini\n# /etc/default/grub\nGRUB_CMDLINE_LINUX_DEFAULT=\"quiet intel_iommu=on iommu=pt\"\n```\nBind GPU to vfio stub driver:\n```ini\n# /etc/modprobe.d/vfio.conf\noptions vfio-pci ids=10de:1f02,10de:10f9\n```"),

    ("2026-12-17-pihole-unbound-recursive-dns.md", "Recursive DNS: Pairing Pi-hole with Unbound", "Homelab", ["dns", "security", "homelab"],
     "How does a recursive DNS resolver like Unbound differ from standard upstream DNS (like Google 8.8.8.8 or Cloudflare 1.1.1.1)? Unbound queries authoritative root nameservers directly (`.` -> `.com` -> `mrmahesh.com`), eliminating third-party DNS logging and upstream tracking completely.",
     "**Unbound** is a validating, recursive, caching DNS resolver. Pairing it with Pi-hole provides network-wide ad blocking combined with total DNS privacy.",
     "Deploy Unbound as Pi-hole's sole upstream DNS provider on `127.0.0.1#5335`.",
     "```ini\n# /etc/unbound/unbound.conf.d/pi-hole.conf\nserver:\n    port: 5335\n    do-ip4: yes\n    do-udp: yes\n    do-tcp: yes\n    harden-glue: yes\n    harden-dnssec-stripped: yes\n    hide-identity: yes\n```"),

    ("2026-12-18-traefik-docker-labels.md", "Traefik Dynamic Routing via Docker Labels", "Homelab", ["docker", "traefik", "networking"],
     "How does Traefik discover new Docker containers without restarting the proxy? Traefik connects to `/var/run/docker.sock` and reads `traefik.http.routers...` container labels dynamically as containers start and stop.",
     "Unlike Nginx which requires manual config files and reloads, Traefik routes traffic dynamically using Docker container labels.",
     "Use Traefik Docker labels for zero-touch SSL and reverse proxy configuration.",
     "```yaml\nservices:\n  custom-cms:\n    image: mrmahesh-cms:latest\n    labels:\n      - \"traefik.enable=true\"\n      - \"traefik.http.routers.cms.rule=Host(`cms.mrmahesh.com`)\"\n      - \"traefik.http.routers.cms.entrypoints=websecure\"\n      - \"traefik.http.routers.cms.tls.certresolver=letsencrypt\"\n```"),

    ("2026-12-19-authelia-homelab-sso-2fa.md", "Authelia: Single Sign-On (SSO) & 2FA for Homelabs", "Cybersecurity", ["security", "auth", "homelab"],
     "How does Authelia protect unauthenticated self-hosted apps behind a reverse proxy? The reverse proxy (Nginx/Traefik) intercepts all incoming requests and forwards authentication sub-requests to Authelia (`auth_request /api/verify`).",
     "**Authelia** is an open-source authentication server providing Single Sign-On (SSO) and Two-Factor Authentication (Duo, TOTP, FIDO2 WebAuthn keys).",
     "Place all admin tools (Portainer, qBittorrent, Grafana) behind Authelia 2FA gatekeeping.",
     "```yaml\n# Traefik ForwardAuth Middleware\napiVersion: traefik.io/v1alpha1\nkind: Middleware\nmetadata:\n  name: authelia-auth\nspec:\n  forwardAuth:\n    address: http://authelia:9091/api/verify?rd=https://auth.mrmahesh.com\n    trustForwardHeader: true\n```"),

    ("2026-12-20-glances-realtime-monitoring.md", "Glances: Lightweight Real-Time Server Monitoring", "Homelab", ["monitoring", "linux", "performance"],
     "What makes Glances more comprehensive than standard `htop` for server monitoring? Glances monitors CPU, RAM, disk I/O, network bandwidth, GPU temperatures, Docker container stats, and exposes a REST API / web UI simultaneously.",
     "**Glances** is an open-source system monitoring tool written in Python with a curses terminal UI and built-in web server.",
     "Run Glances as a systemd service or Docker container for rapid terminal or web-based hardware inspection.",
     "```bash\n# Run Glances in terminal:\nglances\n\n# Run Glances with web UI on port 61208:\nglances -w\n```"),

    ("2026-12-21-wake-on-lan-remote-power.md", "Wake-on-LAN (WoL): Powering On Remote Homelab Nodes", "Homelab", ["networking", "hardware", "linux"],
     "What network packet triggers a computer to power on via Wake-on-LAN? A **Magic Packet** (a broadcast frame containing 6 bytes of `0xFF` followed by the target machine's MAC address repeated 16 times).",
     "**Wake-on-LAN** allows you to remotely power on powered-down servers and PCs across your local network without physical access.",
     "Enable WoL in motherboard BIOS and send magic packets from your router or primary home server.",
     "```bash\n# Install wakeonlan tool:\nsudo apt install wakeonlan -y\n\n# Wake remote server using its MAC address:\nwakeonlan 00:11:22:33:44:55\n```"),

    ("2026-12-22-restic-encrypted-backups.md", "Restic: Encrypted, Deduplicated Cloud Backups", "Homelab", ["backup", "storage", "security"],
     "How does Restic achieve high storage efficiency and security when backing up to cloud providers like Backblaze B2 or AWS S3? Restic uses **Content-Defined Chunking (Deduplication)** to store identical data blocks only once, and encrypts all snapshots client-side using AES-256 before uploading.",
     "**Restic** is a secure, fast backup program that turns directories into versioned snapshots with zero unencrypted metadata leakage.",
     "Automate nightly Restic backups for all database dumps and configuration files.",
     "```bash\n# 1. Initialize encrypted repository:\nrestic -r b2:my-backup-bucket:homelab init\n\n# 2. Perform automated snapshot backup:\nrestic -r b2:my-backup-bucket:homelab backup /Users/m/mrmr/mrmahesh\n\n# 3. Restore files from snapshot:\nrestic -r b2:my-backup-bucket:homelab restore latest --target /tmp/restore\n```"),

    ("2026-12-23-ups-nut-server-shutdown.md", "Network UPS Tools (NUT): Auto-Shutdown on Power Outage", "Homelab", ["hardware", "power", "reliability"],
     "Why is a Network UPS Tools (NUT) server critical for homelab data safety during a power blackout? When battery backup reaches critical threshold (<20%), NUT broadcasts shutdown commands to all networked servers, cleanly unmounting filesystems and flushing database buffers before power cuts.",
     "**NUT** provides reliable monitoring of Uninterruptible Power Supply (UPS) hardware (APC, CyberPower) over USB and network.",
     "Deploy a master NUT daemon on your primary server to coordinate graceful shutdown of Proxmox nodes and NAS pools during outages.",
     "```ini\n# /etc/nut/ups.conf\n[cyberpower]\n    driver = usbhid-ups\n    port = auto\n    desc = \"Main Homelab UPS\"\n```\nMonitor UPS status:\n```bash\nupsc cyberpower\n```"),

    ("2026-12-24-iperf3-lan-benchmarking.md", "Network Throughput Benchmarking with iPerf3", "Homelab", ["networking", "performance", "linux"],
     "How do you test true local network throughput between two servers without being bottlenecked by slow hard drive read/write speeds? Run `iperf3`, which generates in-memory synthetic TCP/UDP data streams across network sockets without touching disk storage.",
     "**iPerf3** measures maximum achievable bandwidth on IP networks, reporting transfer speed, packet loss, and jitter.",
     "Use iPerf3 to verify 1GbE/10GbE network link performance between homelab nodes.",
     "```bash\n# Server Mode (on Node 1):\niperf3 -s\n\n# Client Mode (on Node 2):\niperf3 -c 192.168.20.182 -t 10 -P 4\n# Output: Measures throughput across 4 parallel streams\n```"),

    # 41-50: Cybersecurity & Ethical Hacking
    ("2026-12-25-crowdsec-collaborative-ips.md", "CrowdSec: Collaborative Intrusion Prevention System", "Cybersecurity", ["security", "crowdsec", "firewall"],
     "How does CrowdSec differ from traditional Fail2ban? While Fail2ban operates in isolation on one machine, CrowdSec shares anonymized attack signals with a global network, proactively blocking malicious IP addresses identified by other users worldwide.",
     "**CrowdSec** is an open-source security engine that parses logs, detects aggressive behaviors, and applies remediation (block, captcha) across firewalls and reverse proxies.",
     "Install CrowdSec to protect Nginx, Traefik, and SSH with crowd-sourced threat intelligence.",
     "```bash\n# Check active bans and decisions:\nsudo cscli decisions list\n\n# View parsed log metrics:\nsudo cscli metrics\n```"),

    ("2026-12-26-burp-suite-interception-proxy.md", "Burp Suite: Intercepting & Modifying Web Requests", "Cybersecurity", ["security", "pentest", "web"],
     "How does Burp Suite intercept HTTPS requests from your browser without triggering SSL certificate warnings? You install Burp's custom root Certificate Authority (CA) certificate into your browser trust store.",
     "**Burp Suite** is the leading web vulnerability scanner and proxy tool, allowing security researchers to inspect, modify, and replay HTTP requests in real time.",
     "Use Burp Suite's Repeater tool to test API endpoints for parameter tampering and missing authorization checks.",
     "```bash\n# Configure browser proxy to 127.0.0.1:8080 to route traffic through Burp Suite\n```"),

    ("2026-12-27-hydra-password-auditing.md", "Hydra: Auditing Network Authentication Security", "Cybersecurity", ["security", "pentest", "passwords"],
     "Why should SSH password authentication be disabled in favor of keys on all public servers? Automated tools like Hydra can test thousands of password combinations per minute against exposed SSH ports until a match is found.",
     "**THC-Hydra** is a fast network login cracker supporting numerous protocols (SSH, FTP, HTTP POST, MySQL, RDP).",
     "Use Hydra to audit password complexity on internal network devices and verify rate-limiting defenses.",
     "```bash\n# Audit SSH server password strength against a wordlist:\nhydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50 -t 4\n```"),

    ("2026-12-28-sqlmap-automated-injection.md", "SQLMap: Automating SQL Injection Audits", "Cybersecurity", ["security", "database", "pentest"],
     "What automated capability does SQLMap provide during web application security audits? It automatically tests input parameters, identifies SQL injection vulnerability types (Blind, Error-based, Time-based), and extracts database schemas safely.",
     "**SQLMap** is an open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws.",
     "Run SQLMap against your own web application forms to verify that all SQL queries are strictly parameterized.",
     "```bash\n# Test a URL parameter for SQL injection vulnerabilities:\nsqlmap -u \"http://test.local/api/search?q=test\" --batch --dbs\n```"),

    ("2026-12-29-shodan-censys-osint.md", "OSINT Reconnaissance with Shodan & Censys", "Cybersecurity", ["security", "osint", "recon"],
     "How does Shodan discover exposed homelab ports without you ever visiting their website? Shodan runs continuous automated port scans across the entire IPv4 internet address space 24/7, indexing server banners and SSL certificate metadata.",
     "**Shodan** and **Censys** are search engines for internet-connected devices, indexing exposed web cams, databases, SSH servers, and industrial controls.",
     "Query your public home IP on Shodan regularly to ensure no unintended ports (e.g. database port 5432 or unauthenticated web panels) are exposed to the public internet.",
     "```bash\n# Query Shodan CLI for your public IP:\nshodan host <YOUR_PUBLIC_IP>\n```"),

    ("2026-12-30-tls-cipher-suite-hardening.md", "Hardening TLS: Disabling Insecure Legacy Ciphers", "Cybersecurity", ["ssl", "security", "nginx"],
     "Why should legacy TLS 1.0, TLS 1.1, and CBC mode ciphers be disabled on modern web servers? Legacy protocols are vulnerable to cryptographic attacks (POODLE, BEAST) and lack forward secrecy (PFS).",
     "Configuring modern cipher suites (TLS 1.2/1.3 with AES-GCM and ChaCha20-Poly1305) ensures that encrypted data cannot be decrypted retroactively even if a server private key is leaked.",
     "Enforce modern cipher configurations across all Nginx and Traefik reverse proxies.",
     "```nginx\n# Modern SSL Cipher Configuration (Mozilla Intermediate)\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;\nssl_prefer_server_ciphers off;\n```"),

    ("2026-12-31-dns-rebinding-attacks.md", "DNS Rebinding Attacks & Defenses", "Cybersecurity", ["security", "dns", "web"],
     "How does a DNS Rebinding attack bypass a browser's Same-Origin Policy (SOP) to access internal home devices? An attacker's domain returns a public IP initially, then quickly changes its DNS response TTL to `127.0.0.1` or `192.168.1.1`, tricking the victim's browser into executing requests against local intranet services.",
     "**DNS Rebinding** turns a victim's web browser into an HTTP proxy to attack unauthenticated private services on your local LAN (like router admin panels or transmission torrent clients).",
     "Defend against DNS rebinding by requiring strict HTTP `Host` header validation and enabling DNS Rebinding protection in your router/Pi-hole.",
     "```text\n# In Pi-hole / dnsmasq:\nstop-dns-rebind\n```"),

    ("2027-01-01-cors-misconfigurations.md", "CORS Security: Preventing Cross-Origin Exploits", "Cybersecurity", ["security", "web", "api"],
     "Why is setting `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` dangerous on authenticated APIs? Wildcard origins with credentials allow malicious external websites to make authenticated AJAX requests on behalf of logged-in users and steal private data.",
     "**CORS (Cross-Origin Resource Sharing)** is a browser mechanism that restricts how resources on a web page can be requested from another domain.",
     "Always whitelist specific, trusted origin domains (`https://mrmahesh.com`) instead of reflecting arbitrary `Origin` request headers.",
     "```javascript\n// Secure CORS Origin Whitelist (Express.js)\nconst allowedOrigins = ['https://mrmahesh.com', 'https://cms.mrmahesh.com'];\n\napp.use((req, res, next) => {\n    const origin = req.headers.origin;\n    if (allowedOrigins.includes(origin)) {\n        res.setHeader('Access-Control-Allow-Origin', origin);\n        res.setHeader('Access-Control-Allow-Credentials', 'true');\n    }\n    next();\n});\n```"),

    ("2027-01-02-jwt-none-algorithm-exploit.md", "JWT Security: Preventing the 'None' Algorithm Exploit", "Cybersecurity", ["security", "jwt", "auth"],
     "How does the infamous JWT 'none' algorithm vulnerability allow attackers to forge admin tokens? If a server backend accepts tokens with header `{\"alg\": \"none\"}` without verifying the cryptographic signature, attackers can change their user payload to `{\"admin\": true}` and bypass authentication.",
     "**JSON Web Tokens (JWT)** authenticate stateless sessions. Secure libraries must explicitly enforce an expected algorithm (e.g. `HS256` or `RS256`) and reject unsigned `none` tokens unconditionally.",
     "Always explicitly specify allowed algorithms when verifying JWT signatures in Node.js or Python backends.",
     "```javascript\n// Secure JWT Verification\njwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {\n    if (err) return res.status(401).json({ error: 'Invalid or forged token' });\n    req.user = decoded;\n});\n```"),

    ("2027-01-03-wireshark-tcp-stream-analysis.md", "Wireshark: Following TCP Streams & Protocol Dissection", "Cybersecurity", ["security", "wireshark", "networking"],
     "What feature in Wireshark reconstructs an entire two-way conversational data exchange between client and server into human-readable text? **Follow > TCP Stream** (or HTTP Stream).",
     "**Wireshark** dissects hundreds of network protocols. Following TCP streams reassembles out-of-order packets into the exact raw payload sent over the wire.",
     "Use TCP stream analysis to inspect unencrypted HTTP requests, debug API webhooks, and analyze network anomalies.",
     "```text\n# Wireshark Display Filter Syntax:\nhttp.request.method == \"POST\"\nip.addr == 192.168.20.182 and tcp.port == 3000\n```")
]

created = 0

for g in NEW_50_GUIDES:
    filepath = os.path.join(GUIDES_DIR, g["filename"])
    tags_yaml = "\n".join([f"  - {t}" for t in g["tags"]])
    md = f"""---
title: {json.dumps(g["title"])}
layout: default
category: {json.dumps(g["category"])}
date: {g["filename"][:10]}
tags:
{tags_yaml}
status: "Published"
challenge: {json.dumps(g["challenge"])}
answer: {json.dumps(g["answer"])}
---

### 💡 WHY (The Concept)
{g["concept"]}

### ⚖️ THE LOGICAL DECISION
{g["reasoning"]}

### ⚙️ HOW (Implementation Code)
{g["how"]}
"""
    with open(filepath, "w") as f:
        f.write(md)
    created += 1

for (fname, title, cat, tags, challenge, concept, reasoning, how) in REMAINING_30:
    filepath = os.path.join(GUIDES_DIR, fname)
    tags_yaml = "\n".join([f"  - {t}" for t in tags])
    md = f"""---
title: {json.dumps(title)}
layout: default
category: {json.dumps(cat)}
date: {fname[:10]}
tags:
{tags_yaml}
status: "Published"
challenge: {json.dumps(challenge)}
answer: {json.dumps(concept)}
---

### 💡 WHY (The Concept)
{concept}

### ⚖️ THE LOGICAL DECISION
{reasoning}

### ⚙️ HOW (Implementation Code)
{how}
"""
    with open(filepath, "w") as f:
        f.write(md)
    created += 1

print(f"[+] Successfully created {created} new active recall study guides in _guides/")
