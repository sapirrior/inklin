const hexCache = new Map();

export function hexToRgb(hex) {
  if (typeof hex !== 'string') return [255, 255, 255];
  
  const cleanHex = hex.replace('#', '').toLowerCase();
  if (hexCache.has(cleanHex)) return hexCache.get(cleanHex);

  let h = cleanHex;
  // Validation: Strictly check for valid 3 or 6 digit hex
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return [255, 255, 255];

  if (h.length === 3) {
    h = h.split('').map(s => s + s).join('');
  }

  const n = parseInt(h, 16);
  const rgb = [(n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF];
  
  // Cache the result
  if (hexCache.size < 100) { // Limit cache size to prevent memory leaks
    hexCache.set(cleanHex, rgb);
  }
  
  return rgb;
}

export function rgbToAnsi256(r, g, b) {
  // Grayscale ramp
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 255;
    return Math.round(((r - 8) / 247) * 23) + 232;
  }

  return 16 
    + (36 * Math.round(r / 255 * 5))
    + (6 * Math.round(g / 255 * 5))
    + Math.round(b / 255 * 5);
}

export function rgbToAnsi16(r, g, b) {
  const i = r + g + b > 383 ? 8 : 0; // Brightness threshold
  const red = r > 127 ? 1 : 0;
  const green = g > 127 ? 2 : 0;
  const blue = b > 127 ? 4 : 0;
  return i + red + green + blue;
}

export function validateRgb(val) {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}
