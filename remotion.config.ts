// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";

Config.setVideoImageFormat("jpeg");

Config.overrideWebpackConfig(webpackOverride);

Config.setCodec("h264");

Config.setCrf(18);

Config.setPixelFormat("yuv420p");

Config.setColorSpace("rec709");