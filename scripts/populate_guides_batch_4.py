#!/usr/bin/env python3
import os
import json

WEBSITE_ROOT = "/Users/m/mrmr/mrmahesh"
GUIDES_DIR = os.path.join(WEBSITE_ROOT, "_guides")
os.makedirs(GUIDES_DIR, exist_ok=True)

BATCH_4_GUIDES = [
    # 1. Linux Performance & Kernel Tracing
    {
        "filename": "2027-01-04-bcache-hybrid-storage.md",
        "title": "Linux bcache: Accelerating HDDs with NVMe SSD Caching",
        "category": "Homelab",
        "tags": ["storage", "linux", "performance", "homelab"],
        "challenge": "What is the difference between bcache's `writethrough` and `writeback` caching modes?",
        "answer": "`writethrough` writes data to both the fast SSD cache and the slow backing HDD simultaneously (safe against SSD failure, but slower writes). `writeback` writes data to the SSD immediately and flushes to HDD later (maximum write speed, requires battery/UPS protection).",
        "concept": "**bcache** is a Linux kernel block layer cache. It allows fast SSDs or NVMe drives to act as read/write caches for large, slow mechanical hard drives, delivering SSD-like random I/O speeds on multi-terabyte storage arrays.",
        "reasoning": "Pair a cheap 256GB NVMe SSD with a 16TB HDD using bcache writeback mode to eliminate Plex media library and torrent random I/O lag without buying expensive all-flash storage.",
        "how": "```bash\n# 1. Format caching device (SSD) and backing device (HDD):\nsudo make-bcache -B /dev/sdb -C /dev/nvme0n1p1\n\n# 2. Attach cache set to backing disk:\necho <CACHE_SET_UUID> | sudo tee /sys/block/bcache0/bcache/attach\n\n# 3. Set writeback caching mode:\necho writeback | sudo tee /sys/block/bcache0/bcache/cache_mode\n```"
    },
    {
        "filename": "2027-01-05-ebpf-bcc-tools-tracing.md",
        "title": "eBPF System Tracing with BCC Tools",
        "category": "DevOps",
        "tags": ["linux", "ebpf", "debugging", "performance"],
        "challenge": "Why are modern eBPF tracing tools significantly safer to run in production than legacy kernel modules or `strace`?",
        "answer": "eBPF programs are verified by an in-kernel safety checker before execution, guaranteeing they cannot crash the kernel, loop infinitely, or corrupt system memory, with near-zero (<1%) performance overhead.",
        "concept": "**eBPF (Extended Berkeley Packet Filter)** runs sandboxed programs in the Linux kernel without changing kernel source code. **BCC (BPF Compiler Collection)** provides utilities (`opensnoop`, `execsnoop`, `biolatency`) for real-time kernel observability.",
        "reasoning": "Use `execsnoop` to catch short-lived ephemeral processes that spike CPU and disappear before `top` can register them.",
        "how": "```bash\n# 1. Trace all new processes being executed across the system:\nsudo execsnoop-bpfcc\n\n# 2. Trace all files being opened in real-time:\nsudo opensnoop-bpfcc\n\n# 3. Measure disk I/O latency histogram:\nsudo biolatency-bpfcc 1 10\n```"
    },
    {
        "filename": "2027-01-06-nvme-cli-smart-endurance.md",
        "title": "NVMe SSD Health, Wear-Leveling & TBW with nvme-cli",
        "category": "Homelab",
        "tags": ["hardware", "storage", "linux", "nvme"],
        "challenge": "How do you calculate the remaining lifespan percentage of an NVMe SSD using `nvme-cli`?",
        "answer": "Run `sudo nvme smart-log /dev/nvme0`. Inspect the `percentage_used` field. A value of `15%` means 15% of the manufacturer's rated endurance has been consumed (85% lifespan remains).",
        "concept": "Unlike SATA drives which use `smartctl`, NVMe drives use direct PCIe interfaces managed via **`nvme-cli`**. It reports Total Bytes Written (TBW), temperature thresholds, spare block availability, and unsafe shutdown counts.",
        "reasoning": "Monitor NVMe percentage used and critical warnings on homelab nodes to replace failing boot drives before silent data corruption occurs.",
        "how": "```bash\n# 1. Inspect SMART health log and wear percentage:\nsudo nvme smart-log /dev/nvme0n1\n\n# 2. List all NVMe namespaces and controller firmwares:\nsudo nvme list\n\n# 3. Check for media errors and temperature throttle events:\nsudo nvme error-log /dev/nvme0n1\n```"
    },
    {
        "filename": "2027-01-07-luks-disk-encryption.md",
        "title": "Full Disk Encryption with LUKS & cryptsetup",
        "category": "Cybersecurity",
        "tags": ["security", "encryption", "storage", "linux"],
        "challenge": "What happens to data on a LUKS-encrypted drive if someone steals the physical hard drive from your server rack?",
        "answer": "All sectors on the physical disk appear as high-entropy random noise. Without the master decryption passphrase or keyfile, the data cannot be read or mounted.",
        "concept": "**LUKS (Linux Unified Key Setup)** is the standard for Linux block-device encryption. Using **`cryptsetup`**, it maps raw encrypted disk partitions to decrypted virtual block devices in `/dev/mapper/` using AES-XTS-256.",
        "reasoning": "Encrypt all backup drives and off-site NAS disks with LUKS so that disposed or stolen hardware cannot expose personal data or server secrets.",
        "how": "```bash\n# 1. Format partition with LUKS AES-256 encryption:\nsudo cryptsetup luksFormat /dev/sdb1\n\n# 2. Unlock and open encrypted volume:\nsudo cryptsetup open /dev/sdb1 secure_storage\n\n# 3. Format and mount decrypted virtual block device:\nsudo mkfs.ext4 /dev/mapper/secure_storage\nsudo mount /dev/mapper/secure_storage /mnt/secure\n\n# 4. Lock and close volume when unmounted:\nsudo umount /mnt/secure\nsudo cryptsetup close secure_storage\n```"
    },
    {
        "filename": "2027-01-08-iscsi-target-multipath.md",
        "title": "Enterprise Storage: iSCSI Targets & Multipath I/O",
        "category": "Homelab",
        "tags": ["storage", "networking", "homelab", "iscsi"],
        "challenge": "What is the key difference between NFS file shares and iSCSI block storage?",
        "answer": "NFS shares files over the network (file-level storage). iSCSI presents remote server storage as raw physical unformatted hard drive blocks (block-level storage), allowing the client to format it with its own native filesystem (e.g. ext4, ZFS).",
        "concept": "**iSCSI (Internet Small Computer Systems Interface)** transports raw block commands over IP networks. **Multipath I/O** bonds multiple Ethernet cables between server and NAS, providing failover redundancy and aggregated bandwidth.",
        "reasoning": "Use iSCSI with TrueNAS or Proxmox to give virtual machines high-speed block storage over a dedicated 10GbE network.",
        "how": "```bash\n# 1. Discover iSCSI targets on NAS:\nsudo iscsiadm -m discovery -t sendtargets -p 192.168.20.182\n\n# 2. Log in and attach iSCSI block device:\nsudo iscsiadm -m node -T iqn.2026-01.com.mrmahesh:storage.target1 -p 192.168.20.182 --login\n\n# 3. Check attached block disk:\nlsblk\n```"
    },
    {
        "filename": "2027-01-09-linux-oom-score-adj.md",
        "title": "Linux OOM Killer Priority & oom_score_adj",
        "category": "DevOps",
        "tags": ["linux", "performance", "memory"],
        "challenge": "How do you protect a critical process (like SSH daemon or a master database) from ever being killed by the Linux Out-Of-Memory (OOM) killer?",
        "answer": "Set its `oom_score_adj` value to `-1000`. A value of `-1000` completely immunizes the process from OOM termination.",
        "concept": "When system RAM is completely exhausted, the Linux kernel **OOM Killer** assigns a score (0 to 1000) to every process based on memory usage. The process with the highest score is terminated with `SIGKILL` (exit code 137).",
        "reasoning": "Lower the `oom_score_adj` on SSHD and your primary database, while increasing it (+500) on dispensable background video transcoding workers.",
        "how": "```bash\n# 1. Check a process's current OOM score:\ncat /proc/1234/oom_score\n\n# 2. Immunize critical process from OOM kills:\necho -1000 | sudo tee /proc/1234/oom_score_adj\n\n# 3. Configure via Systemd Unit:\n# In [Service] block:\nOOMScoreAdjust=-500\n```"
    },
    {
        "filename": "2027-01-10-tuned-performance-profiles.md",
        "title": "Linux Performance Profiles with tuned-adm",
        "category": "DevOps",
        "tags": ["linux", "performance", "tuning"],
        "challenge": "What `tuned-adm` profile optimizes Linux for low-latency network packet handling and CPU governor throughput?",
        "answer": "`throughput-performance` (or `network-latency`).",
        "concept": "**TuneD** is a dynamic adaptive system tuning daemon for Linux. It monitors system components and adjusts kernel scheduler parameters, CPU governors, disk elevator algorithms, and power states using pre-tested profiles.",
        "reasoning": "Apply `throughput-performance` on virtualization hosts and compute nodes, or `powersave` on low-power Intel NUC home servers.",
        "how": "```bash\n# 1. List available tuning profiles:\ntuned-adm list\n\n# 2. Switch to throughput-performance profile:\nsudo tuned-adm profile throughput-performance\n\n# 3. Verify active profile settings:\ntuned-adm active\n```"
    },
    {
        "filename": "2027-01-11-sar-sysstat-audits.md",
        "title": "Historical Performance Audits with sar & sysstat",
        "category": "DevOps",
        "tags": ["linux", "monitoring", "performance"],
        "challenge": "How do you use `sar` to inspect what CPU utilization was yesterday at 3:00 PM during an unmonitored crash?",
        "answer": "`sar -u -f /var/log/sysstat/sa$(date -d 'yesterday' +%d) -s 14:30:00 -e 15:30:00`",
        "concept": "While `top` shows live CPU metrics, **`sysstat` (`sar`)** records historical CPU, RAM, disk I/O, and network activity in the background every 10 minutes, saving daily binary logs for 30+ days.",
        "reasoning": "When a server crashes overnight and reboots, use `sar` to reconstruct the exact CPU, memory, and disk load leading up to the crash.",
        "how": "```bash\n# 1. View today's CPU usage timeline in 10-minute increments:\nsar -u\n\n# 2. View historical memory and swap usage:\nsar -r\n\n# 3. View network interface bandwidth usage:\nsar -n DEV\n```"
    },
    {
        "filename": "2027-01-12-overlayfs-container-internals.md",
        "title": "Docker Storage Internals: Upper, Lower & Merged OverlayFS",
        "category": "DevOps",
        "tags": ["docker", "storage", "linux"],
        "challenge": "When you edit a file inside a running Docker container, what does OverlayFS do under the hood?",
        "answer": "OverlayFS performs a **Copy-on-Write (CoW)**: it copies the file from the read-only `lowerdir` (image layer) up into the read-write `upperdir` (container layer) and applies changes there, leaving the base image untouched.",
        "concept": "**OverlayFS** is a union mount filesystem. It layers multiple directories onto a single mount point:\n* **`lowerdir`**: Read-only base container image layers.\n* **`upperdir`**: Read-write container layer where changes are written.\n* **`merged`**: Unified filesystem view presented inside the container.",
        "reasoning": "Understanding OverlayFS helps debug why large file writes inside unmounted container paths cause Docker's `/var/lib/docker/overlay2` to rapidly consume all host disk space.",
        "how": "```bash\n# Inspect Docker container's OverlayFS layers:\ndocker inspect my-container | grep -A 10 \"GraphDriver\"\n\n# Manually mount an OverlayFS test:\nsudo mount -t overlay overlay -o lowerdir=/base,upperdir=/changes,workdir=/work /merged\n```"
    },
    {
        "filename": "2027-01-13-auditd-security-monitoring.md",
        "title": "Linux Security Auditing: Tracking File Access with auditd",
        "category": "Cybersecurity",
        "tags": ["linux", "security", "auditing"],
        "challenge": "How do you configure `auditd` to record every time a user or process modifies `/etc/passwd`?",
        "answer": "`sudo auditctl -w /etc/passwd -p wa -k passwd_changes` (`w` = watch path, `p wa` = write and attribute change permissions, `k` = search tag).",
        "concept": "**`auditd`** (Linux Audit Daemon) is the user-space component of the Linux Auditing System. It logs security-relevant events, system call invocations, file access, and user authentications for compliance and forensics.",
        "reasoning": "Configure audit rules on `/etc/shadow`, SSH keys, and system binaries to detect unauthorized file tampering with cryptographic attribution.",
        "how": "```bash\n# 1. Add watch rule for SSH authorized_keys:\nsudo auditctl -w /home/m/.ssh/authorized_keys -p wa -k ssh_key_tamper\n\n# 2. Search audit logs for specific key events:\nsudo ausearch -k ssh_key_tamper --interpret\n\n# 3. Generate human-readable audit report:\nsudo aureport --file\n```"
    }
]

# Generate items 14-50 (37 items)
REMAINING_BATCH_4 = [
    # Kubernetes & Resilience (14-23)
    ("2027-01-14-k8s-pod-disruption-budgets.md", "Pod Disruption Budgets (PDB) for Zero-Downtime Node Upgrades", "DevOps", ["kubernetes", "reliability", "devops"],
     "What is the purpose of a PodDisruptionBudget (PDB) in Kubernetes during `kubectl drain` maintenance? A PDB specifies the minimum number of healthy replicas that must remain online simultaneously, preventing cluster maintenance from taking down all application pods at once.",
     "When upgrading Kubernetes worker nodes, `kubectl drain` evicts pods. A **PDB** ensures high-availability services retain quorum during rolling node restarts.",
     "Define PDBs for all multi-replica deployments (databases, APIs) to guarantee zero downtime during cluster kernel upgrades.",
     "```yaml\napiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: cms-pdb\n  namespace: media\nspec:\n  minAvailable: 1\n  selector:\n    matchLabels:\n      app: mrmahesh-cms\n```"),

    ("2027-01-15-k8s-topology-spread-constraints.md", "Kubernetes Topology Spread Constraints", "DevOps", ["kubernetes", "scheduling", "scaling"],
     "How do Topology Spread Constraints differ from Pod Anti-Affinity? Pod Anti-Affinity is binary (schedule or don't schedule). Topology Spread Constraints evenly distribute pods across failure domains (nodes, racks, zones) based on a configured `maxSkew` ratio.",
     "**Topology Spread Constraints** prevent Kubernetes from accidentally placing all 4 replicas of a service on the same physical server.",
     "Use topology spreading across multi-node homelabs so pods are evenly balanced across physical hardware.",
     "```yaml\nspec:\n  topologySpreadConstraints:\n    - maxSkew: 1\n      topologyKey: kubernetes.io/hostname\n      whenUnsatisfiable: DoNotSchedule\n      labelSelector:\n        matchLabels:\n          app: mrmahesh-cms\n```"),

    ("2027-01-16-k8s-kube-bench-cis-hardening.md", "Cluster Hardening with kube-bench & CIS Benchmarks", "Cybersecurity", ["kubernetes", "security", "devops"],
     "What standard does `kube-bench` test against to verify Kubernetes security posture? The **Center for Internet Security (CIS) Kubernetes Benchmark**.",
     "**kube-bench** runs automated security checks against master and worker node configurations (checking etcd encryption, anonymous auth flags, file permissions).",
     "Run `kube-bench` as a Kubernetes Job to generate automated security compliance scorecards.",
     "```bash\n# Run kube-bench on master control plane node:\nkubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml\nkubectl logs job/kube-bench\n```"),

    ("2027-01-17-k8s-coredns-troubleshooting.md", "Debugging CoreDNS Resolution Failures in Kubernetes", "DevOps", ["kubernetes", "dns", "networking"],
     "Why does the default `ndots:5` configuration in Linux Kubernetes pods cause slow DNS resolution times? `ndots:5` forces the resolver to append internal cluster search domains (`.media.svc.cluster.local`, `.svc.cluster.local`) before querying public external domains (`google.com`), generating 4 failed DNS lookups per external request.",
     "**CoreDNS** handles internal DNS lookups for Kubernetes Services. Understanding DNS search paths helps troubleshoot service discovery timeouts.",
     "Inspect CoreDNS logs and adjust `dnsConfig` in Pod specs to optimize external API latency.",
     "```yaml\nspec:\n  dnsConfig:\n    options:\n      - name: ndots\n        value: \"2\"\n```"),

    ("2027-01-18-k8s-ephemeral-storage-limits.md", "Protecting Nodes with Ephemeral Storage Limits", "DevOps", ["kubernetes", "storage", "devops"],
     "What happens to a Pod when its container writes 20GB of temporary files to unmounted `/tmp` and exceeds its `ephemeral-storage` limit? The kubelet evicts the Pod immediately to protect the host node's root filesystem from running out of disk space.",
     "**Ephemeral Storage** encompasses container rootfs writable layers, emptyDir volumes, and container logs.",
     "Always specify ephemeral storage requests and limits alongside CPU and Memory limits.",
     "```yaml\nresources:\n  requests:\n    ephemeral-storage: \"500Mi\"\n  limits:\n    ephemeral-storage: \"2Gi\"\n```"),

    ("2027-01-19-k8s-init-containers-database-check.md", "Pre-Flight Checks with Kubernetes Init Containers", "DevOps", ["kubernetes", "devops"],
     "How do Init Containers guarantee that an application web server does not boot before its backend PostgreSQL database is ready to accept connections? Init Containers run sequentially to completion *before* main app containers start. If the init container script loops waiting for port 5432, the main app will not start until the database responds.",
     "**Init Containers** perform pre-flight setup (running schema migrations, downloading assets, waiting for dependencies).",
     "Add an init container with `nc` or `pg_isready` to prevent crash-looping web apps during cluster boot.",
     "```yaml\nspec:\n  initContainers:\n    - name: wait-for-postgres\n      image: busybox:latest\n      command: ['sh', '-c', 'until nc -z postgres-service 5432; do echo waiting for db; sleep 2; done;']\n  containers:\n    - name: app\n      image: mrmahesh-cms:latest\n```"),

    ("2027-01-20-k8s-security-contexts.md", "Hardening Pod Security Contexts", "Cybersecurity", ["kubernetes", "security"],
     "What three security settings should be enabled in every production Kubernetes `securityContext`? `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, and `allowPrivilegeEscalation: false`.",
     "**Security Contexts** define privilege and access control settings for Pods and Containers in Kubernetes.",
     "Enforce non-root execution and drop all default Linux capabilities (`capabilities: drop: ['ALL']`) to prevent container breakout exploits.",
     "```yaml\nsecurityContext:\n  runAsNonRoot: true\n  runAsUser: 10001\n  allowPrivilegeEscalation: false\n  readOnlyRootFilesystem: true\n  capabilities:\n    drop:\n      - ALL\n```"),

    # Modern Networking & Protocols (21-30)
    ("2027-01-21-vlan-segmentation-managed-switches.md", "802.1Q VLANs: Isolating IoT Devices from Servers", "Homelab", ["networking", "security", "homelab"],
     "Why should smart home IoT devices (smart plugs, Chinese cameras) be isolated on a separate VLAN from your NAS and servers? IoT devices often have unpatched vulnerabilities and unverified cloud connections. An isolated IoT VLAN blocks compromised devices from scanning or attacking internal servers.",
     "**802.1Q VLANs** divide a single physical network switch into multiple isolated virtual networks.",
     "Configure router firewall rules to allow one-way established traffic from your trusted LAN to IoT devices, while dropping all initiated connections from IoT to LAN.",
     "```text\n# VLAN Scheme Example:\n# VLAN 10 (Trusted Core): 192.168.10.0/24 (Servers, PCs)\n# VLAN 20 (IoT Smart Home): 192.168.20.0/24 (Cameras, Thermostats)\n# VLAN 30 (Guest): 192.168.30.0/24\n```"),

    ("2027-01-22-http3-quic-protocols.md", "HTTP/3 & QUIC: Zero-RTT Handshakes over UDP", "DevOps", ["networking", "http3", "performance"],
     "Why does HTTP/3 run over UDP instead of TCP? TCP connections suffer from **Head-of-Line (HoL) Blocking**—if one packet is lost, all streams stall. QUIC runs over UDP with independent multiplexed streams, so packet loss in one stream never blocks other streams.",
     "**HTTP/3** replaces TCP and TLS with **QUIC (Quick UDP Internet Connections)**, offering faster connection establishment (0-RTT) and smooth mobile Wi-Fi-to-cellular IP roaming.",
     "Enable HTTP/3 in Nginx or Cloudflare to accelerate mobile asset delivery.",
     "```nginx\n# Enable HTTP/3 (QUIC) in Nginx\nlisten 443 quic reuseport;\nlisten 443 ssl;\nadd_header Alt-Svc 'h3=\":443\"; ma=86400';\n```"),

    ("2027-01-23-dnssec-cryptographic-validation.md", "DNSSEC: Cryptographic Signatures & Anti-Spoofing", "Cybersecurity", ["dns", "security"],
     "How does DNSSEC protect users from DNS cache poisoning attacks? Authoritative DNS zones sign their DNS records with public-key cryptography (RRSIG). Resolvers verify the cryptographic chain of trust up to the root zone, rejecting forged DNS responses.",
     "**DNSSEC (DNS Security Extensions)** adds cryptographic authentication to DNS records, preventing attackers from redirecting domain traffic to phishing IP addresses.",
     "Enable DNSSEC in Cloudflare registrar and verify signatures with `dig +dnssec`.",
     "```bash\n# Verify DNSSEC signature on a domain:\ndig +dnssec +multiline mrmahesh.com\n# Look for RRSIG and ad (Authenticated Data) flag in response\n```"),

    ("2027-01-24-wireguard-site-to-site-vpn.md", "Site-to-Site WireGuard VPN: Linking Physical Homelabs", "Homelab", ["vpn", "networking", "homelab"],
     "How does a Site-to-Site VPN allow all devices in Location A (`192.168.10.0/24`) to reach devices in Location B (`192.168.20.0/24`) without installing VPN software on individual clients? The gateway routers at both locations maintain a persistent WireGuard tunnel and route entire subnet IP ranges across the tunnel.",
     "**Site-to-Site VPN** joins two separate physical networks into a single cohesive routing domain.",
     "Connect your home server lab to a remote backup server at a family member's house for off-site backups.",
     "```ini\n# Gateway A /etc/wireguard/wg0.conf\n[Peer]\nPublicKey = <Gateway_B_PublicKey>\nEndpoint = remote-location.duckdns.org:51820\nAllowedIPs = 192.168.20.0/24, 10.100.0.2/32\nPersistentKeepalive = 25\n```"),

    ("2027-01-25-network-jumbo-frames-10gbe.md", "10GbE Network Tuning: 9000 MTU Jumbo Frames", "Homelab", ["networking", "hardware", "performance"],
     "Why do 9000 MTU Jumbo Frames reduce CPU usage and increase throughput on 10GbE storage networks? Standard 1500 MTU requires 830,000 packet interrupts per second for 10Gbps transfer. Jumbo frames increase payload size 6x, reducing packet processing interrupts to 138,000 per second.",
     "**Jumbo Frames** increase Ethernet Maximum Transmission Unit (MTU) from 1500 to 9000 bytes.",
     "Enable 9000 MTU exclusively on dedicated storage VLANs (NFS/iSCSI) where all switches and NICs support it.",
     "```bash\n# Set MTU to 9000 on 10GbE interface:\nsudo ip link set eth1 mtu 9000\n\n# Verify Jumbo Frames connectivity without fragmentation:\nping -M do -s 8972 192.168.20.182\n```"),

    ("2027-01-26-ssh-ca-certificates.md", "Enterprise SSH: Replacing authorized_keys with an SSH CA", "Cybersecurity", ["ssh", "security", "devops"],
     "Why is an SSH Certificate Authority (CA) vastly easier to manage than copying public keys to hundreds of servers? Instead of editing `authorized_keys` on every server, you sign user keys with your private SSH CA. Servers trust any key signed by the CA, with built-in certificate expiration.",
     "**SSH Certificates** allow short-lived, role-based SSH access with automated expiration (e.g. valid for 8 hours).",
     "Deploy Step-CA or Smallstep SSH CA for zero-touch credential revocation across homelab fleets.",
     "```bash\n# Sign user public key with CA key for 8 hours:\nssh-keygen -s ca_key -I mahesh -V +8h -n m,root id_ed25519.pub\n\n# Configure servers in /etc/ssh/sshd_config:\n# TrustedUserCAKeys /etc/ssh/ca.pub\n```"),

    ("2027-01-27-haproxy-stick-tables-rate-limiting.md", "HAProxy Stick Tables: Distributed Rate Limiting", "Cybersecurity", ["haproxy", "security", "networking"],
     "How do HAProxy Stick Tables track abusive IP addresses across millions of concurrent requests in memory? Stick Tables store client IP keys and request counters directly in in-memory hash tables, evaluating request rates in sub-microseconds.",
     "**Stick Tables** provide stateful in-memory tracking in HAProxy for sticky sessions, rate limiting, and DDoS mitigation.",
     "Drop abusive scraping bots before they reach backend Kubernetes pods.",
     "```haproxy\nfrontend http_in\n    bind *:80\n    stick-table type ip size 100k expire 10s store http_req_rate(10s)\n    tcp-request content track-sc0 src\n    tcp-request content reject if { sc_http_req_rate(0) gt 50 }\n```"),

    # Databases, Caching & Queues (31-40)
    ("2027-01-28-postgres-wal-streaming-replication.md", "PostgreSQL Streaming Replication & WAL Shipping", "DevOps", ["database", "postgres", "backup"],
     "What is the role of the Write-Ahead Log (WAL) in PostgreSQL replication? Every database change is recorded sequentially to WAL files before being applied to data pages. Primary servers stream WAL records to replicas, which replay the exact transactions in real time.",
     "**Streaming Replication** provides byte-for-byte read replicas and automated hot-standby failovers.",
     "Set up a streaming replica on a secondary homelab node for zero-downtime database maintenance.",
     "```bash\n# Take a physical base backup from replica node:\npg_basebackup -h 192.168.20.182 -D /var/lib/postgresql/data -U replicator -P -v -R\n```"),

    ("2027-01-29-postgres-gin-btree-indexes.md", "PostgreSQL Index Architectures: B-Tree vs. GIN vs. GiST", "DevOps", ["database", "postgres", "performance"],
     "When should you use a GIN index instead of a standard B-Tree index in PostgreSQL? Use **GIN (Generalized Inverted Index)** for composite data types (JSONB document search, full-text search tsvector, and arrays). Use **B-Tree** for standard equality (`=`) and range (`<`, `>`) queries.",
     "Choosing the correct index type reduces query search time from seconds to milliseconds on large tables.",
     "Index JSONB metadata columns with GIN to support fast key-value lookups.",
     "```sql\n-- Create B-Tree index for dates\nCREATE INDEX idx_guides_date ON guides(date);\n\n-- Create GIN index for JSONB tags\nCREATE INDEX idx_guides_tags ON guides USING gin (tags);\n```"),

    ("2027-01-30-redis-sentinel-high-availability.md", "Redis Sentinel: Automated Master-Replica Failover", "DevOps", ["redis", "database", "clustering"],
     "How does Redis Sentinel detect that a master Redis node has crashed and execute a failover? Sentinel nodes continuously ping the master. When a quorum of Sentinels agree the master is unresponsive (ODOWN), they elect a leader to promote a replica to new master automatically.",
     "**Redis Sentinel** provides automated monitoring, notifications, and master failover for Redis clusters.",
     "Deploy 3 Sentinel instances in Kubernetes to ensure caching layers survive pod crashes.",
     "```ini\n# sentinel.conf\nsentinel monitor mymaster 192.168.20.182 6379 2\nsentinel down-after-milliseconds mymaster 5000\nsentinel failover-timeout mymaster 10000\n```"),

    ("2027-01-31-rabbitmq-exchanges-queues-dlx.md", "RabbitMQ: Exchanges, Queues & Dead-Letter Exchanges (DLX)", "DevOps", ["rabbitmq", "microservices", "devops"],
     "What happens to a message when it fails processing 3 times in RabbitMQ if a Dead-Letter Exchange (DLX) is configured? RabbitMQ routes the failed message to the DLX, which stores it in a dedicated error quarantine queue for debugging without blocking incoming message processing.",
     "**RabbitMQ** coordinates asynchronous task queues between microservices using Direct, Topic, and Fanout exchanges.",
     "Use Dead-Letter Exchanges to handle transient API failures and retry workflows gracefully.",
     "```json\n{\n  \"x-dead-letter-exchange\": \"failed_tasks_dlx\",\n  \"x-message-ttl\": 60000\n}\n```"),

    ("2027-02-01-kafka-event-streaming-partitions.md", "Apache Kafka: Topics, Partitions & Consumer Groups", "DevOps", ["kafka", "streaming", "devops"],
     "How does Kafka allow 10 consumer instances to process messages from a single topic concurrently? The topic is divided into multiple **Partitions**. Each consumer in a **Consumer Group** is assigned exclusive ownership of a specific partition, enabling parallel stream processing.",
     "**Apache Kafka** is a distributed event store and stream processing platform designed for high-throughput log ingestion.",
     "Use Kafka partitions to scale event streams across multiple worker microservices.",
     "```bash\n# Create a Kafka topic with 3 partitions and replication factor 2:\nkafka-topics.sh --create --topic user-events --partitions 3 --replication-factor 2 --bootstrap-server localhost:9092\n```"),

    ("2027-02-02-sqlite-wal-mode-concurrency.md", "SQLite WAL Mode: High-Concurrency Multithreading", "DevOps", ["sqlite", "database", "performance"],
     "Why does enabling WAL (Write-Ahead Logging) mode in SQLite dramatically improve multithreaded web application performance? In default rollback journal mode, writing locks the entire database file from readers. In WAL mode, **readers never block writers, and writers never block readers**.",
     "**SQLite WAL Mode** writes new transactions to a separate `-wal` file, allowing continuous concurrent read queries.",
     "Always execute `PRAGMA journal_mode=WAL;` on SQLite databases used in web servers (like our Custom CMS).",
     "```sql\n-- Enable WAL mode for high-concurrency web apps\nPRAGMA journal_mode=WAL;\nPRAGMA synchronous=NORMAL;\nPRAGMA busy_timeout=5000;\n```"),

    ("2027-02-03-clickhouse-columnar-analytics.md", "ClickHouse: Columnar Databases for Real-Time Analytics", "DevOps", ["clickhouse", "database", "analytics"],
     "Why is ClickHouse 100x faster than PostgreSQL or MySQL for calculating aggregate metrics (like `COUNT(DISTINCT user_id)`) across 500 million rows? ClickHouse is a **Column-Oriented DBMS**—it reads only the specific column requested from disk, ignoring all other table columns and compressing data heavily with vector SIMD instructions.",
     "**ClickHouse** is built for real-time analytical reporting (OLAP), server log aggregation, and user telemetry.",
     "Use ClickHouse to ingest and query billions of server log lines and Prometheus metrics with sub-second response times.",
     "```sql\nCREATE TABLE server_logs (\n    timestamp DateTime,\n    ip String,\n    status UInt16,\n    duration_ms Float32\n) ENGINE = MergeTree()\nORDER BY (timestamp, status);\n```"),

    ("2027-02-04-etcd-raft-consensus.md", "Distributed Consensus: How etcd Uses the Raft Protocol", "DevOps", ["etcd", "kubernetes", "clustering"],
     "Why must an etcd cluster ALWAYS contain an odd number of nodes (3, 5, 7)? Raft consensus requires a strict majority **Quorum** ($N/2 + 1$) to elect leaders and commit writes. A 3-node cluster can survive 1 failure ($3/2 + 1 = 2$). A 4-node cluster also requires 3 nodes for quorum, adding hardware without improving fault tolerance.",
     "**etcd** is the distributed, reliable key-value store that holds the entire configuration state of every Kubernetes cluster.",
     "Maintain 3-node etcd topologies to guarantee quorum survivability during server maintenance.",
     "```bash\n# Check etcd cluster health and member list:\netcdctl endpoint health --write-out=table\netcdctl member list\n```"),

    # Cloud-Native Security & Ethical Hacking (41-50)
    ("2027-02-05-falco-ebpf-runtime-security.md", "Falco: eBPF Cloud-Native Runtime Security", "Cybersecurity", ["security", "kubernetes", "ebpf"],
     "How does Falco detect an attacker spawning a reverse shell inside a Kubernetes container? Falco intercepts Linux kernel system calls via eBPF. When it detects a shell execution (`execve`) inside a container namespace spawned by a web server process (`nginx`), it triggers an immediate security alert.",
     "**Falco** is the CNCF standard for runtime security detection in Kubernetes, Linux hosts, and cloud platforms.",
     "Deploy Falco as a DaemonSet to detect privilege escalations, unauthorized file modifications, and container breakouts in real time.",
     "```yaml\n# Falco Detection Rule\n- rule: Terminal shell in container\n  desc: A shell was spawned inside a container\n  condition: container and evt.type = execve and proc.name in (bash, sh, zsh)\n  output: \"⚠️ CRITICAL: Shell spawned in container (%container.name) by user (%user.name)\"\n  priority: CRITICAL\n```"),

    ("2027-02-06-trivy-container-vulnerability-scanning.md", "Container Security: Scanning Images with Trivy", "Cybersecurity", ["security", "docker", "cicd"],
     "What does Trivy scan for inside a Docker container image? OS package vulnerabilities (Debian/Alpine CVEs), language dependency vulnerabilities (npm, pip, go.mod), misconfigured Dockerfile commands, and leaked API keys/secrets.",
     "**Trivy** is a fast vulnerability and secret scanner for container images, Git repositories, and Kubernetes manifests.",
     "Integrate Trivy into GitHub Actions CI pipelines to block deployment of images with Critical CVEs.",
     "```bash\n# Scan a Docker image and exit with error code 1 if CRITICAL vulnerabilities exist:\ntrivy image --severity HIGH,CRITICAL --exit-code 1 mrmahesh-cms:latest\n```"),

    ("2027-02-07-cosign-container-signing.md", "Supply Chain Security: Signing Images with Cosign", "Cybersecurity", ["security", "docker", "kubernetes"],
     "How does Cosign verify that a Docker container running in Kubernetes was built by your official CI/CD pipeline and not tampered with by an attacker? Cosign signs the cryptographic hash (digest) of the container image using private keypairs. Kubernetes admission controllers verify the signature before allowing the pod to pull the image.",
     "**Cosign (Sigstore)** provides container signing, verification, and software supply chain integrity.",
     "Sign all production container images during GitHub Actions builds.",
     "```bash\n# 1. Sign container image with Cosign:\ncosign sign --key cosign.key 192.168.20.182:5000/mrmahesh-cms:latest\n\n# 2. Verify signature:\ncosign verify --key cosign.pub 192.168.20.182:5000/mrmahesh-cms:latest\n```"),

    ("2027-02-08-semgrep-static-code-analysis.md", "Static Application Security Testing (SAST) with Semgrep", "Cybersecurity", ["security", "cicd", "code-quality"],
     "How does Semgrep find security vulnerabilities in source code faster and more accurately than regex grep? Semgrep parses source code into an **Abstract Syntax Tree (AST)**, understanding variables, scopes, and data flow patterns rather than naive string matching.",
     "**Semgrep** is a lightweight static analysis engine for finding bugs, enforcing standards, and detecting OWASP Top 10 vulnerabilities.",
     "Run Semgrep in pre-commit hooks to catch SQL injection and hardcoded keys before code leaves developer machines.",
     "```bash\n# Scan current codebase with standard OWASP security ruleset:\nsemgrep scan --config auto .\n```"),

    ("2027-02-09-suricata-ids-ips-monitoring.md", "Network Intrusion Detection (IDS) with Suricata", "Cybersecurity", ["security", "networking", "firewall"],
     "What is the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)? An **IDS** inspects a mirror of network traffic and alerts on threats without interfering. An **IPS** sits inline in the network path and actively drops malicious packets in real time.",
     "**Suricata** is an open-source threat detection engine capable of multi-gigabit network intrusion detection (IDS), inline intrusion prevention (IPS), and network security monitoring.",
     "Deploy Suricata on your router/gateway to detect Cobalt Strike beacons and port scan probes across your LAN.",
     "```bash\n# Run Suricata inspecting interface eth0:\nsudo suricata -c /etc/suricata/suricata.yaml -i eth0\n\n# View live threat alerts:\nsudo tail -f /var/log/suricata/fast.log\n```"),

    ("2027-02-10-ssrf-server-side-request-forgery.md", "Server-Side Request Forgery (SSRF) Attacks & Cloud Metadata", "Cybersecurity", ["security", "web", "api"],
     "How do attackers exploit SSRF vulnerabilities to steal IAM credentials from cloud instances? If a web server fetches a user-supplied URL without validation, an attacker inputs `http://169.254.169.254/latest/meta-data/` (the internal Cloud Metadata Service IP) to extract temporary root credentials.",
     "**SSRF** occurs when a backend web application fetches a remote resource requested by a user without validating whether the target IP is an internal private network address (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`).",
     "Block private IP ranges and require strict hostname whitelisting in any backend service that makes outbound HTTP requests.",
     "```javascript\n// Safe URL Fetch Validator\nconst ipaddr = require('ipaddr.js');\n\nfunction isSafeUrl(targetUrl) {\n    const ip = resolveDns(targetUrl.hostname);\n    const addr = ipaddr.parse(ip);\n    // Reject private and loopback IP addresses\n    if (addr.range() === 'private' || addr.range() === 'loopback') {\n        throw new Error('SSRF Attempt Blocked: Internal IP address requested');\n    }\n    return true;\n}\n```"),

    ("2027-02-11-oauth2-pkce-flow-security.md", "OAuth 2.0 PKCE: Securing Single Page & Mobile Apps", "Cybersecurity", ["security", "auth", "web"],
     "Why was the Authorization Code Flow with PKCE (Proof Key for Code Exchange) created to replace legacy Implicit Flow in Single Page Apps (SPAs)? Single Page Apps cannot securely store client secrets in public JavaScript. PKCE generates a dynamic cryptographic secret (`code_verifier`) and hash (`code_challenge`) per authorization request, preventing authorization code interception.",
     "**PKCE** is the mandatory security standard for authenticating mobile and single-page web applications with OAuth/OIDC providers (Google, GitHub, Auth0).",
     "Always enforce PKCE across all frontend OAuth2 authentication handlers.",
     "```javascript\n// 1. Generate random code_verifier and SHA-256 challenge:\nconst verifier = generateRandomString(64);\nconst challenge = await sha256Base64Url(verifier);\n\n// 2. Send challenge to authorization endpoint:\n// https://auth.provider.com/authorize?response_type=code&code_challenge_method=S256&code_challenge=...\n```"),

    # Additional 16 Guides to complete the 50 batch
    ("2027-02-12-git-submodules-vs-monorepos.md", "Git Submodules vs. Monorepos: Managing Multi-Repo Projects", "DevOps", ["git", "devops", "architecture"],
     "Why do Git Submodules cause detached HEAD confusion, and how do you update all submodules recursively? Submodules point to a specific commit SHA rather than a branch name. Run `git submodule update --init --recursive` to pull and sync all nested submodule trees.",
     "**Git Submodules** allow you to keep a Git repository as a subdirectory of another Git repository.",
     "Use monorepos with tooling (like Turborepo or Nx) for tightly-coupled apps, and submodules for vendor code libraries.",
     "```bash\n# Clone a repository and initialize all submodules automatically:\ngit clone --recurse-submodules git@github.com:MMVLogic/MrMahesh.com.git\n```"),

    ("2027-02-13-linux-perf-cpu-flamegraphs.md", "CPU Profiling with Linux perf & Brendan Gregg's FlameGraphs", "DevOps", ["linux", "performance", "profiling"],
     "What does a FlameGraph visualize during high CPU load? A **FlameGraph** visualizes profiled software call stacks, where the width of each box represents the percentage of total CPU time consumed by that function.",
     "**`perf`** samples CPU instruction pointers and call stacks at high frequency (99 Hz) to pinpoint CPU hotspots.",
     "Generate SVG FlameGraphs to detect memory reallocation or unoptimized loops in production binaries.",
     "```bash\n# 1. Sample CPU call stacks for 10 seconds across all cores:\nsudo perf record -F 99 -a -g -- sleep 10\n\n# 2. Generate FlameGraph SVG:\nperf script | stackcollapse-perf.pl | flamegraph.pl > flamegraph.svg\n```"),

    ("2027-02-14-nginx-http2-multiplexing.md", "Nginx HTTP/2 Multiplexing & Stream Tuning", "DevOps", ["nginx", "performance", "networking"],
     "How does HTTP/2 multiplexing eliminate the need for domain sharding and CSS/JS image spriting? HTTP/2 sends hundreds of requests and responses concurrently over a single persistent TCP connection using binary framing, eliminating connection setup latency.",
     "Enable HTTP/2 in Nginx to accelerate page load times on mobile and high-latency networks.",
     "Add `http2` to Nginx `listen` directives.",
     "```nginx\nserver {\n    listen 443 ssl http2;\n    server_name mrmahesh.com;\n    ssl_certificate /etc/ssl/cert.pem;\n    ssl_certificate_key /etc/ssl/key.pem;\n}\n```"),

    ("2027-02-15-dns-split-horizon-routing.md", "Split-Horizon DNS: Internal LAN IP vs. External Public IP", "Homelab", ["dns", "networking", "homelab"],
     "Why is Split-Horizon (Hairpin NAT alternative) DNS used in homelabs? When inside your house, `cms.mrmahesh.com` resolves directly to the local LAN IP (`192.168.20.182`). When outside, it resolves to your public WAN IP, avoiding router hairpin NAT slowdowns.",
     "**Split-Horizon DNS** returns different IP addresses for the same domain name based on the client's source IP.",
     "Configure local DNS overrides in Pi-hole/Unbound for all your public domain names.",
     "```text\n# In Pi-hole Local DNS Records:\n192.168.20.182 cms.mrmahesh.com\n192.168.20.182 jellyfin.mrmahesh.com\n```"),

    ("2027-02-16-loki-promtail-grafana-logs.md", "Grafana Loki & Promtail: Lightweight Log Aggregation", "Homelab", ["monitoring", "logs", "grafana"],
     "Why does Grafana Loki consume 90% less RAM and disk storage than Elasticsearch for log aggregation? Loki does not build full-text inverted indexes on log contents; it only indexes metadata stream labels (like Prometheus), storing raw compressed log chunks in object storage.",
     "**Grafana Loki** is a horizontally scalable, multi-tenant log aggregation system paired with **Promtail** log collectors.",
     "Deploy Loki and Promtail in your homelab to search logs across all Docker containers in Grafana using LogQL.",
     "```yaml\n# Promtail config to scrape Docker container logs\nscrape_configs:\n  - job_name: docker\n    static_configs:\n      - targets: ['localhost']\n        labels:\n          job: docker_logs\n          __path__: /var/lib/docker/containers/*/*-json.log\n```"),

    ("2027-02-17-openvpn-pki-easyrsa.md", "OpenVPN Public Key Infrastructure (PKI) with Easy-RSA", "Cybersecurity", ["vpn", "security", "pki"],
     "What is the purpose of generating a Certificate Revocation List (CRL) in OpenVPN? A **CRL** records serial numbers of compromised or revoked client certificates, instructing the OpenVPN server to reject connection attempts from those keys instantly.",
     "**Easy-RSA** is a command-line CA management tool for building and managing a secure Certificate Authority.",
     "Use Easy-RSA to issue individual cryptographic client certificates for each laptop and phone.",
     "```bash\n# Revoke a client certificate:\n./easyrsa revoke client_laptop\n\n# Generate updated CRL and copy to OpenVPN:\n./easyrsa gen-crl\nsudo cp pki/crl.pem /etc/openvpn/server/\n```"),

    ("2027-02-18-docker-layer-caching-buildx.md", "Docker Buildx: Multi-Arch (ARM64/AMD64) Builds with GitHub Cache", "DevOps", ["docker", "cicd", "devops"],
     "How does Docker Buildx build images for both Apple Silicon (ARM64) and Intel/AMD servers (AMD64) on a single build machine? Buildx uses QEMU CPU emulation and BuildKit to compile multi-architecture container manifests simultaneously.",
     "**Docker Buildx** compiles multi-platform container images and pushes multi-arch manifest lists to registries.",
     "Use Buildx in CI/CD pipelines to ensure containers run natively on Raspberry Pis, Apple M-series chips, and x86 servers.",
     "```bash\n# Build and push multi-arch image:\ndocker buildx build --platform linux/amd64,linux/arm64 -t 192.168.20.182:5000/mrmahesh-cms:latest --push .\n```"),

    ("2027-02-19-k8s-pod-topology-affinity.md", "Kubernetes Pod Affinity & Anti-Affinity Rules", "DevOps", ["kubernetes", "scheduling"],
     "How do you configure Kubernetes to guarantee that two pods of the same database deployment NEVER run on the same physical server? Add `podAntiAffinity` with `topologyKey: kubernetes.io/hostname` and `requiredDuringSchedulingIgnoredDuringExecution`.",
     "**Pod Affinity and Anti-Affinity** allow you to constrain which nodes your Pod can schedule on based on the labels of other Pods already running on the node.",
     "Keep redundant replicas on separate physical machines for high availability.",
     "```yaml\nspec:\n  affinity:\n    podAntiAffinity:\n      requiredDuringSchedulingIgnoredDuringExecution:\n        - labelSelector:\n            matchExpressions:\n              - key: app\n                operator: In\n                values:\n                  - redis-master\n          topologyKey: \"kubernetes.io/hostname\"\n```"),

    ("2027-02-20-linux-capabilities-cap-net-admin.md", "Linux Capabilities: Rootless Port Binding with CAP_NET_BIND_SERVICE", "Cybersecurity", ["linux", "security"],
     "How do you allow a non-root Node.js web server process to bind to privileged low ports (port 80 / 443) without running the app as `root`? Assign the `CAP_NET_BIND_SERVICE` capability to the binary using `setcap`.",
     "**Linux Capabilities** divide root privileges into distinct distinct units (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN`, `CAP_NET_BIND_SERVICE`), eliminating the need for `sudo`.",
     "Apply `CAP_NET_BIND_SERVICE` to web server binaries to run them as unprivileged users.",
     "```bash\n# Grant capability to bind ports <1024 without root:\nsudo setcap 'cap_net_bind_service=+ep' /usr/bin/node\n```"),

    ("2027-02-21-sqlite-vacuum-into.md", "Zero-Downtime SQLite Backups with VACUUM INTO", "DevOps", ["sqlite", "database", "backup"],
     "How does `VACUUM INTO '/backup/db.sqlite'` provide a transactionally-consistent backup without locking active database writes? `VACUUM INTO` creates a clean, defragmented copy of the database into a target file atomically using WAL snapshots while active readers and writers continue uninterrupted.",
     "Introduced in SQLite 3.27, **`VACUUM INTO`** is the standard for live, non-blocking automated database backups.",
     "Schedule daily `VACUUM INTO` cron scripts for all SQLite-backed web apps.",
     "```sql\n-- Create live atomic backup file\nVACUUM INTO '/backup/cms-backup-2027-02-21.db';\n```"),

    ("2027-02-22-postgres-pg-stat-statements.md", "Finding Slow Queries with PostgreSQL pg_stat_statements", "DevOps", ["postgres", "database", "performance"],
     "What PostgreSQL extension records execution statistics (total time, call count, buffer hits) for all SQL queries executed on the database? **`pg_stat_statements`**",
     "`pg_stat_statements` normalizes query parameters (e.g. `WHERE id = ?`) and aggregates runtime metrics, identifying the top 5 queries causing 80% of database CPU load.",
     "Enable `pg_stat_statements` in `postgresql.conf` across all database servers.",
     "```sql\n-- Find top 5 queries consuming the most cumulative execution time\nSELECT query, calls, total_exec_time, mean_exec_time\nFROM pg_stat_statements\nORDER BY total_exec_time DESC\nLIMIT 5;\n```"),

    ("2027-02-23-redis-bitmaps-hyperloglog.md", "Redis Advanced Structures: Bitmaps & HyperLogLog", "DevOps", ["redis", "performance", "analytics"],
     "How can Redis count 100 million unique daily website visitors with only 12KB of memory? Using **HyperLogLog (`PFADD`, `PFCOUNT`)**, a probabilistic cardinality estimation algorithm with a standard error rate of under 0.81%.",
     "**Redis Bitmaps** track binary states (e.g. daily user logins) in single bits, and **HyperLogLog** estimates massive distinct set counts in constant memory.",
     "Use HyperLogLog for real-time analytics dashboards without scaling database memory.",
     "```bash\n# Add user IDs to HyperLogLog:\nredis-cli PFADD unique_visitors user_101 user_102 user_103\n\n# Get approximate unique count:\nredis-cli PFCOUNT unique_visitors\n```"),

    ("2027-02-24-graphql-query-depth-security.md", "GraphQL Security: Query Depth Limiting & Cost Analysis", "Cybersecurity", ["security", "api", "web"],
     "How can an attacker trigger a Denial of Service (DoS) attack on a GraphQL server using circular nested queries? By crafting a deeply nested circular query (e.g. `author { books { author { books { ... } } } }`), forcing the server to execute thousands of recursive database queries.",
     "**Query Depth Limiting** rejects incoming GraphQL queries that exceed a maximum nesting depth (e.g. max depth 5).",
     "Configure query complexity and depth analyzers in Apollo Server / Express GraphQL backends.",
     "```javascript\nconst depthLimit = require('graphql-depth-limit');\n\nconst server = new ApolloServer({\n    schema,\n    validationRules: [depthLimit(5)] // Reject queries deeper than 5 levels\n});\n```"),

    ("2027-02-25-ansible-idempotency-best-practices.md", "Ansible Idempotency: Writing Re-runnable Automation", "DevOps", ["ansible", "devops", "automation"],
     "What does it mean for an Ansible playbook to be strictly Idempotent? Running the playbook 10 times in a row produces the exact same system state as running it once, making 0 changes (`changed: 0`) on subsequent runs if the system is already configured correctly.",
     "**Idempotency** guarantees automation safety. Avoid using raw `shell:` or `command:` modules without `creates:` or `changed_when:` guards.",
     "Use native Ansible modules (`apt`, `copy`, `systemd`) instead of shell scripts to preserve idempotency.",
     "```yaml\n# Idempotent task: copies file only if checksum changed\n- name: Deploy custom Nginx config\n  ansible.builtin.template:\n    src: templates/nginx.conf.j2\n    dest: /etc/nginx/nginx.conf\n  notify: Reload Nginx\n```"),

    ("2027-02-26-wireshark-tls-decryption-sslkeylog.md", "Wireshark TLS Decryption with SSLKEYLOGFILE", "Cybersecurity", ["security", "wireshark", "ssl"],
     "How do you inspect the decrypted HTTPS payloads of your local browser in Wireshark without breaking TLS certificates? Set the `SSLKEYLOGFILE` environment variable in Chrome or Firefox. Point Wireshark to that key log file to decrypt and inspect all TLS sessions in plain text.",
     "**SSLKEYLOGFILE** logs client TLS session keys generated during handshakes, allowing packet analyzers to decrypt traffic non-invasively.",
     "Use `SSLKEYLOGFILE` to debug encrypted REST APIs and WebSocket streams.",
     "```bash\n# Launch Chrome with TLS session key logging:\nexport SSLKEYLOGFILE=~/.ssl-keys.log\nopen -a \"Google Chrome\"\n\n# In Wireshark: Preferences > Protocols > TLS > (Pre)-Master-Secret log filename -> ~/.ssl-keys.log\n```"),

    ("2027-02-27-cloudflare-edge-caching-page-rules.md", "Cloudflare Edge Caching & Cache-Everything Rules", "Homelab", ["cloudflare", "performance", "web"],
     "Why does enabling 'Cache Everything' on Cloudflare without excluding admin routes break CMS dashboards? 'Cache Everything' caches HTML responses on Cloudflare's global edge servers. If admin/login HTML pages are cached, public visitors receive cached admin session pages.",
     "**Cloudflare Edge Caching** serves static pages from 300+ global edge locations in under 15ms.",
     "Set Edge Cache TTL to 7 days for public assets, and create an explicit `Bypass Cache` rule for `/admin/*` and `/api/*`.",
     "```text\n# Cloudflare Page Rules Order:\n# Rule 1 (Bypass): cms.mrmahesh.com/admin/* -> Cache Level: Bypass\n# Rule 2 (Bypass): cms.mrmahesh.com/api/*   -> Cache Level: Bypass\n# Rule 3 (Edge Cache): mrmahesh.com/*        -> Cache Level: Cache Everything, Edge TTL: 7 days\n```")
]

created_count = 0

for g in BATCH_4_GUIDES:
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
    created_count += 1

for (fname, title, cat, tags, challenge, concept, reasoning, how) in REMAINING_BATCH_4:
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
    created_count += 1

print(f"[+] Successfully wrote {created_count} study guides to _guides/ directory.")
