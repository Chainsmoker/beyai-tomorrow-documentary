import { loadFont } from "@remotion/google-fonts/Inter";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Video,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700", "900"],
});

const TILE_DUR = 6; // 200ms stagger
const LOWER_THIRD_DUR = 12; // 400ms
const LINE_CHART_START = 600;
const LINE_CHART_DUR = 90;

const GRID_TILES = [
  staticFile("broll/kaleidoscope.mp4"),
  staticFile("broll/abstract-waveform.mp4"),
  staticFile("broll/binary-matrix.mp4"),
  staticFile("broll/scrolling-code.mp4"),
];

// Line chart points (in normalized 0-1)
const HUMAN_POINTS = [
  [0, 0.85],
  [0.25, 0.75],
  [0.5, 0.6],
  [0.75, 0.4],
  [1, 0.2],
];
const AI_POINTS = [
  [0, 0.92],
  [0.25, 0.91],
  [0.5, 0.9],
  [0.75, 0.89],
  [1, 0.88],
];

const CHART_X = 200;
const CHART_Y = 880;
const CHART_W = 1520;
const CHART_H = 280;

const toPath = (points: number[][]) => {
  return points
    .map((p, i) =>
      i === 0
        ? `M ${CHART_X + p[0] * CHART_W} ${CHART_Y + p[1] * CHART_H}`
        : `L ${CHART_X + p[0] * CHART_W} ${CHART_Y + p[1] * CHART_H}`,
    )
    .join(" ");
};

export const Scene06Visual: React.FC<{
  durationInFrames: number;
}> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitFade = Math.min(1, frame / 20);
  const ltT = Math.min(1, frame / LOWER_THIRD_DUR);
  const ltEased = 1 - Math.pow(1 - ltT, 3);
  const ltY = (1 - ltEased) * 48;

  // Line drawing animation
  const lineT = Math.min(
    1,
    Math.max(0, (frame - LINE_CHART_START) / LINE_CHART_DUR),
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bg_primary,
        overflow: "hidden",
      }}
    >
      {/* Split screen container */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 80,
          bottom: 380,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          opacity: splitFade,
          border: "1px solid #30363D",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* LEFT: human designer (cold filter) */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Video
            src={staticFile("broll/designer-stressed.mp4")}
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) saturate(0.5) hue-rotate(-20deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              padding: "6px 14px",
              backgroundColor: "rgba(255,107,107,0.85)",
              fontFamily,
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            HUMAN
          </div>
        </div>

        {/* RIGHT: 2x2 grid of AI generated */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 4,
            backgroundColor: "#0A0E27",
          }}
        >
          {GRID_TILES.map((src, i) => {
            const tileDelay = i * TILE_DUR;
            const tileFrame = Math.max(0, frame - tileDelay);
            const tileScale = spring({
              fps,
              frame: tileFrame,
              config: { stiffness: 180, damping: 18 },
              durationInFrames: 20,
            });
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  opacity: tileScale,
                  transform: `scale(${0.9 + tileScale * 0.1})`,
                }}
              >
                <Video
                  src={src}
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              padding: "6px 14px",
              backgroundColor: "rgba(78,205,196,0.85)",
              fontFamily,
              fontSize: 14,
              fontWeight: 700,
              color: "#0A0E27",
              letterSpacing: 2,
            }}
          >
            AI · 4s
          </div>
        </div>

        {/* Animated divider */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: "rgba(255,255,255,0.5)",
            boxShadow: "0 0 12px rgba(255,255,255,0.4)",
            transform: "translateX(-1px)",
          }}
        />
      </div>

      {/* Line chart */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          opacity: lineT > 0 ? 1 : 0,
        }}
      >
        <svg
          width="100%"
          height="280"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", left: 0, right: 0 }}
        >
          {/* Axis line */}
          <line
            x1={CHART_X}
            y1={CHART_Y + CHART_H}
            x2={CHART_X + CHART_W}
            y2={CHART_Y + CHART_H}
            stroke="#444"
            strokeWidth="1"
          />
          {/* Fill area between human and AI lines (when visible) */}
          {lineT > 0 && (
            <path
              d={`${toPath(HUMAN_POINTS)} L ${CHART_X + CHART_W} ${CHART_Y + AI_POINTS[AI_POINTS.length - 1][1] * CHART_H} L ${CHART_X + CHART_W} ${CHART_Y + HUMAN_POINTS[0][1] * CHART_H} ${toPath([HUMAN_POINTS[HUMAN_POINTS.length - 1]])} Z`}
              fill="rgba(255,107,107,0.12)"
              style={{
                clipPath: `inset(0 ${(1 - lineT) * 100}% 0 0)`,
              }}
            />
          )}
          {/* AI line (cyan, flat) */}
          {lineT > 0 && (
            <path
              d={toPath(AI_POINTS)}
              stroke="#4ECDC4"
              strokeWidth="3"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={1000 - 1000 * lineT}
            />
          )}
          {/* Human line (red, ascending) */}
          {lineT > 0 && (
            <path
              d={toPath(HUMAN_POINTS)}
              stroke="#FF6B6B"
              strokeWidth="3"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={1000 - 1000 * lineT}
            />
          )}
          {/* Labels */}
          {lineT > 0.3 && (
            <text
              x={CHART_X + CHART_W - 40}
              y={CHART_Y + AI_POINTS[AI_POINTS.length - 1][1] * CHART_H - 12}
              fill="#4ECDC4"
              fontFamily={fontFamily}
              fontSize="18"
              fontWeight="700"
              textAnchor="end"
            >
              AI LABOR
            </text>
          )}
          {lineT > 0.3 && (
            <text
              x={CHART_X + CHART_W - 40}
              y={CHART_Y + HUMAN_POINTS[HUMAN_POINTS.length - 1][1] * CHART_H - 12}
              fill="#FF6B6B"
              fontFamily={fontFamily}
              fontSize="18"
              fontWeight="700"
              textAnchor="end"
            >
              HUMAN COST
            </text>
          )}
        </svg>
      </div>

      {/* Lower third */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 20,
          display: "flex",
          alignItems: "center",
          transform: `translateY(${ltY}px)`,
        }}
      >
        <div
          style={{
            width: 6,
            height: 48,
            backgroundColor: "#FFD700",
            marginRight: 16,
          }}
        />
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "12px 20px",
            fontFamily,
            fontSize: 18,
            fontWeight: 500,
            color: COLORS.text_secondary,
            letterSpacing: 0.5,
          }}
        >
          McKinsey & Company — June 2023
        </div>
      </div>

      {/* Music + SFX */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/piano-synth.mp3")}
          volume={(f) => {
            // Duck music during early voice (first 5s)
            if (f < 30) return (f / 30) * 0.06;
            if (f < 150) return 0.06;
            // Slight swell mid-scene
            if (f > 700) return Math.min(0.1, 0.06 + (f - 700) / 1500);
            return 0.06;
          }}
        />
      </Sequence>
      {/* Subtle ambient drone bed */}
      <Sequence from={0}>
        <Audio src={staticFile("music/dark-ambient.mp3")} volume={0.03} />
      </Sequence>
      {/* Paper crumple early */}
      <Sequence from={60} durationInFrames={60}>
        <Audio src={staticFile("sfx/paper-crumple.mp3")} volume={0.6} />
      </Sequence>
      {/* Cash register distorted later */}
      <Sequence from={800} durationInFrames={120}>
        <Audio src={staticFile("sfx/cash-register.mp3")} volume={0.75} />
      </Sequence>


      <Watermark />

      <PostFX />
    </div>
  );
};