# Contributing to Inklin

Inklin maintains rigorous engineering and documentation standards to ensure the library remains predictable, performant, and maintainable across all JavaScript environments. All contributors must adhere to these guidelines.

## Technical Writing Standards

All project communications—including documentation, code comments, commit messages, and pull request descriptions—must utilize **Objective Technical Language**. Precision is prioritized; the use of casual, subjective, or hyperbolic terminology is strictly prohibited.

### 1. Style Guidelines
- **Eliminate Hyperbole:** Avoid terms such as "fast", "blazing", "easy", or "high-performance". Describe the technical mechanism instead (e.g., "monomorphic property access", "O(1) lookup", "minimized memory allocation").
- **Remove Subjectivity:** Avoid qualifiers like "basically", "actually", "just", or "simple".
- **Use Literal Terms:** Prefer descriptions of architectural or engine-level reality (e.g., "JIT-optimized", "ANSI-escaped", "hidden-class stable").

### 2. Documentation Rules
- **Rationale Over Action:** Comments must clarify *why* an architectural or implementation decision was made. The code itself should clearly express *what* is occurring.
- **Zero-Dependency Mandate:** Do not propose changes that introduce external runtime dependencies.

## Engineering Standards

### 1. Performance & Memory
- **Monomorphic Execution Paths:** Maintain consistent object shapes (hidden classes) to optimize V8 engine transitions. Avoid patterns that trigger de-optimizations (e.g., `delete` operator, dynamic property injection after initialization).
- **Self-Overwriting Getters:** When adding style properties to the kernel, follow the pattern of overwriting getters with static references upon first access.
- **Regex Registry:** Utilize the `REGEX_CACHE` in `src/kernel/kernel.js` for all regular expression operations to prevent memory leaks and unnecessary recompilation.

### 2. Environment Parity
- **Universal Compatibility:** Logic must remain stable across Node.js (ESM/CJS) environments.
- **Zero-Dependency Build:** The build pipeline must remain self-contained within the `scripts/` directory, using regex-based source transformation instead of external bundlers.

## Commit Message Protocol

Commit messages serve as a permanent technical record. They must follow a structured format and adhere strictly to the **Technical Writing Standards**.

### Required Format:
```text
type(scope): concise summary (imperative mood)

CHANGES:
- Technical list of modifications.

RATIONALE:
- Architectural or performance-based reason for the change.
- Technical comparison of previous vs. new state.

IMPROVEMENTS:
- Specific gains in performance, reliability, or environment compatibility.
- Quantifiable metrics where applicable.
```

### Commit Types:
- `feat`: A new capability.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `perf`: Performance optimizations.
- `refactor`: Structural changes without behavioral updates.
- `test`: Adding or correcting tests.
- `chore`: Maintenance tasks.

### Mandatory Scopes:
`kernel`, `platform`, `color`, `registry`, `build`, `types`, `tests`.

## Pull Request Process

1.  **Branching**: Create a feature branch from `main`.
2.  **Implementation**: Adhere to the JIT-targeted prototype architecture and strict mode.
3.  **Verification**:
    -   Ensure all tests pass: `npm test`.
    -   Verify the build pipeline: `npm run build`.
    -   Update `types/inklin.d.ts` if the public API is modified.
4.  **Submission**: Submit your PR with a detailed technical description following the **Technical Writing Standards**.

## License

By contributing to Inklin, you agree that your contributions will be licensed under the project's MIT License.
