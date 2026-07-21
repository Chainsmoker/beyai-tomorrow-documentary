import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene10Visual } from "./scenes/scene-10/Visual";

const VOICE_SRC = "voice/08_Chapter_9.mp3";

export const SCENE_10_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 47.26) * 30) + 10;

export const Scene10: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene10Visual durationInFrames={SCENE_10_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};