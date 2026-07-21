import React from "react";
import { AbsoluteFill } from "remotion";

export const PostFX: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Color grading layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0a4a55",
          mixBlendMode: "soft-light",
          opacity: 0.18,
        }}
      />
      {/* Contrast boost */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          mixBlendMode: "overlay",
          opacity: 0.12,
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* Film grain via SVG feTurbulence */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};