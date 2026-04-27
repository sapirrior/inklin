const isTerminal = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;

const getColorLevel = () => {
  if (typeof process === 'undefined' || !process.env) {
    return (typeof navigator !== 'undefined' && navigator.userAgent) ? 1 : 0;
  }
  
  const { FORCE_COLOR, TERM, NO_COLOR, COLORTERM } = process.env;
  
  if (NO_COLOR || FORCE_COLOR === '0') return 0;
  if (COLORTERM === 'truecolor' || COLORTERM === '24bit') return 3;
  if (TERM && (TERM.includes('256') || TERM.includes('color'))) return 2;
  if (FORCE_COLOR || isTerminal || (TERM && TERM !== 'dumb')) return 1;
  
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
