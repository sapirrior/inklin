declare interface Styler {
  (text: string | number | null | undefined): string;
  (strings: TemplateStringsArray, ...values: any[]): string;

  readonly reset: Styler;
  readonly bold: Styler;
  readonly dim: Styler;
  readonly italic: Styler;
  readonly underline: Styler;
  readonly inverse: Styler;
  readonly hidden: Styler;
  readonly strikethrough: Styler;

  readonly black: Styler;
  readonly red: Styler;
  readonly green: Styler;
  readonly yellow: Styler;
  readonly blue: Styler;
  readonly magenta: Styler;
  readonly cyan: Styler;
  readonly white: Styler;
  readonly gray: Styler;

  readonly redBright: Styler;
  readonly greenBright: Styler;
  readonly yellowBright: Styler;
  readonly blueBright: Styler;
  readonly magentaBright: Styler;
  readonly cyanBright: Styler;
  readonly whiteBright: Styler;

  readonly bgBlack: Styler;
  readonly bgRed: Styler;
  readonly bgGreen: Styler;
  readonly bgYellow: Styler;
  readonly bgBlue: Styler;
  readonly bgMagenta: Styler;
  readonly bgCyan: Styler;
  readonly bgWhite: Styler;
  readonly bgGray: Styler;

  readonly bgRedBright: Styler;
  readonly bgGreenBright: Styler;
  readonly bgYellowBright: Styler;
  readonly bgBlueBright: Styler;
  readonly bgMagentaBright: Styler;
  readonly bgCyanBright: Styler;
  readonly bgWhiteBright: Styler;

  hex(color: string): Styler;
  bgHex(color: string): Styler;
  rgb(r: number, g: number, b: number): Styler;
  bgRgb(r: number, g: number, b: number): Styler;
  link(text: string, url: string): string;

  enable(): Styler;
  disable(): Styler;

  readonly env: {
    level: number;
    enabled: boolean;
  };
}

declare const inklin: Styler;
export default inklin;
