const inklin = require('../../dist/inklin.cjs');

const logTest = (name, result) => {
  const escaped = String(result).replace(/\x1b/g, '\\e');
  console.log(`[PASS] ${name.padEnd(30)} | Render: ${result} | Raw: ${escaped}`);
};

console.log('\n--- INKLIN CJS COMPREHENSIVE SUITE ---\n');

// 1. Common Cases
logTest('CJS: Basic Color', inklin.red('Red Text'));
logTest('CJS: Chained', inklin.yellow.italic('Yellow Italic'));
logTest('CJS: Tagged Template', inklin.blue`Blue ${'Value'}`);

// 2. Complex Restoration
logTest('CJS: Nesting', inklin.red(`Outer ${inklin.blue('Inner')} Outer`));
logTest('CJS: Reset Nesting', inklin.green(`Start ${inklin.reset('Reset')} End`));

// 3. Environment Check
logTest('CJS: Env Detection', `Level: ${inklin.env.level}, Enabled: ${inklin.env.enabled}`);

console.log('\n--- SUITE COMPLETE ---\n');
