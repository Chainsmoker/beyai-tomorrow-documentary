import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene11Visual } from "./scenes/scene-11/Visual";

const VOICE_SRC = "voice/09_Chapter_10.mp3";

export const SCENE_11_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 30.82) * 30) + 10;

export const Scene11: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene11Visual durationInFrames={SCENE_11_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};