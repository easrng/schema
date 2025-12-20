const colors = {
  __proto__: null,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  gray: 90,
  redBright: 91,
  greenBright: 92,
  yellowBright: 93,
  blueBright: 94,
  magentaBright: 95,
  cyanBright: 96,
};
export const styleText = (
  format: Exclude<keyof typeof colors, "__proto__">,
  text: string,
): string => {
  return `\u001b[${colors[format]}m${text.replace(
    // eslint-disable-next-line no-control-regex
    /\u001b\[39m/g,
    (match, offset) => {
      return offset + match.length < text.length
        ? `\u001b[${colors[format]}m`
        : match;
    },
  )}\u001b[39m`;
};
