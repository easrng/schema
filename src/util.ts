import type * as Standard from "./standard.js";

export function is<Schema extends Standard.SchemaV1>(
  schema: Schema,
  value: unknown,
): value is Standard.TypedV1.InferInput<Schema> {
  const result = schema["~standard"].validate(value);
  if ("then" in result && typeof result.then === "function") {
    throw new TypeError("unexpected async schema");
  }
  return !(result as Awaited<typeof result>).issues;
}
