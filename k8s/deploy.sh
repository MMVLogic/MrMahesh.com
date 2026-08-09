#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
REMOTE_HOST="192.168.20.182"
SSH_KEY="$HOME/.ssh/id_ed25519_remote"

echo "=========================================="
echo "🚀 Deploying MrMahesh CMS to Kubernetes"
echo "=========================================="

echo "[1/3] Syncing custom-cms files to remote host..."
tar --exclude="node_modules" --exclude="*.db" -czf /tmp/custom-cms-update.tar.gz -C "$ROOT_DIR" custom-cms
scp -i "$SSH_KEY" /tmp/custom-cms-update.tar.gz "m@$REMOTE_HOST:/home/m/"
ssh -i "$SSH_KEY" "m@$REMOTE_HOST" "tar -xzf /home/m/custom-cms-update.tar.gz -C /home/m/"
rm -f /tmp/custom-cms-update.tar.gz

echo "[2/3] Applying Kubernetes manifests..."
(
  for file in "$SCRIPT_DIR"/0*.yaml; do
    echo "---"
    cat "$file"
    echo ""
  done
) | ssh -i "$SSH_KEY" "m@$REMOTE_HOST" "kubectl apply -f -"

echo "[3/3] Restarting deployment & waiting for rollout..."
ssh -i "$SSH_KEY" "m@$REMOTE_HOST" "kubectl rollout restart deployment/mrmahesh-cms-deployment -n media && kubectl rollout status deployment/mrmahesh-cms-deployment -n media --timeout=60s"

echo "=========================================="
echo "✅ CMS is live and running at:"
echo "👉 https://cms.mrmahesh.com"
echo "👉 Dashboard: https://portal.mrmahesh.com"
echo "=========================================="
