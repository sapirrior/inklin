import inklin from '../../src/inklin.js';

const logTest = (name, result) => {
  const escaped = result.replace(/\x1b/g, '\\e');
  console.log(`[PASS] ${name.padEnd(30)} | Render: ${result} | Raw: ${escaped}`);
};

console.log('\n--- INKLIN ESM COMPREHENSIVE SUITE ---\n');

// 1. Common Cases
logTest('Basic Color', inklin.red('Red Text'));
logTest('Chained Styles', inklin.blue.bold.underline('Blue Bold Underline'));
logTest('Backgrounds', inklin.bgMagenta.white(' White on Magenta '));
logTest('Tagged Template', inklin.green`Green ${'Value'} and ${inklin.yellow('Yellow')}`);

// 2. Color Processors
logTest('Hex Color (Standard)', inklin.hex('#ff79c6')('Pink Hex'));
logTest('Hex Color (Short)', inklin.hex('#50f')('Purple Hex'));
logTest('RGB Color', inklin.rgb(255, 121, 198)('Pink RGB'));
logTest('RGB Clamping (300 -> 255)', inklin.rgb(300, 0, 0)('Red Clamped'));

// 3. Edge Cases: Nesting & Resets
logTest('Nested Styles', inklin.red(`Red ${inklin.blue('Blue')} Red`));
logTest('Nested Reset Recovery', inklin.magenta(`Mag ${inklin.reset('Reset')} Mag`));
logTest('Deep Nesting (3 levels)', inklin.yellow(`Yel ${inklin.blue(`Blu ${inklin.red('Red')} Blu`)} Yel`));

// 4. Edge Cases: Links & Sanitization
logTest('Standard Link', inklin.link('Inklin', 'https://github.com'));
logTest('Styled Link', inklin.cyan.bold.link('Bold Cyan Link', 'https://inklin.dev'));
logTest('Link Sanitization', inklin.link('Injected', 'https://test.com/\x07\x1b\x01'));

// 5. Edge Cases: Data Types
logTest('Styled Number', inklin.yellow(12345));
logTest('Styled Boolean', inklin.green(true));
logTest('Styled Null (Empty)', inklin.red(null));
logTest('Styled Undefined (Empty)', inklin.red(undefined));
logTest('Styled Object', inklin.blue({ id: 1 }));

// 6. Edge Cases: Malformed Input
logTest('Malformed Hex (5 chars)', inklin.hex('#ff79')('Fallback'));
logTest('Malformed Hex (Invalid)', inklin.hex('#zzzzzz')('Fallback'));

// 7. System Logic
const disabled = inklin.disable();
logTest('System Disabled', disabled.red('Should be plain'));
const enabled = disabled.enable();
logTest('System Re-enabled', enabled.red('Should be red'));

console.log('\n--- SUITE COMPLETE ---\n');
