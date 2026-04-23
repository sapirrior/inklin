import fs from 'fs';
import inklin from '../src/inklin.js';

const colors = {
  30: '#282a36', 31: '#ff5555', 32: '#50fa7b', 33: '#f1fa8c', 34: '#bd93f9', 35: '#ff79c6', 36: '#8be9fd', 37: '#f8f8f2', 90: '#6272a4',
  91: '#ff6e6e', 92: '#69ff94', 93: '#ffffa5', 94: '#d6acff', 95: '#ff92df', 96: '#a4ffff', 97: '#ffffff'
};

const bgColors = {
  41: '#ff5555', 42: '#50fa7b', 43: '#f1fa8c', 44: '#bd93f9', 45: '#ff79c6', 46: '#8be9fd', 47: '#f8f8f2', 100: '#6272a4'
};

function generateSVG() {
  const sampleText = [
    inklin.magenta.bold('Inklin') + ' - Terminal Styling Done Right',
    '',
    inklin.green('✔') + ' Zero Dependencies',
    inklin.blue('ℹ') + ' ESM & CJS Support',
    inklin.yellow('⚠') + ' Ultra Lightweight (3KB)',
    '',
    inklin.cyan('Themes:'),
    '  ' + inklin.bgRed.white.bold(' ERROR ') + ' ' + inklin.red('Connection failed'),
    '  ' + inklin.bgGreen.black.bold(' SUCCESS ') + ' ' + inklin.green('Build complete'),
    '',
    'Hex Support: ' + inklin.hex('#ff79c6')('Pink') + ' ' + inklin.hex('#50fa7b')('Green'),
    'Hyperlinks: ' + inklin.link('GitHub', 'https://github.com')
  ].join('\n');

  let y = 30;
  let textElements = '';
  
  sampleText.split('\n').forEach(line => {
    let currentLine = '';
    let x = 20;
    
    // Simplistic parser for this specific demo
    const segments = line.split('\x1b[');
    segments.forEach((seg, i) => {
      if (i === 0) {
        if (seg) textElements += `<text x="${x}" y="${y}" fill="#f8f8f2">${seg}</text>`;
        return;
      }
      
      const parts = seg.split('m');
      const codes = parts[0].split(';');
      const text = parts[1];
      
      let color = '#f8f8f2';
      let weight = 'normal';
      let decoration = 'none';
      let bg = 'none';

      codes.forEach(code => {
        if (colors[code]) color = colors[code];
        if (code === '1') weight = 'bold';
        if (code === '4') decoration = 'underline';
        if (bgColors[code]) bg = bgColors[code];
      });

      if (text) {
        if (bg !== 'none') {
           textElements += `<rect x="${x}" y="${y-14}" width="${text.length * 8.5}" height="18" fill="${bg}" />`;
           color = (bg === '#f8f8f2' || bg === '#50fa7b' || bg === '#f1fa8c') ? '#282a36' : '#ffffff';
        }
        textElements += `<text x="${x}" y="${y}" fill="${color}" font-weight="${weight}" style="text-decoration: ${decoration}">${text}</text>`;
        x += text.length * 8.5;
      }
    });
    y += 22;
  });

  const svg = `
<svg width="600" height="340" viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="340" rx="10" fill="#1e1e1e" />
  <circle cx="25" cy="20" r="6" fill="#ff5f56" />
  <circle cx="45" cy="20" r="6" fill="#ffbd2e" />
  <circle cx="65" cy="20" r="6" fill="#27c93f" />
  <g font-family="monospace" font-size="14">
    ${textElements}
  </g>
</svg>
  `.trim();

  fs.writeFileSync('assets/preview.svg', svg);
  console.log('SVG Preview generated: assets/preview.svg');
}

generateSVG();
