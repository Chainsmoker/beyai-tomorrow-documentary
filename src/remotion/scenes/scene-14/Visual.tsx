import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Video,
} from "remotion";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["300", "400", "500", "700", "900"],
});

// Phase transitions (local frames)
const ZOOM_END = 450;
const LAYER1_END = 150;
const LAYER2_END = 300;

// Neural network connection positions (50 lines across the earth layer)
const NETWORK_LINES = Array.from({ length: 50 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rand = (n: number) => ((seed * (n + 1) * 1.61803) % 1 + 1) % 1;
  return {
    x1: rand(1) * 1920,
    y1: rand(2) * 1080,
    x2: rand(3) * 1920,
    y2: rand(4) * 1080,
    speed: 0.3 + rand(5) * 0.5,
    delay: rand(6) * 60,
  };
});

// Question phrases synced to voice
const PHRASE_LABELS = [
  "BUILD",       // ~3s — what we can build
  "CALCULATE",   // ~4-5s — what we can calculate
  "WRITE",       // ~6s — what we can write
  "FASTER",      // ~10s
  "CHEAPER",     // ~11s
  "NO SLEEP",    // ~12s
  "THE QUESTION",// ~16s
];

export const Scene14Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Zoom out (ease-in-out, scale 1.0 → 0.10 over ZOOM_END frames)
  const zoomT = Math.min(1, frame / ZOOM_END);
  const zoomEased = zoomT < 0.5
    ? 2 * zoomT * zoomT
    : 1 - Math.pow(-2 * zoomT + 2, 2) / 2;
  const scale = 1 - zoomEased * 0.9;
  // Translation: center stays anchored, but content moves outward
  const tx = (1920 * (1 - scale)) / 2;
  const ty = (1080 * (1 - scale)) / 2;

  // Layer opacities (crossfades)
  const layer1Opacity = interpolate(frame, [LAYER1_END - 9, LAYER1_END + 9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const layer2Opacity = interpolate(
    frame,
    [LAYER1_END, LAYER1_END + 18, LAYER2_END, LAYER2_END + 18],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const layer3Opacity = interpolate(frame, [LAYER2_END, LAYER2_END + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Color grading: temperature 0 → -20, brightness 1.0 → 0.8
  const tempRotate = interpolate(frame, [0, ZOOM_END], [0, -20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brightness = interpolate(frame, [0, ZOOM_END], [1.0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Final fade to black (last 30 frames)
  const finalFade = interpolate(frame, [durationInFrames - 30, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Neural network overlay animation
  const networkDashOffset = (frame * 1.5) % 200;

  // Header fade
  const headerOpacity = interpolate(frame, [0, 30, durationInFrames - 90, durationInFrames - 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase question reveal — frame ~540 ("what is left for the human to do?")
  const questionFrame = 540;
  const questionOpacity = interpolate(frame, [questionFrame, questionFrame + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pre-question phrase shows current concept
  const currentPhraseIdx = Math.min(
    PHRASE_LABELS.length - 1,
    Math.floor(frame / 80),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}>
      {/* Zoom container */}
      <div
        style={{
          position: "absolute",
          left: -tx,
          top: -ty,
          width: 1920 * scale + 1920 * (1 - scale) * 1.4,
          height: 1080 * scale + 1080 * (1 - scale) * 1.4,
          transform: `translate(${tx}px, ${ty}px) scale(${1 + (1 - scale) * 0.4})`,
          transformOrigin: "center center",
        }}
      >
        {/* LAYER 1: Server rack close-up (frames 0-150) */}
        <div style={{ position: "absolute", inset: 0, opacity: layer1Opacity }}>
          <Video
            src={staticFile("broll/cpu-closeup.mp4")}
            muted
            loop
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brightness}) hue-rotate(${tempRotate}deg) saturate(1.1)` }}
          />
        </div>

        {/* LAYER 2: Disk drives data center (frames 150-300) */}
        <div style={{ position: "absolute", inset: 0, opacity: layer2Opacity }}>
          <Video
            src={staticFile("broll/disk-drives.mp4")}
            muted
            loop
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brightness * 0.95}) hue-rotate(${tempRotate}deg) saturate(1.05)` }}
          />
        </div>

        {/* LAYER 3: Earth from space (frames 300+) */}
        <div style={{ position: "absolute", inset: 0, opacity: layer3Opacity }}>
          <Video
            src={staticFile("broll/earth-orbit.mp4")}
            muted
            loop
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brightness * 0.9}) hue-rotate(${tempRotate}deg) saturate(0.95) contrast(1.1)` }}
          />

          {/* Neural network overlay - 50 connections */}
          <svg
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {NETWORK_LINES.map((line, i) => {
              const phase = ((frame * line.speed * 0.5 + line.delay) % 200) / 200;
              return (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#4ECDC4"
                  strokeWidth="1"
                  strokeDasharray="60 140"
                  strokeDashoffset={-networkDashOffset}
                  opacity={Math.sin(phase * Math.PI) * 0.35}
                />
              );
            })}
            {/* Small node dots at line endpoints */}
            {NETWORK_LINES.slice(0, 25).map((line, i) => (
              <React.Fragment key={`n-${i}`}>
                <circle cx={line.x1} cy={line.y1} r="2.5" fill="#4ECDC4" opacity={0.7} />
                <circle cx={line.x2} cy={line.y2} r="2.5" fill="#4ECDC4" opacity={0.7} />
              </React.Fragment>
            ))}
          </svg>
        </div>
      </div>

      {/* Header / pre-question concept */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headerOpacity,
        }}
      >
        <div style={{ fontFamily, fontSize: 13, color: "#4ECDC4", fontWeight: 700, letterSpacing: 6 }}>
          THE FINAL QUESTION
        </div>
        {frame < questionFrame - 30 && (
          <div
            style={{
              marginTop: 12,
              fontFamily,
              fontSize: 48,
              fontWeight: 300,
              color: "#FFFFFF",
              letterSpacing: 8,
              opacity: interpolate(frame, [30, 60], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {PHRASE_LABELS[currentPhraseIdx]}
          </div>
        )}
      </div>

      {/* THE QUESTION — center reveal at frame ~540 */}
      {frame > questionFrame - 15 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: questionOpacity,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 13,
              color: "#4ECDC4",
              letterSpacing: 8,
              fontWeight: 700,
              marginBottom: 24,
              opacity: 0.7,
            }}
          >
            THE QUESTION
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 300,
              fontSize: 56,
              color: "#FFFFFF",
              letterSpacing: 2,
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 1400,
              textShadow: "0 0 30px rgba(255,255,255,0.2)",
            }}
          >
            When the machine writes the code,
            <br />
            <span
              style={{
                fontWeight: 700,
                color: "#FFD700",
                fontStyle: "italic",
              }}
            >
              what is left for the human to do?
            </span>
          </div>
        </div>
      )}

      {/* Final fade to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: finalFade,
          pointerEvents: "none",
        }}
      />

      {/* Audio */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/drone-sci-fi.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.05;
            // Build tension
            if (f > 480) return Math.min(0.09, 0.05 + ((f - 480) / 200) * 0.04);
            return 0.05;
          }}
        />
      </Sequence>
      {/* Ticking SFX intro */}
      <Sequence from={0} durationInFrames={420}>
        <Audio src={staticFile("sfx/ticking.mp3")} volume={0.18} loop />
      </Sequence>
      {/* Total silence last 60 frames */}
      {/* (Drones fade-out handles this) */}


      <Watermark />

      <PostFX
        grainOpacity={0.06}
        vignetteRadius={0.5 + zoomEased * 0.3}
        vignetteDarkness={0.4 + zoomEased * 0.2}
        hueRotate={tempRotate}
        brightness={brightness}
      />
    </AbsoluteFill>
  );
};