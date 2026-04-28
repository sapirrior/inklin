"use strict";

const hexCache = new Map();

export function hexToRgb(hex) {
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

export function rgbToAnsi256(r, g, b) {
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

export function rgbToAnsi16(r, g, b) {
  // Improved 4-bit mapping
  const i = (r + g + b) / 3 > 128 ? 8 : 0;
  const red = r > 128 ? 1 : 0;
  const green = g > 128 ? 2 : 0;
  const blue = b > 128 ? 4 : 0;
  return i + red + green + blue;
}

export function validateRgb(val) {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}
