import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene09Visual } from "./scenes/scene-09/Visual";

const VOICE_SRC = "voice/07_Chapter_8.mp3";

export const SCENE_09_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 44.43) * 30,
) + 10;

export const Scene09: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene09Visual durationInFrames={SCENE_09_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};
