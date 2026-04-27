import inklin from '../../src/inklin.js';
import { env } from '../../src/kernel/platform.js';

console.log('--- Test 5: Color Downsampling ---');

const testColor = '#ff5555';

// 1. Level 3 (Truecolor)
env.level = 3;
console.log(inklin.hex(testColor)('Truecolor (Level 3) - Expect 24-bit sequences'));

// 2. Level 2 (256 Colors)
env.level = 2;
console.log(inklin.hex(testColor)('ANSI 256 (Level 2) - Expect 8-bit sequences'));

// 3. Level 1 (16 Colors)
env.level = 1;
console.log(inklin.hex(testColor)('ANSI 16 (Level 1) - Expect 4-bit sequences (Bright Red)'));

// 4. Level 0 (Disabled)
env.level = 0;
console.log(inklin.hex(testColor)('Disabled (Level 0) - Expect plain text'));

// Restore for future tests if necessary (though env is usually per-process in real usage)
env.level = 3;

console.log('--- Test 5 Finished ---');
