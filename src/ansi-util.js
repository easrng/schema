// Modified copy of wrap-ansi and string-width patched to be fully tree-shakable

/**
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// node_modules/.pnpm/ansi-regex@6.2.2/node_modules/ansi-regex/index.js
function ansiRegex({ onlyFirst = false } = {}) {
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;
  const csi =
    "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
  const pattern = `${osc}|${csi}`;
  return new RegExp(pattern, onlyFirst ? void 0 : "g");
}

// node_modules/.pnpm/strip-ansi@7.1.2/node_modules/strip-ansi/index.js
function stripAnsi(string) {
  regex ??= ansiRegex();
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }
  return string.replace(regex, "");
}
var regex;

// node_modules/.pnpm/get-east-asian-width@1.4.0/node_modules/get-east-asian-width/lookup.js
function isAmbiguous(x) {
  return (
    x === 161 ||
    x === 164 ||
    x === 167 ||
    x === 168 ||
    x === 170 ||
    x === 173 ||
    x === 174 ||
    (x >= 176 && x <= 180) ||
    (x >= 182 && x <= 186) ||
    (x >= 188 && x <= 191) ||
    x === 198 ||
    x === 208 ||
    x === 215 ||
    x === 216 ||
    (x >= 222 && x <= 225) ||
    x === 230 ||
    (x >= 232 && x <= 234) ||
    x === 236 ||
    x === 237 ||
    x === 240 ||
    x === 242 ||
    x === 243 ||
    (x >= 247 && x <= 250) ||
    x === 252 ||
    x === 254 ||
    x === 257 ||
    x === 273 ||
    x === 275 ||
    x === 283 ||
    x === 294 ||
    x === 295 ||
    x === 299 ||
    (x >= 305 && x <= 307) ||
    x === 312 ||
    (x >= 319 && x <= 322) ||
    x === 324 ||
    (x >= 328 && x <= 331) ||
    x === 333 ||
    x === 338 ||
    x === 339 ||
    x === 358 ||
    x === 359 ||
    x === 363 ||
    x === 462 ||
    x === 464 ||
    x === 466 ||
    x === 468 ||
    x === 470 ||
    x === 472 ||
    x === 474 ||
    x === 476 ||
    x === 593 ||
    x === 609 ||
    x === 708 ||
    x === 711 ||
    (x >= 713 && x <= 715) ||
    x === 717 ||
    x === 720 ||
    (x >= 728 && x <= 731) ||
    x === 733 ||
    x === 735 ||
    (x >= 768 && x <= 879) ||
    (x >= 913 && x <= 929) ||
    (x >= 931 && x <= 937) ||
    (x >= 945 && x <= 961) ||
    (x >= 963 && x <= 969) ||
    x === 1025 ||
    (x >= 1040 && x <= 1103) ||
    x === 1105 ||
    x === 8208 ||
    (x >= 8211 && x <= 8214) ||
    x === 8216 ||
    x === 8217 ||
    x === 8220 ||
    x === 8221 ||
    (x >= 8224 && x <= 8226) ||
    (x >= 8228 && x <= 8231) ||
    x === 8240 ||
    x === 8242 ||
    x === 8243 ||
    x === 8245 ||
    x === 8251 ||
    x === 8254 ||
    x === 8308 ||
    x === 8319 ||
    (x >= 8321 && x <= 8324) ||
    x === 8364 ||
    x === 8451 ||
    x === 8453 ||
    x === 8457 ||
    x === 8467 ||
    x === 8470 ||
    x === 8481 ||
    x === 8482 ||
    x === 8486 ||
    x === 8491 ||
    x === 8531 ||
    x === 8532 ||
    (x >= 8539 && x <= 8542) ||
    (x >= 8544 && x <= 8555) ||
    (x >= 8560 && x <= 8569) ||
    x === 8585 ||
    (x >= 8592 && x <= 8601) ||
    x === 8632 ||
    x === 8633 ||
    x === 8658 ||
    x === 8660 ||
    x === 8679 ||
    x === 8704 ||
    x === 8706 ||
    x === 8707 ||
    x === 8711 ||
    x === 8712 ||
    x === 8715 ||
    x === 8719 ||
    x === 8721 ||
    x === 8725 ||
    x === 8730 ||
    (x >= 8733 && x <= 8736) ||
    x === 8739 ||
    x === 8741 ||
    (x >= 8743 && x <= 8748) ||
    x === 8750 ||
    (x >= 8756 && x <= 8759) ||
    x === 8764 ||
    x === 8765 ||
    x === 8776 ||
    x === 8780 ||
    x === 8786 ||
    x === 8800 ||
    x === 8801 ||
    (x >= 8804 && x <= 8807) ||
    x === 8810 ||
    x === 8811 ||
    x === 8814 ||
    x === 8815 ||
    x === 8834 ||
    x === 8835 ||
    x === 8838 ||
    x === 8839 ||
    x === 8853 ||
    x === 8857 ||
    x === 8869 ||
    x === 8895 ||
    x === 8978 ||
    (x >= 9312 && x <= 9449) ||
    (x >= 9451 && x <= 9547) ||
    (x >= 9552 && x <= 9587) ||
    (x >= 9600 && x <= 9615) ||
    (x >= 9618 && x <= 9621) ||
    x === 9632 ||
    x === 9633 ||
    (x >= 9635 && x <= 9641) ||
    x === 9650 ||
    x === 9651 ||
    x === 9654 ||
    x === 9655 ||
    x === 9660 ||
    x === 9661 ||
    x === 9664 ||
    x === 9665 ||
    (x >= 9670 && x <= 9672) ||
    x === 9675 ||
    (x >= 9678 && x <= 9681) ||
    (x >= 9698 && x <= 9701) ||
    x === 9711 ||
    x === 9733 ||
    x === 9734 ||
    x === 9737 ||
    x === 9742 ||
    x === 9743 ||
    x === 9756 ||
    x === 9758 ||
    x === 9792 ||
    x === 9794 ||
    x === 9824 ||
    x === 9825 ||
    (x >= 9827 && x <= 9829) ||
    (x >= 9831 && x <= 9834) ||
    x === 9836 ||
    x === 9837 ||
    x === 9839 ||
    x === 9886 ||
    x === 9887 ||
    x === 9919 ||
    (x >= 9926 && x <= 9933) ||
    (x >= 9935 && x <= 9939) ||
    (x >= 9941 && x <= 9953) ||
    x === 9955 ||
    x === 9960 ||
    x === 9961 ||
    (x >= 9963 && x <= 9969) ||
    x === 9972 ||
    (x >= 9974 && x <= 9977) ||
    x === 9979 ||
    x === 9980 ||
    x === 9982 ||
    x === 9983 ||
    x === 10045 ||
    (x >= 10102 && x <= 10111) ||
    (x >= 11094 && x <= 11097) ||
    (x >= 12872 && x <= 12879) ||
    (x >= 57344 && x <= 63743) ||
    (x >= 65024 && x <= 65039) ||
    x === 65533 ||
    (x >= 127232 && x <= 127242) ||
    (x >= 127248 && x <= 127277) ||
    (x >= 127280 && x <= 127337) ||
    (x >= 127344 && x <= 127373) ||
    x === 127375 ||
    x === 127376 ||
    (x >= 127387 && x <= 127404) ||
    (x >= 917760 && x <= 917999) ||
    (x >= 983040 && x <= 1048573) ||
    (x >= 1048576 && x <= 1114109)
  );
}
function isFullWidth(x) {
  return (
    x === 12288 || (x >= 65281 && x <= 65376) || (x >= 65504 && x <= 65510)
  );
}
function isWide(x) {
  return (
    (x >= 4352 && x <= 4447) ||
    x === 8986 ||
    x === 8987 ||
    x === 9001 ||
    x === 9002 ||
    (x >= 9193 && x <= 9196) ||
    x === 9200 ||
    x === 9203 ||
    x === 9725 ||
    x === 9726 ||
    x === 9748 ||
    x === 9749 ||
    (x >= 9776 && x <= 9783) ||
    (x >= 9800 && x <= 9811) ||
    x === 9855 ||
    (x >= 9866 && x <= 9871) ||
    x === 9875 ||
    x === 9889 ||
    x === 9898 ||
    x === 9899 ||
    x === 9917 ||
    x === 9918 ||
    x === 9924 ||
    x === 9925 ||
    x === 9934 ||
    x === 9940 ||
    x === 9962 ||
    x === 9970 ||
    x === 9971 ||
    x === 9973 ||
    x === 9978 ||
    x === 9981 ||
    x === 9989 ||
    x === 9994 ||
    x === 9995 ||
    x === 10024 ||
    x === 10060 ||
    x === 10062 ||
    (x >= 10067 && x <= 10069) ||
    x === 10071 ||
    (x >= 10133 && x <= 10135) ||
    x === 10160 ||
    x === 10175 ||
    x === 11035 ||
    x === 11036 ||
    x === 11088 ||
    x === 11093 ||
    (x >= 11904 && x <= 11929) ||
    (x >= 11931 && x <= 12019) ||
    (x >= 12032 && x <= 12245) ||
    (x >= 12272 && x <= 12287) ||
    (x >= 12289 && x <= 12350) ||
    (x >= 12353 && x <= 12438) ||
    (x >= 12441 && x <= 12543) ||
    (x >= 12549 && x <= 12591) ||
    (x >= 12593 && x <= 12686) ||
    (x >= 12688 && x <= 12773) ||
    (x >= 12783 && x <= 12830) ||
    (x >= 12832 && x <= 12871) ||
    (x >= 12880 && x <= 42124) ||
    (x >= 42128 && x <= 42182) ||
    (x >= 43360 && x <= 43388) ||
    (x >= 44032 && x <= 55203) ||
    (x >= 63744 && x <= 64255) ||
    (x >= 65040 && x <= 65049) ||
    (x >= 65072 && x <= 65106) ||
    (x >= 65108 && x <= 65126) ||
    (x >= 65128 && x <= 65131) ||
    (x >= 94176 && x <= 94180) ||
    (x >= 94192 && x <= 94198) ||
    (x >= 94208 && x <= 101589) ||
    (x >= 101631 && x <= 101662) ||
    (x >= 101760 && x <= 101874) ||
    (x >= 110576 && x <= 110579) ||
    (x >= 110581 && x <= 110587) ||
    x === 110589 ||
    x === 110590 ||
    (x >= 110592 && x <= 110882) ||
    x === 110898 ||
    (x >= 110928 && x <= 110930) ||
    x === 110933 ||
    (x >= 110948 && x <= 110951) ||
    (x >= 110960 && x <= 111355) ||
    (x >= 119552 && x <= 119638) ||
    (x >= 119648 && x <= 119670) ||
    x === 126980 ||
    x === 127183 ||
    x === 127374 ||
    (x >= 127377 && x <= 127386) ||
    (x >= 127488 && x <= 127490) ||
    (x >= 127504 && x <= 127547) ||
    (x >= 127552 && x <= 127560) ||
    x === 127568 ||
    x === 127569 ||
    (x >= 127584 && x <= 127589) ||
    (x >= 127744 && x <= 127776) ||
    (x >= 127789 && x <= 127797) ||
    (x >= 127799 && x <= 127868) ||
    (x >= 127870 && x <= 127891) ||
    (x >= 127904 && x <= 127946) ||
    (x >= 127951 && x <= 127955) ||
    (x >= 127968 && x <= 127984) ||
    x === 127988 ||
    (x >= 127992 && x <= 128062) ||
    x === 128064 ||
    (x >= 128066 && x <= 128252) ||
    (x >= 128255 && x <= 128317) ||
    (x >= 128331 && x <= 128334) ||
    (x >= 128336 && x <= 128359) ||
    x === 128378 ||
    x === 128405 ||
    x === 128406 ||
    x === 128420 ||
    (x >= 128507 && x <= 128591) ||
    (x >= 128640 && x <= 128709) ||
    x === 128716 ||
    (x >= 128720 && x <= 128722) ||
    (x >= 128725 && x <= 128728) ||
    (x >= 128732 && x <= 128735) ||
    x === 128747 ||
    x === 128748 ||
    (x >= 128756 && x <= 128764) ||
    (x >= 128992 && x <= 129003) ||
    x === 129008 ||
    (x >= 129292 && x <= 129338) ||
    (x >= 129340 && x <= 129349) ||
    (x >= 129351 && x <= 129535) ||
    (x >= 129648 && x <= 129660) ||
    (x >= 129664 && x <= 129674) ||
    (x >= 129678 && x <= 129734) ||
    x === 129736 ||
    (x >= 129741 && x <= 129756) ||
    (x >= 129759 && x <= 129770) ||
    (x >= 129775 && x <= 129784) ||
    (x >= 131072 && x <= 196605) ||
    (x >= 196608 && x <= 262141)
  );
}

// node_modules/.pnpm/get-east-asian-width@1.4.0/node_modules/get-east-asian-width/index.js
function validate(codePoint) {
  if (!Number.isSafeInteger(codePoint)) {
    throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
  }
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
  validate(codePoint);
  if (
    isFullWidth(codePoint) ||
    isWide(codePoint) ||
    (ambiguousAsWide && isAmbiguous(codePoint))
  ) {
    return 2;
  }
  return 1;
}
// node_modules/.pnpm/ansi-styles@6.2.3/node_modules/ansi-styles/index.js
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`,
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false,
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round(((red - 8) / 247) * 24) + 232;
        }
        return (
          16 +
          36 * Math.round((red / 255) * 5) +
          6 * Math.round((green / 255) * 5) +
          Math.round((blue / 255) * 5)
        );
      },
      enumerable: false,
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString]
            .map((character) => character + character)
            .join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [(integer >> 16) & 255, (integer >> 8) & 255, integer & 255];
      },
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = (remainder % 6) / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result =
          30 +
          ((Math.round(blue) << 2) |
            (Math.round(green) << 1) |
            Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false,
    },
    rgbToAnsi: {
      value: (red, green, blue) =>
        styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false,
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false,
    },
  });
  return styles;
}
var ANSI_BACKGROUND_OFFSET = 10,
  wrapAnsi16 =
    (offset = 0) =>
    (code) =>
      `\x1B[${code + offset}m`,
  wrapAnsi256 =
    (offset = 0) =>
    (code) =>
      `\x1B[${38 + offset};5;${code}m`,
  wrapAnsi16m =
    (offset = 0) =>
    (red, green, blue) =>
      `\x1B[${38 + offset};2;${red};${green};${blue}m`,
  styles = {
    modifier: {
      reset: [0, 0],
      // 21 isn't widely supported and 22 does the same thing
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      // Bright color
      blackBright: [90, 39],
      gray: [90, 39],
      // Alias of `blackBright`
      grey: [90, 39],
      // Alias of `blackBright`
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39],
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      // Bright color
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      // Alias of `bgBlackBright`
      bgGrey: [100, 49],
      // Alias of `bgBlackBright`
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49],
    },
  };
var ansiStyles = /** @__PURE__ */ assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/.pnpm/wrap-ansi@9.0.2/node_modules/wrap-ansi/index.js
function wrapAnsi2(string, columns, options) {
  return String(string)
    .normalize()
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => exec(line, columns, options))
    .join("\n");
}
var ESCAPES,
  END_CODE,
  ANSI_ESCAPE_BELL,
  ANSI_CSI,
  ANSI_OSC,
  ANSI_SGR_TERMINATOR,
  ANSI_ESCAPE_LINK,
  wrapAnsiCode,
  wrapAnsiHyperlink,
  wordLengths,
  wrapWord,
  stringVisibleTrimSpacesRight,
  exec;
var init_wrap_ansi = () => {
  ESCAPES = /* @__PURE__ */ (() => new Set(["\x1B", "\x9B"]))();
  END_CODE = 39;
  ANSI_ESCAPE_BELL = "\x07";
  ANSI_CSI = "[";
  ANSI_OSC = "]";
  ANSI_SGR_TERMINATOR = "m";
  ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
  wrapAnsiCode = (code) =>
    `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
  wrapAnsiHyperlink = (url) =>
    `${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
  wordLengths = (string) =>
    string.split(" ").map((character) => stringWidth(character));
  wrapWord = (rows, word, columns) => {
    const characters = [...word];
    let isInsideEscape = false;
    let isInsideLinkEscape = false;
    let visible = stringWidth(stripAnsi(rows.at(-1)));
    for (const [index, character] of characters.entries()) {
      const characterLength = stringWidth(character);
      if (visible + characterLength <= columns) {
        rows[rows.length - 1] += character;
      } else {
        rows.push(character);
        visible = 0;
      }
      if (ESCAPES.has(character)) {
        isInsideEscape = true;
        const ansiEscapeLinkCandidate = characters
          .slice(index + 1, index + 1 + ANSI_ESCAPE_LINK.length)
          .join("");
        isInsideLinkEscape = ansiEscapeLinkCandidate === ANSI_ESCAPE_LINK;
      }
      if (isInsideEscape) {
        if (isInsideLinkEscape) {
          if (character === ANSI_ESCAPE_BELL) {
            isInsideEscape = false;
            isInsideLinkEscape = false;
          }
        } else if (character === ANSI_SGR_TERMINATOR) {
          isInsideEscape = false;
        }
        continue;
      }
      visible += characterLength;
      if (visible === columns && index < characters.length - 1) {
        rows.push("");
        visible = 0;
      }
    }
    if (!visible && rows.at(-1).length > 0 && rows.length > 1) {
      rows[rows.length - 2] += rows.pop();
    }
  };
  stringVisibleTrimSpacesRight = (string) => {
    const words = string.split(" ");
    let last = words.length;
    while (last > 0) {
      if (stringWidth(words[last - 1]) > 0) {
        break;
      }
      last--;
    }
    if (last === words.length) {
      return string;
    }
    return words.slice(0, last).join(" ") + words.slice(last).join("");
  };
  exec = (string, columns, options = {}) => {
    if (options.trim !== false && string.trim() === "") {
      return "";
    }
    let returnValue = "";
    let escapeCode;
    let escapeUrl;
    const lengths = wordLengths(string);
    let rows = [""];
    for (const [index, word] of string.split(" ").entries()) {
      if (options.trim !== false) {
        rows[rows.length - 1] = rows.at(-1).trimStart();
      }
      let rowLength = stringWidth(rows.at(-1));
      if (index !== 0) {
        if (
          rowLength >= columns &&
          (options.wordWrap === false || options.trim === false)
        ) {
          rows.push("");
          rowLength = 0;
        }
        if (rowLength > 0 || options.trim === false) {
          rows[rows.length - 1] += " ";
          rowLength++;
        }
      }
      if (options.hard && lengths[index] > columns) {
        const remainingColumns = columns - rowLength;
        const breaksStartingThisLine =
          1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
        const breaksStartingNextLine = Math.floor(
          (lengths[index] - 1) / columns
        );
        if (breaksStartingNextLine < breaksStartingThisLine) {
          rows.push("");
        }
        wrapWord(rows, word, columns);
        continue;
      }
      if (
        rowLength + lengths[index] > columns &&
        rowLength > 0 &&
        lengths[index] > 0
      ) {
        if (options.wordWrap === false && rowLength < columns) {
          wrapWord(rows, word, columns);
          continue;
        }
        rows.push("");
      }
      if (rowLength + lengths[index] > columns && options.wordWrap === false) {
        wrapWord(rows, word, columns);
        continue;
      }
      rows[rows.length - 1] += word;
    }
    if (options.trim !== false) {
      rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
    }
    const preString = rows.join("\n");
    const pre = [...preString];
    let preStringIndex = 0;
    for (const [index, character] of pre.entries()) {
      returnValue += character;
      if (ESCAPES.has(character)) {
        const { groups } = new RegExp(
          `(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`
        ).exec(preString.slice(preStringIndex)) || { groups: {} };
        if (groups.code !== void 0) {
          const code2 = Number.parseFloat(groups.code);
          escapeCode = code2 === END_CODE ? void 0 : code2;
        } else if (groups.uri !== void 0) {
          escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
        }
      }
      const code = ansi_styles_default.codes.get(Number(escapeCode));
      if (pre[index + 1] === "\n") {
        if (escapeUrl) {
          returnValue += wrapAnsiHyperlink("");
        }
        if (escapeCode && code) {
          returnValue += wrapAnsiCode(code);
        }
      } else if (character === "\n") {
        if (escapeCode && code) {
          returnValue += wrapAnsiCode(escapeCode);
        }
        if (escapeUrl) {
          returnValue += wrapAnsiHyperlink(escapeUrl);
        }
      }
      preStringIndex += character.length;
    }
    return returnValue;
  };
};

// node_modules/.pnpm/string-width@8.1.0/node_modules/string-width/index.js
var segmenter = /** @__PURE__ */ (() => new Intl.Segmenter())();
function baseVisible(segment) {
  return segment.replace(leadingNonPrintingRegex, "");
}
function isZeroWidthCluster(segment) {
  return zeroWidthClusterRegex.test(segment);
}
function trailingHalfwidthWidth(segment, eastAsianWidthOptions) {
  let extra = 0;
  if (segment.length > 1) {
    for (const char of segment.slice(1)) {
      if (char >= "\uFF00" && char <= "\uFFEF") {
        extra += eastAsianWidth(char.codePointAt(0), eastAsianWidthOptions);
      }
    }
  }
  return extra;
}
export function stringWidth(input, options = {}) {
  if (typeof input !== "string" || input.length === 0) {
    return 0;
  }
  const { ambiguousIsNarrow = true, countAnsiEscapeCodes = false } = options;
  let string = input;
  if (!countAnsiEscapeCodes) {
    string = stripAnsi(string);
  }
  if (string.length === 0) {
    return 0;
  }
  let width = 0;
  const eastAsianWidthOptions = { ambiguousAsWide: !ambiguousIsNarrow };
  for (const { segment } of segmenter.segment(string)) {
    if (isZeroWidthCluster(segment)) {
      continue;
    }
    if (rgiEmojiRegex.test(segment)) {
      width += 2;
      continue;
    }
    const codePoint = baseVisible(segment).codePointAt(0);
    width += eastAsianWidth(codePoint, eastAsianWidthOptions);
    width += trailingHalfwidthWidth(segment, eastAsianWidthOptions);
  }
  return width;
}
var zeroWidthClusterRegex =
    /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Mark}|\p{Surrogate})+$/v,
  leadingNonPrintingRegex =
    /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Mark}\p{Surrogate}]+/v,
  rgiEmojiRegex = /^\p{RGI_Emoji}$/v;

// src/wrap-ansi-pure.ts
export const wrapAnsi = /** @__PURE__ */ (() => (
  init_wrap_ansi(),
  wrapAnsi2
))();
