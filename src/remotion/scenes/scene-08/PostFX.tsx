import React from "react";

type Props = {
  grainOpacity?: number;
  vignetteRadius?: number;
  vignetteDarkness?: number;
};

export const PostFX: React.FC<Props> = ({
  grainOpacity = 0.08,
  vignetteRadius = 0.5,
  vignetteDarkness = 0.5,
}) => {
  const vignetteStop = Math.round(vignetteRadius * 100);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent ${vignetteStop}%, rgba(0,0,0,${vignetteDarkness}) 100%)`,
        }}
      />
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
        <filter id="grain8">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain8)" />
      </svg>
    </div>
  );
};
