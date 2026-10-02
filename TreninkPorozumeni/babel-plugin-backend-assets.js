// Babel plugin: per-exercise assets are served by the ResourceBackend, never bundled.
// Requested in _TreninkPorozumeni_Fields123_PROMPTS.md — "User request 26" (mobile-apps-preferences skill:
// "data used only in a particular exercise shall not be bundled inside the app").
// The item definitions (src/items.ts, src/items/field5X.ts) keep their `require('../assets/audio|images/...')`
// lines unchanged (content managers edit them in parallel); this plugin rewrites every such require into a
// plain marker string 'backend-asset:<file name>' at bundle time, so Metro never registers the file as an
// asset. The game resolves pictures/sounds by example id + fixed entry name (src/itemResources.ts); the marker
// only tells "this optional audio exists" (null stays null).
'use strict';

const BACKEND_ASSET_PATTERN = /(^|\/)assets\/(audio|images)\/([^/]+)$/;

module.exports = function backendAssetsPlugin({ types }) {
  return {
    name: 'backend-assets',
    visitor: {
      CallExpression(path, state) {
        const filename = (state.filename || '').split('\\').join('/');
        if (filename.includes('/node_modules/')) {
          return;
        }
        const { callee, arguments: args } = path.node;
        if (!types.isIdentifier(callee, { name: 'require' }) || args.length !== 1 || !types.isStringLiteral(args[0])) {
          return;
        }
        const match = BACKEND_ASSET_PATTERN.exec(args[0].value);
        if (match) {
          path.replaceWith(types.stringLiteral(`backend-asset:${match[3]}`));
        }
      },
    },
  };
};
