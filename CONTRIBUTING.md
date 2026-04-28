# Contributing to Inklin

This document outlines the procedures and standards for contributing to the Inklin project. 

## Technical Constraints

All contributions must adhere to the following project constraints:
*   **Zero Dependencies**: No external runtime dependencies may be added.
*   **Module Support**: All code must support both ECMAScript Modules (ESM) and CommonJS (CJS).
*   **Modular Architecture**: Logic must remain decoupled into `src/kernel/`, `src/registry/`, and `src/processors/`.
*   **Heavy Nomenclature**: Use standardized terminology for modules: `kernel` (engine), `registry` (constants), `processors` (utilities), and `platform` (environment state).
*   **Footprint**: Code should remain concise to maintain a small installation size.

## Development Setup

The project is developed in an environment with specific filesystem restrictions. Follow these steps for local setup:

1.  Clone the repository.
2.  Install development dependencies using the `--no-bin-links` flag to ensure compatibility with restricted filesystems:
    ```bash
    npm install --no-bin-links
    ```

## Build Process

Inklin uses a custom build script to generate the CommonJS distribution. Do not modify `dist/` files directly.

To generate the CommonJS bundle:
```bash
npm run build
```

The build script performs keyword transformation and IIFE wrapping to ensure cross-module compatibility.

## Testing

Contributions must include updated or new tests in the `tests/` directory. All tests must pass before a pull request is considered.

Run the test suite:
```bash
npm test
```

## Pull Request Process

1.  Create a feature branch from `main`.
2.  Implement changes following the existing code style and modular structure.
3.  Ensure the build script executes successfully and all tests pass.
4.  Update the documentation in `README.md` if the public API has changed.
5.  Submit a pull request with a clear, objective description of the modifications.

## Documentation & Communication Standards

*   **Tone**: Maintain a formal, objective, and technical tone in all documentation, commit messages, and pull requests.
*   **Prohibitions**: The use of emojis, slang, or casual language is strictly prohibited.
*   **Clarity**: Descriptions must be concise and to-the-point. Avoid hyperbolic or subjective terms such as "best", "fastest", "high performance", or "revolutionary". Focus strictly on measurable technical facts and implementation details.

## Coding Standards

*   **Formatting**: Use standard JavaScript formatting consistent with the existing codebase.
*   **Naming**: Use descriptive, camelCase naming for variables and functions.
*   **Types**: Ensure logic is stable across different input types through proper sanitization.
*   **Style**: Avoid the use of external libraries; utilize native Node.js or JavaScript primitives only.

## License

By contributing to Inklin, you agree that your contributions will be licensed under the project's MIT License.
