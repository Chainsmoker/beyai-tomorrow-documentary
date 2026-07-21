import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene08Visual } from "./scenes/scene-08/Visual";

const VOICE_SRC = "voice/06_Chapter_7.mp3";

export const SCENE_08_DURATION = Math.ceil(
  (VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 30.09) * 30,
) + 10;

export const Scene08: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene08Visual durationInFrames={SCENE_08_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};
