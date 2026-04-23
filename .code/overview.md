# Technical Overview

This document describes the technical architecture and component responsibilities of the Inklin codebase.

## Core Architecture

Inklin uses a **Recursive Proxy** pattern to enable infinite style chaining without pre-generating every possible combination.

### 1. Entry Point (`src/inklin.js`)
The primary gateway for the library. It initializes the first instance of the styler and exports it as the default.

### 2. Styling Engine (`src/engine/`)

#### `core.js`
The heart of the library.
- **`createStyler(open, close)`**: A factory function that returns a `Proxy` wrapped around a styling function.
- **Proxy Logic**: Intercepts property access (e.g., `.red`, `.bold`). If the property matches an ANSI code, it returns a new styler with updated escape sequences.
- **Smart Nesting**: Inside the styler, the code detects if a string already contains ANSI reset codes and re-injects the parent styles immediately after them to prevent "style leakage."

#### `environment.js`
Manages global state and terminal detection.
- **Color Detection**: Uses `process.stdout.isTTY`, `FORCE_COLOR`, and `TERM` environment variables to decide if colors should be rendered.
- **Live State**: Exports a mutable `env` object so that calling `.disable()` or `.enable()` updates all active styler instances simultaneously.

### 3. Data & Constants (`src/constants/`)

#### `ansi.js`
A dictionary mapping style names (foreground, background, modifiers, and brights) to their standard ANSI escape code pairs (opening and closing codes).

### 4. Utilities (`src/utils/`)

#### `color.js`
Contains `hexToRgb`, which parses 3-digit and 6-digit hex strings into their integer RGB components for Truecolor (24-bit) output.

### 5. Build System (`scripts/`)

#### `build.js`
A zero-dependency bundler used to create the CommonJS distribution (`dist/inklin.cjs`).
- **Logic**: Reads the modular ESM source files, strips `import`/`export` keywords using regular expressions, and inlines them into a single file wrapped in an IIFE.
- **Purpose**: Ensures compatibility for environments that do not yet support ESM without requiring a heavy external build tool.
