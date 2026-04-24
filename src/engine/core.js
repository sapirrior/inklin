import { ANSI_CODES } from '../constants/ansi.js';
import { hexToRgb, validateRgb } from '../utils/color.js';
import { env } from './environment.js';

export function createStyler(openCodes = [], closeCodes = []) {
  // Use a unique set of opening codes for this styler instance
  const openAnsi = openCodes.length > 0 ? `\x1b[${openCodes.join(';')}m` : '';

  const styler = (strings, ...values) => {
    let str = strings;
    if (Array.isArray(strings)) {
      str = strings.reduce((acc, part, i) => acc + part + (values[i] === undefined ? '' : values[i]), '');
    }

    if (!env.enabled) return str;
    if (str === undefined || str === null) return '';
    let result = (typeof str === 'string') ? str : String(str);
    if (result === '' || openCodes.length === 0) return result;
    
    // Efficiently handle nested styles:
    // If the inner string contains a reset code that matches one of our closing codes,
    // we need to re-open our specific styles immediately after.
    const uniqueCloses = [...new Set(closeCodes)];
    for (const close of uniqueCloses) {
      const closeAnsi = `\x1b[${close}m`;
      if (result.indexOf(closeAnsi) !== -1) {
        result = result.split(closeAnsi).join(closeAnsi + openAnsi);
      }
    }

    const closeAnsi = closeCodes.map(c => `\x1b[${c}m`).reverse().join('');
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
