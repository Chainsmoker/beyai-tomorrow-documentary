import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Series,
} from "remotion";
import {
  COMP_NAME,
  defaultMainProps,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Scene01, SCENE_01_DURATION } from "./Scene01";
import { Scene02, SCENE_02_DURATION } from "./Scene02";
import { Scene03, SCENE_03_DURATION } from "./Scene03";
import { Scene04, SCENE_04_DURATION } from "./Scene04";
import { Scene05, SCENE_05_DURATION } from "./Scene05";
import { Scene06, SCENE_06_DURATION } from "./Scene06";
import { Scene07, SCENE_07_DURATION } from "./Scene07";
import { Scene08, SCENE_08_DURATION } from "./Scene08";
import { Scene09, SCENE_09_DURATION } from "./Scene09";
import { Scene10, SCENE_10_DURATION } from "./Scene10";
import { Scene11, SCENE_11_DURATION } from "./Scene11";
import { Scene12, SCENE_12_DURATION } from "./Scene12";
import { Scene13, SCENE_13_DURATION } from "./Scene13";
import { Scene14, SCENE_14_DURATION } from "./Scene14";
import { Scene15, SCENE_15_DURATION } from "./Scene15";

const TOTAL_DURATION =
  SCENE_01_DURATION +
  SCENE_02_DURATION +
  SCENE_03_DURATION +
  SCENE_04_DURATION +
  SCENE_05_DURATION +
  SCENE_06_DURATION +
  SCENE_07_DURATION +
  SCENE_08_DURATION +
  SCENE_09_DURATION +
  SCENE_10_DURATION +
  SCENE_11_DURATION +
  SCENE_12_DURATION +
  SCENE_13_DURATION +
  SCENE_14_DURATION +
  SCENE_15_DURATION;

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_01_DURATION}>
          <Scene01 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_02_DURATION}>
          <Scene02 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_03_DURATION}>
          <Scene03 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_04_DURATION}>
          <Scene04 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_05_DURATION}>
          <Scene05 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_06_DURATION}>
          <Scene06 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_07_DURATION}>
          <Scene07 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_08_DURATION}>
          <Scene08 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_09_DURATION}>
          <Scene09 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_10_DURATION}>
          <Scene10 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_11_DURATION}>
          <Scene11 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_12_DURATION}>
          <Scene12 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_13_DURATION}>
          <Scene13 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_14_DURATION}>
          <Scene14 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_15_DURATION}>
          <Scene15 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const calculateMetadata: CalculateMetadataFunction<Record<string, unknown>> =
  async () => {
    return {
      durationInFrames: TOTAL_DURATION,
      fps: VIDEO_FPS,
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT,
    };
  };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="scene-01"
        component={Scene01}
        durationInFrames={SCENE_01_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-02"
        component={Scene02}
        durationInFrames={SCENE_02_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-03"
        component={Scene03}
        durationInFrames={SCENE_03_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-04"
        component={Scene04}
        durationInFrames={SCENE_04_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-05"
        component={Scene05}
        durationInFrames={SCENE_05_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-06"
        component={Scene06}
        durationInFrames={SCENE_06_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-07"
        component={Scene07}
        durationInFrames={SCENE_07_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-08"
        component={Scene08}
        durationInFrames={SCENE_08_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-09"
        component={Scene09}
        durationInFrames={SCENE_09_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-10"
        component={Scene10}
        durationInFrames={SCENE_10_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-11"
        component={Scene11}
        durationInFrames={SCENE_11_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-12"
        component={Scene12}
        durationInFrames={SCENE_12_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-13"
        component={Scene13}
        durationInFrames={SCENE_13_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-14"
        component={Scene14}
        durationInFrames={SCENE_14_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="scene-15"
        component={Scene15}
        durationInFrames={SCENE_15_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMainProps}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};