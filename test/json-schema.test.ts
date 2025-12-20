/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputSchema, InputSchema2020 } from "../dist/types.js";
import type { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema";
import type { JSONSchema as JSONSchema7Alt } from "json-schema-typed/draft-07";
import type { JSONSchema as JSONSchema2019 } from "json-schema-typed/draft-2019-09";
import type { JSONSchema as JSONSchema2020 } from "json-schema-typed/draft-2020-12";

type ConcreteKeys<T> = keyof {
  [K in keyof T as K extends string
    ? string extends K
      ? never
      : K
    : never]: never;
};

const inputSchema = {} as InputSchema;
const _supports4: [JSONSchema4, "error" | "const"] = [
  inputSchema,
  "" as Exclude<keyof InputSchema, ConcreteKeys<Extract<JSONSchema4, object>>>,
];

const _supports6: [JSONSchema7, "error"] = [
  inputSchema,
  "" as Exclude<keyof InputSchema, ConcreteKeys<Extract<JSONSchema6, object>>>,
];
const _supports7: [JSONSchema7, "error"] = [
  inputSchema,
  "" as Exclude<keyof InputSchema, ConcreteKeys<Extract<JSONSchema7, object>>>,
];
const _supports7Alt: [JSONSchema7Alt, "error"] = [
  inputSchema,
  "" as Exclude<
    keyof InputSchema,
    ConcreteKeys<Extract<JSONSchema7Alt, object>>
  >,
];
const _supports2019: [JSONSchema2019, "error"] = [
  inputSchema,
  "" as Exclude<
    keyof InputSchema,
    ConcreteKeys<Extract<JSONSchema2019, object>>
  >,
];

const _supports2020: [JSONSchema2020, "error"] = [
  {} as InputSchema2020,
  "" as Exclude<
    keyof InputSchema,
    ConcreteKeys<Extract<JSONSchema2020, object>>
  >,
];
