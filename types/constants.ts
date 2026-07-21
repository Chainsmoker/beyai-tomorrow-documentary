import { z } from "zod";
export const COMP_NAME = "Main";

export const CompositionProps = z.object({});

export const defaultMainProps: z.infer<typeof CompositionProps> = {};

export const DURATION_IN_FRAMES = 25050;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

export const COLORS = {
  bg_primary: "#000000",
  bg_secondary: "#0A0E27",
  bg_tertiary: "#0D1117",
  text_primary: "#FFFFFF",
  text_secondary: "#AAAAAA",
  text_muted: "#666666",
  accent_cyan: "#4ECDC4",
  accent_green: "#00FF41",
  accent_red: "#FF3366",
  accent_gold: "#FFD700",
  accent_purple: "#A855F7",
  border: "#30363D",
};

export const FONTS = {
  heading: "Inter Black",
  subheading: "Inter Bold",
  body: "Inter Medium",
  caption: "Inter Regular",
  code: "JetBrains Mono",
  quote: "Playfair Display Italic",
};

export const SPRINGS = {
  aggressive: { stiffness: 250, damping: 12, mass: 1 },
  standard: { stiffness: 180, damping: 18, mass: 1 },
  smooth: { stiffness: 120, damping: 22, mass: 1 },
  bouncy: { stiffness: 200, damping: 10, mass: 1 },
};

export const POST_FX = {
  filmGrain: { opacity: 0.06, size: 1.5 },
  vignette: { radius: 0.65, darkness: 0.4 },
  colorGrading: {
    temperature: -10,
    tint: 5,
    contrast: 1.08,
    saturation: 0.95,
  },
  scanlines: { opacity: 0.02, spacing: 4 },
};