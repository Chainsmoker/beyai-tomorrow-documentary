import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
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

const fadeEaseIn = (t: number) => t * t;

// Per-case timing
const CHEGG_CHART_START = 90;
const CHEGG_CHART_END = 180;
const CHEGG_DROP_FRAME = 180;
const CHEGG_LAYOFF_START = 250; // second counter shows layoff
const CHEGG_LAYOFF_END = 380;
const WIPE_CHEGG_TO_IBM = 480;

const IBM_START = 540;                          // pushed back 70 frames (~2.3s)
const IBM_COUNTER_END = 700;                    // counter finishes in 160 frames (~5.3s)
const IBM_SUB_DELAY = 700;                      // 30% sublabel appears right when count finishes
const IBM_HOLD_END = 1100;                      // holds at 7800 for 400 frames (~13.3s)
const WIPE_IBM_TO_KLARNA = 1100;

const KLARNA_START = 1110;
const KLARNA_COUNTER_END = 1230;
const KLARNA_HOLD_END = 1418;

export const Scene10Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Wipe transitions
  const wipeChegg = interpolate(frame, [WIPE_CHEGG_TO_IBM, WIPE_CHEGG_TO_IBM + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // IBM panel: slides in from left at WIPE_CHEGG_TO_IBM, slides out at WIPE_IBM_TO_KLARNA
  const wipeIbmIn = interpolate(frame, [WIPE_CHEGG_TO_IBM, WIPE_CHEGG_TO_IBM + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeIbmOut = interpolate(frame, [WIPE_IBM_TO_KLARNA, WIPE_IBM_TO_KLARNA + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ----- CHEGG -----
  const cheggChartProgress = interpolate(frame, [CHEGG_CHART_START, CHEGG_CHART_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cheggEased = fadeEaseIn(cheggChartProgress);
  const cheggDropSpring = spring({
    fps: 30,
    frame: Math.max(0, frame - CHEGG_DROP_FRAME),
    config: { stiffness: 250, damping: 12 },
  });
  const cheggDropShown = frame >= CHEGG_DROP_FRAME;
  const cheggDropScale = cheggDropShown ? cheggDropSpring : 0;

  // ----- IBM -----
  // Counter is FAST first, then decelerates (ease-out cubic) — keeps text readable from frame 0
  const ibmProgress = interpolate(frame, [IBM_START, IBM_COUNTER_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ibmEased = 1 - Math.pow(1 - ibmProgress, 3);
  // Pre-ramp: counter visible at "1,200" immediately on IBM_START so panel isn't empty
  const ibmQuickStart = Math.min(ibmProgress * 25, 1); // 0 → 1 over first 10 frames
  const ibmValue = Math.floor(ibmProgress * 7800); // Linear ramp — text changes fast
  const ibmSubOpacity = interpolate(frame, [IBM_SUB_DELAY, IBM_SUB_DELAY + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ----- KLARNA -----
  const klarnaProgress = interpolate(frame, [KLARNA_START, KLARNA_COUNTER_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const klarnaValue = Math.floor(klarnaProgress * 700);

  // Lower third slide-in per case
  const cheggLT = interpolate(frame, [60, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ibmLT = interpolate(frame, [IBM_START, IBM_START + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const klarnaLT = interpolate(frame, [KLARNA_START, KLARNA_START + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}>
      {/* ============================== CHEGG PANEL ============================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: frame < WIPE_CHEGG_TO_IBM + 20 ? 1 : 0,
          clipPath: `inset(0 ${wipeChegg * 100}% 0 0)`,
        }}
      >
        {/* BG: stock trading viz */}
        <Video
          src={staticFile("broll/stock-trading-viz.mp4")}
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.4) saturate(1.3) hue-rotate(-15deg)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />

        {/* Chart SVG */}
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="cheggGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3366" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0" />
            </linearGradient>
            <filter id="glowRed">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Y-axis grid */}
          {[200, 350, 500, 650].map((y) => (
            <line key={y} x1="200" y1={y} x2="800" y2={y} stroke="#FFFFFF" strokeOpacity="0.08" strokeDasharray="3 5" />
          ))}
          {/* Vertical price guide */}
          <line x1="200" y1="200" x2="200" y2="780" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="200" y1="780" x2="800" y2="780" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1" />

          {/* Chart path (animated stroke-dasharray, ease-in) */}
          {cheggChartProgress > 0 && (
            <>
              <path
                d="M 200 200 C 320 230, 420 290, 510 410 C 600 510, 700 620, 800 700"
                stroke="#FF3366"
                strokeWidth="4"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset={1000 - 1000 * cheggEased}
                filter="url(#glowRed)"
              />
              <path
                d="M 200 200 C 320 230, 420 290, 510 410 C 600 510, 700 620, 800 700 L 800 780 L 200 780 Z"
                fill="url(#cheggGrad)"
                opacity={cheggEased * 0.6}
              />
            </>
          )}
        </svg>

        {/* -48% reveal */}
        <div
          style={{
            position: "absolute",
            top: 380,
            right: 220,
            transform: `scale(${cheggDropScale * 1.0})`,
            opacity: cheggDropShown ? 1 : 0,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 200,
              color: "#FF3366",
              letterSpacing: -4,
              textShadow: "0 0 40px rgba(255,51,102,0.6), 0 0 80px rgba(255,51,102,0.3)",
              lineHeight: 0.9,
            }}
          >
            -48%
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 32,
              color: "#FFFFFF",
              letterSpacing: 4,
              marginTop: 20,
            }}
          >
            IN A SINGLE DAY
          </div>
        </div>

        {/* Lower third */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            transform: `translateX(${(1 - cheggLT) * -400}px)`,
            opacity: cheggLT,
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: "16px 28px",
            borderLeft: "4px solid #FF3366",
          }}
        >
          <div style={{ fontFamily, fontSize: 14, color: "#FF3366", fontWeight: 700, letterSpacing: 3 }}>
            CASE 01 · CHEGG
          </div>
          <div style={{ fontFamily, fontSize: 22, color: "#FFFFFF", fontWeight: 500, marginTop: 4 }}>
            Q1 2023 Earnings Call
          </div>
        </div>

        {/* Header label */}
        <div style={{ position: "absolute", top: 60, left: 60, opacity: headerOpacity }}>
          <div style={{ fontFamily, fontSize: 14, color: "#FF3366", fontWeight: 700, letterSpacing: 4 }}>
            THE PROOF · NOT SPECULATION
          </div>
        </div>

        {/* Layoff counter (second visual to fill space) */}
        {frame >= CHEGG_LAYOFF_START && (
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 320,
              opacity: interpolate(frame, [CHEGG_LAYOFF_START, CHEGG_LAYOFF_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `translateY(${Math.max(0, 1 - (frame - CHEGG_LAYOFF_START) / 20) * 30}px)`,
            }}
          >
            <div style={{ fontFamily, fontSize: 16, color: "#FFD700", fontWeight: 700, letterSpacing: 4 }}>
              BY 2024 · WORKFORCE LAID OFF
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 110,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: -3,
                textShadow: "0 0 20px rgba(255,215,0,0.3)",
                marginTop: 8,
              }}
            >
              {Math.floor(((frame - CHEGG_LAYOFF_START) / (CHEGG_LAYOFF_END - CHEGG_LAYOFF_START)) * 50)}%
            </div>
          </div>
        )}
      </div>

      {/* ============================== IBM PANEL ============================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: frame >= WIPE_CHEGG_TO_IBM && frame < KLARNA_START + 20 ? 1 : 0,
          clipPath: `inset(0 ${wipeIbmOut * 100}% 0 ${(1 - wipeIbmIn) * 100}%)`,
        }}
      >
        <Video
          src={staticFile("broll/office-walking.mp4")}
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.55) saturate(0.85) contrast(1.1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)" }} />
        {/* Subtle moving grid overlay to fill empty space */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(78,205,196,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Central counter */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 36,
              color: "#888888",
              letterSpacing: 6,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            AUTOMATED BY AI
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 220,
              color: "#FFFFFF",
              letterSpacing: -6,
              textShadow: "0 0 30px rgba(255,255,255,0.3)",
              lineHeight: 0.9,
            }}
          >
            {ibmValue.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 42,
              color: "#FFD700",
              letterSpacing: 4,
              marginTop: 32,
              opacity: ibmSubOpacity,
            }}
          >
            BACK-OFFICE ROLES · 30% REPLACED
          </div>
        </div>

        {/* Lower third */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            transform: `translateX(${(1 - ibmLT) * -400}px)`,
            opacity: ibmLT,
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: "16px 28px",
            borderLeft: "4px solid #4ECDC4",
          }}
        >
          <div style={{ fontFamily, fontSize: 14, color: "#4ECDC4", fontWeight: 700, letterSpacing: 3 }}>
            CASE 02 · IBM
          </div>
          <div style={{ fontFamily, fontSize: 22, color: "#FFFFFF", fontWeight: 500, marginTop: 4 }}>
            May 2023 · Hiring Pause
          </div>
        </div>
      </div>

      {/* ============================== KLARNA PANEL ============================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: frame >= KLARNA_START ? 1 : 0,
        }}
      >
        <Video
          src={staticFile("broll/stock-tablet-analysis.mp4")}
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.55) saturate(0.9) hue-rotate(15deg) contrast(1.1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.08) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 36,
              color: "#888888",
              letterSpacing: 6,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            AI ASSISTANT REPLACED
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 240,
              color: "#FFFFFF",
              letterSpacing: -6,
              textShadow: "0 0 40px rgba(255,255,255,0.4)",
              lineHeight: 0.9,
            }}
          >
            {klarnaValue}
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 56,
              color: "#FFD700",
              letterSpacing: 8,
              marginTop: 24,
            }}
          >
            AGENTS
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 24,
              color: "#FFFFFF",
              letterSpacing: 3,
              marginTop: 24,
            }}
          >
            Full-time agents · in one month
          </div>
        </div>

        {/* Lower third */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            transform: `translateX(${(1 - klarnaLT) * -400}px)`,
            opacity: klarnaLT,
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: "16px 28px",
            borderLeft: "4px solid #A855F7",
          }}
        >
          <div style={{ fontFamily, fontSize: 14, color: "#A855F7", fontWeight: 700, letterSpacing: 3 }}>
            CASE 03 · KLARNA
          </div>
          <div style={{ fontFamily, fontSize: 22, color: "#FFFFFF", fontWeight: 500, marginTop: 4 }}>
            February 2024 · AI Assistant
          </div>
        </div>
      </div>

      {/* ============================== AUDIO ============================== */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/cinematic-long.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.05;
            if (f < CHEGG_DROP_FRAME) return 0.05;
            // Build through cases
            if (f < IBM_START) return 0.07;
            if (f < KLARNA_START) return 0.09;
            // Spike on Klarna reveal
            if (f > KLARNA_START && f < KLARNA_START + 60) return 0.14;
            return 0.1;
          }}
        />
      </Sequence>
      {/* Stock crash on Chegg drop */}
      <Sequence from={CHEGG_DROP_FRAME} durationInFrames={60}>
        <Audio src={staticFile("sfx/stock-crash.mp3")} volume={0.85} />
      </Sequence>
      {/* String sting cue IBM */}
      <Sequence from={IBM_START} durationInFrames={45}>
        <Audio src={staticFile("sfx/string-sting.mp3")} volume={0.6} />
      </Sequence>
      {/* Newspaper on IBM transition */}
      <Sequence from={IBM_SUB_DELAY} durationInFrames={60}>
        <Audio src={staticFile("sfx/newspaper.mp3")} volume={0.5} />
      </Sequence>
      {/* Counter tick Klarna */}
      <Sequence from={KLARNA_START} durationInFrames={120}>
        <Audio src={staticFile("sfx/counter-tick.mp3")} volume={0.7} />
      </Sequence>
      {/* Wipe whoosh transitions */}
      <Sequence from={WIPE_CHEGG_TO_IBM} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={WIPE_IBM_TO_KLARNA} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>

      {/* ============================== FLASH DURING WIPES ============================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FF3366",
          pointerEvents: "none",
          zIndex: 15,
          opacity:
            (frame >= WIPE_CHEGG_TO_IBM && frame < WIPE_CHEGG_TO_IBM + 4) ||
            (frame >= WIPE_IBM_TO_KLARNA && frame < WIPE_IBM_TO_KLARNA + 4)
              ? 0.5
              : 0,
        }}
      />


      <Watermark />

      <PostFX grainOpacity={0.08} vignetteRadius={0.55} vignetteDarkness={0.5} />
    </AbsoluteFill>
  );
};