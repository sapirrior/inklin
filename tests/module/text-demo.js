import inklin from '../../src/inklin.js';

// 1. Prompt and Gap
const prompt = inklin.green('root@localhost') + inklin.white(':') + inklin.blue('~') + inklin.white('# ');
console.log(`${prompt}node tests/text-demo.js`); 

// 2. All styles on one line with spaces
console.log(
  inklin.strikethrough('STRIKETHROUGH') + ' ' + 
  inklin.yellow('YELLOW') + ' ' + 
  inklin.green('GREEN') + ' ' + 
  inklin.blue('BLUE') + ' ' + 
  inklin.magenta('MAGENTA')
);