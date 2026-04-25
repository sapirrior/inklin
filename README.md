<p align="center">
  <img src="assets/inklin.png" width="400" alt="Inklin Logo">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/inklin">
    <img src="https://img.shields.io/npm/v/inklin?style=flat-square&logo=npm&color=2e86de&labelColor=333" alt="npm version" height="20">
  </a>
  &nbsp;
  <a href="https://www.npmjs.com/package/inklin">
    <img src="https://img.shields.io/npm/dt/inklin?style=flat-square&color=e056fd&labelColor=333" alt="downloads" height="20">
  </a>
  &nbsp;
  <a href="https://github.com/sapirrior/inklin/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/sapirrior/inklin?style=flat-square&color=f1c40f&labelColor=333" alt="license" height="20">
  </a>
</p>


# Inklin

Terminal text styling for command-line interfaces.

Inklin is a utility for terminal string styling. It provides a chainable API with support for style restoration, truecolor, and CLI hyperlinks, within a zero-dependency footprint.

<p align="center">
  <img src="assets/hero.png" alt="Inklin Hero" style="border-radius: 30px;">
</p>

## Core Features

*   **Style Restoration**: Tracks and restores parent styles during nesting to prevent color leakage.
*   **Zero Dependencies**: A self-contained utility with no external runtime dependencies.
*   **Hybrid Module Support**: Support for both ECMAScript Modules (ESM) and CommonJS (CJS).
*   **Color Support**: Support for standard ANSI colors, bright variants, 24-bit Hex, and RGB.
*   **Hyperlinks**: Support for clickable terminal links via the OSC 8 sequence.
*   **Template Literals**: String interpolation using JavaScript tagged template literals.

## Installation

```bash
npm install inklin
```

## Usage

### Basic Formatting

```javascript
import inklin from 'inklin';

// Foreground colors
console.log(inklin.blue('Informational message'));

// Background and modifiers
console.log(inklin.bgRed.white.bold(' ERROR '));

// Chained modifiers
console.log(inklin.yellow.italic.underline('Warning: Low disk space'));
```

### Color Input

```javascript
// Hexadecimal (supports 3 and 6 digit formats)
console.log(inklin.hex('#50fa7b')('Brand Color'));

// RGB values
console.log(inklin.rgb(255, 165, 0)('Orange Output'));
```

### Integration

#### Style Nesting
Inklin manages the ANSI escape stack to ensure nested styles return to the outer context.

```javascript
console.log(
  inklin.red(`Outer Red ${inklin.blue.bold('Inner Blue Bold')} Outer Red`)
);
```

#### Hyperlinks
Create clickable links in supported terminal emulators.

```javascript
console.log(inklin.link('Project Repository', 'https://github.com/Sapirrior/inklin'));
```

#### Tagged Templates
```javascript
const module = 'Engine';
console.log(inklin.cyan.bold`Status: ${module} is operational.`);
```

## API Reference

| Category | Available Properties |
| :--- | :--- |
| **Modifiers** | `bold`, `dim`, `italic`, `underline`, `inverse`, `strikethrough` |
| **Standard Colors** | `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray` |
| **Bright Colors** | `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright` |
| **Backgrounds** | `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`, `bgGray` |
| **Bright Backgrounds** | `bgRedBright`, `bgGreenBright`, `bgYellowBright`, `bgBlueBright`, `bgMagentaBright`, `bgCyanBright`, `bgWhiteBright` |

### Static Methods

*   **`hex(string)`**: Applies a foreground color using a hexadecimal string.
*   **`bgHex(string)`**: Applies a background color using a hexadecimal string.
*   **`rgb(r, g, b)`**: Applies a foreground color using RGB integers (0-255).
*   **`bgRgb(r, g, b)`**: Applies a background color using RGB integers (0-255).
*   **`link(text, url)`**: Generates an ANSI escape sequence for a clickable link.
*   **`enable()` / `disable()`**: Globally toggles styling state.

## Technical Specifications

Inklin respects standard environment variables:
*   Supports `FORCE_COLOR` and `TERM` detection.
*   Respects `FORCE_COLOR=0` for explicit disabling of styles.
*   Footprint is under few KBs.

## License

MIT © Sapirrior
