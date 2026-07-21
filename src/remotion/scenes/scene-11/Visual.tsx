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
  weights: ["300", "400", "500", "700"],
});

const TOTAL_AVATARS = 20;
const COLS = 5;
const ROWS = 4;
const AVATAR_DROP_FRAMES = 15; // 0.5s between drops

const Avatar: React.FC<{
  alive: boolean;
  fadeOut: number; // 0 = visible, 1 = fully gone
}> = ({ alive, fadeOut }) => {
  if (!alive) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - fadeOut,
        transform: `scale(${1 - fadeOut * 0.2})`,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "#4ECDC4",
          border: "2px solid #FFFFFF",
          boxShadow: "0 0 8px rgba(78,205,196,0.4)",
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 9,
          color: "#4ECDC4",
          letterSpacing: 1,
          marginTop: 4,
          fontWeight: 700,
        }}
      >
        ACTIVE
      </div>
    </div>
  );
};

export const Scene11Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Attrition sequence: drop one avatar every AVATAR_DROP_FRAMES
  // Drop order: random-ish but interesting (visually random via index % spread)
  // We'll drop them in a defined order so empties scatter visually
  const dropOrder = [3, 7, 1, 12, 5, 17, 0, 9, 14, 2, 19, 6, 11, 16, 4, 13, 8, 18, 10, 15];

  const dropsCompletedThisFrame = Math.min(
    TOTAL_AVATARS,
    Math.floor(frame / AVATAR_DROP_FRAMES)
  );

  // Color temperature shift: 0 → -30 over the scene (hue-rotate -30deg)
  const tempShift = interpolate(frame, [0, durationInFrames], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fluorescent flicker (every 100ms = 3 frames)
  const flickerSeed = (Math.floor(frame / 3) * 7919) % 100;
  const flickerOn = flickerSeed > 30;
  const flickerOpacity = flickerOn ? 0.03 + (flickerSeed % 5) * 0.012 : 0.06;
  const flickerY = (frame % 2) * 1.2;

  // Final "..." text
  const dotsPhase = Math.max(0, frame - (durationInFrames - 30));
  const dotsOpacity = interpolate(dotsPhase, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotCharCount = Math.min(3, Math.floor(dotsPhase / 10) + 1);

  // Header fade
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Lower third fade
  const ltOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Lower third fade out as attrition happens
  const ltLastOpacity = interpolate(frame, [durationInFrames - 60, durationInFrames - 20], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compute which avatars are still alive + their fadeOut progress
  const avatarStates: { alive: boolean; fadeOut: number; cellIndex: number }[] = [];
  for (let cellIdx = 0; cellIdx < TOTAL_AVATARS; cellIdx++) {
    // Find if cell is still alive
    const dropIndex = dropOrder.indexOf(cellIdx);
    let alive = true;
    let fadeOut = 0;
    if (dropIndex >= 0 && dropIndex < dropsCompletedThisFrame) {
      const dropFrame = dropIndex * AVATAR_DROP_FRAMES;
      const elapsed = frame - dropFrame;
      if (elapsed >= 9) {
        alive = false;
      } else if (elapsed > 0) {
        // 300ms = 9 frames fade-out
        fadeOut = Math.min(1, elapsed / 9);
      } else {
        alive = true;
      }
    }
    avatarStates.push({ alive, fadeOut, cellIndex: cellIdx });
  }

  const aliveCount = avatarStates.filter((a) => a.alive).length;
  const totalDropped = TOTAL_AVATARS - aliveCount;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E14", fontFamily, overflow: "hidden" }}>
      {/* Background office B-roll (subtle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `hue-rotate(${tempShift}deg) brightness(0.5)`,
        }}
      >
        <Video
          src={staticFile("broll/office-empty.mp4")}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Office wall gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(20,30,40,0.55) 0%, rgba(10,14,20,0.85) 100%)",
        }}
      />

      {/* Window-pane grid pattern (ceiling lights effect) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(0deg, rgba(78,205,196,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.05) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          filter: `hue-rotate(${tempShift}deg)`,
        }}
      />

      {/* Top header bar */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: headerOpacity,
        }}
      >
        <div>
          <div style={{ fontFamily, fontSize: 13, color: "#4ECDC4", fontWeight: 700, letterSpacing: 4 }}>
            SILENT LAYOFFS · ATTRITION BY AI
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily,
            fontSize: 13,
            color: "#AAAAAA",
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FF3366" }} />
          {totalDropped} / {TOTAL_AVATARS} POSITIONS GONE
        </div>
      </div>

      {/* Isometric-ish office workstation grid */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 120,
          right: 120,
          bottom: 200,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gap: 20,
        }}
      >
        {avatarStates.map((s, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                backgroundColor: "rgba(15,20,30,0.7)",
                border: "1px solid rgba(78,205,196,0.15)",
                borderRadius: 4,
                overflow: "hidden",
                transform: `perspective(800px) rotateX(${8 + row * 2}deg) rotateY(${col * 1.5 - 4}deg) translateZ(${-row * 6}px)`,
                transformOrigin: "center center",
                boxShadow: s.alive ? "0 0 12px rgba(78,205,196,0.1)" : "inset 0 0 20px rgba(0,0,0,0.6)",
              }}
            >
              {/* Desk surface */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  backgroundColor: "rgba(40,50,60,0.4)",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              />
              {/* Monitor when alive */}
              {s.alive && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      right: 8,
                      height: 8,
                      backgroundColor: "#4ECDC4",
                      opacity: 0.4 - s.fadeOut * 0.4,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      right: 8,
                      height: 1,
                      backgroundColor: "#4ECDC4",
                      boxShadow: `0 0 4px rgba(78,205,196,${0.6 - s.fadeOut * 0.6})`,
                      opacity: 0.6 - s.fadeOut * 0.6,
                    }}
                  />
                </>
              )}
              <Avatar alive={s.alive} fadeOut={s.fadeOut} />
              {/* Station ID label faded */}
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 6,
                  fontFamily,
                  fontSize: 10,
                  color: "#555555",
                  letterSpacing: 1,
                  fontWeight: 500,
                }}
              >
                WS-{(i + 1).toString().padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower-third narrator citation */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity: ltOpacity,
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - ltLastOpacity) * 8}px)`,
          }}
        >
          <div style={{ fontFamily, fontSize: 12, color: "#FF3366", fontWeight: 700, letterSpacing: 3 }}>
            CASE · QUIET REPLACEMENT
          </div>
          <div style={{ fontFamily, fontSize: 18, color: "#DDDDDD", fontWeight: 500, marginTop: 4, letterSpacing: 1 }}>
            Companies simply don't refill positions when people quit
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily,
            fontSize: 12,
            color: "#888888",
            letterSpacing: 2,
            transform: `translateY(${(1 - ltLastOpacity) * 8}px)`,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: aliveCount === 0 ? "#FF3366" : "#4ECDC4",
            }}
          />
          {aliveCount} ACTIVE
        </div>
      </div>

      {/* Fluorescent light flicker overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFFFF",
          opacity: flickerOpacity,
          pointerEvents: "none",
          mixBlendMode: "screen",
          transform: `translateY(${flickerY}px)`,
        }}
      />

      {/* Final "..." text */}
      {dotsPhase > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: dotsOpacity,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 300,
              fontSize: 36,
              color: "#666666",
              letterSpacing: 12,
            }}
          >
            {".".repeat(dotCharCount)}
          </div>
        </div>
      )}

      {/* Audio */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/drone-sci-fi.mp3")}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.04;
            // Fade down to near-silence by end
            if (f > durationInFrames - 120) {
              return Math.max(0.005, 0.06 - ((f - (durationInFrames - 120)) / 120) * 0.055);
            }
            return 0.06;
          }}
        />
      </Sequence>
      <Sequence from={0} durationInFrames={durationInFrames - 200}>
        <Audio src={staticFile("sfx/server-hum.mp3")} volume={0.08} />
      </Sequence>
      <Sequence from={AVATAR_DROP_FRAMES} durationInFrames={durationInFrames - 60}>
        <Audio src={staticFile("sfx/ticking.mp3")} volume={0.15} loop />
      </Sequence>


      <Watermark />

      <PostFX grainOpacity={0.12} vignetteRadius={0.6} vignetteDarkness={0.5} />
    </AbsoluteFill>
  );
};