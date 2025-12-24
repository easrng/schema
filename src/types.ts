export interface InputSchemaBase {
  not?: { type?: "null" };
  pattern?: string;
  anyOf?: this[];
  properties?: Record<string, this>;
  patternProperties?: Record<string, this>;
  additionalProperties?: this;
  required?: string[];
  error?: string;
}
export interface InputSchema extends InputSchemaBase {
  type?:
    | "boolean"
    | "number"
    | "string"
    | "null"
    | "array"
    | "object"
    | "bigint"
    | "map"
    | "set"
    | "undefined";
  items?: this | this[];
  additionalItems?: false;
  const?: boolean | number | string;
}
export interface InputSchema7 extends InputSchemaBase {
  type?: "boolean" | "number" | "string" | "null" | "array" | "object";
  items?: this | this[];
  additionalItems?: false;
  const?: boolean | number | string;
}
export interface InputSchema4 extends InputSchemaBase {
  type?: "boolean" | "number" | "string" | "null" | "array" | "object";
  items?: this | this[];
  additionalItems?: false;
  enum?: [boolean | number | string];
}
export interface InputSchema2020 extends InputSchemaBase {
  type?: "boolean" | "number" | "string" | "null" | "array" | "object";
  items?: this;
  prefixItems?: this[];
  additionalItems?: false;
  const?: boolean | number | string;
}
