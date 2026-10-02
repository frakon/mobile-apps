// Metro config — _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences skill):
// - per-exercise pictures/sounds (assets/audio, assets/images) are served by the ResourceBackend, so Metro must
//   neither bundle nor watch them (their requires are rewritten by babel-plugin-backend-assets.js; blocking the
//   folders makes any missed require fail the build loudly instead of silently re-bundling 800+ MB);
// - non-runtime files (.txt provenance, .md notes, .part partial downloads) never reach the bundler.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const existingBlockList = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existingBlockList) ? existingBlockList : existingBlockList ? [existingBlockList] : []),
  /[\\/]assets[\\/](audio|images)[\\/].*/,
  /.*\.(txt|md|part)$/,
];

module.exports = config;
