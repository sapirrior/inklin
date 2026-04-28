"use strict";

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

export const env = {
  get level() { return currentLevel; },
  set level(val) { currentLevel = val; },
  get enabled() { return currentLevel > 0; },
  set enabled(val) { 
    currentLevel = val ? (currentLevel || detectedLevel || 1) : 0;
  }
};
