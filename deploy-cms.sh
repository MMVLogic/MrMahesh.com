#!/bin/bash
# ==============================================================================
# Fast Streamlined Deploy Script for MrMahesh Custom CMS
# ==============================================================================

set -e

CMS_LOCAL_DIR="/Users/m/mrmr/mrmahesh/custom-cms"
REMOTE_HOST="m@192.168.20.182"
REMOTE_DIR="/home/m/custom-cms"
SSH_KEY="$HOME/.ssh/id_ed25519_remote"

echo "🚀 [1/2] Syncing CMS code to server (delta sync)..."
rsync -avz \
  --exclude "node_modules" \
  --exclude ".git" \
  --exclude "cms.db" \
  -e "ssh -i $SSH_KEY" \
  "$CMS_LOCAL_DIR/" "$REMOTE_HOST:$REMOTE_DIR/"

echo "🔄 [2/2] Triggering rolling restart on Kubernetes..."
ssh -i "$SSH_KEY" "$REMOTE_HOST" \
  "kubectl rollout restart deployment mrmahesh-cms-deployment -n media && kubectl rollout status deployment mrmahesh-cms-deployment -n media --timeout=60s"

echo "✅ Deployment successful! MrMahesh CMS is live."
