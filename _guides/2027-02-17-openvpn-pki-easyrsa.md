---
title: "OpenVPN Public Key Infrastructure (PKI) with Easy-RSA"
layout: default
category: "Cybersecurity"
date: 2027-02-17
tags:
  - vpn
  - security
  - pki
status: "Published"
challenge: "What is the purpose of generating a Certificate Revocation List (CRL) in OpenVPN? A **CRL** records serial numbers of compromised or revoked client certificates, instructing the OpenVPN server to reject connection attempts from those keys instantly."
answer: "**Easy-RSA** is a command-line CA management tool for building and managing a secure Certificate Authority."
---

### 💡 WHY (The Concept)
**Easy-RSA** is a command-line CA management tool for building and managing a secure Certificate Authority.

### ⚖️ THE LOGICAL DECISION
Use Easy-RSA to issue individual cryptographic client certificates for each laptop and phone.

### ⚙️ HOW (Implementation Code)
```bash
# Revoke a client certificate:
./easyrsa revoke client_laptop

# Generate updated CRL and copy to OpenVPN:
./easyrsa gen-crl
sudo cp pki/crl.pem /etc/openvpn/server/
```
