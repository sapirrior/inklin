import inklin from '../src/inklin.js';

console.log('--- Test 1: Core Styling (Colors, Brights, Mods) ---');

// Standard Colors
console.log(inklin.black('Black'), inklin.red('Red'), inklin.green('Green'), inklin.yellow('Yellow'));
console.log(inklin.blue('Blue'), inklin.magenta('Magenta'), inklin.cyan('Cyan'), inklin.white('White'), inklin.gray('Gray'));

// Bright Colors
console.log(inklin.redBright('RedBright'), inklin.greenBright('GreenBright'), inklin.yellowBright('YellowBright'));
console.log(inklin.blueBright('BlueBright'), inklin.magentaBright('MagentaBright'), inklin.cyanBright('CyanBright'), inklin.whiteBright('WhiteBright'));

// Backgrounds
console.log(inklin.bgRed.white('White on Red BG'), inklin.bgGreen.black('Black on Green BG'));
console.log(inklin.bgYellowBright.black('Black on Bright Yellow BG'), inklin.bgGray.white('White on Gray BG'));

// Modifiers
console.log(inklin.bold('Bold'), inklin.dim('Dim'), inklin.italic('Italic'), inklin.underline('Underline'));
console.log(inklin.strikethrough('Strikethrough'), inklin.inverse('Inverse'), inklin.hidden('Hidden (you should not see this)'));

// Chaining
console.log(inklin.red.bold.underline.bgWhite('Complex Chained Style'));

console.log('--- Test 1 Finished ---');
