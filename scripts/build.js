import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const DIST_DIR = './dist';

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

/**
 * Transforms ESM source parts into internal logic strings.
 */
export function transformPart(relPath, version) {
  const fullPath = path.join(SRC_DIR, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');

  return code
    .replace(/^"use strict";?\n?/g, '') // Remove redundant strict mode declaration
    .replace(/^import\s+.*?;?\n/gm, '') // Remove imports
    .replace(/\bexport\s+(const|let|function)\b/g, '$1') // Strip named exports
    .replace(/\bexport\s+default\s+.*?;?\n?/g, '') // Strip default exports
    .replace(/__VERSION__/g, version || '0.0.0') // Inject version
    .trim();
}

function updateDocs(version) {
  const files = ['./README.md', './.code/overview.md'];
  files.forEach(f => {
    if (fs.existsSync(f)) {
      let content = fs.readFileSync(f, 'utf8');
      content = content.replace(/(Inklin v|Current Major Version: \*\*)(\d+\.\d+\.\d+)/g, `$1${version}`);
      fs.writeFileSync(f, content);
    }
  });
}

function buildCJS() {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const version = pkg.version;
  console.log(`Building Inklin (CJS: Optimized) v${version}...`);
  updateDocs(version);

  const parts = [
    transformPart('registry/ansi.js', version),
    transformPart('processors/color.js', version),
    transformPart('kernel/platform.js', version),
    transformPart('kernel/kernel.js', version)
  ].join('\n\n');

  const bundle = `/**
 * Inklin CJS Bundle | v${pkg.version}
 * (c) Sapirrior | MIT License
 */
"use strict";

const { createStyler } = (function() {
${parts.split('\n').map(l => '  ' + l).join('\n')}
  return { createStyler };
})();

const inklin = createStyler();
module.exports = inklin;
module.exports.default = inklin;
`.trim();

  fs.writeFileSync(path.join(DIST_DIR, 'inklin.cjs'), bundle);
  console.log('Build complete: dist/inklin.cjs');
}

if (process.argv[1].endsWith('build.js')) {
  buildCJS();
}
