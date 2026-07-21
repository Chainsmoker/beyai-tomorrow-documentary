import { loadFont } from "@remotion/google-fonts/Inter";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700", "900"],
});

const CREATED_TARGET = 83;
const ELIMINATED_TARGET = 69;
const GAP_TARGET = 14;

const BAR_WIDTH = 120;
const CREATED_HEIGHT = 415;
const ELIMINATED_HEIGHT = 345;
const BAR_BOTTOM_Y = 880;

const CREATED_X = 720;
const ELIMINATED_X = 1080;

const BAR_DUR_FRAMES = 45;
const ELIMINATED_DELAY = 9; // 300ms at 30fps
const COUNTER_DUR = 45;

const RISER_AT = 380;
const IMPACT_AT = 560;
const LOWER_THIRD_DUR = 12; // 400ms at 30fps

const formatM = (n: number) => `${Math.round(n)}M`;

export const Scene04Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const createdSpring = spring({
    fps,
    frame,
    config: { stiffness: 150, damping: 20 },
    durationInFrames: BAR_DUR_FRAMES,
  });
  const eliminatedSpring = spring({
    fps,
    frame: Math.max(0, frame - ELIMINATED_DELAY),
    config: { stiffness: 150, damping: 20 },
    durationInFrames: BAR_DUR_FRAMES,
  });

  const createdH = createdSpring * CREATED_HEIGHT;
  const eliminatedH = eliminatedSpring * ELIMINATED_HEIGHT;

  const counterT = Math.min(1, frame / COUNTER_DUR);
  const eliminatedCounterT = Math.min(
    1,
    Math.max(0, (frame - ELIMINATED_DELAY) / COUNTER_DUR),
  );
  const easedCounter = (t: number) => 1 - Math.pow(1 - t, 3);
  const createdVal = easedCounter(counterT) * CREATED_TARGET;
  const eliminatedVal = easedCounter(eliminatedCounterT) * ELIMINATED_TARGET;

  // Gap reveal ~13s into 22s scene
  const gapStart = 380;
  const gapAppearT = Math.min(1, Math.max(0, (frame - gapStart) / 20));
  const gapEased = 1 - Math.pow(1 - gapAppearT, 3);
  // Pulsating highlight
  const pulsePeriod = 36; // 1200ms at 30fps
  const pulseT = (Math.floor((frame - gapStart) / pulsePeriod) % 2 === 0)
    ? 1
    : 0;
  const pulseAlpha = 0.3 + 0.3 * pulseT;

  // Lower third
  const ltT = Math.min(1, frame / LOWER_THIRD_DUR);
  const ltEased = 1 - Math.pow(1 - ltT, 3);
  const ltY = (1 - ltEased) * 48;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#0A0E27",
        overflow: "hidden",
      }}
    >
      {/* Axis labels (CREATED / ELIMINATED) */}
      <div
        style={{
          position: "absolute",
          left: CREATED_X,
          top: BAR_BOTTOM_Y + 32,
          width: BAR_WIDTH,
          textAlign: "center",
          fontFamily,
          fontSize: 16,
          fontWeight: 500,
          color: "#888888",
          letterSpacing: 2,
        }}
      >
        CREATED
      </div>
      <div
        style={{
          position: "absolute",
          left: ELIMINATED_X,
          top: BAR_BOTTOM_Y + 32,
          width: BAR_WIDTH,
          textAlign: "center",
          fontFamily,
          fontSize: 16,
          fontWeight: 500,
          color: "#888888",
          letterSpacing: 2,
        }}
      >
        ELIMINATED
      </div>

      {/* Baseline */}
      <div
        style={{
          position: "absolute",
          left: 480,
          right: 480,
          top: BAR_BOTTOM_Y,
          height: 2,
          backgroundColor: "#222A4A",
        }}
      />

      {/* Bar: CREATED (green) */}
      <div
        style={{
          position: "absolute",
          left: CREATED_X,
          top: BAR_BOTTOM_Y - createdH,
          width: BAR_WIDTH,
          height: createdH,
          background: "linear-gradient(180deg, #00FF88 0%, #00CC6A 100%)",
          boxShadow: "0 0 24px rgba(0,255,136,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -52,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily,
            fontSize: 36,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow: "0 0 12px rgba(0,255,136,0.5)",
          }}
        >
          {formatM(createdVal)}
        </div>
      </div>

      {/* Bar: ELIMINATED (red) */}
      <div
        style={{
          position: "absolute",
          left: ELIMINATED_X,
          top: BAR_BOTTOM_Y - eliminatedH,
          width: BAR_WIDTH,
          height: eliminatedH,
          background: "linear-gradient(180deg, #FF3366 0%, #CC1F4A 100%)",
          boxShadow: "0 0 24px rgba(255,51,102,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -52,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily,
            fontSize: 36,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow: "0 0 12px rgba(255,51,102,0.5)",
          }}
        >
          {formatM(eliminatedVal)}
        </div>
      </div>

      {/* Gap indicator (between bars, top region) */}
      <div
        style={{
          position: "absolute",
          left: CREATED_X + BAR_WIDTH + 12,
          top: 220,
          width: ELIMINATED_X - (CREATED_X + BAR_WIDTH) - 24,
          opacity: gapEased,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 900,
            color: "#FFD700",
            textShadow: `0 0 18px rgba(255,215,0,${pulseAlpha + 0.3})`,
          }}
        >
          {formatM(GAP_TARGET)}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "6px 16px",
            backgroundColor: `rgba(255,215,0,${pulseAlpha})`,
            border: "2px solid #FFD700",
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            color: "#0A0E27",
            letterSpacing: 3,
          }}
        >
          LOST
        </div>
      </div>

      {/* Lower third (slides from bottom) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
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
          World Economic Forum — Future of Jobs Report 2023
        </div>
      </div>

      {/* Music + SFX */}
      <Sequence from={0}>
        <Audio src={staticFile("music/cinematic-drone.mp3")} volume={0.15} />
      </Sequence>
      <Sequence from={RISER_AT} durationInFrames={300}>
        <Audio src={staticFile("sfx/riser-tension.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={IMPACT_AT} durationInFrames={120}>
        <Audio src={staticFile("sfx/impact-hit.mp3")} volume={0.95} />
      </Sequence>


      <Watermark />

      <PostFX />
    </div>
  );
};