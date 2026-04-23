export function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(s => s + s).join('');
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF];
}
