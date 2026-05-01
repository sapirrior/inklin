/**
 * Inklin CJS Bundle | v3.0.1
 * (c) Sapirrior | MIT License
 */
"use strict";

const { createStyler } = (function() {
  const ANSI_CODES = {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
  
    // Bright colors
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
  
    // Bright backgrounds
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  };
  
  const hexCache = new Map();
  
  function hexToRgb(hex) {
    if (typeof hex !== 'string') return [255, 255, 255];
    
    const h = hex.startsWith('#') ? hex.slice(1).toLowerCase() : hex.toLowerCase();
    if (hexCache.has(h)) return hexCache.get(h);
  
    // Validation: Strictly check for valid 3 or 6 digit hex
    if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return [255, 255, 255];
  
    let expanded = h;
    if (h.length === 3) {
      expanded = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
  
    const n = parseInt(expanded, 16);
    const rgb = [(n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF];
    
    if (hexCache.size < 256) { // Expanded cache for production workloads
      hexCache.set(h, rgb);
    }
    
    return rgb;
  }
  
  function rgbToAnsi256(r, g, b) {
    // Grayscale ramp optimization
    if (r === g && g === b) {
      if (r < 8) return 16;
      if (r > 248) return 251; // Fix: 255 is near white, but 231 is pure white in 6x6x6
      return Math.round(((r - 8) / 247) * 23) + 232;
    }
  
    return 16 
      + (36 * Math.round(r / 255 * 5))
      + (6 * Math.round(g / 255 * 5))
      + Math.round(b / 255 * 5);
  }
  
  function rgbToAnsi16(r, g, b) {
    // Improved 4-bit mapping
    const i = (r + g + b) / 3 > 128 ? 8 : 0;
    const red = r > 128 ? 1 : 0;
    const green = g > 128 ? 2 : 0;
    const blue = b > 128 ? 4 : 0;
    return i + red + green + blue;
  }
  
  function validateRgb(val) {
    const n = Number(val);
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(255, Math.round(n)));
  }
  
  const isTerminal = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;
  
  const getColorLevel = () => {
    // Browser detection
    if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
      return 3; // Most browser consoles generally support Truecolor
    }
  
    if (typeof process === 'undefined' || !process.env) return 0;
    
    const { FORCE_COLOR, TERM, NO_COLOR, COLORTERM } = process.env;
    
    // NO_COLOR and FORCE_COLOR=0 override everything
    if (NO_COLOR != null || FORCE_COLOR === '0') return 0;
    
    // Explicit overrides
    if (FORCE_COLOR === '1') return 1;
    if (FORCE_COLOR === '2') return 2;
    if (FORCE_COLOR === '3') return 3;
    
    // Capability detection
    if (COLORTERM === 'truecolor' || COLORTERM === '24bit') return 3;
    
    if (TERM) {
      if (TERM.includes('256')) return 2;
      if (TERM.includes('color') || TERM.includes('ansi') || TERM.includes('linux')) return 1;
      if (TERM === 'dumb') return 0;
    }
    
    if (isTerminal || FORCE_COLOR != null) return 1;
    
    return 0;
  };
  
  const detectedLevel = getColorLevel();
  let currentLevel = detectedLevel;
  
  const env = {
    get level() { return currentLevel; },
    set level(val) { currentLevel = val; },
    get enabled() { return currentLevel > 0; },
    set enabled(val) { 
      currentLevel = val ? (currentLevel || detectedLevel || 1) : 0;
    }
  };
  
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
  
  // JIT Property Overwriting for Monomorphic Execution Paths
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
  
  function createStyler(openAnsi = '', closeAnsi = '', regex = null, oCodes = [], cCodes = []) {
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
    styler.version = '3.0.1';
    
    Object.setPrototypeOf(styler, stylerProto);
    return styler;
  }
  return { createStyler };
})();

const inklin = createStyler();
module.exports = inklin;
module.exports.default = inklin;