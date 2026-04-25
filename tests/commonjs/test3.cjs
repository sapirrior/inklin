const inklin = require('../../dist/inklin.cjs');

console.log('--- CJS Test 3: Style Restoration ---');

console.log(
  inklin.red(`Outer Red [${inklin.reset('Reset')}] Back to Red`)
);

console.log(
  inklin.bgBlue.white(` Blue [${inklin.bgRed(' Red ')}] Blue `)
);

console.log('--- CJS Test 3 Finished ---');
