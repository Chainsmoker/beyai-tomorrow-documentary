"""Transcribe all voice files in public/voice/ using faster-whisper.

Outputs JSON per file with:
- text: full transcript
- segments: array of {start, end, text, words: [{start, end, word, prob}]}
- language: detected language code

Usage:
  .venv/bin/python scripts/transcribe-voices.py           # all voices
  .venv/bin/python scripts/transcribe-voices.py voice/00_Chapter_1.mp3  # specific
"""
import json
import sys
from pathlib import Path
from faster_whisper import WhisperModel

VOICES_DIR = Path(__file__).parent.parent / "public" / "voice"
MODEL_SIZE = "base"  # tiny/base/small/medium/large-v3. Trade: speed vs accuracy
DEVICE = "cpu"        # "cpu" or "cuda" or "metal" (Apple Silicon)
COMPUTE_TYPE = "int8" # "int8" for CPU speed


def transcribe(model: WhisperModel, audio_path: Path) -> dict:
    segments, info = model.transcribe(
        str(audio_path),
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        language="en",
    )
    segs = []
    full_text_parts = []
    for seg in segments:
        words = [
            {
                "start": round(w.start, 3),
                "end": round(w.end, 3),
                "word": w.word,
                "prob": round(w.probability, 3),
            }
            for w in (seg.words or [])
        ]
        segs.append({
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "words": words,
        })
        full_text_parts.append(seg.text.strip())
    return {
        "file": audio_path.name,
        "language": info.language,
        "duration": round(info.duration, 3),
        "text": " ".join(full_text_parts),
        "segments": segs,
    }


def main() -> int:
    if not VOICES_DIR.exists():
        print(f"Missing {VOICES_DIR}", file=sys.stderr)
        return 1

    targets: list[Path] = []
    cli_args = sys.argv[1:]
    if cli_args:
        for a in cli_args:
            p = Path(a)
            if not p.exists():
                print(f"Skip {p}: not found", file=sys.stderr)
                continue
            targets.append(p)
    else:
        targets = sorted(VOICES_DIR.glob("*.mp3"))

    if not targets:
        print("No voice files to process.", file=sys.stderr)
        return 1

    print(f"Loading Whisper model '{MODEL_SIZE}' on {DEVICE}...", file=sys.stderr)
    model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    print(f"Loaded. Processing {len(targets)} file(s)...", file=sys.stderr)

    for audio in targets:
        print(f"  {audio.name}...", file=sys.stderr)
        out = transcribe(model, audio)
        json_path = audio.with_suffix(".json")
        json_path.write_text(json.dumps(out, indent=2, ensure_ascii=False))
        print(f"    → {json_path.name} ({out['duration']}s, {len(out['segments'])} segments)", file=sys.stderr)

    print("Done.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())