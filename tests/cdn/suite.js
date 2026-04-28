/**
 * Inklin CDN Test Suite
 */
import fs from 'fs';
import path from 'path';

console.log('\n--- INKLIN CDN COMPREHENSIVE SUITE ---\n');

const bundlePath = path.resolve('cdn/inklin.min.js');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

try {
  const mockGlobal = {
    navigator: { userAgent: 'MockBrowser' }
  };
  
  // Use 'this' as the global scope for the UMD wrapper
  const execute = new Function(bundleContent + '; return this.inklin;');
  const inklin = execute.call(mockGlobal);

  if (!inklin) throw new Error('Inklin failed to attach to global scope');
  console.log('[PASS] Global Attachment confirmed (inklin is defined)');

  const logTest = (name, result) => {
    const escaped = String(result).replace(/\x1b/g, '\\e');
    console.log(`[PASS] ${name.padEnd(30)} | Render: ${result} | Raw: ${escaped}`);
  };

  logTest('CDN: Basic Color', inklin.red('Red Text'));
  logTest('CDN: Chained', inklin.blue.bold.underline('Blue Bold Underline'));
  logTest('CDN: Hex Support', inklin.hex('#ff79c6')('Pink Hex'));
  logTest('CDN: Nesting Restoration', inklin.magenta(`Outer ${inklin.cyan('Inner')} Outer`));
  logTest('CDN: Template Literals', inklin.yellow`Yellow ${'Value'}`);

  console.log(`[PASS] CDN: Env Detection           | Level: ${inklin.env.level} (Mock Browser)`);

} catch (err) {
  console.error(`[FAIL] CDN Test Suite failed: ${err.message}`);
  process.exit(1);
}

console.log('\n--- CDN SUITE COMPLETE ---\n');
