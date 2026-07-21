import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene13Visual } from "./scenes/scene-13/Visual";

const VOICE_SRC = "voice/11_Chapter_12.mp3";

export const SCENE_13_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 35.53) * 30) + 10;

export const Scene13: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene13Visual durationInFrames={SCENE_13_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};