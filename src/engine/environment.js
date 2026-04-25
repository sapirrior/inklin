const isTerminal = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;

const getEnabled = () => {
  if (typeof process === 'undefined') {
    return typeof navigator !== 'undefined' && navigator.userAgent;
  }
  
  const { FORCE_COLOR, TERM, NO_COLOR } = process.env;
  
  // Explicitly disabled
  if (NO_COLOR || FORCE_COLOR === '0') return false;
  
  // Explicitly enabled or TTY detection
  return !!(
    FORCE_COLOR || 
    isTerminal || 
    (TERM && TERM !== 'dumb' && TERM.includes('256'))
  );
};

export const env = {
  enabled: getEnabled()
};
