# Inklin

Expressive terminal text styling for modern command-line interfaces.

Inklin is a high-performance, zero-dependency utility designed for elegant terminal string styling. It provides a familiar, chainable API with advanced features such as smart style restoration, truecolor support, and modern CLI hyperlinks, all within a lightweight footprint.

## Key Features

*   **Zero Dependencies**: A self-contained utility with no external supply-chain risks.
*   **Smart Nesting**: Automatically restores parent styles when a nested style ends, preventing color leakage.
*   **Dual Module Support**: Native support for both ECMAScript Modules (ESM) and CommonJS (CJS).
*   **Full Color Suite**: Comprehensive support for standard ANSI colors, bright variants, Hex, and RGB.
*   **Modern Hyperlinks**: Native support for clickable terminal links via the OSC 8 sequence.
*   **Tagged Templates**: Optimized string interpolation using JavaScript tagged template literals.

## Installation

```bash
npm install inklin
```

## Usage

### Basic Styling

```javascript
import inklin from 'inklin';

// Simple colors
console.log(inklin.blue('Informational message'));

// Chaining styles
console.log(inklin.red.bold.underline('Critical error detected'));

// Background colors
console.log(inklin.bgGreen.black(' Success '));
```

### Advanced Colors (Hex and RGB)

```javascript
// Hexadecimal support (3 and 6 digit)
console.log(inklin.hex('#50fa7b')('Custom green'));

// RGB support
console.log(inklin.rgb(255, 165, 0)('Vibrant orange'));
```

### Smart Nesting

Inklin handles nested styles intelligently by tracking and restoring the parent style context.

```javascript
console.log(
  inklin.red(`Level 1 (Red) ${inklin.blue('Level 2 (Blue)')} Level 1 (Red)`)
);
```

### Hyperlinks

Create clickable links in supported modern terminals.

```javascript
console.log(inklin.link('Documentation', 'https://github.com/Sapirrior/inklin'));
```

### Tagged Templates

```javascript
const user = 'Developer';
console.log(inklin.cyan`Hello ${user}, welcome to Inklin.`);
```

## API Reference

### Modifiers
*   `bold`
*   `dim`
*   `italic`
*   `underline`
*   `inverse`
*   `strikethrough`

### Foreground Colors
*   Standard: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
*   Bright: `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### Background Colors
*   Standard: `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`, `bgGray`
*   Bright: `bgRedBright`, `bgGreenBright`, `bgYellowBright`, `bgBlueBright`, `bgMagentaBright`, `bgCyanBright`, `bgWhiteBright`

### Methods
*   `hex(string)`: Set foreground color via Hex code.
*   `bgHex(string)`: Set background color via Hex code.
*   `rgb(r, g, b)`: Set foreground color via RGB values.
*   `bgRgb(r, g, b)`: Set background color via RGB values.
*   `link(text, url)`: Create an ANSI hyperlink.
*   `enable()` / `disable()`: Globally toggle styling.

## Environment Support

Inklin automatically detects color support. You can manually override this behavior:

```javascript
inklin.disable(); // Turns off all ANSI formatting
inklin.enable();  // Force enables ANSI formatting
```

## License

MIT © Sapirrior
