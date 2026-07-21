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
  weights: ["400", "500", "600", "700", "900"],
});

type Icon = {
  id: string;
  color: string;
  label: string;
  caption: string;
};

const ICONS: Icon[] = [
  {
    id: "brain",
    color: "#4ECDC4",
    label: "EMPATHY",
    caption: "Human perspective",
  },
  {
    id: "spark",
    color: "#FFD700",
    label: "CREATIVITY",
    caption: "Imagination, ideation",
  },
  {
    id: "crown",
    color: "#A855F7",
    label: "LEADERSHIP",
    caption: "Direction, architecture",
  },
];

const ICON_SIZE = 120;
const ICON_SPACING = 260;

// Deterministic particle positions
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rand = (n: number) => (seed * (n + 1) * 1.61803) % 1;
  return {
    startX: rand(1) * 1920,
    startY: rand(2) * 1080,
    speedX: (rand(3) - 0.5) * 0.5,
    speedY: (rand(4) - 0.5) * 0.4,
    size: 2 + rand(5) * 2,
    twinkleOffset: rand(6) * 1000,
  };
});

const BrainIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 100 100">
    <path
      d="M 35 25 C 25 25, 20 35, 25 45 C 20 50, 25 60, 35 60 C 30 70, 40 80, 50 75 C 60 80, 70 70, 65 60 C 75 60, 80 50, 75 45 C 80 35, 75 25, 65 25 C 60 18, 50 18, 45 22 C 42 22, 38 23, 35 25 Z"
      fill="none"
      stroke={color}
      strokeWidth="3"
    />
    <line x1="40" y1="35" x2="40" y2="60" stroke={color} strokeWidth="2" />
    <line x1="50" y1="32" x2="50" y2="68" stroke={color} strokeWidth="2" />
    <line x1="60" y1="35" x2="60" y2="60" stroke={color} strokeWidth="2" />
    <line x1="35" y1="45" x2="65" y2="45" stroke={color} strokeWidth="2" />
    <line x1="35" y1="55" x2="65" y2="55" stroke={color} strokeWidth="2" />
  </svg>
);

const SparkIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 100 100">
    <path
      d="M 50 15 L 55 40 L 78 30 L 60 48 L 85 50 L 60 52 L 78 70 L 55 60 L 50 85 L 45 60 L 22 70 L 40 52 L 15 50 L 40 48 L 22 30 L 45 40 Z"
      fill={color}
    />
  </svg>
);

const CrownIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 100 100">
    <path
      d="M 20 60 L 25 35 L 35 50 L 50 30 L 65 50 L 75 35 L 80 60 Z"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect x="20" y="62" width="60" height="10" fill={color} opacity="0.8" />
    <line x1="25" y1="35" x2="25" y2="28" stroke={color} strokeWidth="2" />
    <line x1="50" y1="30" x2="50" y2="22" stroke={color} strokeWidth="2" />
    <line x1="75" y1="35" x2="75" y2="28" stroke={color} strokeWidth="2" />
    <circle cx="25" cy="28" r="2" fill={color} />
    <circle cx="50" cy="22" r="3" fill={color} />
    <circle cx="75" cy="28" r="2" fill={color} />
  </svg>
);

const IconImage: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  if (id === "brain") return <BrainIcon color={color} />;
  if (id === "spark") return <SparkIcon color={color} />;
  if (id === "crown") return <CrownIcon color={color} />;
  return null;
};

export const Scene13Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon stagger: 0ms, 400ms, 800ms (each 12 frames)
  const ICON_STAGGER = 12;

  // B-roll crossfade phases — distribute 3 clips across scene duration
  const segmentLength = Math.floor(durationInFrames / 3);
  const FADE_FRAMES = 30;

  // Clip visibility (opacity 0-1 across crossfade windows)
  const clip1Opacity = Math.min(
    1,
    Math.max(0, 1 - Math.max(0, frame - segmentLength) / FADE_FRAMES),
  );
  const clip2Opacity = interpolate(
    frame,
    [
      segmentLength - FADE_FRAMES,
      segmentLength,
      segmentLength * 2 - FADE_FRAMES,
      segmentLength * 2,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const clip3Opacity = Math.min(
    1,
    Math.max(0, (frame - segmentLength * 2) / FADE_FRAMES),
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}
    >
      {/* B-roll background clips with crossfades */}
      <Video
        src={staticFile("broll/book-reading.mp4")}
        muted
        loop
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) saturate(0.85) contrast(1.05) blur(1px)",
          opacity: 0.5 * clip1Opacity,
        }}
      />
      <Video
        src={staticFile("broll/laptop-closing.mp4")}
        muted
        loop
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) saturate(0.85) contrast(1.05) blur(1px)",
          opacity: 0.5 * clip2Opacity,
        }}
      />
      <Video
        src={staticFile("broll/handshake-business.mp4")}
        muted
        loop
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) saturate(0.85) contrast(1.05) blur(1px)",
          opacity: 0.5 * clip3Opacity,
        }}
      />
      {/* Radial overlay (preserves the dark blue → black design) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, #0A0E27 0%, rgba(0,0,0,0.55) 70%, #000000 100%)",
        }}
      />
      {/* Particles */}
      {PARTICLES.map((p, i) => {
        const rawX = p.startX + p.speedX * frame * 6;
        const wrapX = ((rawX % 1920) + 1920) % 1920;
        const rawY = p.startY + p.speedY * frame * 6 - 60;
        const wrapY = (((rawY % 1080) + 1080) % 1080) + frame * 0.05;
        const safeY = wrapY % 1080;
        const twinkle =
          0.15 + 0.15 * Math.sin((frame + p.twinkleOffset) * 0.15);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: wrapX,
              top: safeY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              opacity: twinkle,
              boxShadow: "0 0 4px rgba(255,255,255,0.4)",
            }}
          />
        );
      })}
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 13,
            color: "#4ECDC4",
            fontWeight: 700,
            letterSpacing: 6,
          }}
        >
          THE PLAYBOOK · SURVIVAL GUIDE
        </div>
      </div>
      {/* Section title */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [10, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 64,
            color: "#FFFFFF",
            letterSpacing: 4,
          }}
        >
          {frame > 30 ? "PIVOT FROM" : ""}
          <span
            style={{
              display: "inline-block",
              opacity: frame > 30 ? Math.min(1, (frame - 30) / 20) : 0,
              transform: `translateY(${frame > 30 ? Math.max(0, 1 - (frame - 30) / 20) * 30 : 30}px)`,
            }}
          >
            PROCESSOR
          </span>
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 36,
            color: "#AAAAAA",
            letterSpacing: 6,
            marginTop: 12,
            opacity: interpolate(frame, [60, 120], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          →
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 64,
            color: "#4ECDC4",
            letterSpacing: 4,
            textShadow: "0 0 30px rgba(78,205,196,0.4)",
            marginTop: 4,
            opacity: interpolate(frame, [90, 180], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          DIRECTOR OF INTELLIGENCE
        </div>
      </div>
      {/* Icons row at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: ICON_SPACING,
          padding: "0 80px",
        }}
      >
        {ICONS.map((icon, i) => {
          const iconStartFrame = 180 + i * ICON_STAGGER;
          const labelStartFrame = iconStartFrame + 18;
          const iconSpring = spring({
            fps,
            frame: Math.max(0, frame - iconStartFrame),
            config: { stiffness: 200, damping: 15 },
            durationInFrames: 30,
          });
          const scale = iconSpring;
          const iconOpacity = Math.min(
            1,
            Math.max(0, (frame - iconStartFrame) / 4),
          );
          const labelOpacity = interpolate(
            frame,
            [labelStartFrame, labelStartFrame + 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={icon.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  border: `2px solid ${icon.color}33`,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  boxShadow: `0 0 ${20 + iconSpring * 30}px ${icon.color}66`,
                  opacity: iconOpacity,
                  transform: `scale(${scale})`,
                }}
              >
                <IconImage id={icon.id} color={icon.color} />
              </div>
              <div
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 18,
                  color: icon.color,
                  letterSpacing: 4,
                  opacity: labelOpacity,
                }}
              >
                {icon.label}
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: 13,
                  color: "#888888",
                  letterSpacing: 1,
                  opacity: labelOpacity,
                  maxWidth: 180,
                  textAlign: "center",
                }}
              >
                {icon.caption}
              </div>
            </div>
          );
        })}
      </div>
      {/* Lower third */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 60,
          padding: "12px 22px",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderLeft: "4px solid #FFD700",
          opacity: interpolate(frame, [350, 410], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 12,
            color: "#FFD700",
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          THE FRAMEWORK
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 18,
            color: "#FFFFFF",
            fontWeight: 500,
            marginTop: 4,
          }}
        >
          Adapt, or be replaced
        </div>
      </div>
      {/* Audio */}
      <Sequence
        from={0}
        style={{
          translate: "-34.1px 581.5px",
        }}
      >
        <Audio
          src={staticFile("music/piano-synth.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.06;
            if (f < 600) return 0.08;
            return 0.07;
          }}
        />
      </Sequence>
      <Sequence from={120}>
        <Audio
          src={staticFile("music/electronic-drive.mp3")}
          volume={(f) => {
            if (f < 120) return 0;
            return Math.min(0.04, ((f - 120) / 90) * 0.04);
          }}
        />
      </Sequence>
      {/* Page flip on first icon */}
      <Sequence from={190} durationInFrames={30}>
        <Audio src={staticFile("sfx/page-flip.mp3")} volume={0.55} />
      </Sequence>
      {/* Achievement on crown */}
      <Sequence
        from={228}
        durationInFrames={40}
        style={{
          translate: "62.6px 610.6px",
        }}
      >
        <Audio src={staticFile("sfx/achievement.mp3")} volume={0.5} />
      </Sequence>
      <Watermark />
      <PostFX
        grainOpacity={0.06}
        vignetteRadius={0.55}
        vignetteDarkness={0.45}
      />
    </AbsoluteFill>
  );
};
