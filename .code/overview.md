# Technical Overview

This document describes the technical architecture and component responsibilities of the Inklin codebase.

## Version
Current Major Version: **2.0.0**

## Core Architecture

Inklin utilizes a **Recursive Proxy** pattern to facilitate style chaining without the requirement for pre-generated style combinations.

### 1. Entry Point (`src/inklin.js`)
The primary module for the library. It initializes the base styler instance using the kernel logic and provides the default export.

### 2. Kernel Logic (`src/kernel/`)

#### `kernel.js`
The central logic of the library.
- **`createStyler(open, close)`**: A factory function that returns a `Proxy` wrapped around a styling function.
- **Performance Optimization**: Implements **Regex Hoisting** where style restoration patterns are pre-compiled during the instantiation phase.
- **Proxy Caching**: Memoizes styler instances for static properties to reduce object allocation and initialization overhead.
- **State-Aware Style Restoration**: Implements a restoration mechanism that utilizes a pre-compiled regular expression to re-apply styles following nested resets (`\x1b[0m`) or specific termination codes.
- **Hybrid Link Support**: The `link` method is fully integrated into the style chain, allowing for styled clickable terminal hyperlinks.

#### `platform.js`
Manages configuration and terminal capability detection.
- **Color Level Detection**: Evaluates environment variables (`COLORTERM`, `FORCE_COLOR`, `TERM`, `NO_COLOR`) to determine the color support level:
    - **Level 3**: 24-bit Truecolor
    - **Level 2**: ANSI 256 colors
    - **Level 1**: Basic 16 colors
    - **Level 0**: Disabled
- **Global State**: Exports a shared `env` object, allowing `.disable()` or `.enable()` calls to affect all active styler instances while preserving detected support levels.

### 3. Registry & Definitions (`src/registry/`)

#### `ansi.js`
A mapping of style identifiers to their respective standard ANSI escape code pairs.

### 4. Processors (`src/processors/`)

#### `color.js`
Handles complex color value processing and mapping:
- **`hexToRgb`**: Parses and validates hexadecimal strings with internal memoization.
- **Automatic Color Downsampling**: Mathematically maps RGB/Hex values to the nearest ANSI 256 or ANSI 16 color index based on the detected `platform` support level.

### 5. Type System (`types/`)

#### `inklin.d.ts`
First-class TypeScript definition file providing full interface documentation and autocompletion for the styler, methods, and environment object.

### 6. Build System (`scripts/`)

#### `build.js`
A specialized bundling script for the CommonJS distribution (`dist/inklin.cjs`).
- **Transformation Logic**: Performs keyword-boundary-sensitive operations to transform ECMAScript Modules into a CommonJS-compatible IIFE bundle.
