import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700", "900"],
});

// Cubic bezier curve points for "Valle de Transición"
// Start (200, 200) -> Drop to (600, 700) with ease-in -> Rise to (1400, 400) with ease-out
const CURVE_PATH = "M 200 200 C 400 200, 550 500, 600 700 C 650 700, 1000 400, 1400 400";
const VALLEY_FILL_PATH = `${CURVE_PATH} L 1400 760 L 200 760 Z`;

export const Scene08Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del trazado de línea (120 frames = 4s)
  const lineProgress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse animation para el área del valle (loop cada 1500ms = 45 frames)
  const pulseCycle = (frame % 45) / 45;
  const pulseOpacity = interpolate(
    Math.sin(pulseCycle * Math.PI * 2),
    [-1, 1],
    [0.1, 0.25]
  );

  // Staggered fade-in para las etiquetas (stagger 300ms = 9 frames)
  const currentJobsOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newJobsOpacity = interpolate(frame, [29, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const valleyOpacity = interpolate(frame, [38, 53], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crossfade B-Roll graduación (0-400 frames) -> Help Wanted Sign (400+ frames)
  const brollTransition = interpolate(frame, [380, 410], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch Effect loop para "Help Wanted" (duración 300ms = 9 frames, loop cada 2s = 60 frames)
  const glitchCycleFrame = frame % 60;
  const isGlitching = glitchCycleFrame < 9 && frame > 390;
  const glitchOffsetX = isGlitching ? (Math.random() > 0.5 ? 8 : -8) : 0;
  const glitchOffsetY = isGlitching ? (Math.random() > 0.5 ? 4 : -4) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg_primary,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Background B-Roll Layer */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Layer 1: Graduation B-Roll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - brollTransition,
          }}
        >
          <Img
            src={staticFile("broll/college_graduation.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.4) contrast(1.1) grayscale(0.3)",
              transform: `scale(${1 + (frame / durationInFrames) * 0.08})`,
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Layer 2: Help Wanted Sign con Glitch Effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: brollTransition,
          }}
        >
          {/* Main Image */}
          <Img
            src={staticFile("broll/help_wanted_sign.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55) contrast(1.2)",
              transform: `scale(${1 + (frame / durationInFrames) * 0.12}) translate(${glitchOffsetX}px, ${glitchOffsetY}px)`,
              transformOrigin: "center center",
            }}
          />

          {/* RGB Split Glitch Layers */}
          {isGlitching && (
            <>
              {/* Red Channel Shift */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  mixBlendMode: "screen",
                  opacity: 0.7,
                  transform: `translate(${glitchOffsetX + 6}px, ${glitchOffsetY - 2}px)`,
                  filter: "hue-rotate(90deg)",
                }}
              >
                <Img
                  src={staticFile("broll/help_wanted_sign.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Cyan Channel Shift */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  mixBlendMode: "screen",
                  opacity: 0.7,
                  transform: `translate(${glitchOffsetX - 6}px, ${glitchOffsetY + 2}px)`,
                  filter: "hue-rotate(-90deg)",
                }}
              >
                <Img
                  src={staticFile("broll/help_wanted_sign.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dim Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(10, 14, 39, 0.65)",
        }}
      />

      {/* Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          padding: "6px 18px",
          backgroundColor: "rgba(0,0,0,0.8)",
          border: "1px solid #FF3366",
          color: "#FF3366",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          borderRadius: 4,
          zIndex: 5,
        }}
      >
        THE TRANSITION VALLEY · HUMAN COST
      </div>

      {/* Motion Graphic: "Valle de Transición" SVG Graph */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            {/* Red valley fill gradient */}
            <linearGradient id="valleyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3366" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Fill area for "Valle" with pulse animation */}
          {lineProgress > 0.1 && (
            <path
              d={VALLEY_FILL_PATH}
              fill="url(#valleyGradient)"
              style={{
                opacity: pulseOpacity * Math.min(1, lineProgress * 1.5),
              }}
            />
          )}

          {/* Animated Line path (stroke-dasharray) */}
          <path
            d={CURVE_PATH}
            stroke="#FFFFFF"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray="2000"
            strokeDashoffset={2000 - 2000 * lineProgress}
            filter="url(#glow)"
          />

          {/* Baseline reference line */}
          <line
            x1="200"
            y1="760"
            x2="1400"
            y2="760"
            stroke="#30363D"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Labels positioned at specific points */}
        {/* 1. CURRENT JOBS (200, 180) */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 150,
            fontFamily,
            fontWeight: 500,
            fontSize: 16,
            color: "#888888",
            letterSpacing: 1.5,
            opacity: currentJobsOpacity,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
          CURRENT JOBS
        </div>

        {/* 2. NEW JOBS (1400, 380) */}
        <div
          style={{
            position: "absolute",
            left: 1400,
            top: 350,
            fontFamily,
            fontWeight: 500,
            fontSize: 16,
            color: "#888888",
            letterSpacing: 1.5,
            opacity: newJobsOpacity,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ECDC4" }} />
          NEW JOBS
        </div>

        {/* 3. THE VALLEY (600, 720) */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 720,
            fontFamily,
            fontWeight: 700,
            fontSize: 18,
            color: "#FF3366",
            letterSpacing: 2,
            opacity: valleyOpacity,
            backgroundColor: "rgba(0,0,0,0.75)",
            padding: "6px 16px",
            border: "1px solid rgba(255, 51, 102, 0.4)",
            borderRadius: 4,
          }}
        >
          ▼ THE VALLEY OF TRANSITION
        </div>
      </div>

      {/* Audio Tracks */}
      {/* 1. Melancholic Piano Music */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/piano-synth.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.08;
            return 0.08;
          }}
        />
      </Sequence>

      {/* 2. SFX: Digital Glitch sound on glitch loop */}
      <Sequence from={400} durationInFrames={30}>
        <Audio src={staticFile("sfx/glitch.mp3")} volume={0.6} />
      </Sequence>

      <Sequence from={520} durationInFrames={30}>
        <Audio src={staticFile("sfx/glitch.mp3")} volume={0.5} />
      </Sequence>

      {/* PostFX overlay */}

      <Watermark />
      <PostFX grainOpacity={0.08} vignetteRadius={0.5} vignetteDarkness={0.5} />
    </AbsoluteFill>
  );
};
