#!/bin/bash
# Render all 15 scenes sequentially (one at a time), then concatenate with ffmpeg.
# Safe for low-memory machines (no parallel Chrome workers).
set -e

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)
OUT_DIR="$PROJECT_ROOT/out"
mkdir -p "$OUT_DIR"

echo "=== Step 1/2: Rendering scenes sequentially ==="

FAILED=()
for i in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15; do
  if [ -f "$OUT_DIR/scene-$i.mp4" ]; then
    echo "[scene-$i] already rendered, skipping"
    continue
  fi

  echo "[scene-$i] starting..."
  if pnpm exec remotion render "scene-$i" "$OUT_DIR/scene-$i.mp4" \
       --public-dir=public \
       --concurrency=2 \
       --log=error 2>&1 | tail -5; then
    echo "[scene-$i] done"
  else
    echo "[scene-$i] FAILED"
    FAILED+=("$i")
  fi
done

if [ ${#FAILED[@]} -gt 0 ]; then
  echo ""
  echo "WARNING: ${#FAILED[@]} scene(s) failed: ${FAILED[*]}"
fi

echo ""
echo "=== Step 2/2: Concatenating scenes with ffmpeg ==="

LIST_FILE="$OUT_DIR/list.txt"
> "$LIST_FILE"
for i in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15; do
  if [ -f "$OUT_DIR/scene-$i.mp4" ]; then
    echo "file 'scene-$i.mp4'" >> "$LIST_FILE"
  fi
done

ffmpeg -y -f concat -safe 0 -i "$LIST_FILE" -c copy "$OUT_DIR/full.mp4"

SIZE=$(du -h "$OUT_DIR/full.mp4" | cut -f1)
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUT_DIR/full.mp4" 2>/dev/null)
echo ""
echo "=== DONE ==="
echo "Output: $OUT_DIR/full.mp4 ($SIZE, ${DURATION}s)"
