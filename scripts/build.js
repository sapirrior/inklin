import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const DIST_DIR = './dist';

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

function build() {
  console.log('Building Inklin (CJS)...');

  const readPart = (relPath) => {
    return fs.readFileSync(path.join(SRC_DIR, relPath), 'utf8')
      .replace(/\bexport (const|let|function)\b/g, '$1')
      .replace(/^import .*;?\n?/gm, '');
  };

  const ansi = readPart('registry/ansi.js');
  const colorUtils = readPart('processors/color.js');
  const env = readPart('kernel/platform.js');
  const core = readPart('kernel/kernel.js');

  const entry = `
const { createStyler } = (function() {
  ${ansi}
  ${colorUtils}
  ${env}
  ${core}
  return { createStyler };
})();

const inklin = createStyler();
module.exports = inklin;
module.exports.default = inklin;
  `.trim();

  const bundle = `
/**
 * Inklin CJS Bundle
 * Generated automatically. Do not edit.
 */

${entry}
  `.trim();

  fs.writeFileSync(path.join(DIST_DIR, 'inklin.cjs'), bundle);
  console.log('Build complete: dist/inklin.cjs');
}

build();
