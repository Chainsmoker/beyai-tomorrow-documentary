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
  weights: ["400", "500", "700", "900"],
});

const PANEL_HEIGHT = 360;
const FADE_START_FRAME = 900;
const FADE_DURATION_FRAMES = 60;
const REPLACED_START = FADE_START_FRAME + FADE_DURATION_FRAMES;
const REPLACED_FADE_FRAMES = 9;

export const Scene09Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const fadeProgress = interpolate(frame, [FADE_START_FRAME, FADE_START_FRAME + FADE_DURATION_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easedFade = Math.pow(fadeProgress, 2);
  const centerOpacity = 1 - easedFade;
  const vignetteRadius = interpolate(fadeProgress, [0, 1], [0.5, 0.9]);
  const vignetteDarkness = interpolate(fadeProgress, [0, 1], [0.3, 0.8]);

  const replacedOpacity = interpolate(frame, [REPLACED_START, REPLACED_START + REPLACED_FADE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replacedScale = interpolate(frame, [REPLACED_START, REPLACED_START + 24], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replacedPulse = ((frame - REPLACED_START) % 30) < 15 ? 1 : 0.9;
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entranceT = Math.min(1, frame / 24);
  const easedEntrance = 1 - Math.pow(1 - entranceT, 3);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily, overflow: "hidden" }}>
      {/* PANEL 1: CEO (TOP) */}
      <div style={{ position: "absolute", top: -360 * (1 - easedEntrance), left: 0, right: 0, height: PANEL_HEIGHT, overflow: "hidden" }}>
        <Video
          src={staticFile("broll/ceo-conference.mp4")}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.25) saturate(1.25) hue-rotate(-12deg) brightness(1.05) contrast(1.05)" }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(212, 175, 55, 0.12)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 30, left: 40, padding: "8px 18px", backgroundColor: "rgba(0,0,0,0.7)", border: "1px solid #D4AF37", color: "#D4AF37", fontSize: 13, fontWeight: 700, letterSpacing: 3, borderRadius: 2, zIndex: 4 }}>
          HIGH-END · CAPITAL & AI OWNERS
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 40, color: "#FFD700", fontSize: 18, fontWeight: 700, letterSpacing: 1.5, opacity: 0.85, zIndex: 4 }}>
          MASSIVE WEALTH GAINS
        </div>
      </div>

      {/* DIVIDER 1 */}
      <div style={{ position: "absolute", top: PANEL_HEIGHT, left: 0, right: 0, height: 1, backgroundColor: "#FFFFFF", opacity: 0.3, zIndex: 5 }} />

      {/* PANEL 2: DESIGNER (CENTER) — fades to black */}
      <div style={{ position: "absolute", top: PANEL_HEIGHT, left: 0, right: 0, height: PANEL_HEIGHT, overflow: "hidden", opacity: centerOpacity }}>
        <Video
          src={staticFile("broll/designer-computer.mp4")}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) saturate(0.7) contrast(1.05)" }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(100, 130, 200, 0.12)" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, transparent ${Math.round(vignetteRadius * 100)}%, rgba(0,0,0,${vignetteDarkness}) 100%)` }} />
        <div style={{ position: "absolute", top: 30, left: 40, padding: "8px 18px", backgroundColor: "rgba(0,0,0,0.7)", border: "1px solid #AAAAAA", color: "#AAAAAA", fontSize: 13, fontWeight: 700, letterSpacing: 3, borderRadius: 2, zIndex: 4 }}>
          WHITE-COLLAR · COGNITIVE WORKERS
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 40, color: "#DDDDDD", fontSize: 18, fontWeight: 700, letterSpacing: 1.5, opacity: Math.max(0, centerOpacity - 0.2), zIndex: 4 }}>
          THE HOLLOWING OUT
        </div>
      </div>

      {/* DIVIDER 2 */}
      <div style={{ position: "absolute", top: PANEL_HEIGHT * 2, left: 0, right: 0, height: 1, backgroundColor: "#FFFFFF", opacity: 0.3, zIndex: 5 }} />

      {/* PANEL 3: PLUMBER (BOTTOM) */}
      <div style={{ position: "absolute", bottom: -360 * (1 - easedEntrance), left: 0, right: 0, height: PANEL_HEIGHT, overflow: "hidden" }}>
        <Video
          src={staticFile("broll/plumber-faucet.mp4")}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.95) saturate(1.05) contrast(1.05)" }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(78, 205, 196, 0.06)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "absolute", top: 30, left: 40, padding: "8px 18px", backgroundColor: "rgba(0,0,0,0.7)", border: "1px solid #4ECDC4", color: "#4ECDC4", fontSize: 13, fontWeight: 700, letterSpacing: 3, borderRadius: 2, zIndex: 4 }}>
          ESSENTIAL MANUAL LABOR
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 40, color: "#4ECDC4", fontSize: 18, fontWeight: 700, letterSpacing: 1.5, opacity: 0.85, zIndex: 4 }}>
          SAFE FOR NOW
        </div>
      </div>

      {/* Header badge */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", opacity: headerOpacity, pointerEvents: "none" }}>
        <div style={{ display: "inline-block", padding: "8px 24px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(0,0,0,0.55)", fontSize: 13, fontWeight: 500, color: "#DDDDDD", letterSpacing: 4, fontFamily }}>
          THE HOLLOWING OUT EFFECT
        </div>
      </div>

      {/* REPLACED overlay */}
      {frame > REPLACED_START && (
        <div style={{ position: "absolute", top: PANEL_HEIGHT, left: 0, right: 0, height: PANEL_HEIGHT, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 70%)", opacity: replacedOpacity, transform: `scale(${replacedScale})`, zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#FF3366", letterSpacing: 12, fontFamily, textShadow: `0 0 30px rgba(255,51,102,${0.5 * replacedPulse}), 0 0 60px rgba(255,51,102,0.4)`, transform: `scale(${replacedPulse})`, display: "inline-block" }}>
              REPLACED
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#AAAAAA", letterSpacing: 4, marginTop: 16, fontFamily }}>
              BY A LINE OF CODE
            </div>
          </div>
        </div>
      )}

      {/* Audio */}
      <Sequence from={0} durationInFrames={45}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={REPLACED_START} durationInFrames={45}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={0}>
        <Audio src={staticFile("music/piano-synth.mp3")} volume={(f) => {
          if (f < 30) return (f / 30) * 0.05;
          if (f < REPLACED_START) return 0.05 + (f / REPLACED_START) * 0.06;
          if (f > REPLACED_START && f < REPLACED_START + 60) return 0.14;
          return 0.09;
        }} />
      </Sequence>
      <Sequence from={REPLACED_START} durationInFrames={60}>
        <Audio src={staticFile("sfx/sub-bass.mp3")} volume={0.85} />
      </Sequence>


      <Watermark />

      <PostFX grainOpacity={0.1} vignetteRadius={0.55} vignetteDarkness={0.5} />
    </AbsoluteFill>
  );
};