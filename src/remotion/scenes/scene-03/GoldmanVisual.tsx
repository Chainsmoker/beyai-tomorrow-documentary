import { loadFont } from "@remotion/google-fonts/Inter";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  Video,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./GoldmanPostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700", "900"],
});

const GLOBE_CENTER_X = 960;
const GLOBE_CENTER_Y = 480;
const GLOBE_RADIUS = 380;
const LAT_COUNT = 9;
const LON_COUNT = 14;

type Point = { x: number; y: number; z: number; delay: number };

const POINTS: Point[] = (() => {
  const pts: Point[] = [];
  for (let i = 0; i < 1500; i++) {
    // Fibonacci sphere distribution
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 1500);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta) * 0.45;
    const z = GLOBE_RADIUS * Math.cos(phi);
    pts.push({ x, y, z, delay: Math.random() * 90 });
  }
  return pts;
})();

// cubic-bezier(0.25, 0.46, 0.45, 0.94)
const cubicBezier = (t: number, p1: number, p2: number, p3: number, p4: number) => {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p3 + t * t * t;
};

const formatNumber = (n: number) => n.toLocaleString("en-US");

export const GoldmanVisual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const globeRotY = frame * 0.5;
  const counterStart = 150;
  const counterDur = 60;
  const lowerThirdDur = 24;
  const whooshAt = 150;
  const subBassAt = 210;
  const silenceAt = Math.max(0, durationInFrames - 60);

  const counterT = Math.min(1, Math.max(0, (frame - counterStart) / counterDur));
  const counterEased = cubicBezier(counterT, 0.25, 0.46, 0.45, 0.94);
  const counterValue = Math.floor(counterEased * 300_000_000);

  const lowerThirdT = Math.min(1, frame / lowerThirdDur);
  const lowerThirdEased = 1 - Math.pow(1 - lowerThirdT, 3); // ease-out cubic
  const lowerThirdX = (1 - lowerThirdEased) * -400;

  const globeFade = Math.min(1, frame / 30);
  const counterOpacity = counterT > 0 ? Math.min(1, counterT * 4) : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bg_primary,
        overflow: "hidden",
      }}
    >
      {/* B-roll background (empty offices) */}
      <Video
        src={staticFile("broll/empty-office.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Wireframe globe */}
      <div
        style={{
          position: "absolute",
          left: GLOBE_CENTER_X - GLOBE_RADIUS,
          top: GLOBE_CENTER_Y - GLOBE_RADIUS,
          width: GLOBE_RADIUS * 2,
          height: GLOBE_RADIUS * 2,
          perspective: 1400,
          perspectiveOrigin: "50% 50%",
          opacity: globeFade,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${globeRotY}deg)`,
          }}
        >
          {/* Horizontal latitude rings */}
          {Array.from({ length: LAT_COUNT }).map((_, i) => {
            const lat = ((i - (LAT_COUNT - 1) / 2) / LAT_COUNT) * Math.PI;
            const ry = Math.abs(Math.cos(lat)) * GLOBE_RADIUS;
            return (
              <svg
                key={`lat-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "visible",
                }}
              >
                <ellipse
                  cx={GLOBE_RADIUS}
                  cy={GLOBE_RADIUS}
                  rx={GLOBE_RADIUS}
                  ry={ry}
                  fill="none"
                  stroke="#1A1F3A"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              </svg>
            );
          })}
          {/* Vertical longitude rings */}
          {Array.from({ length: LON_COUNT }).map((_, i) => {
            const lon = (i / LON_COUNT) * 360;
            return (
              <div
                key={`lon-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${lon}deg)`,
                }}
              >
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                  }}
                >
                  <ellipse
                    cx={GLOBE_RADIUS}
                    cy={GLOBE_RADIUS}
                    rx={GLOBE_RADIUS}
                    ry={GLOBE_RADIUS}
                    fill="none"
                    stroke="#1A1F3A"
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                </svg>
              </div>
            );
          })}

          {/* Light points */}
          {POINTS.map((p, i) => {
            const localFrame = frame - (counterStart + p.delay);
            const appearT = Math.min(1, Math.max(0, localFrame / 6));
            const eased = 1 - Math.pow(1 - appearT, 3);
            const rotateAngle = (globeRotY * Math.PI) / 180;
            const cosA = Math.cos(rotateAngle);
            const sinA = Math.sin(rotateAngle);
            const xr = p.x * cosA + p.z * sinA;
            const zr = -p.x * sinA + p.z * cosA;
            const perspectiveScale = 600 / (600 + zr);
            const screenX = GLOBE_RADIUS + xr * perspectiveScale;
            const screenY = GLOBE_RADIUS + p.y * perspectiveScale;
            const depthAlpha = (zr + GLOBE_RADIUS) / (2 * GLOBE_RADIUS);
            const visible = zr > -GLOBE_RADIUS * 0.95 && eased > 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: screenX - 2,
                  top: screenY - 2,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  backgroundColor: "#00D4FF",
                  boxShadow: "0 0 6px rgba(0,212,255,0.9)",
                  opacity: visible ? eased * depthAlpha : 0,
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: GLOBE_CENTER_Y + GLOBE_RADIUS + 40,
          textAlign: "center",
          opacity: counterOpacity,
          transform: `scale(${0.92 + counterEased * 0.08})`,
        }}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow:
              "0 0 16px rgba(0,212,255,0.45), 0 0 32px rgba(0,212,255,0.2)",
            letterSpacing: -2,
          }}
        >
          {formatNumber(counterValue)}
        </div>
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.text_secondary,
            marginTop: 8,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          jobs exposed to automation
        </div>
      </div>

      {/* Lower third */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          transform: `translateX(${lowerThirdX}px)`,
        }}
      >
        <div
          style={{
            width: 6,
            height: 48,
            backgroundColor: "#00D4FF",
            marginRight: 16,
          }}
        />
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "12px 20px",
            fontFamily: fontFamily,
            fontSize: 18,
            fontWeight: 500,
            color: COLORS.text_secondary,
            letterSpacing: 0.5,
          }}
        >
          Goldman Sachs Economics Research — April 2023
        </div>
      </div>

      {/* Music bed */}
      <Sequence from={0}>
        <Audio src={staticFile("music/cinematic-drone.mp3")} volume={0.18} />
      </Sequence>

      {/* SFX cues */}
      <Sequence from={whooshAt} durationInFrames={120}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={subBassAt} durationInFrames={150}>
        <Audio src={staticFile("sfx/sub-bass.mp3")} volume={0.95} />
      </Sequence>
      {/* Silence before "combined" — drop music volume */}
      <Sequence from={silenceAt} durationInFrames={durationInFrames - silenceAt}>
        <Audio src={staticFile("music/cinematic-drone.mp3")} volume={0} />
      </Sequence>


      <Watermark />

      <PostFX grainOpacity={0.06} vignetteRadius={0.5} vignetteDarkness={0.5} />
    </div>
  );
};