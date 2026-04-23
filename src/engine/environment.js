const isTerminal = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;

export const env = {
  enabled: isTerminal || 
    (typeof process !== 'undefined' && (process.env.FORCE_COLOR || (process.env.TERM && process.env.TERM.includes('256')))) || 
    (typeof navigator !== 'undefined' && navigator.userAgent)
};
