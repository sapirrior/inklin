import inklin from '../../src/inklin.js';

console.log('--- Test 4: Restoration & Industrial Safety ---');

// 1. Style Restoration (The "Philosophy" Test)
// Ensures outer styles survive both specific and global resets.
console.log(inklin.red(`Outer Red [${inklin.blue('Nested Blue')}] Back to Red`));
console.log(inklin.magenta(`Outer Mag [${inklin.reset('Nested Reset')}] Back to Mag`));

// 2. Deep Stack Restoration
// Multiple layers of nesting should collapse and restore correctly.
console.log(
  inklin.bgBlue.white(
    ` BG Blue ${inklin.bgRed(` BG Red ${inklin.reset(' Reset ')} BG Red `)} BG Blue `
  )
);

// 3. Tagged Template Safety
// Verifies that null/undefined values are handled gracefully in templates.
const empty = null;
const missing = undefined;
console.log(inklin.cyan.bold`Template Null: >${empty}< (Should be empty)`);
console.log(inklin.yellow`Template Undefined: >${missing}< (Should be empty)`);

// 4. Strict Validation
// Verifies that invalid hex codes are rejected (remain white) instead of corrupting.
console.log(inklin.hex('#ABCDE')('Invalid 5-char Hex (Should be white)'));
console.log(inklin.hex('#1234')('Invalid 4-char Hex (Should be white)'));
console.log(inklin.hex('#50fa7b')('Valid 6-char Hex (Should be green)'));

// 5. Complex Composition
const error = inklin.bgRed.white.bold;
const warn = inklin.yellow.italic;
console.log(error` FATAL ` + warn` Connection lost ` + inklin.gray` (retrying...)`);

console.log('--- Test 4 Finished ---');
