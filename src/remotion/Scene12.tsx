import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene12Visual } from "./scenes/scene-12/Visual";

const VOICE_SRC = "voice/10_Chapter_11.mp3";

export const SCENE_12_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 32.55) * 30) + 10;

export const Scene12: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene12Visual durationInFrames={SCENE_12_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};