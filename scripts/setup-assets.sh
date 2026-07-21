#!/bin/bash
# Download and extract project assets (B-roll, music, SFX, voices).
# Release: https://github.com/Chainsmoker/beyai-tomorrow-documentary/releases/tag/v1.0-assets
set -e

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)
ASSETS_DIR="$PROJECT_ROOT/public"

REPO="Chainsmoker/beyai-tomorrow-documentary"
TAG="v1.0-assets"
ASSET="beyai-assets.tar.gz"
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Check if already extracted (look for any scene voice file as marker)
if [ -f "$ASSETS_DIR/voice/00_Chapter_1.mp3" ]; then
  echo "Assets already present at $ASSETS_DIR — skipping download."
  exit 0
fi

echo "=== Downloading assets release ($ASSET) ==="
gh release download "$TAG" --repo "$REPO" --pattern "$ASSET" --dir "$TMPDIR"

echo "=== Extracting to $ASSETS_DIR ==="
mkdir -p "$ASSETS_DIR"
tar -xzf "$TMPDIR/$ASSET" -C "$PROJECT_ROOT"

echo ""
echo "=== Done ==="
echo "Assets extracted to $ASSETS_DIR"
du -sh "$ASSETS_DIR"/* 2>/dev/null
