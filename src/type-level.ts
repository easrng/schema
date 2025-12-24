/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToJSONSchema<
  T,
  Acc extends readonly string[] = [],
  L = Union.LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N
  ? `{"anyOf":[${Tuple.Join<Acc, ",">}]}`
  : UnionToJSONSchema<Exclude<T, L>, Sort.Insert<TypeToJSONSchema<L>, Acc>>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type UnbrandPrimitive<T, P> = T extends P & (infer T extends {})
  ? T extends P
    ? T
    : P
  : T;
/* type SymbolNames = {
  [K in keyof SymbolConstructor as SymbolConstructor[K] extends symbol
    ? SymbolConstructor[K]
    : never]: K;
}; */
type Values<T> = T[keyof T];
type KeysOf<T> = T extends infer E
  ? Values<{
      [K in keyof E as TSToJSONSchema<K>]: [K];
    }>
  : never;
type TypeToJSONSchema<T> = [
  [T] extends [boolean]
    ? [boolean] extends [UnbrandPrimitive<T, boolean>]
      ? '{"type":"boolean"}'
      : `{"const":${T}}`
    : never,
  T extends number
    ? number extends UnbrandPrimitive<T, number>
      ? '{"type":"number"}'
      : `{"const":${T}}`
    : never,
  T extends string
    ? string extends UnbrandPrimitive<T, string>
      ? '{"type":"string"}'
      : String.ToJSONSchema<T>
    : never,
  T extends null ? '{"type":"null"}' : never,
  T extends bigint
    ? bigint extends UnbrandPrimitive<T, bigint>
      ? '{"type":"bigint"}'
      : `{"type":"bigint","const":"${T}"}`
    : never,
  T extends undefined ? `{"type":"undefined"}` : never,
  T extends undefined | bigint | null | string | number | boolean
    ? never
    : Equal<T, void> extends true
      ? // equivalent to unknown:
        //
        //   declare const f1: () => void
        //   const f2: () => unknown = f1
        //   const f3: () => void = f2
        //
        `{}`
      : Equal<[T, keyof T], [object, keyof object]> extends true
        ? 1 extends T
          ? '{"not":{"type":"null"}}'
          : '{"type":"object"}'
        : T extends readonly unknown[]
          ? Equal<T["length"], number> extends true
            ? `{"type":"array","items":${TSToJSONSchema<T[number]>}}`
            : `{"type":"array","additionalItems":false,"items":[${Tuple.Join<
                {
                  [K in keyof T]: K extends number | `${number}`
                    ? TSToJSONSchema<T[K]> extends infer E extends string
                      ? E
                      : never
                    : never;
                },
                ","
              >}]}`
          : T extends (...args: never[]) => unknown
            ? `{"error":"Functions cannot be represented in JSON Schema"}`
            : T extends new (...args: never[]) => unknown
              ? `{"error":"Constructors cannot be represented in JSON Schema"}`
              : T extends ReadonlyMap<infer K, infer V>
                ? `{"type":"map","items":${TSToJSONSchema<[K, V]>}}`
                : T extends ReadonlySet<infer V>
                  ? `{"type":"set","items":${TSToJSONSchema<V>}}`
                  : T extends symbol
                    ? `{"error":"Symbols cannot be represented in JSON Schema"}`
                    : `{"type":"object"${Properties<T>}${PatternProperties<T>}${AdditionalProperties<T>}${MaybeRequired<
                        UnionToKeys<
                          keyof {
                            [K in keyof T as [
                              Extract<T[K], undefined>,
                            ] extends [never]
                              ? String.ToKey<`${Exclude<K, symbol>}`>
                              : never]: never;
                          }
                        >
                      >}}`,
][number];
type MaybeRequired<T extends string> = T extends "[]" ? "" : `,"required":${T}`;
// eslint bug??
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AdditionalProperties<T> = {
  [K in keyof T as Equal<K, string> extends true ? "_" : never]: T[K];
} extends { _: infer T }
  ? `,"additionalProperties":${TSToJSONSchema<T>}`
  : "";
type Properties<
  T,
  Keys = KeysOf<T>,
  Acc extends readonly string[] = [],
  L = Union.LastOf<Keys>,
> = [Keys] extends [never]
  ? Acc extends []
    ? ""
    : `,"properties":{${Tuple.Join<Acc, ",">}}`
  : L extends [string | number]
    ? Properties<
        T,
        Exclude<Keys, L>,
        String.ToKey<`${Extract<L[0], string | number>}`> extends infer K
          ? [K] extends [never]
            ? Acc
            : Sort.Insert<
                `${K & string}:${TSToJSONSchema<
                  Exclude<T[L[0] & keyof T], undefined>
                >}`,
                Acc
              >
          : Acc
      >
    : Properties<T, Exclude<Keys, L>, Acc>;

type PatternProperties<
  T,
  Keys = KeysOf<T>,
  Acc extends readonly string[] = [],
  L = Union.LastOf<Keys>,
> = [Keys] extends [never]
  ? Acc extends []
    ? ""
    : `,"patternProperties":{${Tuple.Join<Acc, ",">}}`
  : L extends [string | number]
    ? PatternProperties<
        T,
        Exclude<Keys, L>,
        String.ToPatternKey<`${Extract<L[0], string | number>}`> extends infer K
          ? [K] extends [never]
            ? Acc
            : Sort.Insert<
                `${K & string}:${TSToJSONSchema<
                  Exclude<T[L[0] & keyof T], undefined>
                >}`,
                Acc
              >
          : Acc
      >
    : PatternProperties<T, Exclude<Keys, L>, Acc>;
type UnionToKeys<
  T extends readonly string[],
  Acc extends readonly string[] = [],
  L = Union.LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N
  ? `[${Tuple.Join<Acc, ",">}]`
  : UnionToKeys<
      Exclude<T, L>,
      L extends string | number ? Sort.Insert<Extract<L, string>, Acc> : Acc
    >;
export type TSToJSONSchema<T> = [unknown] extends [T]
  ? "{}"
  : [T] extends [never]
    ? `{"not":{}}`
    : Equal<T, Union.LastOf<T>> extends true
      ? TypeToJSONSchema<T>
      : UnionToJSONSchema<T>;
type Equal<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Sort {
  export type Insert<
    Element,
    Tuple extends readonly any[],
    Acc extends readonly any[] = [],
  > = Tuple extends readonly [infer Head, ...infer Tail]
    ? Compare<Element, Head> extends 1
      ? Insert<Element, Tail, readonly [...Acc, Head]>
      : readonly [...Acc, Element, ...Tuple]
    : readonly [...Acc, Element];
  interface ASCIIToBinary {
    "\u0000": "00000000";
    "\u0001": "00000001";
    "\u0002": "00000010";
    "\u0003": "00000011";
    "\u0004": "00000100";
    "\u0005": "00000101";
    "\u0006": "00000110";
    "\u0007": "00000111";
    "\u0008": "00001000";
    "\u0009": "00001001";
    "\u000a": "00001010";
    "\u000b": "00001011";
    "\u000c": "00001100";
    "\u000d": "00001101";
    "\u000e": "00001110";
    "\u000f": "00001111";
    "\u0010": "00010000";
    "\u0011": "00010001";
    "\u0012": "00010010";
    "\u0013": "00010011";
    "\u0014": "00010100";
    "\u0015": "00010101";
    "\u0016": "00010110";
    "\u0017": "00010111";
    "\u0018": "00011000";
    "\u0019": "00011001";
    "\u001a": "00011010";
    "\u001b": "00011011";
    "\u001c": "00011100";
    "\u001d": "00011101";
    "\u001e": "00011110";
    "\u001f": "00011111";
    "\u0020": "00100000";
    "\u0021": "00100001";
    "\u0022": "00100010";
    "\u0023": "00100011";
    "\u0024": "00100100";
    "\u0025": "00100101";
    "\u0026": "00100110";
    "\u0027": "00100111";
    "\u0028": "00101000";
    "\u0029": "00101001";
    "\u002a": "00101010";
    "\u002b": "00101011";
    "\u002c": "00101100";
    "\u002d": "00101101";
    "\u002e": "00101110";
    "\u002f": "00101111";
    "\u0030": "00110000";
    "\u0031": "00110001";
    "\u0032": "00110010";
    "\u0033": "00110011";
    "\u0034": "00110100";
    "\u0035": "00110101";
    "\u0036": "00110110";
    "\u0037": "00110111";
    "\u0038": "00111000";
    "\u0039": "00111001";
    "\u003a": "00111010";
    "\u003b": "00111011";
    "\u003c": "00111100";
    "\u003d": "00111101";
    "\u003e": "00111110";
    "\u003f": "00111111";
    "\u0040": "01000000";
    "\u0041": "01000001";
    "\u0042": "01000010";
    "\u0043": "01000011";
    "\u0044": "01000100";
    "\u0045": "01000101";
    "\u0046": "01000110";
    "\u0047": "01000111";
    "\u0048": "01001000";
    "\u0049": "01001001";
    "\u004a": "01001010";
    "\u004b": "01001011";
    "\u004c": "01001100";
    "\u004d": "01001101";
    "\u004e": "01001110";
    "\u004f": "01001111";
    "\u0050": "01010000";
    "\u0051": "01010001";
    "\u0052": "01010010";
    "\u0053": "01010011";
    "\u0054": "01010100";
    "\u0055": "01010101";
    "\u0056": "01010110";
    "\u0057": "01010111";
    "\u0058": "01011000";
    "\u0059": "01011001";
    "\u005a": "01011010";
    "\u005b": "01011011";
    "\u005c": "01011100";
    "\u005d": "01011101";
    "\u005e": "01011110";
    "\u005f": "01011111";
    "\u0060": "01100000";
    "\u0061": "01100001";
    "\u0062": "01100010";
    "\u0063": "01100011";
    "\u0064": "01100100";
    "\u0065": "01100101";
    "\u0066": "01100110";
    "\u0067": "01100111";
    "\u0068": "01101000";
    "\u0069": "01101001";
    "\u006a": "01101010";
    "\u006b": "01101011";
    "\u006c": "01101100";
    "\u006d": "01101101";
    "\u006e": "01101110";
    "\u006f": "01101111";
    "\u0070": "01110000";
    "\u0071": "01110001";
    "\u0072": "01110010";
    "\u0073": "01110011";
    "\u0074": "01110100";
    "\u0075": "01110101";
    "\u0076": "01110110";
    "\u0077": "01110111";
    "\u0078": "01111000";
    "\u0079": "01111001";
    "\u007a": "01111010";
    "\u007b": "01111011";
    "\u007c": "01111100";
    "\u007d": "01111101";
    "\u007e": "01111110";
    "\u007f": "01111111";
    "\u0080": "10000000";
    "\u0081": "10000001";
    "\u0082": "10000010";
    "\u0083": "10000011";
    "\u0084": "10000100";
    "\u0085": "10000101";
    "\u0086": "10000110";
    "\u0087": "10000111";
    "\u0088": "10001000";
    "\u0089": "10001001";
    "\u008a": "10001010";
    "\u008b": "10001011";
    "\u008c": "10001100";
    "\u008d": "10001101";
    "\u008e": "10001110";
    "\u008f": "10001111";
    "\u0090": "10010000";
    "\u0091": "10010001";
    "\u0092": "10010010";
    "\u0093": "10010011";
    "\u0094": "10010100";
    "\u0095": "10010101";
    "\u0096": "10010110";
    "\u0097": "10010111";
    "\u0098": "10011000";
    "\u0099": "10011001";
    "\u009a": "10011010";
    "\u009b": "10011011";
    "\u009c": "10011100";
    "\u009d": "10011101";
    "\u009e": "10011110";
    "\u009f": "10011111";
    "\u00a0": "10100000";
    "\u00a1": "10100001";
    "\u00a2": "10100010";
    "\u00a3": "10100011";
    "\u00a4": "10100100";
    "\u00a5": "10100101";
    "\u00a6": "10100110";
    "\u00a7": "10100111";
    "\u00a8": "10101000";
    "\u00a9": "10101001";
    "\u00aa": "10101010";
    "\u00ab": "10101011";
    "\u00ac": "10101100";
    "\u00ad": "10101101";
    "\u00ae": "10101110";
    "\u00af": "10101111";
    "\u00b0": "10110000";
    "\u00b1": "10110001";
    "\u00b2": "10110010";
    "\u00b3": "10110011";
    "\u00b4": "10110100";
    "\u00b5": "10110101";
    "\u00b6": "10110110";
    "\u00b7": "10110111";
    "\u00b8": "10111000";
    "\u00b9": "10111001";
    "\u00ba": "10111010";
    "\u00bb": "10111011";
    "\u00bc": "10111100";
    "\u00bd": "10111101";
    "\u00be": "10111110";
    "\u00bf": "10111111";
    "\u00c0": "11000000";
    "\u00c1": "11000001";
    "\u00c2": "11000010";
    "\u00c3": "11000011";
    "\u00c4": "11000100";
    "\u00c5": "11000101";
    "\u00c6": "11000110";
    "\u00c7": "11000111";
    "\u00c8": "11001000";
    "\u00c9": "11001001";
    "\u00ca": "11001010";
    "\u00cb": "11001011";
    "\u00cc": "11001100";
    "\u00cd": "11001101";
    "\u00ce": "11001110";
    "\u00cf": "11001111";
    "\u00d0": "11010000";
    "\u00d1": "11010001";
    "\u00d2": "11010010";
    "\u00d3": "11010011";
    "\u00d4": "11010100";
    "\u00d5": "11010101";
    "\u00d6": "11010110";
    "\u00d7": "11010111";
    "\u00d8": "11011000";
    "\u00d9": "11011001";
    "\u00da": "11011010";
    "\u00db": "11011011";
    "\u00dc": "11011100";
    "\u00dd": "11011101";
    "\u00de": "11011110";
    "\u00df": "11011111";
    "\u00e0": "11100000";
    "\u00e1": "11100001";
    "\u00e2": "11100010";
    "\u00e3": "11100011";
    "\u00e4": "11100100";
    "\u00e5": "11100101";
    "\u00e6": "11100110";
    "\u00e7": "11100111";
    "\u00e8": "11101000";
    "\u00e9": "11101001";
    "\u00ea": "11101010";
    "\u00eb": "11101011";
    "\u00ec": "11101100";
    "\u00ed": "11101101";
    "\u00ee": "11101110";
    "\u00ef": "11101111";
    "\u00f0": "11110000";
    "\u00f1": "11110001";
    "\u00f2": "11110010";
    "\u00f3": "11110011";
    "\u00f4": "11110100";
    "\u00f5": "11110101";
    "\u00f6": "11110110";
    "\u00f7": "11110111";
    "\u00f8": "11111000";
    "\u00f9": "11111001";
    "\u00fa": "11111010";
    "\u00fb": "11111011";
    "\u00fc": "11111100";
    "\u00fd": "11111101";
    "\u00fe": "11111110";
  }
  type Compare<A, B> = A extends B
    ? 0
    : A extends `${infer AFirst}${infer ARest}`
      ? B extends `${infer BFirst}${infer BRest}`
        ? AFirst extends BFirst
          ? Compare<ARest, BRest>
          : [AFirst, BFirst] extends ["0", "1"]
            ? -1 // '0' < '1'
            : [AFirst, BFirst] extends ["1", "0"]
              ? 1 // '1' > '0'
              : Compare<
                  AFirst extends keyof ASCIIToBinary
                    ? ASCIIToBinary[AFirst]
                    : "11111111",
                  BFirst extends keyof ASCIIToBinary
                    ? ASCIIToBinary[BFirst]
                    : "11111111"
                >
        : 1 // A is longer, B is empty
      : -1; // A is empty, B is longer
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace String {
  interface EscapeMap {
    "\u0000": "\\u0000";
    "\u0001": "\\u0001";
    "\u0002": "\\u0002";
    "\u0003": "\\u0003";
    "\u0004": "\\u0004";
    "\u0005": "\\u0005";
    "\u0006": "\\u0006";
    "\u0007": "\\u0007";
    "\u0008": "\\u0008";
    "\u0009": "\\u0009";
    "\u000a": "\\u000a";
    "\u000b": "\\u000b";
    "\u000c": "\\u000c";
    "\u000d": "\\u000d";
    "\u000e": "\\u000e";
    "\u000f": "\\u000f";
    "\u0010": "\\u0010";
    "\u0011": "\\u0011";
    "\u0012": "\\u0012";
    "\u0013": "\\u0013";
    "\u0014": "\\u0014";
    "\u0015": "\\u0015";
    "\u0016": "\\u0016";
    "\u0017": "\\u0017";
    "\u0018": "\\u0018";
    "\u0019": "\\u0019";
    "\u001a": "\\u001a";
    "\u001b": "\\u001b";
    "\u001c": "\\u001c";
    "\u001d": "\\u001d";
    "\u001e": "\\u001e";
    "\u001f": "\\u001f";
    "\\": "\\u005c";
    '"': "\\u0022";
  }
  export type Escape<
    String extends string,
    Acc extends string,
  > = String extends ""
    ? `"${Acc}"`
    : String extends `${infer Char}${infer Rest}`
      ? Escape<
          Rest,
          `${Acc}${Char extends keyof EscapeMap ? EscapeMap[Char] : Char}`
        >
      : never;
  interface TemplateTypeToRegexp {
    // any string
    string: "[\\\\s\\\\S]*";
    // match bigints that can be parsed by typescript infer
    bigint: "-?(?:[1-9][0-9]*|0)";
    // match numbers that can be parsed by typescript infer
    number: "(?:-?(?:[1-9][0-9]{0,20}|0)(?:\\\\.[0-9]{0,5}[1-9])?|-[0-9](?:\\\\.[0-9]*[1-9])?e-(?:[7-9]|[1-9][0-9]+)|[0-9](?:\\\\.[0-9]*[1-9])?e\\\\+(?:2[1-9]|[3-9][0-9]|[1-9][0-9]{2,}))";
  }

  type StringAcc = {
    literalAcc: string;
    regexpAcc: string;
    isRegexp: boolean;
  };

  type MakeStringAcc<T extends StringAcc> = T;

  type NeedsRegexpEscape =
    | "-"
    | "["
    | "]"
    | "{"
    | "}"
    | "("
    | ")"
    | "*"
    | "+"
    | "?"
    | "."
    | ","
    | "/"
    | "^"
    | "$"
    | "|"
    | "#";

  type AppendStringLike<
    Acc extends StringAcc,
    Value extends string,
  > = MakeStringAcc<
    Equal<Value, `${bigint}`> extends true
      ? {
          literalAcc: "";
          regexpAcc: `${Acc["regexpAcc"]}${TemplateTypeToRegexp["bigint"]}`;
          isRegexp: true;
        }
      : Equal<Value, `${number}`> extends true
        ? {
            literalAcc: "";
            regexpAcc: `${Acc["regexpAcc"]}${TemplateTypeToRegexp["number"]}`;
            isRegexp: true;
          }
        : Equal<Value, string> extends true
          ? {
              literalAcc: "";
              regexpAcc: `${Acc["regexpAcc"]}${TemplateTypeToRegexp["string"]}`;
              isRegexp: true;
            }
          : {
              literalAcc: Acc["isRegexp"] extends true
                ? ""
                : `${Acc["literalAcc"]}${Value extends keyof String.EscapeMap
                    ? String.EscapeMap[Value]
                    : Value}`;
              regexpAcc: `${Acc["regexpAcc"]}${Value extends keyof String.EscapeMap
                ? `\\${String.EscapeMap[Value]}`
                : Value extends NeedsRegexpEscape
                  ? `\\\\${Value}`
                  : Value}`;
              isRegexp: Acc["isRegexp"];
            }
  >;

  type FinalizeStringAcc<Acc extends StringAcc> = Acc["isRegexp"] extends true
    ? `{"type":"string","pattern":"^${Acc["regexpAcc"]}$"}`
    : `{"const":"${Acc["literalAcc"]}"}`;

  export type ToJSONSchema<
    T extends string,
    Acc extends StringAcc = {
      isRegexp: false;
      literalAcc: "";
      regexpAcc: "";
    },
  > = T extends ""
    ? FinalizeStringAcc<Acc>
    : T extends `${infer Head}${infer Rest}`
      ? String.ToJSONSchema<Rest, AppendStringLike<Acc, Head>>
      : FinalizeStringAcc<AppendStringLike<Acc, T>>;

  type FinalizeKeyAcc<Acc extends StringAcc> = Acc["isRegexp"] extends true
    ? never
    : `"${Acc["literalAcc"]}"`;

  export type ToKey<
    T extends string,
    Acc extends StringAcc = {
      isRegexp: false;
      literalAcc: "";
      regexpAcc: "";
    },
  > = T extends ""
    ? FinalizeKeyAcc<Acc>
    : T extends `${infer Head}${infer Rest}`
      ? String.ToKey<Rest, AppendStringLike<Acc, Head>>
      : FinalizeKeyAcc<AppendStringLike<Acc, T>>;

  type FinalizePatternKeyAcc<Acc extends StringAcc> =
    Acc["isRegexp"] extends true
      ? Acc["regexpAcc"] extends TemplateTypeToRegexp["string"]
        ? never
        : `"^${Acc["regexpAcc"]}$"`
      : never;

  export type ToPatternKey<
    T extends string,
    Acc extends StringAcc = {
      isRegexp: false;
      literalAcc: "";
      regexpAcc: "";
    },
  > = T extends ""
    ? FinalizePatternKeyAcc<Acc>
    : T extends `${infer Head}${infer Rest}`
      ? String.ToPatternKey<Rest, AppendStringLike<Acc, Head>>
      : FinalizePatternKeyAcc<AppendStringLike<Acc, T>>;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Union {
  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
  type NormalizeBoolean<T, U> = T extends boolean
    ? boolean extends Extract<U | T, boolean>
      ? boolean
      : T
    : T;
  export type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => infer R
      ? NormalizeBoolean<R, T>
      : never;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Tuple {
  export type Join<
    Tuple extends readonly string[],
    Delimiter extends string,
    Acc extends string = "",
  > = Tuple extends readonly [
    infer First extends string,
    ...infer Rest extends readonly string[],
  ]
    ? Rest extends readonly []
      ? `${Acc}${First}`
      : Join<Rest, Delimiter, `${Acc}${First}${Delimiter}`>
    : Acc;
}
