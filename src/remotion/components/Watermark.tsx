import { Img, staticFile } from "remotion";

type Props = {
  size?: number;
  opacity?: number;
  bottomMargin?: number;
  rightMargin?: number;
};

/**
 * BeyAI Tomorrow watermark — small logo in bottom-right corner.
 * Source: public/broll/Logo con fondo transparente.png (4096x4096 RGBA)
 */
export const Watermark: React.FC<Props> = ({
  size = 72,
  opacity = 0.7,
  bottomMargin = 36,
  rightMargin = 36,
}) => {
  return (
    <Img
      src={staticFile("broll/Logo con fondo transparente.png")}
      style={{
        position: "absolute",
        bottom: bottomMargin,
        right: rightMargin,
        width: size,
        height: size,
        objectFit: "contain",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};