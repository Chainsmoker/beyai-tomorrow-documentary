import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { GoldmanVisual } from "./scenes/scene-03/GoldmanVisual";

const VOICE_SRC = "voice/01_Chapter_2.mp3";

export const SCENE_03_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 29) * 30,
) + 10;

export const Scene03: React.FC = () => {
  return (
    <AbsoluteFill>
      <GoldmanVisual durationInFrames={SCENE_03_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};