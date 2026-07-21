import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Video,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";
import transcript from "../../../../public/voice/03_Chapter_4.json";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

type TokenType = "var" | "op" | "mod" | "func" | "p" | "str" | "ws";
type Token = { text: string; type: TokenType };

const LINES: Token[][] = [
  [
    { text: "response", type: "var" },
    { text: " ", type: "ws" },
    { text: "=", type: "op" },
    { text: " ", type: "ws" },
    { text: "openai", type: "mod" },
    { text: ".", type: "p" },
    { text: "ChatCompletion", type: "func" },
    { text: ".", type: "p" },
    { text: "create", type: "func" },
    { text: "(", type: "p" },
  ],
  [
    { text: "    ", type: "ws" },
    { text: "model", type: "var" },
    { text: "=", type: "op" },
    { text: '"gpt-4"', type: "str" },
    { text: ",", type: "p" },
  ],
  [
    { text: "    ", type: "ws" },
    { text: "messages", type: "var" },
    { text: "=", type: "op" },
    { text: "prompt", type: "var" },
  ],
  [{ text: ")", type: "p" }],
];

const COLORS_TOKENS: Record<TokenType, string> = {
  var: "#F8F8F2",
  op: "#FF79C6",
  mod: "#8BE9FD",
  func: "#50FA7B",
  p: "#F8F8F2",
  str: "#F1FA8C",
  ws: "#F8F8F2",
};

const FULL_TEXT_LENGTH = LINES.reduce(
  (sum, line) => sum + line.reduce((s, t) => s + t.text.length, 0) + 1,
  0,
);
const MS_PER_CHAR = 80;
const FRAMES_PER_CHAR = (MS_PER_CHAR / 1000) * 30;

// Transcript-driven timings (seconds → frames at 30fps)
const FPS = 30;
const flatWords = transcript.segments.flatMap((s) => s.words);
const findWordFrame = (text: string) => {
  const w = flatWords.find((w) =>
    w.word.toLowerCase().trim().startsWith(text.toLowerCase()),
  );
  return w ? Math.round(w.start * FPS) : -1;
};

// Phase markers synced to voice
const F_THIS_IS_IT = findWordFrame("This is it");              // ~203 — terminal fades in
const F_SINGLE_LINE = findWordFrame("single line");            // ~253 — highlight line 1
const F_API = findWordFrame("API");                            // ~425 — start PiP shrink
const F_70PCT = findWordFrame("70%");                          // 70% stat moment

// Terminal appears at "This is it" (~203), starts typing just after fade-in
const F_INTRO_END = F_THIS_IS_IT - 10;                         // b-roll until 193
const F_TYPING_START = F_THIS_IS_IT + 12;                      // typing at 215 (matches "A")
const HIGHLIGHT_DUR = 36;                                       // 1.2s emphasis
const F_HIGHLIGHT = F_SINGLE_LINE;
// PiP shrink starts AFTER "API call" phrase so code is fully readable during weapon/API narration
const F_PIP_START = F_API + 60;                                // ~485

export const Scene05Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const typingFrame = frame - F_TYPING_START;
  const charsTyped = Math.min(
    FULL_TEXT_LENGTH,
    Math.max(0, Math.floor(typingFrame / FRAMES_PER_CHAR)),
  );
  const typingDone = charsTyped >= FULL_TEXT_LENGTH;
  const terminalOpacity = interpolate(
    frame,
    [F_INTRO_END, F_INTRO_END + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const introOpacity = interpolate(frame, [F_INTRO_END - 18, F_INTRO_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pipT = Math.min(1, Math.max(0, (frame - F_PIP_START) / 30));
  const pipEased = 1 - Math.pow(1 - pipT, 3);
  const terminalWidth = 1200 - pipEased * (1200 - 384);
  const terminalHeight = 600 - pipEased * (600 - 216);
  const terminalLeft = pipEased * (1820 - 1200 / 2 + 384 / 2 - 60) + (960 - 1200 / 2);
  const terminalTop = pipEased * (1020 - 600 / 2 + 216 / 2 - 60) + (540 - 600 / 2);

  const highlightT = Math.min(1, Math.max(0, (frame - F_HIGHLIGHT) / HIGHLIGHT_DUR));
  const highlightActive = frame >= F_HIGHLIGHT;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bg_primary,
        overflow: "hidden",
      }}
    >
      {/* PHASE 1: Intro B-roll — coder typing — synced to "This is it" */}
      <Video
        src={staticFile("broll/coder-typing.mp4")}
        muted
        loop
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) saturate(1.1) hue-rotate(-10deg)",
          opacity: introOpacity,
        }}
      />
      {frame < F_INTRO_END && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 22,
              color: "#4ECDC4",
              letterSpacing: 6,
              fontWeight: 700,
              marginBottom: 16,
              opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            A SINGLE LINE OF PYTHON CODE
          </div>
          <div
            style={{
              width: 80,
              height: 4,
              backgroundColor: "#00FF41",
              boxShadow: "0 0 12px rgba(0,255,65,0.8)",
            }}
          />
        </div>
      )}

      {/* B-roll background — appears after PiP */}
      <Sequence from={F_PIP_START} durationInFrames={durationInFrames - F_PIP_START}>
        <Video
          src={staticFile("broll/dev-night.mp4")}
          muted
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
          }}
        />
        <Video
          src={staticFile("broll/binary-matrix.mp4")}
          muted
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "screen",
            opacity: 0.35,
          }}
        />
      </Sequence>

      {/* Terminal window */}
      <div
        style={{
          position: "absolute",
          left: terminalLeft,
          top: terminalTop,
          width: terminalWidth,
          height: terminalHeight,
          backgroundColor: "#0D1117",
          border: "1px solid #30363D",
          borderRadius: 8,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(139,233,253,0.08)",
          overflow: "hidden",
          opacity: terminalOpacity,
        }}
      >
        <div
          style={{
            height: 36,
            backgroundColor: "#161B22",
            borderBottom: "1px solid #30363D",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27C93F" }} />
          <div style={{ marginLeft: 16, fontFamily, fontSize: 13, color: "#8B949E" }}>
            displacement.py
          </div>
        </div>

        <div
          style={{
            padding: "24px 28px",
            fontFamily,
            fontSize: 22,
            lineHeight: 1.5,
            color: "#F8F8F2",
            whiteSpace: "pre",
          }}
        >
          {LINES.map((line, lineIdx) => {
            const lineStartChar =
              LINES.slice(0, lineIdx).reduce(
                (s, l) => s + l.reduce((ss, t) => ss + t.text.length, 0) + 1,
                0,
              );
            const isActiveLine =
              charsTyped >= lineStartChar &&
              charsTyped < lineStartChar +
                line.reduce((s, t) => s + t.text.length, 0) + 1;
            const isHighlightedLine = lineIdx === 0 && highlightActive;
            const charsIntoLine = Math.max(
              0,
              Math.min(
                line.reduce((s, t) => s + t.text.length, 0),
                charsTyped - lineStartChar,
              ),
            );

            return (
              <div
                key={lineIdx}
                style={{
                  position: "relative",
                  padding: "2px 8px",
                  marginLeft: -8,
                  borderRadius: 4,
                  backgroundColor: isHighlightedLine
                    ? `rgba(255,121,198,${highlightT * 0.15})`
                    : isActiveLine
                      ? "rgba(139,233,253,0.06)"
                      : "transparent",
                  boxShadow: isActiveLine ? "0 0 20px rgba(139,233,253,0.18)" : "none",
                  border: isHighlightedLine
                    ? `1px dashed rgba(255,121,198,${highlightT})`
                    : "1px solid transparent",
                }}
              >
                {line.reduce<React.ReactNode[]>((acc, token, tokIdx) => {
                  if (charsIntoLine <= 0) return acc;
                  const visibleChars = Math.min(token.text.length, charsIntoLine);
                  if (visibleChars <= 0) return acc;
                  acc.push(
                    <span
                      key={`${lineIdx}-${tokIdx}`}
                      style={{ color: COLORS_TOKENS[token.type] }}
                    >
                      {token.text.slice(0, visibleChars)}
                    </span>,
                  );
                  return acc;
                }, [])}
              </div>
            );
          })}
          {!typingDone && charsTyped > 0 && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 22,
                backgroundColor: "#8BE9FD",
                marginLeft: 4,
                verticalAlign: "middle",
                boxShadow: "0 0 8px rgba(139,233,253,0.6)",
                opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0,
              }}
            />
          )}
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
          opacity: Math.min(1, frame / 30),
        }}
      >
        <div
          style={{
            width: 6,
            height: 48,
            backgroundColor: "#FF79C6",
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
          Stack Overflow Developer Survey 2023
        </div>
      </div>

      {/* Music + SFX — synced to transcript timings */}
      <Sequence from={0}>
        <Audio src={staticFile("music/synth-wave.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={F_TYPING_START} durationInFrames={FULL_TEXT_LENGTH * FRAMES_PER_CHAR + 30}>
        <Audio src={staticFile("sfx/keystroke.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={F_HIGHLIGHT} durationInFrames={HIGHLIGHT_DUR + 30}>
        <Audio src={staticFile("sfx/digital-compile.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={F_70PCT > 0 ? F_70PCT : 800} durationInFrames={120}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>


      <Watermark />

      <PostFX />
    </div>
  );
};