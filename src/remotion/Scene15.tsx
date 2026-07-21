import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene15Visual } from "./scenes/scene-15/Visual";

const VOICE_SRC = "voice/13_Chapter_14.mp3";

export const SCENE_15_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 14.66) * 30) + 10;

export const Scene15: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene15Visual durationInFrames={SCENE_15_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};