import { AbsoluteFill } from "remotion";
import { Scene02Visual } from "./scenes/scene-02/Visual";

export const SCENE_02_DURATION = 300;

export const Scene02: React.FC = () => {
  return (
    <AbsoluteFill>
      <Scene02Visual durationInFrames={SCENE_02_DURATION} />
    </AbsoluteFill>
  );
};