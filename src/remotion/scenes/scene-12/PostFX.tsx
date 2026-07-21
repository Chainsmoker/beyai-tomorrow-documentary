import React from "react";

export const PostFX: React.FC<{
  grainOpacity?: number;
  vignetteRadius?: number;
  vignetteDarkness?: number;
  scanlines?: boolean;
  hueRotate?: number;
}> = ({
  grainOpacity = 0.06,
  vignetteRadius = 0.5,
  vignetteDarkness = 0.4,
  scanlines = false,
  hueRotate = 0,
}) => {
  const vignetteStop = Math.round(vignetteRadius * 100);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent ${vignetteStop}%, rgba(0,0,0,${vignetteDarkness}) 100%)`,
          filter: hueRotate ? `hue-rotate(${hueRotate}deg)` : undefined,
        }}
      />
      {scanlines && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(0deg, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "100% 4px",
            opacity: 0.2,
          }}
        />
      )}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: grainOpacity, mixBlendMode: "overlay" }}>
        <filter id="grain12">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain12)" />
      </svg>
    </div>
  );
};