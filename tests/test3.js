import inklin from '../src/inklin.js';

console.log('--- Test 3: Integration & Environment ---');

// 1. Hyperlinks
console.log('Link: ' + inklin.link('Inklin Repo', 'https://github.com/user/inklin'));

// 2. Theme Composition
const success = inklin.green.bold;
const error = inklin.red.bold.underline;
const info = inklin.blueBright.italic;

console.log(success('SUCCESS: Operation complete'));
console.log(error('ERROR: Something went wrong'));
console.log(info('INFO: System update available'));

// 3. Environment Control (Enable/Disable)
inklin.disable();
console.log(inklin.red('This RED should be PLAIN (disabled)'));
inklin.enable();
console.log(inklin.green('This GREEN should be COLORED (enabled)'));

// 4. Manual Style Creation (Checking for internal state consistency)
const boldOnly = inklin.bold;
console.log(boldOnly('This should be just bold'));
console.log(boldOnly.red('This should be bold and red (nested property access)'));

console.log('--- Test 3 Finished ---');
