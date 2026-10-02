// Babel config: Expo preset + babel-plugin-backend-assets.js (per-exercise assets are NOT bundled —
// _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26", mobile-apps-preferences skill).
// babel-preset-expo is resolved through expo (it is not hoisted to the app's node_modules).
module.exports = function babelConfig(api) {
  api.cache(true);
  const presetPath = require.resolve('babel-preset-expo', { paths: [require.resolve('expo/package.json')] });
  return {
    presets: [presetPath],
    plugins: ['./babel-plugin-backend-assets.js'],
  };
};
