const inklin = require('../../dist/inklin.cjs');

console.log('--- CJS Test 2: Advanced Logic ---');

console.log(inklin.hex('#ff79c6')('Pink Hex'));
console.log(inklin.rgb(255, 165, 0)('Orange RGB'));
console.log(inklin.cyan.bold`Tagged Template in CJS: ${'Success'}`);
console.log('Null Safety:', inklin.red(null) === '' ? 'PASS' : 'FAIL');

console.log('--- CJS Test 2 Finished ---');
