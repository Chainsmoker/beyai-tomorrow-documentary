import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene04Visual } from "./scenes/scene-04/Visual";

const VOICE_SRC = "voice/02_Chapter_3.mp3";

export const SCENE_04_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 39) * 30,
) + 10;

export const Scene04: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene04Visual durationInFrames={SCENE_04_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};