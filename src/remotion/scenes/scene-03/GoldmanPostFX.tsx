import React from "react";

type Props = {
  grainOpacity?: number;
  vignetteRadius?: number;
  vignetteDarkness?: number;
};

export const PostFX: React.FC<Props> = ({
  grainOpacity = 0.06,
  vignetteRadius = 0.5,
  vignetteDarkness = 0.4,
}) => {
  const vignetteStop = Math.round(vignetteRadius * 100);
  const vignetteAlpha = vignetteDarkness;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent ${vignetteStop}%, rgba(0,0,0,${vignetteAlpha}) 100%)`,
        }}
      />
      {/* Color grading teal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0a4a55",
          mixBlendMode: "soft-light",
          opacity: 0.14,
        }}
      />
      {/* Film grain */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: grainOpacity,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain3">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain3)" />
      </svg>
    </div>
  );
};