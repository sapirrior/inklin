import fs from 'fs';
import path from 'path';
import { transformPart } from './build.js';

const CDN_DIR = './cdn';
if (!fs.existsSync(CDN_DIR)) fs.mkdirSync(CDN_DIR);

function buildCDN() {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const version = pkg.version;
  console.log(`Building Inklin (CDN: Optimized Minification) v${version}...`);

  const parts = [
    transformPart('registry/ansi.js', version),
    transformPart('processors/color.js', version),
    transformPart('kernel/platform.js', version),
    transformPart('kernel/kernel.js', version)
  ].join('\n');

  // Multi-pass minification
  const minified = parts
    .replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
    .replace(/\/\/.*$/gm, '')        // Line comments
    .replace(/\s+/g, ' ')           // Collapse whitespace
    .replace(/\s*([{};,:])\s*/g, '$1') // Remove spaces around delimiters
    .trim();

  const bundle = `/*! Inklin v${pkg.version} | MIT | github.com/sapirrior/inklin */
(function(g,f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define(f)}else{g.inklin=f()}})(this,function(){"use strict";${minified}
return createStyler();});`;

  fs.writeFileSync(path.join(CDN_DIR, 'inklin.min.js'), bundle);
  console.log('Build complete: cdn/inklin.min.js');
}

buildCDN();
