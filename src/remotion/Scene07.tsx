import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene07Visual } from "./scenes/scene-07/Visual";

const VOICE_SRC = "voice/05_Chapter_6.mp3";

export const SCENE_07_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 40.31) * 30,
) + 10;

export const Scene07: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene07Visual durationInFrames={SCENE_07_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};
