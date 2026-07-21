import React from "react";

export const PostFX: React.FC<{
  grainOpacity?: number;
  vignetteRadius?: number;
  vignetteDarkness?: number;
}> = ({
  grainOpacity = 0.06,
  vignetteRadius = 0.55,
  vignetteDarkness = 0.45,
}) => {
  const vignetteStop = Math.round(vignetteRadius * 100);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent ${vignetteStop}%, rgba(0,0,0,${vignetteDarkness}) 100%)`,
        }}
      />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: grainOpacity, mixBlendMode: "overlay" }}>
        <filter id="grain13">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain13)" />
      </svg>
    </div>
  );
};