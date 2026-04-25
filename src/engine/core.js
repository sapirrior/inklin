import { ANSI_CODES } from '../constants/ansi.js';
import { hexToRgb, validateRgb } from '../utils/color.js';
import { env } from './environment.js';

export function createStyler(openCodes = [], closeCodes = []) {
  const openAnsi = openCodes.length > 0 ? `\x1b[${openCodes.join(';')}m` : '';
  const closeAnsi = closeCodes.map(c => `\x1b[${c}m`).reverse().join('');
  
  // Pre-calculate restoration patterns for efficiency
  const restorationPatterns = openAnsi 
    ? [...new Set([...closeCodes, 0])].map(c => `\x1b[${c}m`)
    : [];

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
    
    // Efficiently handle nested styles:
    if (restorationPatterns.length > 0) {
      // Create a combined regex for all patterns
      const combinedPattern = restorationPatterns
        .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
      const regex = new RegExp(combinedPattern, 'g');

      let resetCount = 0;
      result = result.replace(regex, (match) => {
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
        const [o, c] = ANSI_CODES[prop];
        return createStyler([...openCodes, o], [...closeCodes, c]);
      }

      if (prop === 'hex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return createStyler([...openCodes, `38;2;${r};${g};${b}`], [...closeCodes, 39]);
        };
      }

      if (prop === 'rgb') {
        return (r, g, b) => {
          const rr = validateRgb(r), gg = validateRgb(g), bb = validateRgb(b);
          return createStyler([...openCodes, `38;2;${rr};${gg};${bb}`], [...closeCodes, 39]);
        };
      }

      if (prop === 'bgHex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return createStyler([...openCodes, `48;2;${r};${g};${b}`], [...closeCodes, 49]);
        };
      }

      if (prop === 'bgRgb') {
        return (r, g, b) => {
          const rr = validateRgb(r), gg = validateRgb(g), bb = validateRgb(b);
          return createStyler([...openCodes, `48;2;${rr};${gg};${bb}`], [...closeCodes, 49]);
        };
      }

      if (prop === 'link') {
        return (text, url) => {
          if (!env.enabled) return text;
          const safeText = (text === undefined || text === null) ? '' : text;
          // Basic URL sanitization to prevent escape sequence injection
          const safeUrl = String(url).replace(/[^\x20-\x7E]/g, '');
          return `\x1b]8;;${safeUrl}\x1b\\${safeText}\x1b]8;;\x1b\\`;
        };
      }
      
      return target[prop];
    }
  });

  return proxy;
}
