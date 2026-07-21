import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from "remotion";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700", "900"],
});

// 4 B-roll clips
const CLIPS = [
  "broll/doctor-hologram.mp4",
  "broll/vr-sketching.mp4",
  "broll/coder-typing.mp4",
  "broll/coder-night.mp4",
];

// Each clip holds ~25% of duration with quick crossfades
const FADE_FRAMES = 8;

const ROLES = ["DOCTOR + AI", "ARCHITECT + VR", "DEVELOPER + COPILOT", "TEAM + AGENT"];

export const Scene12Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute per-clip crossfades
  const segmentLength = Math.floor(durationInFrames / CLIPS.length);
  const clipIndex = Math.min(
    CLIPS.length - 1,
    Math.floor(frame / segmentLength)
  );
  const segmentFrame = frame - clipIndex * segmentLength;
  const fadeT = Math.min(1, segmentFrame / FADE_FRAMES);
  const nextClipT = Math.min(
    1,
    Math.max(0, (segmentFrame - (segmentLength - FADE_FRAMES)) / FADE_FRAMES)
  );

  // Title reveal at start (frames 0-90, 3s)
  const titleScale = spring({
    fps,
    frame: Math.max(0, frame - 60),
    config: { stiffness: 180, damping: 18 },
    durationInFrames: 30,
  });
  const titleOpacity = interpolate(frame, [60, 90, durationInFrames - 90, durationInFrames - 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch frames 78-90 (3 frames of RGB split)
  const glitchPhase = (frame - 78) >= 0 && (frame - 78) < 12;

  // Animated line position: smooth back-and-forth sweep, no abrupt jump at wrap.
  // Cycle every 180 frames (6s): from 100% (off-screen right) → -100% (off-screen left).
  // Both endpoints are off-screen so the wrap from -100% → 100% is invisible.
  const sweepCycle = 180;
  const sweepProgress = (frame % sweepCycle) / sweepCycle;
  const lineTranslateX = 100 - sweepProgress * 200; // 100 → -100

  // Text glow pulse (smooth sine — no modulo jump)
  const glowPhase = (frame / 60) * Math.PI * 2;

  // Lower-third per clip (current role label)
  const ltOpacity = interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const roleSwapT = Math.max(0, segmentFrame - 6) / FADE_FRAMES;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}>
      {/* Background b-roll crossfades */}
      {CLIPS.map((src, i) => {
        const startFrame = i * segmentLength;
        const endFrame = startFrame + segmentLength;
        const inFrame =
          i === 0 ? 1 : Math.min(1, Math.max(0, (frame - startFrame) / FADE_FRAMES));
        const outFrame =
          i === CLIPS.length - 1
            ? 1
            : Math.max(0, 1 - (frame - (endFrame - FADE_FRAMES)) / FADE_FRAMES);
        const visible = frame >= startFrame && frame < endFrame;
        if (!visible) return null;
        return (
          <Video
            key={i}
            src={staticFile(src)}
            muted
            loop
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55) saturate(1.15) contrast(1.1) hue-rotate(5deg)",
              opacity: i === clipIndex ? inFrame * outFrame : 0,
            }}
          />
        );
      })}

      {/* Dark overlay base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,5,15,0.4)",
        }}
      />

      {/* Scanlines subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,0.4) 1px, transparent 1px)",
          backgroundSize: "100% 4px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title block centered */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${0.95 + titleScale * 0.05})`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        {/* Subtitle */}
        <div
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 22,
            color: "#4ECDC4",
            letterSpacing: 8,
            marginBottom: 16,
          }}
        >
          THE FUTURE OF WORK
        </div>
        {/* Main title with animated color sweep */}
        <div
          style={{
            position: "relative",
            fontFamily,
            fontWeight: 900,
            fontSize: 84,
            letterSpacing: 6,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1,
            textShadow: `
              0 0 30px rgba(78,205,196,${0.4 + Math.sin(glowPhase) * 0.2}),
              0 0 60px rgba(168,85,247,${0.3 + Math.cos(glowPhase) * 0.15})
            `,
          }}
        >
          THE CENTAUR MODEL
        </div>
        {/* Glow line under title */}
        <div
          style={{
            position: "relative",
            marginTop: 18,
            height: 4,
            width: 800,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, #4ECDC4 30%, #A855F7 70%, transparent)",
              transform: `translateX(${lineTranslateX}%)`,
            }}
          />
        </div>
        {/* Tagline */}
        <div
          style={{
            fontFamily,
            fontSize: 22,
            color: "#FFFFFF",
            fontWeight: 500,
            letterSpacing: 4,
            marginTop: 32,
            opacity: interpolate(frame, [120, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          HUMAN + AI · BEATS HUMAN OR AI ALONE
        </div>
      </div>

      {/* RGB Split glitch layers (transient) */}
      {glitchPhase && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#FF3366",
              mixBlendMode: "screen",
              opacity: 0.3,
              transform: "translate(8px, 0)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#00D4FF",
              mixBlendMode: "screen",
              opacity: 0.3,
              transform: "translate(-8px, 0)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Lower-third role badge */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          padding: "14px 28px",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderLeft: "4px solid #4ECDC4",
          opacity: ltOpacity,
          transform: `translateX(${(1 - Math.min(1, roleSwapT)) * -40}px)`,
        }}
      >
        <div style={{ fontFamily, fontSize: 13, color: "#4ECDC4", fontWeight: 700, letterSpacing: 3 }}>
          {ROLES[clipIndex]}
        </div>
        <div style={{ fontFamily, fontSize: 16, color: "#FFFFFF", fontWeight: 500, marginTop: 4 }}>
          Centaur Augmentation · {Math.floor((clipIndex + 1) * 100 / CLIPS.length)}% sequence
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily, fontSize: 13, color: "#4ECDC4", fontWeight: 700, letterSpacing: 4 }}>
          THE PIVOT · CENTAUR ALLIANCE
        </div>
        <div style={{ fontFamily, fontSize: 13, color: "#AAAAAA", fontWeight: 500, letterSpacing: 2 }}>
          {clipIndex + 1} / {CLIPS.length}
        </div>
      </div>

      {/* Audio */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/electronic-drive.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.06;
            if (f < 180) return 0.06 + ((f - 30) / 150) * 0.06;
            return 0.12;
          }}
        />
      </Sequence>
      {/* Uplifting riser intro */}
      <Sequence from={0} durationInFrames={120}>
        <Audio src={staticFile("sfx/uplifting-riser.mp3")} volume={0.55} />
      </Sequence>
      {/* Tech blip per clip transition */}
      {[1, 2, 3].map((i) => (
        <Sequence key={i} from={i * segmentLength - 4} durationInFrames={20}>
          <Audio src={staticFile("sfx/buzzer.mp3")} volume={0.4} />
        </Sequence>
      ))}


      <Watermark />

      <PostFX grainOpacity={0.06} vignetteRadius={0.5} vignetteDarkness={0.4} hueRotate={5} />
    </AbsoluteFill>
  );
};