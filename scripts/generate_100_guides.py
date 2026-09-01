#!/usr/bin/env python3
import os
import sys
import json
import asyncio

WEBSITE_ROOT = "/Users/m/mrmr/mrmahesh"
GUIDES_DIR = os.path.join(WEBSITE_ROOT, "_guides")
STATE_FILE = os.path.join(WEBSITE_ROOT, "scripts/.generator_state.json")

# Define all 100 active study guide topics
TOPICS = [
    {"id": "git-rebase", "title": "Git Rebase vs. Merge", "category": "DevOps", "tags": ["git", "devops", "vcs"], "prompt": "Git rebase vs merge. Explain why rebase keeps a linear history, how interactive rebase works (squashing), and caution against rebasing public branches."},
    {"id": "git-stash", "title": "Git Stash & Temporary Commits", "category": "DevOps", "tags": ["git", "devops"], "prompt": "Git stash and pop. Explain how to save dirty work directory states without committing, list stashes, and pop them back."},
    {"id": "git-cherry-pick", "title": "Git Cherry-Pick: Snipping Commits", "category": "DevOps", "tags": ["git", "devops"], "prompt": "Git cherry-pick. Explain how to copy a specific commit from one branch to another without merging the whole branch."},
    {"id": "git-workflows", "title": "Git Forking vs. Branching Workflows", "category": "DevOps", "tags": ["git", "devops", "collaboration"], "prompt": "Compare Git Forking workflows (typical open source) vs. Feature Branching workflows (typical internal teams). Explain the trade-offs of pull requests."},
    {"id": "git-hooks", "title": "Git Hooks: Automating Pre-Commit Checks", "category": "DevOps", "tags": ["git", "devops", "automation"], "prompt": "Git hooks. How to write a pre-commit shell script in .git/hooks/ to lint files or block pushing secrets automatically."},
    {"id": "docker-multistage", "title": "Docker Multi-stage Builds", "category": "Homelab", "tags": ["docker", "devops", "build"], "prompt": "Docker multi-stage builds. Explain how to compile code in a builder image and copy artifacts to a tiny runtime image (e.g. alpine) to reduce image sizes."},
    {"id": "docker-networks", "title": "Docker Networks: Bridge vs. Host vs. Macvlan", "category": "Homelab", "tags": ["docker", "networking"], "prompt": "Docker networking modes. Explain bridge networks, direct host port routing, and macvlan (giving a container its own IP on your router)."},
    {"id": "docker-healthcheck", "title": "Docker container Healthchecks", "category": "Homelab", "tags": ["docker", "reliability"], "prompt": "Docker HEALTHCHECK directive. How to write custom checks in a Dockerfile or compose to verify an internal service is responding, not just running."},
    {"id": "docker-registry", "title": "Self-Hosting a Private Docker Registry", "category": "Homelab", "tags": ["docker", "self-hosting"], "prompt": "How to deploy a private docker registry container on a home server, configure credentials, and push/pull custom local images."},
    {"id": "docker-extends", "title": "Docker Compose Extends & DRY Configs", "category": "Homelab", "tags": ["docker", "compose"], "prompt": "Docker Compose 'extends' and anchor templates. How to reuse environment variables, volume mappings, and services to keep docker-compose files DRY (Don't Repeat Yourself)."},
    {"id": "k8s-pod-lifecycle", "title": "Kubernetes Pod Lifecycle & Restart Policies", "category": "DevOps", "tags": ["kubernetes", "devops"], "prompt": "Kubernetes Pod lifecycles (Pending, Running, Succeeded, Failed) and how restartPolicies (Always, OnFailure, Never) affect them."},
    {"id": "k8s-configmaps-secrets", "title": "Kubernetes ConfigMaps & Secrets", "category": "DevOps", "tags": ["kubernetes", "security"], "prompt": "ConfigMaps and Secrets in Kubernetes. Explain how to load config files and passwords into containers via volume mounts and environment variables."},
    {"id": "k8s-services", "title": "Kubernetes Services: ClusterIP, NodePort & LoadBalancer", "category": "DevOps", "tags": ["kubernetes", "networking"], "prompt": "Kubernetes service types. Explain internal routing (ClusterIP), host ports (NodePort), and external routing (LoadBalancer) clearly."},
    {"id": "k8s-namespaces", "title": "Kubernetes Namespaces & Resource Isolation", "category": "DevOps", "tags": ["kubernetes", "devops"], "prompt": "Kubernetes namespaces. How to split a single cluster into virtual spaces for isolating apps (e.g., separating media apps from monitoring tools)."},
    {"id": "k8s-helm", "title": "Kubernetes Helm: The Package Manager", "category": "DevOps", "tags": ["kubernetes", "devops", "helm"], "prompt": "Helm basics. Explain Charts, values overrides, templating manifests, and deploying popular tools (like plex or database servers) in one command."},
    {"id": "k8s-kustomize", "title": "Kubernetes Kustomize: Template-free Overlays", "category": "DevOps", "tags": ["kubernetes", "devops"], "prompt": "Kustomize basics. Explain base and overlay directories, patching configurations for dev/staging environments without Helm templates."},
    {"id": "k8s-rbac", "title": "Kubernetes RBAC: Roles and ServiceAccounts", "category": "DevOps", "tags": ["kubernetes", "security"], "prompt": "Kubernetes Role-Based Access Control (RBAC). Explain Roles, ClusterRoles, ServiceAccounts, and RoleBindings to restrict pod api access."},
    {"id": "k8s-cronjobs", "title": "Kubernetes CronJobs for Batch Tasks", "category": "DevOps", "tags": ["kubernetes", "automation"], "prompt": "Kubernetes CronJobs. How to configure automatic db dumps or log cleanup scripts in a cluster using standard cron formatting."},
    {"id": "k8s-quotas", "title": "Kubernetes Resource Quotas & Limits", "category": "DevOps", "tags": ["kubernetes", "devops"], "prompt": "Kubernetes resource limits and requests. Explain how to set limits on CPU and RAM to prevent single containers from freezing the cluster."},
    {"id": "k8s-networkpolicies", "title": "Kubernetes NetworkPolicies: Cluster Firewalls", "category": "DevOps", "tags": ["kubernetes", "security"], "prompt": "Kubernetes NetworkPolicies. How to isolate pods internally, blocking database pods from taking traffic from anything except designated API servers."},
    {"id": "linux-bg-fg", "title": "Linux Processes: Foreground vs. Background", "category": "DevOps", "tags": ["linux", "processes"], "prompt": "Linux process control. Explain backgrounding tasks (&), pausing jobs (Ctrl+Z), listings (jobs), and bringing tasks back (bg, fg)."},
    {"id": "linux-signals", "title": "Linux Signals: kill, trap, and killall", "category": "DevOps", "tags": ["linux", "processes"], "prompt": "Linux process signals (SIGTERM, SIGKILL, SIGHUP). Explain how they work, how to send them (kill, killall), and trapping signals in scripts."},
    {"id": "linux-links", "title": "Linux Inodes: Soft vs. Hard Links", "category": "DevOps", "tags": ["linux", "filesystem"], "prompt": "Linux link mechanics. Explain hard links vs symbolic links (soft links), disk storage references (inodes), and file deletions."},
    {"id": "linux-tar", "title": "Linux File Archives: tar, gzip, and zip", "category": "DevOps", "tags": ["linux", "storage"], "prompt": "Linux archiving commands. Explain tar options (czf, xzf), gzip, and zip command structures for compressing homelab backups."},
    {"id": "linux-grep-regex", "title": "Linux Text Filters: grep, egrep, and fgrep", "category": "DevOps", "tags": ["linux", "regex"], "prompt": "Grep, egrep, and fgrep. Explain literal matches, regular expressions, recursive lookups, and listing filenames with matches."},
    {"id": "linux-sed", "title": "Linux Stream Editing with sed", "category": "DevOps", "tags": ["linux", "automation"], "prompt": "Sed (Stream Editor) in Linux. How to replace text patterns in file configurations programmatically (like changing configurations in a config file)."},
    {"id": "linux-awk", "title": "Linux Text Processing with awk", "category": "DevOps", "tags": ["linux", "scripting"], "prompt": "Awk text parsing. How to read tabular files, extract specific columns (like printing only IPs from access logs), and calculate sums in lines."},
    {"id": "linux-ports", "title": "Checking Open Ports: netstat, ss, and lsof", "category": "DevOps", "tags": ["linux", "networking"], "prompt": "Network debugging commands in Linux. Explain ss, netstat, and lsof to identify which service PID is listening on a specific port."},
    {"id": "linux-ip-routing", "title": "Linux Networking: ip, ifconfig, and route", "category": "DevOps", "tags": ["linux", "networking"], "prompt": "Linux routing and interfaces. Explain how to check local IPs, list routing tables, check packet paths, and configure static IPs via command line."},
    {"id": "linux-disks", "title": "Disk Management: df, du, and ncdu", "category": "DevOps", "tags": ["linux", "storage"], "prompt": "Linux disk space audits. Compare df (partition usage) vs. du (directory size) vs. ncdu (interactive disk usage analysis)."},
    {"id": "linux-mem", "title": "Linux Memory Management: free, vmstat, and sysctl", "category": "DevOps", "tags": ["linux", "performance"], "prompt": "Checking system RAM usage. Explain free -m, vmstat stats, and tuning system swapping values via sysctl configurations."},
    {"id": "linux-packages", "title": "Linux Package Management: apt vs. dpkg", "category": "DevOps", "tags": ["linux", "devops"], "prompt": "Debian/Ubuntu packages. Explain difference between apt (high-level dependency resolver) and dpkg (low-level deb installer)."},
    {"id": "linux-cpu", "title": "CPU Profiling: top, htop, and load averages", "category": "DevOps", "tags": ["linux", "performance"], "prompt": "Monitoring CPU. Explain htop graphs, processes sorting, and interpreting Linux load averages (1, 5, and 15 minute limits)."},
    {"id": "linux-env", "title": "Environment Variables: export and system configs", "category": "DevOps", "tags": ["linux", "devops"], "prompt": "Managing environment variables. Explain temporary exports, persistent user configuration (~/.bashrc), and system-wide configurations (/etc/environment)."},
    {"id": "systemd-timers", "title": "Systemd Timers vs. Cron Jobs", "category": "DevOps", "tags": ["systemd", "cron", "linux"], "prompt": "Compare Systemd Timers vs traditional Cron. Explain why systemd timers provide better log tracking and dependency structures."},
    {"id": "systemd-journal", "title": "Journalctl: Querying System Logs", "category": "DevOps", "tags": ["systemd", "logs", "linux"], "prompt": "Journalctl log filtering. How to check boot logs, filter by system service units (-u), follow logs (-f), and check kernel warnings."},
    {"id": "bash-errors", "title": "Bash Scripting: Exit Codes & Error Traps", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Bash exit codes. Explain how exit status ($?) works, setting custom exit codes, and using 'trap' to run cleanups on error/cancellation."},
    {"id": "bash-expansions", "title": "Bash Scripting: Shell Parameter Expansion", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Bash parameter expansion. How to extract file extensions, replace substrings, and set default fallback variable values in script code."},
    {"id": "bash-substitution", "title": "Bash Scripting: Command Substitution", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Command substitution ($()). Explain how to capture terminal command outputs directly into bash variables and iterate through lists."},
    {"id": "bash-strings", "title": "Bash Scripting: String Manipulations", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Bash string checks. Explain comparing strings (==, !=), checking for empty variables (-z), and extracting substrings in conditionals."},
    {"id": "bash-getopts", "title": "Bash Scripting: CLI Argument Handling", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Parsing CLI flags in Bash scripts using 'getopts'. How to design flags (e.g. -p, -f) and handle missing inputs gracefully."},
    {"id": "bash-redirection", "title": "Bash Scripting: Output and Error Redirection", "category": "DevOps", "tags": ["bash", "scripting"], "prompt": "Linux stream redirects. Explain stdout (1), stderr (2), append (>>), truncate (>), and redirecting both to logs or /dev/null."},
    {"id": "ssh-keys", "title": "SSH Key Generation: RSA vs. Ed25519", "category": "Cybersecurity", "tags": ["ssh", "cryptography"], "prompt": "SSH cryptographies. Compare RSA keys vs. modern Ed25519 keys. Explain why Ed25519 is faster, smaller, and highly secure."},
    {"id": "ssh-config", "title": "SSH Config File Setup", "category": "DevOps", "tags": ["ssh", "networking"], "prompt": "SSH configurations. How to write a ~/.ssh/config file mapping Host profiles, custom ports, users, and specific key files for quick access."},
    {"id": "ssh-tunnels", "title": "SSH Port Forwarding: Local vs. Remote Tunnels", "category": "Cybersecurity", "tags": ["ssh", "networking"], "prompt": "SSH tunneling. Explain Local port forwarding (-L) vs. Remote port forwarding (-R) for bypassing firewalls and sharing local ports."},
    {"id": "ssh-agent", "title": "SSH Agent Forwarding and Safety", "category": "Cybersecurity", "tags": ["ssh", "security"], "prompt": "SSH Agent forwarding. How to forward local keys to a remote jumpbox (-A) and explain the cybersecurity risks of doing so."},
    {"id": "dns-hosts", "title": "Local Hostname Resolution via /etc/hosts", "category": "Homelab", "tags": ["dns", "linux"], "prompt": "Local hosts mapping. Explain how the /etc/hosts file overrides network DNS and how to route custom local host names to local IPs."},
    {"id": "dns-records", "title": "DNS Record Types: A, CNAME, MX, and TXT", "category": "Homelab", "tags": ["dns", "networking"], "prompt": "Core DNS record types. Explain A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), and TXT (metadata/DKIM/SPF) records casually."},
    {"id": "dns-tools", "title": "DNS Query Utilities: dig, host, and nslookup", "category": "DevOps", "tags": ["dns", "networking"], "prompt": "DNS debugging utilities. Compare dig vs nslookup, how to query specific record types, and tracing recursive server paths."},
    {"id": "ssl-handshake", "title": "SSL/TLS Handshake Explained", "category": "Cybersecurity", "tags": ["ssl", "security"], "prompt": "SSL/TLS handshake phases. Explain asymmetric key swaps, certificate verification, and transitioning to symmetric data encryption."},
    {"id": "ssl-verify", "title": "Verifying SSL Certificates with OpenSSL", "category": "DevOps", "tags": ["ssl", "security"], "prompt": "OpenSSL cli verification. How to check certificate expiration dates, inspect certificate chains, and test cipher suites from the command line."},
    {"id": "ssl-wildcard", "title": "SSL Wildcard Certificates with Let's Encrypt", "category": "Homelab", "tags": ["ssl", "security"], "prompt": "Let's Encrypt wildcard certs. How to use DNS-01 verification with certbot to sign a certificate covering all subdomains (*.mrmahesh.com)."},
    {"id": "nginx-rate-limit", "title": "Nginx Rate Limiting: Throttling Bad Bots", "category": "Cybersecurity", "tags": ["nginx", "security"], "prompt": "Nginx rate limiting configurations. How to use limit_req_zone to block brute force scripts by capping request counts per IP."},
    {"id": "nginx-load-balance", "title": "Nginx Load Balancing: Spreading Web Traffic", "category": "DevOps", "tags": ["nginx", "scaling"], "prompt": "Nginx upstream directives. How to balance incoming web requests across a farm of backend servers using round-robin or least_conn."},
    {"id": "nginx-logs", "title": "Nginx Custom Log Formats", "category": "DevOps", "tags": ["nginx", "monitoring"], "prompt": "Customizing Nginx access logs. How to format logs into JSON or custom layouts to track user-agent metrics and upstream response latency."},
    {"id": "nginx-gzip", "title": "Nginx Gzip Compression: Speeding Up Sites", "category": "DevOps", "tags": ["nginx", "performance"], "prompt": "Nginx compression. How to enable gzip to zip text, HTML, and CSS assets on the fly, reducing bandwidth and LCP times."},
    {"id": "nginx-headers", "title": "Nginx Security Headers: CORS, CSP, & X-Frame", "category": "Cybersecurity", "tags": ["nginx", "security"], "prompt": "Nginx header injections. How to add security headers like Content-Security-Policy (CSP), HSTS, and X-Frame-Options to block clickjacking and XSS."},
    {"id": "caddy-ssl", "title": "Caddy Web Server: Zero-Config SSL", "category": "Homelab", "tags": ["caddy", "ssl", "self-hosting"], "prompt": "Caddy server setup. Explain how Caddy automatically handles Let's Encrypt registration, renewals, and reverse proxying with a single line config."},
    {"id": "haproxy-tcp", "title": "HAProxy: High-Performance TCP Load Balancing", "category": "DevOps", "tags": ["haproxy", "load-balancing"], "prompt": "HAProxy basics. How to configure HAProxy for raw TCP load balancing (e.g. balancing database clusters or mail servers) instead of HTTP."},
    {"id": "sqlite-cli", "title": "SQLite CLI: Managing Database Files", "category": "DevOps", "tags": ["sqlite", "database"], "prompt": "SQLite CLI management. How to query schemas, back up databases to files (.dump), and optimize size using the VACUUM command."},
    {"id": "postgres-backup", "title": "PostgreSQL Backup & Restore: pg_dump", "category": "DevOps", "tags": ["postgres", "database"], "prompt": "PostgreSQL backup mechanics. How to run pg_dump for safe logical backups, and pg_restore to recover databases from dump files."},
    {"id": "postgres-pgbouncer", "title": "PostgreSQL Connection Pooling: PgBouncer", "category": "DevOps", "tags": ["postgres", "scaling"], "prompt": "PgBouncer configuration. Explain how connection pooling solves database query backlogs by recycling database connection sockets."},
    {"id": "redis-cli", "title": "Redis Caching Basics & CLI commands", "category": "DevOps", "tags": ["redis", "performance"], "prompt": "Redis database CLI. Explain key-value settings, expiry TTL configuration, memory limits, and basic cache queries."},
    {"id": "monitoring-prometheus", "title": "Prometheus & Grafana: Homelab Monitoring", "category": "Homelab", "tags": ["monitoring", "grafana"], "prompt": "Prometheus metrics engine. Explain timeseries databases, scraping targets, and building graphical dashboards in Grafana."},
    {"id": "monitoring-node-exporter", "title": "Prometheus Node Exporter: Tracking CPU & RAM", "category": "Homelab", "tags": ["monitoring", "linux"], "prompt": "Node Exporter configurations. How to gather hardware and OS metrics on Linux servers, exposing them on port 9100 for Prometheus."},
    {"id": "logs-logrotate", "title": "Log Rotation with Logrotate", "category": "DevOps", "tags": ["linux", "monitoring"], "prompt": "Linux logrotate setup. How to rotate, compress, and delete old system logs automatically to prevent hard disks from filling up."},
    {"id": "zfs-snapshots", "title": "ZFS Datasets & Instant Snapshots", "category": "Homelab", "tags": ["storage", "zfs"], "prompt": "ZFS filesystem snapshots. How to create datasets, run instant snapshots, roll back file modifications, and replicate pools."},
    {"id": "storage-shares", "title": "NFS vs. Samba/SMB File Sharing", "category": "Homelab", "tags": ["storage", "networking"], "prompt": "Network file sharing. Compare NFS (native Linux mounts) vs SMB/Samba (compatible with Windows and macOS) for home NAS storage."},
    {"id": "cockpit-gui", "title": "Cockpit Web Console: Linux Admin GUI", "category": "Homelab", "tags": ["linux", "self-hosting"], "prompt": "Cockpit console. How to install Cockpit to audit server hardware, run terminals, manage accounts, and monitor VMs inside a web browser."},
    {"id": "proxmox-virtualization", "title": "Proxmox Virtualization: LXC vs. VMs", "category": "Homelab", "tags": ["proxmox", "virtualization"], "prompt": "Proxmox architectures. Compare full Virtual Machines (KVM) vs. lightweight Linux Containers (LXC) for running homelab instances."},
    {"id": "truenas-storage", "title": "TrueNAS Storage: Pools, ZVols, & Datasets", "category": "Homelab", "tags": ["storage", "truenas"], "prompt": "TrueNAS basics. How to structure ZFS disks into vdevs, configure pools, datasets, and share storage across a local home network."},
    {"id": "home-assistant", "title": "Home Assistant Docker deployment", "category": "Homelab", "tags": ["smart-home", "docker"], "prompt": "Home Assistant setup. How to deploy HA in Docker, configure host networking, and pass physical USB zigbee dongles into the container."},
    {"id": "jellyfin-transcode", "title": "Jellyfin Media Server: Hardware Transcoding", "category": "Homelab", "tags": ["media", "docker"], "prompt": "Jellyfin setup. How to mount movie folders, set up users, and map host GPU drivers (/dev/dri) into Docker for hardware transcoding."},
    {"id": "wireguard-vpn", "title": "WireGuard VPN: Secure Remote Lab Access", "category": "Homelab", "tags": ["vpn", "networking"], "prompt": "WireGuard configurations. How to write configuration files, define peers, set up IP forwarding, and connect back to your homelab on the go."},
    {"id": "tailscale-mesh", "title": "Tailscale VPN Mesh Networking", "category": "Homelab", "tags": ["vpn", "networking"], "prompt": "Tailscale mesh networking. Explain how Tailscale sets up overlay peer-to-peer networks bypassing NAT, and configuring exit nodes."},
    {"id": "nextcloud-cloud", "title": "Nextcloud Self-hosted Cloud Storage", "category": "Homelab", "tags": ["storage", "self-hosting"], "prompt": "Nextcloud setup. How to deploy Nextcloud in Docker, attach database backends (PostgreSQL), and configure external storage directories."},
    {"id": "vaultwarden-secrets", "title": "Vaultwarden Self-hosted Password Manager", "category": "Homelab", "tags": ["security", "self-hosting"], "prompt": "Vaultwarden setup. How to self-host a lightweight Rust version of Bitwarden, secure the database, and route via reverse proxy with HTTPS."},
    {"id": "portainer-docker", "title": "Portainer Container Management UI", "category": "Homelab", "tags": ["docker", "self-hosting"], "prompt": "Portainer UI. How to manage docker containers, inspect volumes, check logs, and deploy compose stacks inside a graphical web panel."},
    {"id": "pihole-dns", "title": "Pi-hole Ad-blocking & Local DHCP Server", "category": "Homelab", "tags": ["dns", "ad-block"], "prompt": "Pi-hole setups. How to block ads domain-wide, configure local DNS records, and enable DHCP to manage device IPs on the home network."},
    {"id": "cloudflare-access", "title": "Cloudflare Access & Zero Trust Policies", "category": "Cybersecurity", "tags": ["cloudflare", "security"], "prompt": "Cloudflare Zero Trust. How to hide your homelab portals behind email OTP verification, pinning access rules to specific GitHub accounts."},
    {"id": "cloudflare-ddns", "title": "Cloudflare API Dynamic DNS Updates", "category": "Homelab", "tags": ["cloudflare", "dns"], "prompt": "Dynamic DNS (DDNS). How to write a bash script querying Cloudflare APIs to update your A record whenever your ISP changes your home IP."},
    {"id": "ufw-firewall", "title": "UFW (Uncomplicated Firewall) Rules", "category": "DevOps", "tags": ["linux", "security"], "prompt": "UFW basics. How to check status, allow/deny ports, limit connection attempts, and restrict access to specific subnet IPs on Linux."},
    {"id": "firewalld-zones", "title": "Firewalld Zones & Rich Rules", "category": "DevOps", "tags": ["linux", "security"], "prompt": "Firewalld configurations. Explain zones (public, internal, dmz), rich rules, and port forwarding in RHEL/CentOS systems."},
    {"id": "fail2ban-rules", "title": "Fail2ban: Automating IP Bans", "category": "Cybersecurity", "tags": ["linux", "security"], "prompt": "Fail2ban setup. How to write jail configurations, monitor log patterns, and trigger iptables commands to auto-ban hackers brute-forcing SSH/Nginx."},
    {"id": "kali-pentest", "title": "Penetration Testing: Kali Linux Basics", "category": "Cybersecurity", "tags": ["kali", "security"], "prompt": "Kali Linux overview. Explain basic tools layout, configuring network interfaces, and using default shell environments safely in lab environments."},
    {"id": "kali-metasploit", "title": "Penetration Testing: Metasploit Framework", "category": "Cybersecurity", "tags": ["kali", "security"], "prompt": "Metasploit cli basics. Explain modules structure (exploits, payloads, auxiliary), configuring local/remote hosts, and running audits."},
    {"id": "recon-gobuster", "title": "Gobuster: Directory Brute Forcing", "category": "Cybersecurity", "tags": ["recon", "security"], "prompt": "Gobuster cli usage. How to audit web paths by scanning websites with wordlists to uncover hidden folders or config files."},
    {"id": "recon-nikto", "title": "Nikto: Web Server Vulnerability Scanning", "category": "Cybersecurity", "tags": ["recon", "security"], "prompt": "Nikto scanner. How to scan web servers to identify outdated server software, default index files, and cross-site scripting vulnerabilities."},
    {"id": "recon-whois-dns", "title": "Whois & DNS enumeration", "category": "Cybersecurity", "tags": ["recon", "security"], "prompt": "DNS enumeration. How to gather domain registrar records, inspect name server zones, and query AXFR zone transfers to audit exposures."},
    {"id": "pentest-john", "title": "Password Auditing with John the Ripper", "category": "Cybersecurity", "tags": ["security", "passwords"], "prompt": "John the Ripper basics. How to audit system password hash files (/etc/shadow) against standard wordlists to detect weak user credentials."},
    {"id": "pentest-hashcat", "title": "Password Auditing with Hashcat", "category": "Cybersecurity", "tags": ["security", "passwords"], "prompt": "Hashcat GPU audits. Explain hash mode flags (-m), rule-based attacks, and utilizing GPU acceleration to audit cryptographic hash lists."},
    {"id": "security-xss", "title": "Cross-Site Scripting (XSS) Demystified", "category": "Cybersecurity", "tags": ["security", "web"], "prompt": "XSS mechanics. Explain Reflected, Stored, and DOM-based XSS attacks. How to sanitize output in HTML variables to prevent JS injections."},
    {"id": "security-sqli", "title": "SQL Injection (SQLi) Demystified", "category": "Cybersecurity", "tags": ["security", "database"], "prompt": "SQL injection attacks. Explain how unchecked user inputs alter database queries, and defending using prepared/parameterized statements."},
    {"id": "security-mitm", "title": "Man-in-the-Middle & ARP Spoofing", "category": "Cybersecurity", "tags": ["networking", "security"], "prompt": "MITM routing attacks. Explain how ARP spoofing tricks local switches into routing client traffic through an attacker, and network defenses."},
    {"id": "ai-tfidf", "title": "AI Defense: TF-IDF Prompt Injection Filtering", "category": "Cybersecurity", "tags": ["ai", "security"], "prompt": "Prompt injection defenses. Explain how TF-IDF vectorization and Logistic Regression classifiers flag malicious commands before they hit LLMs."},
    {"id": "ai-guardrails", "title": "AI Defense: LLM Input Sanitization & Guardrails", "category": "Cybersecurity", "tags": ["ai", "security"], "prompt": "LLM input sanitization. How to write regex guardrails to sanitize prompts, redact PII, and block executable command syntax from inputs."},
    {"id": "cicd-gha", "title": "CI/CD: GitHub Actions Self-Hosted Runners", "category": "DevOps", "tags": ["cicd", "github"], "prompt": "GitHub Actions runners. How to install a local runner service on your home server to compile and build code locally without GitHub fees."},
    {"id": "cicd-jenkins", "title": "CI/CD: Jenkins Pipeline Declaratives", "category": "DevOps", "tags": ["cicd", "jenkins"], "prompt": "Jenkins Declarative Pipelines. How to write a Jenkinsfile configuring build, test, and deploy stages with automated triggers."},
    {"id": "cicd-gitlab", "title": "CI/CD: GitLab CI configurations", "category": "DevOps", "tags": ["cicd", "gitlab"], "prompt": "GitLab CI configurations. How to write a .gitlab-ci.yml file mapping pipeline runner environments, job dependencies, and deployment rules."}
]

async def generate_guide_with_sdk(topic):
    from google.antigravity import Agent, LocalAgentConfig
    
    prompt = f"""You are a friendly, highly experienced DevOps engineer and cybersecurity teacher.
    I need you to write an interactive active study guide for this topic:
    Topic Title: "{topic['title']}"
    Category: "{topic['category']}"
    Tags: {json.dumps(topic['tags'])}
    
    Focus Area: {topic['prompt']}
    
    Generate a JSON block matching this EXACT schema:
    {{
        "title": "Title of guide",
        "category": "Homelab or DevOps or Cybersecurity or CNC & Math",
        "tags": ["tag1", "tag2"],
        "challenge": "An engaging, practical active recall question (self-test) about this topic.",
        "answer": "The detailed solution/answer to the self-test challenge.",
        "concept": "Casual, engaging explanation of WHY this topic matters and what the underlying concept is. Write like you are talking to a peer in a homelab. Keep it to 2-3 paragraphs. Avoid dry textbook language.",
        "reasoning": "Explanation of THE LOGICAL DECISION. Why do we choose this command/configuration/approach over alternatives? What are the key trade-offs?",
        "how": "Fully functional code snippets, configuration files, and line-by-line CLI command explanations for HOW to implement this. Make sure commands are accurate and modern."
    }}
    
    Output ONLY valid JSON. Do not wrap the JSON in markdown code blocks like ```json ... ```. Output raw JSON text.
    """
    
    config = LocalAgentConfig(
        system_instructions="You are a JSON synthesis engine. Output ONLY a valid JSON block matching the requested schema. No conversational prose outside the JSON."
    )
    
    try:
        async with Agent(config) as agent:
            resp = await agent.chat(prompt)
            full_text = ""
            async for token in resp:
                full_text += token
            return json.loads(full_text.strip())
    except Exception as e:
        print(f"[-] SDK request failed for {topic['id']}: {e}")
        return None

def save_markdown_guide(topic, guide_data):
    os.makedirs(GUIDES_DIR, exist_ok=True)
    filename = f"{topic['id']}.md"
    # Format prefix date as 2026-08-08 onwards
    date_str = f"2026-08-{10 + len(os.listdir(GUIDES_DIR)) % 20:02d}"
    filepath = os.path.join(GUIDES_DIR, f"{date_str}-{filename}")
    
    tags_yaml = "\n".join([f"  - {t}" for t in guide_data.get('tags', topic['tags'])])
    
    md_content = f"""---
title: {json.dumps(guide_data.get('title', topic['title']))}
layout: default
category: {json.dumps(guide_data.get('category', topic['category']))}
date: {date_str}
tags:
{tags_yaml}
status: "Published"
challenge: {json.dumps(guide_data.get('challenge', ''))}
answer: {json.dumps(guide_data.get('answer', ''))}
---

### 💡 WHY (The Concept)
{guide_data.get('concept', '')}

### ⚖️ THE LOGICAL DECISION
{guide_data.get('reasoning', '')}

### ⚙️ HOW (Implementation Code)
{guide_data.get('how', '')}
"""
    with open(filepath, "w") as f:
        f.write(md_content)
    print(f"[+] Saved Guide: {filename}")
    return filepath

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

async def main():
    state = load_state()
    generated_count = 0
    
    print("[*] Starting batch generation of 100 study guides...")
    
    for idx, topic in enumerate(TOPICS):
        topic_id = topic["id"]
        if state.get(topic_id) == "done":
            print(f"[*] Skipping {topic_id} (already generated)")
            continue
            
        print(f"[*] Generating [{idx+1}/100]: {topic['title']}...")
        guide_data = await generate_guide_with_sdk(topic)
        
        if guide_data:
            save_markdown_guide(topic, guide_data)
            state[topic_id] = "done"
            save_state(state)
            generated_count += 1
            # Rate limit mitigation and pacing
            await asyncio.sleep(2)
        else:
            print(f"[-] Failed to generate {topic_id}. Will retry on next pass.")
            
    print(f"[+] Generation complete! Successfully generated {generated_count} new guides.")

if __name__ == "__main__":
    asyncio.run(main())
