import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";

const entryPoint = path.join(process.cwd(), "src", "remotion", "index.ts");

console.log("Bundling...");
const bundleLocation = await bundle({
  entryPoint,
  webpackOverride,
});

console.log("Selecting composition...");
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "Main",
});

console.log("Rendering 4K master (3840x2160)...");
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: "h264",
  crf: 18,
  audioBitrate: "320k",
  videoBitrate: "18M",
  format: "mp4",
  colorSpace: "rec709",
  scale: 2,
  outputLocation: path.join(process.cwd(), "out", "master-4k.mp4"),
});

console.log("Done: out/master-4k.mp4");