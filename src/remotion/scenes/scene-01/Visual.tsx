import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { Audio, Sequence, staticFile, useCurrentFrame, interpolate, Video } from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const TARGET = "> EXECUTE: JOB_REPLACEMENT.PROTOCOL";
const MS_PER_CHAR = 80;
const FRAMES_PER_CHAR = (MS_PER_CHAR / 1000) * 30; // 2.4 frames/char at 30fps
const CURSOR_BLINK_FRAMES = 24;

const BROLL_START_RATIO = 0.7;

const BROLL_CLIPS = [
  staticFile("broll/tokyo-subway.mp4"),
  staticFile("broll/trading-screen.mp4"),
  staticFile("broll/freelancer-cafe.mp4"),
  staticFile("broll/robot-arm.mp4"),
];

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const fillStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};

export const Scene01Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.min(
    TARGET.length,
    Math.floor(frame / FRAMES_PER_CHAR),
  );
  const text = TARGET.slice(0, charsToShow);

  const cursorOn = Math.floor(frame / CURSOR_BLINK_FRAMES) % 2 === 0;
  const textFadeIn = Math.min(1, frame / 20);

  const brollStart = Math.floor(durationInFrames * BROLL_START_RATIO);
  const brollWindow = durationInFrames - brollStart;
  const brollSegment = Math.floor(brollWindow / BROLL_CLIPS.length);
  const typewriterDone = charsToShow >= TARGET.length;
  const textAppearFrame = Math.ceil(TARGET.length * FRAMES_PER_CHAR);

  const keystrokeAt = 0;
  const serverHumAt = 60;
  const tickingAt = 150;
  const bassDropAt = 240;
  const glitchAt = textAppearFrame + 20;

  return (
    <div style={{ ...fillStyle, backgroundColor: COLORS.bg_primary }}>
      {/* B-roll montage (last 30%) */}
      {BROLL_CLIPS.map((src, i) => (
        <Sequence
          key={i}
          from={brollStart + i * brollSegment}
          durationInFrames={brollSegment}
        >
          <Video
            src={src}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: typewriterDone ? 1 : 0,
            }}
          />
        </Sequence>
      ))}

      {/* COLD OPEN: dark B-roll intro (frames 60-180) before terminal */}
      {frame >= 60 && frame < 210 && (
        <Video
          src={staticFile("broll/code-matrix-pink.mp4")}
          muted
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: interpolate(
              frame,
              [60, 84, 180, 210],
              [0, 0.55, 0.55, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        />
      )}

      {/* Dark overlay (fades when typewriter done) */}
      <div
        style={{
          ...fillStyle,
          backgroundColor: "#000",
          opacity: frame < 90 ? 0.4 : (typewriterDone ? 0.4 : 1),
        }}
      />

      {/* Terminal block */}
      <div
        style={{
          ...fillStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 120,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.accent_green,
            textShadow: `0 0 8px rgba(0,255,65,0.55), 0 0 18px rgba(0,255,65,0.25)`,
            letterSpacing: 1.2,
            opacity: textFadeIn,
            minHeight: 50,
          }}
        >
          <span>{text}</span>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 32,
              marginLeft: 4,
              backgroundColor: COLORS.accent_green,
              boxShadow: `0 0 10px rgba(0,255,65,0.8)`,
              opacity: cursorOn ? 1 : 0,
              transform: "translateY(2px)",
            }}
          />
        </div>
      </div>

      {/* Audio bed */}
      <Sequence from={0}>
        <Audio src={staticFile("music/dark-ambient.mp3")} volume={(f) => {
          // Quiet during black intro
          if (f < 60) return 0.04;
          return 0.12;
        }} />
      </Sequence>

      {/* SFX cues */}
      <Sequence from={keystrokeAt} durationInFrames={60}>
        <Audio src={staticFile("sfx/keystroke.mp3")} volume={0.9} />
      </Sequence>
      <Sequence
        from={serverHumAt}
        durationInFrames={durationInFrames - serverHumAt}
      >
        <Audio src={staticFile("sfx/server-hum.mp3")} volume={0.1} />
      </Sequence>
      <Sequence from={tickingAt} durationInFrames={300}>
        <Audio src={staticFile("sfx/ticking.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={bassDropAt} durationInFrames={120}>
        <Audio src={staticFile("sfx/bass-drop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={glitchAt} durationInFrames={60}>
        <Audio src={staticFile("sfx/glitch.mp3")} volume={0.9} />
      </Sequence>

      {/* Final fade to black for smooth transition to scene-2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: Math.min(1, Math.max(0, (frame - (durationInFrames - 30)) / 30)),
          pointerEvents: "none",
        }}
      />

      <Watermark />

      <PostFX />
    </div>
  );
};