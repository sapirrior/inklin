import inklin from '../../src/inklin.js';

console.log('--- Test 3: Complex Nesting & Integration ---');

// 1. Precise Style Restoration
// When we nest colors, the outer color should be restored perfectly.
console.log(
  inklin.bgBlue.white(
    ` BLUE BG ${inklin.bgRed.bold(' RED BG BOLD ')} BACK TO BLUE BG `
  )
);

// 2. Chaining after Enable/Disable
// This ensures the Proxy continues to work after a toggle.
console.log(
  inklin.disable().red('This is PLAIN (disabled)')
);
console.log(
  inklin.enable().green.bold('This is GREEN BOLD (re-enabled via chaining)')
);

// 3. Hyperlinks & Sanitization
console.log('Safe Link: ' + inklin.link('Inklin', 'https://inklin.js.org'));
console.log('Sanitized Link: ' + inklin.link('Broken', 'https://bad.com\x1b[31mExploit'));

// 4. Style Reusability (Composition)
const brand = inklin.cyan.bold;
const log = (msg) => console.log(brand`[INKLIN]`, msg);

log('System initialized.');
log(inklin.green('All tests passed.'));

console.log('--- Test 3 Finished ---');
