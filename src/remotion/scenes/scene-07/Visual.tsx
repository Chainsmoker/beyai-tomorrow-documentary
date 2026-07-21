import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
  interpolate,
} from "remotion";
import { COLORS } from "../../../../types/constants";
import { PostFX } from "./PostFX";
import { Watermark } from "../../components/Watermark";

const { fontFamily: interFont } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700"],
});

const { fontFamily: playfairFont } = loadPlayfair("italic", {
  subsets: ["latin"],
  weights: ["400", "600", "700"],
});

// Cortes rápidos: 200ms cada uno = 6 frames a 30fps (6 clips)
const FAST_CUT_FRAMES = 6;
const ARCHIVAL_CLIPS = [
  { type: "img", src: staticFile("broll/industrial_loom.jpg"), title: "INDUSTRIAL REVOLUTION" },
  { type: "img", src: staticFile("broll/vintage_atm.jpg"), title: "AUTOMATED TELLER" },
  { type: "img", src: staticFile("broll/vintage_bank_teller.jpg"), title: "BANK TELLER 1970" },
  { type: "video", src: staticFile("broll/classroom-desks.mp4"), title: "HUMAN CAPITAL" },
  { type: "video", src: staticFile("broll/scrolling-code.mp4"), title: "ALGORITHMIC SYSTEM" },
  { type: "img", src: staticFile("broll/acemoglu_portrait.jpg"), title: "DARON ACEMOGLU" },
];

const QUOTE_TEXT = "AI is the first technology to automate the cognitive capabilities of humans.";
const ATTRIBUTION_TEXT = "— Daron Acemoglu, MIT, Nobel Laureate 2024";

// Marcas de tiempo en frames
const QUOTE_START_FRAME = 450; // Al frame ~450
const QUOTE_DURATION_FRAMES = 300; // Permanecer visible 10s para cubrir la narración completa
const FADE_IN_FRAMES = 12; // 400ms = 12 frames a 30fps
const FADE_OUT_FRAMES = 15; // 500ms = 15 frames a 30fps

export const Scene07Visual: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Índice para cortes rápidos durante la introducción histórica (frames 0 a 400)
  const currentClipIndex = Math.floor(frame / FAST_CUT_FRAMES) % ARCHIVAL_CLIPS.length;
  const activeClip = ARCHIVAL_CLIPS[currentClipIndex];

  // Ken Burns zoom para el retrato estilizado B/N tras el frame 400
  const zoomScale = interpolate(frame, [400, durationInFrames], [1.0, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cálculo de opacidad del bloque de cita (Al frame ~450)
  const quoteRelFrame = frame - QUOTE_START_FRAME;
  const isQuoteActive = quoteRelFrame >= 0 && quoteRelFrame < QUOTE_DURATION_FRAMES + FADE_OUT_FRAMES;

  let quoteOpacity = 0;
  if (isQuoteActive) {
    if (quoteRelFrame < FADE_IN_FRAMES) {
      quoteOpacity = interpolate(quoteRelFrame, [0, FADE_IN_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (quoteRelFrame < QUOTE_DURATION_FRAMES) {
      quoteOpacity = 1;
    } else {
      quoteOpacity = interpolate(
        quoteRelFrame - QUOTE_DURATION_FRAMES,
        [0, FADE_OUT_FRAMES],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }

  // Typewriter effect (60ms/char = 1.8 frames por carácter)
  const charsToShow = Math.min(
    QUOTE_TEXT.length,
    Math.floor(Math.max(0, quoteRelFrame) / 1.8)
  );
  const displayedQuote = QUOTE_TEXT.slice(0, charsToShow);

  // Animación de atribución (delay 800ms = ~24 frames tras inicio de cita)
  const attrDelay = 24;
  const attrFrame = Math.max(0, quoteRelFrame - attrDelay);
  const attrOpacity = interpolate(attrFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const attrTranslateY = interpolate(attrFrame, [0, 15], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fase final de reflexión: "Not our muscles. Our minds."
  const finalPhaseStart = Math.max(540, durationInFrames - 90);
  const isFinalPhase = frame >= finalPhaseStart;
  const finalDimOpacity = interpolate(frame, [finalPhaseStart, finalPhaseStart + 30], [0, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg_primary,
        fontFamily: interFont,
        overflow: "hidden",
      }}
    >
      {/* Capa de Fondo: Cortes Rápidos (0-400) -> Retrato Acemoglu (400+) */}
      {frame < 400 ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {activeClip.type === "img" ? (
            <Img
              src={activeClip.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.6) contrast(1.2) brightness(0.85) grayscale(0.2)",
                transform: `scale(${1 + (frame % 36) * 0.003}) translateY(${(frame % 36) * 0.4}px)`,
                transformOrigin: "center center",
              }}
            />
          ) : (
            <Video
              src={activeClip.src}
              muted
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.6) contrast(1.2) brightness(0.85) grayscale(0.2)",
              }}
            />
          )}

          {/* Etiqueta de archivo */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              padding: "6px 16px",
              backgroundColor: "rgba(0,0,0,0.75)",
              border: "1px solid #D4AF37",
              color: "#D4AF37",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              borderRadius: 2,
            }}
          >
            ARCHIVAL RECORD · {activeClip.title}
          </div>
        </div>
      ) : (
        /* Retrato estilizado B/N de Acemoglu con zoom progresivo */
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Img
            src={staticFile("broll/acemoglu_portrait.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(0.3) contrast(1.25) brightness(0.75)",
              transform: `scale(${zoomScale})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      )}

      {/* Oscurecimiento suave de fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Bloque de Cita EN PANTALLA (Al frame ~450) */}
      {isQuoteActive && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            minHeight: 300,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            borderRadius: 4,
            border: "1px solid rgba(212, 175, 55, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.95)",
            padding: "40px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            opacity: quoteOpacity,
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: playfairFont,
              fontSize: 48,
              color: "#D4AF37",
              lineHeight: 1,
              marginBottom: 10,
              opacity: 0.8,
            }}
          >
            “
          </div>

          {/* Texto de Cita Typewriter */}
          <div
            style={{
              fontFamily: playfairFont,
              fontStyle: "italic",
              fontSize: 36,
              color: "#FFFFFF",
              lineHeight: 1.4,
              minHeight: 100,
              maxWidth: 900,
            }}
          >
            {displayedQuote}
            {charsToShow < QUOTE_TEXT.length && (
              <span style={{ color: "#D4AF37" }}>|</span>
            )}
          </div>

          {/* Línea Decorativa Horizontal (#D4AF37, height 2px, width 200px) */}
          <div
            style={{
              height: 2,
              width: 200,
              backgroundColor: "#D4AF37",
              marginTop: 24,
              marginBottom: 20,
              boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
            }}
          />

          {/* Atribución en Inter Medium 18px #AAAAAA */}
          <div
            style={{
              fontFamily: interFont,
              fontWeight: 500,
              fontSize: 18,
              color: "#AAAAAA",
              letterSpacing: 1,
              opacity: attrOpacity,
              transform: `translateY(${attrTranslateY}px)`,
            }}
          >
            {ATTRIBUTION_TEXT}
          </div>
        </div>
      )}

      {/* Texto de Cierre: "NOT OUR MUSCLES. OUR MINDS." */}
      {isFinalPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0, 0, 0, ${finalDimOpacity})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 8,
          }}
        >
          <div
            style={{
              fontFamily: interFont,
              fontWeight: 900,
              fontSize: 64,
              color: "#FFFFFF",
              letterSpacing: 4,
              textAlign: "center",
              textTransform: "uppercase",
              textShadow: "0 10px 30px rgba(0,0,0,0.8)",
            }}
          >
            NOT OUR MUSCLES.
            <div style={{ color: "#D4AF37", marginTop: 10 }}>OUR MINDS.</div>
          </div>
        </div>
      )}

      {/* Audio & Sonido */}
      {/* 1. Música: Cinematic long track (documentary feel) */}
      <Sequence from={0}>
        <Audio
          src={staticFile("music/cinematic-long.mp3")}
          volume={(f) => {
            // Fade in over first 2s
            if (f < 60) return (f / 60) * 0.06;
            // Duck during quote reveal
            if (f > QUOTE_START_FRAME - 30 && f < QUOTE_START_FRAME + 60) return 0.03;
            // Drop to silence before final phrase
            if (f > finalPhaseStart) return 0.005;
            return 0.06;
          }}
        />
      </Sequence>

      {/* Piano grave sutil / bajos */}
      <Sequence from={30}>
        <Audio src={staticFile("sfx/sub-bass.mp3")} volume={0.3} />
      </Sequence>

      {/* 2. SFX: Telar antiguo -> corte abrupto */}
      <Sequence from={0} durationInFrames={120}>
        <Audio src={staticFile("sfx/server-hum.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={10} durationInFrames={60}>
        <Audio src={staticFile("sfx/keystroke.mp3")} volume={0.5} />
      </Sequence>

      {/* 3. SFX: Beep ATM en mención del cajero automático */}
      <Sequence from={120} durationInFrames={30}>
        <Audio src={staticFile("sfx/digital-compile.mp3")} volume={0.6} />
      </Sequence>

      {/* 4. SFX: Paper flip en aparición de cita (Frame 450) */}
      <Sequence from={QUOTE_START_FRAME} durationInFrames={45}>
        <Audio src={staticFile("sfx/paper-crumple.mp3")} volume={0.7} />
      </Sequence>

      {/* Post-procesado: Grano de película (15%) y viñeta sepia */}

      <Watermark />
      <PostFX grainOpacity={0.15} vignetteRadius={0.4} vignetteDarkness={0.65} />
    </AbsoluteFill>
  );
};
