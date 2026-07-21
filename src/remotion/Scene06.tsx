import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene06Visual } from "./scenes/scene-06/Visual";

const VOICE_SRC = "voice/04_Chapter_5.mp3";

export const SCENE_06_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 41) * 30,
) + 10;

export const Scene06: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene06Visual durationInFrames={SCENE_06_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};