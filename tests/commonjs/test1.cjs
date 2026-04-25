const inklin = require('../../dist/inklin.cjs');

console.log('--- CJS Test 1: Core Styling ---');

console.log(inklin.red('Red'), inklin.green('Green'), inklin.blue('Blue'), inklin.yellow('Yellow'));
console.log(inklin.bgRed.white.bold(' FATAL ERROR '));
console.log(inklin.cyan.italic.underline('Chained Modifiers'));

console.log('--- CJS Test 1 Finished ---');
