# Technical Overview

This document describes the technical architecture and component responsibilities of the Inklin codebase.

## Core Architecture

Inklin utilizes a **Recursive Proxy** pattern to facilitate style chaining without the requirement for pre-generated style combinations.

### 1. Entry Point (`src/inklin.js`)
The primary module for the library. It initializes the base styler instance and provides the default export.

### 2. Styling Engine (`src/engine/`)

#### `core.js`
The central logic of the library.
- **`createStyler(open, close)`**: A factory function that returns a `Proxy` wrapped around a styling function.
- **Proxy Logic**: Intercepts property access. When a property matches an ANSI code definition, it returns a new styler instance with merged escape sequences.
- **State-Aware Style Restoration**: Implements a restoration mechanism that utilizes a single-pass regular expression to re-apply styles following nested resets (`\x1b[0m`) or specific termination codes. This ensures that styles are accurately restored for subsequent text while maintaining explicit reset zones.
- **Output Optimization**: Pre-calculates restoration patterns during the instantiation phase and deduplicates consecutive identical ANSI sequences to reduce the overall character count of the terminal output.

#### `environment.js`
Manages configuration and terminal capability detection.
- **Color Detection**: Evaluates `process.stdout.isTTY`, `FORCE_COLOR`, `TERM`, and `NO_COLOR` environment variables to determine rendering state.
- **Global State**: Exports a shared `env` object, allowing `.disable()` or `.enable()` calls to affect all active styler instances.

### 3. Data & Constants (`src/constants/`)

#### `ansi.js`
A mapping of style identifiers to their respective standard ANSI escape code pairs.

### 4. Utilities (`src/utils/`)

#### `color.js`
Handles color value processing:
- **`hexToRgb`**: Parses and validates 3-digit and 6-digit hexadecimal strings.
- **Cache Management**: Employs a fixed-size `Map` cache (maximum 100 entries) for hexadecimal-to-RGB conversions to minimize recalculation overhead.

### 5. Build System (`scripts/`)

#### `build.js`
A specialized bundling script for the CommonJS distribution (`dist/inklin.cjs`).
- **Transformation Logic**: Uses word-boundary-sensitive operations (`\bexport\b`) to remove ECMAScript Module syntax and encapsulate the source within a CommonJS-compatible IIFE.
- **Integrity**: Implemented to prevent accidental modification of literal strings or comments during the code transformation process.
