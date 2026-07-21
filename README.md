# BeyAI Tomorrow — Documentary

A Remotion-based documentary on AI automation, the hollowing-out effect, and the future of work.

## Stack

- **Remotion 4.x** — programmatic video composition
- **Next.js 14** — web studio + player
- **TypeScript**, **Tailwind v4**
- **faster-whisper** — voice transcripts with word-level timestamps for sync

## Structure

```
src/remotion/
├── Root.tsx                  Main composition (concatenates 13 scenes via Series)
├── Scene01.tsx ... Scene15.tsx  One component per scene, voice-synced
├── lib/
│   ├── audio.ts              Voice duration fallbacks
│   ├── transcript.ts         Whisper JSON helpers (frameFor / rangeFor)
│   └── ...
├── components/Watermark.tsx  Reusable BeyAI logo overlay
└── scenes/
    ├── scene-01/Visual.tsx   Cold Open — typewriter + B-roll montage
    ├── scene-02/Visual.tsx   Title reveal
    ├── scene-03/GoldmanVisual.tsx  Goldman globe 300M
    ├── scene-04/Visual.tsx   WEF bars 83M/69M/14M gap
    ├── scene-05/Visual.tsx   OpenAI code terminal
    ├── scene-06/Visual.tsx   Copywriters split screen
    ├── scene-07/Visual.tsx   Optimists history + Atomoglu
    ├── scene-08/Visual.tsx   Cognitive transition valley
    ├── scene-09/Visual.tsx   Triple split CEO/designer/plumber
    ├── scene-10/Visual.tsx   Chegg/IBM/Klarna cases
    ├── scene-11/Visual.tsx   Attrition by AI (office avatars)
    ├── scene-12/Visual.tsx   Centaur Model
    ├── scene-13/Visual.tsx   How to Survive
    ├── scene-14/Visual.tsx   The Final Question (zoom out)
    └── scene-15/Visual.tsx   CTA outro

public/
├── broll/   Stock B-roll (Pexels, gitignored)
├── music/   Background tracks (gitignored)
├── sfx/     Sound effects (gitignored)
└── voice/   Narration .mp3 + .json transcripts (mp3 gitignored)
```

## Rendering

### Single scene
```bash
pnpm exec remotion render scene-01 out/scene-01.mp4 --public-dir=public
```

### Full video
```bash
bash scripts/render-all-scenes.sh
```
Renders each scene sequentially then concatenates with `ffmpeg -c copy` (no re-encoding).

### Single frame for testing
```bash
pnpm exec remotion still scene-01 out/frame.png --frames=0 --public-dir=public
```

## Audio sync workflow

1. Drop narration `.mp3` files into `public/voice/`
2. Run `bash scripts/transcribe-voices.sh` (uses faster-whisper)
3. Reference word timings in scene code:
   ```ts
   import transcript from "../../public/voice/03_Chapter_4.json";
   const singleFrame = frameFor(transcript, "single line");
   ```

## Configuration

`remotion.config.ts`:
- Codec: h264
- CRF: 18 (high quality)
- Pixel format: yuv420p (browser-compatible)
- Color space: rec709

Output: 1920x1080 @ 30fps.
