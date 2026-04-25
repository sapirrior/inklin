import inklin from '../../src/inklin.js';

console.log('--- Test 1: Core Styling (Colors, Brights, Mods) ---');

// Standard Colors
console.log(inklin.red('Red'), inklin.green('Green'), inklin.blue('Blue'), inklin.yellow('Yellow'));
console.log(inklin.magenta('Magenta'), inklin.cyan('Cyan'), inklin.white('White'), inklin.gray('Gray'));

// Bright Colors
console.log(inklin.redBright('RedBright'), inklin.greenBright('GreenBright'), inklin.blueBright('BlueBright'));
console.log(inklin.magentaBright('MagentaBright'), inklin.cyanBright('CyanBright'), inklin.whiteBright('WhiteBright'));

// Backgrounds
console.log(inklin.bgRed.white(' White on Red '), inklin.bgBlueBright.black(' Black on Bright Blue '));
console.log(inklin.bgGray.white(' White on Gray '), inklin.bgGreen.bold(' Bold on Green '));

// Modifiers
console.log(inklin.bold('Bold'), inklin.dim('Dim'), inklin.italic('Italic'), inklin.underline('Underline'));
console.log(inklin.strikethrough('Strikethrough'), inklin.inverse('Inverse'));

// Deep Chaining
console.log(inklin.red.bold.underline.bgWhite(' Critical Error (Chained) '));

console.log('--- Test 1 Finished ---');
