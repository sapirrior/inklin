/**
 * Inklin - A JIT-targeted terminal styling library with zero dependencies.
 */
export interface Styler {
  /**
   * Styles a string or number.
   * @param text The content to style.
   */
  (text: string | number | boolean | null | undefined | object): string;

  /**
   * Styles a template literal.
   */
  (strings: TemplateStringsArray, ...values: any[]): string;

  // Modifiers
  readonly reset: Styler;
  readonly bold: Styler;
  readonly dim: Styler;
  readonly italic: Styler;
  readonly underline: Styler;
  readonly inverse: Styler;
  readonly hidden: Styler;
  readonly strikethrough: Styler;

  // Foreground Colors
  readonly black: Styler;
  readonly red: Styler;
  readonly green: Styler;
  readonly yellow: Styler;
  readonly blue: Styler;
  readonly magenta: Styler;
  readonly cyan: Styler;
  readonly white: Styler;
  readonly gray: Styler;

  // Bright Foreground Colors
  readonly redBright: Styler;
  readonly greenBright: Styler;
  readonly yellowBright: Styler;
  readonly blueBright: Styler;
  readonly magentaBright: Styler;
  readonly cyanBright: Styler;
  readonly whiteBright: Styler;

  // Background Colors
  readonly bgBlack: Styler;
  readonly bgRed: Styler;
  readonly bgGreen: Styler;
  readonly bgYellow: Styler;
  readonly bgBlue: Styler;
  readonly bgMagenta: Styler;
  readonly bgCyan: Styler;
  readonly bgWhite: Styler;
  readonly bgGray: Styler;

  // Bright Background Colors
  readonly bgRedBright: Styler;
  readonly bgGreenBright: Styler;
  readonly bgYellowBright: Styler;
  readonly bgBlueBright: Styler;
  readonly bgMagentaBright: Styler;
  readonly bgCyanBright: Styler;
  readonly bgWhiteBright: Styler;

  /**
   * Applies a foreground color using a hexadecimal string.
   * @param color Hex string (e.g., '#ff0000' or '#f00').
   */
  hex(color: string): Styler;

  /**
   * Applies a background color using a hexadecimal string.
   * @param color Hex string (e.g., '#ff0000' or '#f00').
   */
  bgHex(color: string): Styler;

  /**
   * Applies a foreground color using RGB integers (0-255).
   */
  rgb(r: number, g: number, b: number): Styler;

  /**
   * Applies a background color using RGB integers (0-255).
   */
  bgRgb(r: number, g: number, b: number): Styler;

  /**
   * Generates an ANSI escape sequence for a clickable terminal link.
   * @param text The text to display.
   * @param url The target URL.
   */
  link(text: string | number | boolean | null | undefined | object, url: string): string;

  /**
   * Globally enables styling.
   */
  enable(): this;

  /**
   * Globally disables styling.
   */
  disable(): this;

  /**
   * Current environment and capability state.
   */
  readonly env: {
    /**
     * Color support level:
     * 0: Disabled
     * 1: Basic (16 colors)
     * 2: ANSI 256 colors
     * 3: Truecolor (16.7m colors)
     */
    level: number;
    /**
     * Whether styling is globally enabled.
     */
    enabled: boolean;
  };
}

/**
 * The default inklin styler instance.
 */
declare const inklin: Styler;

export default inklin;
