import { ANSI_CODES } from '../constants/ansi.js';
import { hexToRgb } from '../utils/color.js';
import { env } from './environment.js';

export function createStyler(openCodes = [], closeCodes = []) {
  const styler = (strings, ...values) => {
    let str = strings;
    if (Array.isArray(strings)) {
      str = strings.reduce((acc, part, i) => acc + part + (values[i] === undefined ? '' : values[i]), '');
    }

    if (!env.enabled) return str;
    if (str === undefined || str === null || str === '') return str;
    
    const open = openCodes.map(c => `\x1b[${c}m`).join('');
    const close = closeCodes.map(c => `\x1b[${c}m`).reverse().join('');
    
    let result = String(str);
    if (openCodes.length > 0) {
      for (const closeCode of closeCodes) {
        const closeAnsi = `\x1b[${closeCode}m`;
        if (result.includes(closeAnsi)) {
          result = result.split(closeAnsi).join(closeAnsi + open);
        }
      }
      return open + result + close;
    }
    
    return result;
  };

  return new Proxy(styler, {
    get(target, prop) {
      if (prop === 'disable') return () => { env.enabled = false; return target; };
      if (prop === 'enable') return () => { env.enabled = true; return target; };
      
      if (ANSI_CODES[prop]) {
        const [o, c] = ANSI_CODES[prop];
        return createStyler([...openCodes, o], [...closeCodes, c]);
      }

      if (prop === 'hex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return createStyler(
            [...openCodes, `38;2;${r};${g};${b}`],
            [...closeCodes, 39]
          );
        };
      }

      if (prop === 'rgb') {
        return (r, g, b) => createStyler(
          [...openCodes, `38;2;${r};${g};${b}`],
          [...closeCodes, 39]
        );
      }

      if (prop === 'bgHex') {
        return (color) => {
          const [r, g, b] = hexToRgb(color);
          return createStyler(
            [...openCodes, `48;2;${r};${g};${b}`],
            [...closeCodes, 49]
          );
        };
      }

      if (prop === 'bgRgb') {
        return (r, g, b) => createStyler(
          [...openCodes, `48;2;${r};${g};${b}`],
          [...closeCodes, 49]
        );
      }

      if (prop === 'link') {
        return (text, url) => {
          if (!env.enabled) return text;
          return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
        };
      }
      
      return target[prop];
    }
  });
}
