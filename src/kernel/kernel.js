"use strict";

import { ANSI_CODES } from '../registry/ansi.js';
import { hexToRgb, validateRgb, rgbToAnsi256, rgbToAnsi16 } from '../processors/color.js';
import { env } from './platform.js';

// Global Registry for Compiled Regexes to prevent memory leaks in long-term use
const REGEX_CACHE = new Map();

const stylerProto = Object.create(Function.prototype);

function getCachedRegex(closeCodes) {
  if (!closeCodes || closeCodes.length === 0) return null;
  const key = closeCodes.join(';');
  if (REGEX_CACHE.has(key)) return REGEX_CACHE.get(key);

  const unique = [...new Set(closeCodes), 0];
  const pattern = unique.map(c => `\\x1b\\[${c}m`).join('|');
  const regex = new RegExp(pattern, 'g');
  
  if (REGEX_CACHE.size < 1000) { // Safety cap
    REGEX_CACHE.set(key, regex);
  }
  return regex;
}

function spawnNext(parent, oCode, cCode) {
  const nextOpenCodes = parent._oCodes ? [...parent._oCodes, oCode] : [oCode];
  const nextCloseCodes = parent._cCodes ? [cCode, ...parent._cCodes] : [cCode];
  
  const openAnsi = parent._open + `\x1b[${oCode}m`;
  const closeAnsi = `\x1b[${cCode}m` + parent._close;
  const regex = getCachedRegex(nextCloseCodes);

  return createStyler(openAnsi, closeAnsi, regex, nextOpenCodes, nextCloseCodes);
}

// JIT Property Overwriting for Monomorphic Fast-Paths
Object.keys(ANSI_CODES).forEach(prop => {
  Object.defineProperty(stylerProto, prop, {
    configurable: true,
    get() {
      const [o, c] = ANSI_CODES[prop];
      const next = spawnNext(this, o, c);
      Object.defineProperty(this, prop, { value: next, enumerable: true });
      return next;
    }
  });
});

const dynamicProps = {
  hex: (t) => (color) => {
    const [r, g, b] = hexToRgb(color);
    return t._applyColor(r, g, b, false);
  },
  rgb: (t) => (r, g, b) => t._applyColor(r, g, b, false),
  bgHex: (t) => (color) => {
    const [r, g, b] = hexToRgb(color);
    return t._applyColor(r, g, b, true);
  },
  bgRgb: (t) => (r, g, b) => t._applyColor(r, g, b, true),
  link: (t) => (text, url) => {
    const safeText = (text == null) ? '' : text;
    if (!env.enabled) return String(safeText);
    const safeUrl = String(url).replace(/[^\x20-\x7E]/g, '');
    return t(`\x1b]8;;${safeUrl}\x1b\\${safeText}\x1b]8;;\x1b\\`);
  },
  enable: (t) => () => { env.enabled = true; return t; },
  disable: (t) => () => { env.enabled = false; return t; }
};

Object.keys(dynamicProps).forEach(prop => {
  Object.defineProperty(stylerProto, prop, {
    configurable: true,
    get() {
      const func = dynamicProps[prop](this);
      Object.defineProperty(this, prop, { value: func, enumerable: true });
      return func;
    }
  });
});

Object.defineProperty(stylerProto, 'env', { get() { return env; } });
stylerProto.toString = function() { return this._open; };
stylerProto.valueOf = function() { return this._open; };

export function createStyler(openAnsi = '', closeAnsi = '', regex = null, oCodes = [], cCodes = []) {
  const styler = (strings, ...values) => {
    let str = strings;
    if (Array.isArray(strings)) {
      str = strings.reduce((acc, part, i) => acc + part + (values[i] ?? ''), '');
    }

    if (!env.enabled) return str == null ? '' : String(str);
    if (str == null) return '';
    
    let result = String(str);
    if (result === '' || openAnsi === '') return result;
    
    if (regex && result.indexOf('\x1b') !== -1) {
      let resetCount = 0;
      result = result.replace(regex, (match) => {
        if (match === '\x1b[0m') {
          resetCount++;
          return (resetCount % 2 === 0) ? match + openAnsi : match;
        }
        return match + openAnsi;
      });
    }

    return openAnsi + result + closeAnsi;
  };

  styler._applyColor = (r, g, b, isBg) => {
    const rr = validateRgb(r), gg = validateRgb(g), bb = validateRgb(b);
    let code;
    if (env.level >= 3) {
      code = `${isBg ? 48 : 38};2;${rr};${gg};${bb}`;
    } else if (env.level === 2) {
      code = `${isBg ? 48 : 38};5;${rgbToAnsi256(rr, gg, bb)}`;
    } else if (env.level === 1) {
      const idx = rgbToAnsi16(rr, gg, bb);
      code = (isBg ? (idx < 8 ? 40 + idx : 100 + (idx - 8)) : (idx < 8 ? 30 + idx : 90 + (idx - 8)));
    } else {
      return createStyler(openAnsi, closeAnsi, regex, oCodes, cCodes);
    }
    return spawnNext(styler, code, isBg ? 49 : 39);
  };

  styler._open = openAnsi;
  styler._close = closeAnsi;
  styler._oCodes = oCodes;
  styler._cCodes = cCodes;
  styler.version = '__VERSION__';
  
  Object.setPrototypeOf(styler, stylerProto);
  return styler;
}
