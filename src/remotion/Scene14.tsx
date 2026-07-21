import { AbsoluteFill, Audio, staticFile } from "remotion";
import { VOICE_DURATIONS_FALLBACK } from "./lib/audio";
import { Scene14Visual } from "./scenes/scene-14/Visual";

const VOICE_SRC = "voice/12_Chapter_13.mp3";

export const SCENE_14_DURATION =
  Math.ceil((VOICE_DURATIONS_FALLBACK[VOICE_SRC] ?? 22.8) * 30) + 10;

export const Scene14: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene14Visual durationInFrames={SCENE_14_DURATION} />
      <Audio src={staticFile(VOICE_SRC)} />
    </AbsoluteFill>
  );
};