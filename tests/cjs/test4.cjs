const inklin = require('../../dist/inklin.cjs');

console.log('--- CJS Test 4: Environment Detection ---');

// Visual verification of auto-detection in CJS
console.log(inklin.hex('#ff5555')('Auto-detected Color Level Output'));

console.log('--- CJS Test 4 Finished ---');
