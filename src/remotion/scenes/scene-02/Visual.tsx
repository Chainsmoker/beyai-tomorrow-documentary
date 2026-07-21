import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from "remotion";
import {} from "../../../../types/constants";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["300", "400", "700", "900"],
});

// Phase timing
const F_INTRO_END = 60;        // 2s black
const F_TITLE_REVEAL = 220;   // 2s after intro ends (with 60f pulse buffer)
const TITLE_DUR = 18;
const LOGO_SWEEP_DUR = 24;
const LOGO_SWEEP_DELAY = F_TITLE_REVEAL + 30;

export const Scene02Visual: React.FC<{
  durationInFrames: number;
}> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    fps,
    frame: Math.max(0, frame - F_TITLE_REVEAL),
    config: { stiffness: 200, damping: 15, mass: 1 },
    durationInFrames: TITLE_DUR,
  });

  const sweepFrame = Math.max(0, frame - LOGO_SWEEP_DELAY);
  const sweepT = Math.min(1, sweepFrame / LOGO_SWEEP_DUR);
  void sweepT; // reserved for future light-sweep effect

  const titleScale = 0.8 + titleSpring * 0.2;
  const titleOpacity = titleSpring;

  // Intro video shown between black (0-60) and title reveal (220+)
  const introOpacity = interpolate(frame, [F_INTRO_END - 6, F_INTRO_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
                       interpolate(frame, [F_TITLE_REVEAL - 18, F_TITLE_REVEAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Intro.mp4 fullscreen with native audio (frames 60-210) */}
      <Video
        src={staticFile("broll/intro.mp4")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: introOpacity,
        }}
      />

      {/* Title block */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          filter: `drop-shadow(0px 4px 12px rgba(0,0,0,0.3))`,
          background:
            "radial-gradient(ellipse at center, #0A0E27 0%, #000000 80%)",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 300,
            color: "#FFFFFF",
            letterSpacing: 8,
            marginBottom: 8,
          }}
        >
          REPLACED BY
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
            lineHeight: 1.05,
          }}
        >
          A LINE OF CODE
        </div>
      </div>

      {/* Audio */}
      {/* Intro.mp4 native audio plays automatically (not muted) */}
      <Sequence from={F_TITLE_REVEAL} durationInFrames={60}>
        <Audio src={staticFile("sfx/impact-hit.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={F_TITLE_REVEAL} durationInFrames={90}>
        <Audio src={staticFile("sfx/riser-tension.mp3")} volume={0.7} />
      </Sequence>
      <Watermark />
    </div>
  );
};