import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

export const VOICE_FPS = 30;
const FRAME_BUFFER = 10;

export const voiceFrames = async (src: string, fps = VOICE_FPS, buffer = FRAME_BUFFER) => {
  const dur = await getAudioDurationInSeconds(staticFile(src));
  return Math.ceil(dur * fps) + buffer;
};

export type SceneSpec = {
  id: string;
  voiceSrc?: string;
  videoSrc?: string;
  durationInFrames: number;
};

export type SceneTiming = {
  id: string;
  voiceSrc?: string;
  startFrame: number;
  durationInFrames: number;
};

export const chainScenes = (
  scenes: SceneSpec[],
): { timings: SceneTiming[]; totalDurationInFrames: number } => {
  let cursor = 0;
  const timings: SceneTiming[] = [];
  for (const scene of scenes) {
    timings.push({
      id: scene.id,
      voiceSrc: scene.voiceSrc,
      startFrame: cursor,
      durationInFrames: scene.durationInFrames,
    });
    cursor += scene.durationInFrames;
  }
  return { timings, totalDurationInFrames: cursor };
};

// Hardcoded fallbacks (measured via ffprobe) for SSR calculateMetadata.
export const VOICE_DURATIONS_FALLBACK: Record<string, number> = {
  "voice/00_Chapter_1.mp3": 21.92,
  "voice/01_Chapter_2.mp3": 28.73,
  "voice/02_Chapter_3.mp3": 21.92,
  "voice/03_Chapter_4.mp3": 39.0,
  "voice/04_Chapter_5.mp3": 41.38,
  "voice/05_Chapter_6.mp3": 40.31,
  "voice/06_Chapter_7.mp3": 30.09,
  "voice/07_Chapter_8.mp3": 44.43,
  "voice/08_Chapter_9.mp3": 47.26,
  "voice/09_Chapter_10.mp3": 30.82,
  "voice/10_Chapter_11.mp3": 32.55,
  "voice/11_Chapter_12.mp3": 35.53,
  "voice/12_Chapter_13.mp3": 22.8,
  "voice/13_Chapter_14.mp3": 14.66,
};

export const VIDEO_DURATIONS_FALLBACK: Record<string, number> = {};