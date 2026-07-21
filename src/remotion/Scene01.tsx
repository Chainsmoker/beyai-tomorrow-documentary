import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene01Visual } from "./scenes/scene-01/Visual";

const VOICE_SRC = "voice/00_Chapter_1.mp3";

export const SCENE_01_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 22) * 30,
) + 10;

export const Scene01: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene01Visual durationInFrames={SCENE_01_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};