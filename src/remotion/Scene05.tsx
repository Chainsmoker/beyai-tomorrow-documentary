import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene05Visual } from "./scenes/scene-05/Visual";

const VOICE_SRC = "voice/03_Chapter_4.mp3";

export const SCENE_05_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 41) * 30,
) + 10;

export const Scene05: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene05Visual durationInFrames={SCENE_05_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};