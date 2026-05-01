# Technical Overview

This document describes the technical architecture and component responsibilities of the Inklin codebase.

## Version
Current Major Version: **3.0.1**

## Core Architecture

Inklin utilizes a **JIT-Targeted Prototype Architecture** to facilitate style chaining with deterministic performance and memory stability across Node.js environments.

### 1. Entry Point (`src/inklin.js`)
The primary module for the library. It initializes the base styler instance using the kernel logic and provides the default export.

### 2. Kernel Logic (`src/kernel/`)

#### `kernel.js`
The central engine of the library.
- **JIT-Targeted Prototype**: Style properties replace themselves with static references upon first access, maintaining stable hidden classes (shapes) in the V8 engine.
- **Global Regex Registry**: Manages compiled regular expressions used for style restoration through a centralized cache, ensuring a finite memory footprint.
- **Modulo-2 Style Restoration**: Implements a state-aware mechanism that utilizes a counter to correctly re-apply parent styles only when escaping nested reset zones (`\x1b[0m`).
- **Hybrid Link Support**: The `link` method integrates into the style chain, supporting clickable terminal hyperlinks with sanitization of control characters.

#### `platform.js`
Manages configuration and terminal capability detection.
- **Capability Detection**: Evaluates environment variables (`COLORTERM`, `FORCE_COLOR`, `TERM`, `NO_COLOR`) to determine the color support level (0-3).
- **Global State**: Exports a shared `env` object, allowing `.disable()` or `.enable()` calls to affect all active styler instances globally.

### 3. Registry & Definitions (`src/registry/`)

#### `ansi.js`
A mapping of style identifiers to their respective standard ANSI escape code pairs.

### 4. Processors (`src/processors/`)

#### `color.js`
Handles color value processing and mapping:
- **`hexToRgb`**: Parses and validates hexadecimal strings with an LRU-capped cache.
- **Automatic Color Downsampling**: Mathematically maps RGB/Hex values to the nearest ANSI 256 or ANSI 16 color index based on the detected support level.

### 5. Type System (`types/`)

#### `inklin.d.ts`
TypeScript definition file providing interface documentation and autocompletion for the styler, methods, and environment object.

### 6. Build System (`scripts/`)

#### `build.js`
Specialized bundling script for the CommonJS distribution (`dist/inklin.cjs`).
- **Transformation Logic**: Performs keyword-boundary-sensitive operations to transform ECMAScript Modules into environment-compatible bundles.
