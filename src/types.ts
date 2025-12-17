export interface InputSchemaBase {
  not?: { type?: "null" };
  type?: "boolean" | "number" | "string" | "null" | "array" | "object";
  pattern?: string;
  anyOf?: this[];
  properties?: Record<string, this>;
  patternProperties?: Record<string, this>;
  additionalProperties?: this;
  required?: string[];
  error?: string;
}
export interface InputSchema extends InputSchemaBase {
  items?: this | this[];
  additionalItems?: false;
  const?: boolean | number | string;
}
export interface InputSchema4 extends InputSchemaBase {
  items?: this | this[];
  additionalItems?: false;
  enum?: [boolean | number | string];
}
export interface InputSchema2020 extends InputSchemaBase {
  items?: this;
  prefixItems?: this[];
  additionalItems?: false;
  const?: boolean | number | string;
}
