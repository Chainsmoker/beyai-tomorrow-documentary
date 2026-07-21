import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJet } from "@remotion/google-fonts/JetBrainsMono";
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
import { Watermark } from "../../components/Watermark";

const { fontFamily } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700", "900"],
});
const { fontFamily: monoFont } = loadJet("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const TARGET = "> AWAITING HUMAN INPUT...";
const FRAMES_PER_CHAR = 80 * 30 / 1000; // 80ms/char at 30fps
const CURSOR_BLINK_FRAMES = 24;

export const Scene15Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Typewriter phase (frames 0 to ~textEnd)
  const charsToShow = Math.min(
    TARGET.length,
    Math.floor(frame / FRAMES_PER_CHAR)
  );
  const text = TARGET.slice(0, charsToShow);
  const cursorOn = Math.floor(frame / CURSOR_BLINK_FRAMES) % 2 === 0;
  const typewriterDone = charsToShow >= TARGET.length;
  const typewriterEndFrame = Math.ceil(TARGET.length * FRAMES_PER_CHAR);

  // Logo reveal phase (after typewriter done)
  const logoStartFrame = typewriterEndFrame + 30; // +1s pause
  const logoOpacity = interpolate(frame, [logoStartFrame, logoStartFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScaleSpring = spring({
    fps: 30,
    frame: Math.max(0, frame - logoStartFrame),
    config: { stiffness: 180, damping: 18 },
    durationInFrames: 30,
  });

  // Light sweep across logo (800ms loop starting at logoStartFrame + 60)
  const sweepStart = logoStartFrame + 60;
  const sweepT = frame >= sweepStart ? ((frame - sweepStart) % 24) / 24 : 0;

  // Subscribe button reveal after logo settled
  const buttonStartFrame = logoStartFrame + 90;
  const buttonOpacity = interpolate(frame, [buttonStartFrame, buttonStartFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buttonSpring = spring({
    fps: 30,
    frame: Math.max(0, frame - buttonStartFrame),
    config: { stiffness: 200, damping: 12 },
    durationInFrames: 24,
  });
  // Pulse loop after intro (1.5s = 45 frames)
  const buttonPulse =
    frame > buttonStartFrame + 24
      ? 1 + 0.05 * Math.sin(((frame - buttonStartFrame - 24) / 45) * Math.PI * 2)
      : 1;

  // End screen layout (2 video placeholders) — appears after button reveal
  const endStartFrame = buttonStartFrame + 60;
  const endOpacity = interpolate(frame, [endStartFrame, endStartFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter visibility (fade out as scene moves to logo)
  const typewriterFade = frame > typewriterEndFrame
    ? Math.max(0, 1 - (frame - typewriterEndFrame - 10) / 20)
    : 1;

  // Final fade to black last 30 frames
  const finalFade = interpolate(frame, [durationInFrames - 30, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}>
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,40,15,0.18) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* PHASE 1: Typewriter terminal block */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: typewriterFade,
          transform: `translateY(${frame > typewriterEndFrame ? Math.max(0, 1 - (frame - typewriterEndFrame) / 20) * -40 : 0}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: monoFont,
            fontSize: 36,
            fontWeight: 700,
            color: "#00FF41",
            textShadow: "0 0 12px rgba(0,255,65,0.55), 0 0 24px rgba(0,255,65,0.25)",
            letterSpacing: 1.5,
            minHeight: 50,
            padding: 20,
          }}
        >
          <span>{text}</span>
          {typewriterDone && (
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 32,
                marginLeft: 4,
                backgroundColor: "#00FF41",
                boxShadow: "0 0 10px rgba(0,255,65,0.8)",
                opacity: cursorOn ? 1 : 0,
              }}
            />
          )}
        </div>
      </div>

      {/* PHASE 2: BeyAI Tomorrow logo + sweep (fades out when outro appears) */}
      {frame > logoStartFrame && frame < endStartFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: logoOpacity,
            transform: `translateY(${Math.max(0, 1 - logoScaleSpring) * 20}px) scale(${logoScaleSpring})`,
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 76,
              color: "#FFFFFF",
              letterSpacing: 6,
              textShadow: "0 0 30px rgba(255,255,255,0.3)",
              position: "relative",
            }}
          >
            BeyAI Tomorrow
            {/* Light sweep */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
                backgroundSize: "60% 100%",
                backgroundRepeat: "no-repeat",
                mixBlendMode: "screen",
                transform: `translateX(${(sweepT - 1) * 400}%)`,
                WebkitMaskImage:
                  "linear-gradient(black, black)",
                opacity: frame >= sweepStart ? 0.85 : 0,
              }}
            />
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 18,
              color: "#888888",
              letterSpacing: 4,
              fontWeight: 500,
              marginTop: 12,
            }}
          >
            THE CODE IS ALREADY BEING WRITTEN
          </div>
        </div>
      )}

      {/* PHASE 3: Subscribe button */}
      {frame > buttonStartFrame && (
        <div
          style={{
            position: "absolute",
            top: "68%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: buttonOpacity,
            transform: `scale(${buttonSpring * buttonPulse})`,
          }}
        >
          <button
            style={{
              padding: "16px 48px",
              backgroundColor: "#FF0000",
              borderRadius: 30,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(255,0,0,0.6), 0 4px 14px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="white">
              <path d="M11 16L0 0h22z" />
            </svg>
            <span
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 22,
                color: "#FFFFFF",
                letterSpacing: 4,
              }}
            >
              SUBSCRIBE
            </span>
          </button>
        </div>
      )}

      {/* PHASE 4: End screen — outro.mp4 full screen */}
      {frame > endStartFrame && (
        <Sequence from={endStartFrame} durationInFrames={durationInFrames - endStartFrame}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: endOpacity,
            }}
          >
            <Video
              src={staticFile("broll/outro.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </Sequence>
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
          src={staticFile("music/dark-ambient.mp3")}
          volume={(f) => {
            // Fade out 3s at the end
            if (f > durationInFrames - 90) {
              return Math.max(0, 0.1 - (f - (durationInFrames - 90)) / 90 * 0.1);
            }
            if (f < 30) return (f / 30) * 0.1;
            return 0.1;
          }}
        />
      </Sequence>
      {/* Soft keystroke at the end */}
      <Sequence from={durationInFrames - 30} durationInFrames={30}>
        <Audio src={staticFile("sfx/keystroke.mp3")} volume={0.55} loop />
      </Sequence>

    <Watermark />
    </AbsoluteFill>
  );
};