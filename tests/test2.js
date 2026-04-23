import inklin from '../src/inklin.js';

console.log('--- Test 2: Extended Colors & Syntax ---');

// Hex Colors (6-digit and 3-digit)
console.log(inklin.hex('#ff0000')('Hex Red (#ff0000)'));
console.log(inklin.hex('#0f0')('Hex Green Short (#0f0)'));
console.log(inklin.bgHex('#0000ff').white('White on Hex Blue BG'));

// RGB Colors
console.log(inklin.rgb(255, 165, 0)('RGB Orange (255, 165, 0)'));
console.log(inklin.bgRgb(128, 0, 128).white('White on RGB Purple BG'));

// Smart Nesting (Style Restoration)
console.log(
  inklin.red(
    `Red Start -> ${inklin.blue.bold('Blue Bold Nest')} -> Red End`
  )
);

// Tagged Templates
const tool = 'Inklin';
console.log(inklin.cyan`Tagged Template: ${tool} is active!`);
console.log(inklin.magenta`Nested in Template: ${inklin.yellow('Yellow Nest')} back to Magenta`);

// Edge Cases
console.log('Number Zero:', inklin.green(0));
console.log('Empty String:', inklin.red(''), '(should be empty)');

console.log('--- Test 2 Finished ---');
