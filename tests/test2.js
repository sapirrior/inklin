import inklin from '../src/inklin.js';

console.log('--- Test 2: Advanced Colors & Logic ---');

// Hex (Memoized & Sanitized)
console.log(inklin.hex('#ff79c6')('Pink Hex (#ff79c6)'));
console.log(inklin.hex('#50f')('Short Hex (#50f)'));
console.log(inklin.hex('INVALID')('Invalid Hex (should be white/plain)'));

// RGB (Validated)
console.log(inklin.rgb(255, 121, 198)('RGB Pink (255, 121, 198)'));
console.log(inklin.rgb(999, -50, 100)('Out of range RGB (Auto-clamped)'));

// Tagged Templates (Complex)
const status = 'READY';
const version = '1.0.1';
console.log(inklin.cyan.bold`System ${status} - v${version}`);
console.log(inklin.magenta`Template with ${inklin.yellow.underline('Nested Styled Value')} inside.`);

// Edge Cases
console.log('Styled Number:', inklin.green(100));
console.log('Styled Null:', inklin.red(null), '(should be empty)');
console.log('Styled Object:', inklin.yellow({ key: 'val' }));

console.log('--- Test 2 Finished ---');
