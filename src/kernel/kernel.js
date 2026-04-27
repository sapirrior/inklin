import { ANSI_CODES } from '../registry/ansi.js';
import { hexToRgb, validateRgb, rgbToAnsi256, rgbToAnsi16 } from '../processors/color.js';
import { env } from './platform.js';

export function createStyler(openCodes = [], closeCodes = []) {
  const openAnsi = openCodes.length > 0 ? `\x1b[${openCodes.join(';')}m` : '';
  const closeAnsi = closeCodes.map(c => `\x1b[${c}m`).reverse().join('');
  const cache = {};
  
  // Pre-calculate and pre-compile restoration regex for efficiency
  const restorationPatterns = openAnsi 
    ? [...new Set([...closeCodes, 0])].map(c => `\x1b[${c}m`)
    : [];
  
  let restorationRegex = null;
  if (restorationPatterns.length > 0) {
    const combinedPattern = restorationPatterns
      .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    restorationRegex = new RegExp(combinedPattern, 'g');
  }

  const styler = (strings, ...values) => {
    let str = strings;
    if (Array.isArray(strings)) {
      str = strings.reduce((acc, part, i) => {
        const val = values[i];
        return acc + part + (val == null ? '' : val);
      }, '');
    }

    if (!env.enabled) return str;
    if (str === undefined || str === null) return '';
    
    let result = (typeof str === 'string') ? str : String(str);
    if (result === '' || openAnsi === '') return result;
    
    // Efficiently handle nested styles using pre-compiled regex:
    if (restorationRegex) {
      let resetCount = 0;
      result = result.replace(restorationRegex, (match) => {
        if (match === '\x1b[0m') {
          resetCount++;
          // If this is the FIRST reset in a sequence, it's an 'opener' of a reset zone.
          // If it's the SECOND, it's a 'closer' of a reset zone.
          // We only re-open our style after a 'closer'.
          return (resetCount % 2 === 0) ? match + openAnsi : match;
        }
        // For other closing codes (like \x1b[39m), they are always closers.
        return match + openAnsi;
      });
    }

    // Final cleanup: Remove redundant/consecutive identical ANSI sequences 
    // and empty styled blocks to keep the output minimal.
    result = result.replace(/(\x1b\[[0-9;]*m)\1+/g, '$1');
    
    return openAnsi + result + closeAnsi;
  };

  const proxy = new Proxy(styler, {
    get(target, prop) {
      if (prop === 'disable') return () => { env.enabled = false; return proxy; };
      if (prop === 'enable') return () => { env.enabled = true; return proxy; };
      
      if (ANSI_CODES[prop]) {
        if (!cache[prop]) {
          const [o, c] = ANSI_CODES[prop];
          cache[prop] = createStyler([...openCodes, o], [...closeCodes, c]);
        }
        return cache[prop];
      }

      const applyColor = (r, g, b, isBg) => {
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
          return createStyler(openCodes, closeCodes);
        }
        return createStyler([...openCodes, code], [...closeCodes, isBg ? 49 : 39]);
      };

      if (prop === 'hex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return applyColor(r, g, b, false);
        };
      }

      if (prop === 'rgb') {
        return (r, g, b) => applyColor(r, g, b, false);
      }

      if (prop === 'bgHex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return applyColor(r, g, b, true);
        };
      }

      if (prop === 'bgRgb') {
        return (r, g, b) => applyColor(r, g, b, true);
      }

      if (prop === 'link') {
        return (text, url) => {
          const safeText = (text === undefined || text === null) ? '' : text;
          if (!env.enabled) return String(safeText);
          // Basic URL sanitization to prevent escape sequence injection
          const safeUrl = String(url).replace(/[^\x20-\x7E]/g, '');
          const link = `\x1b]8;;${safeUrl}\x1b\\${safeText}\x1b]8;;\x1b\\`;
          return target(link);
        };
      }
      
      return target[prop];
    }
  });

  return proxy;
}
