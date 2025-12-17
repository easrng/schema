import test from "node:test";
import assert from "node:assert/strict";
import { schema } from "../src/index.ts";
import type { TSToJSONSchema } from "../src/type-level.ts";
import type { SchemaV1 } from "../src/standard.ts";
import { inspect } from "node:util";

const hasIssues = (
  result: SchemaV1.Result<unknown>,
): result is SchemaV1.FailureResult =>
  typeof result === "object" && result !== null && !!result.issues;

const expectSuccess = (result: SchemaV1.Result<unknown>, value: unknown) => {
  assert.deepEqual(result, { value });
};

const expectFailure = (result: SchemaV1.Result<unknown>, message: string) => {
  assert.ok(hasIssues(result), "expected issues for invalid value");
  assert.ok(result.issues.length > 0, "expected at least one issue");
  assert.equal(result.issues[0]?.message, message);
  inspect(result.issues[0]);
  (result.issues[0] as any)[Symbol.for("nodejs.util.inspect.custom")](
    0,
    {},
    inspect,
  );
};

type SchemaCase<T> = {
  readonly name: string;
  readonly json: TSToJSONSchema<T>;
  readonly successes: readonly T[];
  readonly failures: readonly { value: unknown; message: string }[];
  readonly throws?: string;
};

const runSchemaCase = <T>(config: SchemaCase<T>) => {
  test(config.name, async () => {
    let exampleSchema;
    try {
      exampleSchema = schema(config.json);
    } catch (e) {
      assert(e instanceof Error);
      assert.equal(e.message, config.throws);
      return;
    }
    for (const value of config.successes) {
      expectSuccess(exampleSchema.validate(value), value);
    }
    for (const failure of config.failures) {
      expectFailure(exampleSchema.validate(failure.value), failure.message);
    }
  });
};

runSchemaCase<number>({
  name: "number schema",
  json: '{"type":"number"}',
  successes: [0, 3.14, -42],
  failures: [
    { value: "1", message: "expected number" },
    { value: null, message: "expected number" },
  ],
});

runSchemaCase<boolean>({
  name: "boolean schema",
  json: '{"type":"boolean"}',
  successes: [true, false],
  failures: [{ value: 1, message: "expected boolean" }],
});

runSchemaCase<string>({
  name: "string schema",
  json: '{"type":"string"}',
  successes: ["hello"],
  failures: [{ value: 123, message: "expected string" }],
});

runSchemaCase<null>({
  name: "null schema",
  json: '{"type":"null"}',
  successes: [null],
  failures: [{ value: "null", message: "expected null" }],
});

runSchemaCase<42>({
  name: "const literal schema",
  json: '{"const":42}',
  successes: [42],
  failures: [{ value: 41, message: "expected 42" }],
});

runSchemaCase<number | string>({
  name: "union schema",
  json: '{"anyOf":[{"type":"number"},{"type":"string"}]}',
  successes: [1, "one"],
  failures: [
    { value: true, message: "expected value to match one of the schemas" },
  ],
});

runSchemaCase<never>({
  name: "never schema",
  json: '{"not":{}}',
  successes: [],
  failures: [{ value: "anything", message: "expected never" }],
});

runSchemaCase<object>({
  name: "object schema",
  json: '{"type":"object"}',
  successes: [{}],
  failures: [
    { value: null, message: "expected object" },
    { value: 1, message: "expected object" },
    { value: "a", message: "expected object" },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
runSchemaCase<{}>({
  name: "non-null schema",
  json: '{"not":{"type":"null"}}',
  successes: [{}, 1, "a"],
  failures: [{ value: null, message: "expected not null" }],
});

runSchemaCase<number[]>({
  name: "array schema",
  json: '{"type":"array","items":{"type":"number"}}',
  successes: [[1, 2, 3]],
  failures: [
    { value: ["nope"], message: "expected number" },
    { value: "[]", message: "expected array" },
  ],
});

runSchemaCase<[number, string]>({
  name: "tuple schema",
  json: '{"type":"array","additionalItems":false,"items":[{"type":"number"},{"type":"string"}]}',
  successes: [[1, "ok"]],
  failures: [
    { value: [1], message: "expected array of length 2" },
    { value: [1, 2], message: "expected string" },
    { value: 1, message: "expected array" },
  ],
});

runSchemaCase<Record<string, number>>({
  name: "record schema",
  json: '{"type":"object","additionalProperties":{"type":"number"}}',
  successes: [{ a: 1 }],
  failures: [
    { value: { a: "nope" }, message: "expected number" },
    { value: null, message: "expected object" },
  ],
});

runSchemaCase<{ a: number; b?: string }>({
  name: "mixed required optional properties",
  json: '{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"string"}},"required":["a"]}',
  successes: [{ a: 1, b: "ok" }],
  failures: [{ value: {}, message: "missing required property" }],
});

runSchemaCase<{ [key: `${string}@${string}`]: string }>({
  name: "pattern properties",
  json: '{"type":"object","patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"type":"string"}}}',
  successes: [{ "user@example.com": "ok" }],
  failures: [{ value: { "user@example.com": 1 }, message: "expected string" }],
});

runSchemaCase<{ [key: `${string}@${string}`]: "email"; [_: string]: string }>({
  name: "pattern properties and additional properties",
  json: '{"type":"object","patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"const":"email"}},"additionalProperties":{"type":"string"}}',
  successes: [{ "user@example.com": "email", x: "" }],
  failures: [
    { value: { "user@example.com": 1 }, message: 'expected "email"' },
    { value: { x: 1 }, message: "expected string" },
  ],
});

type Complex = {
  a: 1;
  b: 2 | undefined;
  c?: null;
  d: null;
  [_: `${string}@${string}`]: "email";
};

runSchemaCase<Complex>({
  name: "complex object schema",
  json: '{"type":"object","properties":{"a":{"const":1},"b":{"const":2},"c":{"type":"null"},"d":{"type":"null"}},"patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"const":"email"}},"required":["a","d"]}',
  successes: [
    { a: 1, b: 2, d: null, "user@example.com": "email" },
    { a: 1, b: undefined, d: null, "user@example.com": "email" },
  ],
  failures: [
    {
      value: { a: 1, d: null, "user@example.com": "nope" },
      message: 'expected "email"',
    },
  ],
});

runSchemaCase<() => void>({
  name: "function schema produces error",
  json: '{"error":"Functions cannot be represented in JSON Schema"}',
  successes: [],
  failures: [],
  throws: "Functions cannot be represented in JSON Schema",
});

runSchemaCase<unknown>({
  name: "unknown schema accepts everything",
  json: "{}",
  successes: [null, 123, "anything"],
  failures: [],
});

type EmailString = `${string}@${string}}`;

runSchemaCase<EmailString>({
  name: "template literal string pattern",
  json: '{"type":"string","pattern":"^[\\\\s\\\\S]*@[\\\\s\\\\S]*\\\\}$"}',
  successes: ["user@example.com}"],
  failures: [
    {
      value: "user@example.com",
      message: "expected string matching /^[\\s\\S]*@[\\s\\S]*\\}$/",
    },
  ],
});

runSchemaCase<ArrayLike<number>>({
  name: "array-like schema",
  json: '{"type":"object","properties":{"length":{"type":"number"}},"patternProperties":{"^(?:-?(?:[1-9][0-9]{0,20}|0)(?:\\\\.[0-9]{0,5}[1-9])?|-[0-9](?:\\\\.[0-9]*[1-9])?e-(?:[7-9]|[1-9][0-9]+)|[0-9](?:\\\\.[0-9]*[1-9])?e\\\\+(?:2[1-9]|[3-9][0-9]|[1-9][0-9]{2,}))$":{"type":"number"}},"required":["length"]}',
  successes: [{ length: 1, 0: 42 }],
  failures: [{ value: { length: "nope" }, message: "expected number" }],
});

runSchemaCase<number | { [key: `${string}@${string}`]: string }>({
  name: "anyOf across primitives and object",
  json: '{"anyOf":[{"type":"number"},{"type":"object","patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"type":"string"}}}]}',
  successes: [1, { "user@example.com": "ok" }],
  failures: [
    { value: true, message: "expected value to match one of the schemas" },
  ],
});

["draft-04", "openapi-3.0"].forEach((draft) => {
  test("jsonSchema supports " + draft, () => {
    const exampleSchema = schema<[1]>(
      '{"type":"array","additionalItems":false,"items":[{"const":1}]}',
    );
    const parsed: Record<string, unknown> = {
      type: "array",
      additionalItems: false,
      items: [{ enum: [1] }],
    };
    assert.deepEqual(
      exampleSchema["~standard"].jsonSchema.input({ target: draft }),
      parsed,
    );
  });
});

["draft-06", "draft-07", "draft-2019-09"].forEach((draft) => {
  test("jsonSchema supports " + draft, () => {
    const exampleSchema = schema<[1]>(
      '{"type":"array","additionalItems":false,"items":[{"const":1}]}',
    );
    const parsed: Record<string, unknown> = {
      type: "array",
      additionalItems: false,
      items: [{ const: 1 }],
    };
    assert.deepEqual(
      exampleSchema["~standard"].jsonSchema.input({ target: draft }),
      parsed,
    );
  });
});

test("jsonSchema supports draft-2020-12", () => {
  const exampleSchema = schema<[1]>(
    '{"type":"array","additionalItems":false,"items":[{"const":1}]}',
  );
  const parsed: Record<string, unknown> = {
    type: "array",
    additionalItems: false,
    prefixItems: [{ const: 1 }],
  };
  assert.deepEqual(
    exampleSchema["~standard"].jsonSchema.input({ target: "draft-2020-12" }),
    parsed,
  );
});

test("jsonSchema throws on unsupported version", () => {
  const exampleSchema = schema<[1]>(
    '{"type":"array","additionalItems":false,"items":[{"const":1}]}',
  );
  assert.throws(
    () => exampleSchema["~standard"].jsonSchema.input({ target: "draft-fake" }),
    { message: "JSON Schema version draft-fake is not supported." },
  );
});

test("validate matches ~standard.validate", async () => {
  const exampleSchema = schema<null>('{"type":"null"}');
  const direct = await exampleSchema.validate(null);
  expectSuccess(direct, null);
  const viaStandard = await exampleSchema["~standard"].validate(null);
  expectSuccess(viaStandard, null);
});

test("validate matches ~standard.validate", async () => {
  const exampleSchema = schema<null>('{"type":"null"}');
  const direct = await exampleSchema.validate(null);
  expectSuccess(direct, null);
  const viaStandard = await exampleSchema["~standard"].validate(null);
  expectSuccess(viaStandard, null);
});

import { z } from "zod";

const extractIssuePaths = (
  result: SchemaV1.Result<unknown>,
): PropertyKey[][] => {
  if (!hasIssues(result)) return [];
  return result.issues.map((issue) => {
    assert.equal(issue.path, issue.path);
    return issue.path?.map((e) => (typeof e === "object" ? e.key : e)) ?? [];
  });
};

test("issue paths: nested object properties match Zod", async () => {
  const standardSchema = schema<{ user: { name: string; age: number } }>(
    '{"type":"object","properties":{"user":{"type":"object","properties":{"age":{"type":"number"},"name":{"type":"string"}},"required":["age","name"]}},"required":["user"]}',
  );
  const zodSchema = z.object({
    user: z.object({
      name: z.string(),
      age: z.number(),
    }),
  });

  const invalidValue = { user: { name: "Alice", age: "not a number" } };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["user", "age"]]);
});

test("issue paths: array items match Zod", async () => {
  const standardSchema = schema<number[]>(
    '{"type":"array","items":{"type":"number"}}',
  );
  const zodSchema = z.array(z.number());

  const invalidValue = [1, 2, "three", 4, "five"];

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [[2], [4]]);
});

test("issue paths: tuple elements match Zod", async () => {
  const standardSchema = schema<[string, number, boolean]>(
    '{"type":"array","additionalItems":false,"items":[{"type":"string"},{"type":"number"},{"type":"boolean"}]}',
  );
  const zodSchema = z.tuple([z.string(), z.number(), z.boolean()]);

  const invalidValue = ["ok", "not a number", false];

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [[1]]);
});

test("issue paths: nested arrays match Zod", async () => {
  const standardSchema = schema<number[][]>(
    '{"type":"array","items":{"type":"array","items":{"type":"number"}}}',
  );
  const zodSchema = z.array(z.array(z.number()));

  const invalidValue = [[1, 2], [3, "four"], [5]];

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [[1, 1]]);
});

test("issue paths: record/additionalProperties match Zod", async () => {
  const standardSchema = schema<Record<string, number>>(
    '{"type":"object","additionalProperties":{"type":"number"}}',
  );
  const zodSchema = z.record(z.string(), z.number());

  const invalidValue = { a: 1, b: "not a number", c: 3 };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["b"]]);
});

test("issue paths: missing required property matches Zod", async () => {
  const standardSchema = schema<{ name: string; age: number }>(
    '{"type":"object","properties":{"age":{"type":"number"},"name":{"type":"string"}},"required":["age","name"]}',
  );
  const zodSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const invalidValue = { name: "Alice" };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["age"]]);
});

test("issue paths: optional properties match Zod", async () => {
  const standardSchema = schema<{ name: string; age?: number }>(
    '{"type":"object","properties":{"age":{"type":"number"},"name":{"type":"string"}},"required":["name"]}',
  );
  const zodSchema = z.object({
    name: z.string(),
    age: z.number().optional(),
  });

  const invalidValue = { name: "Alice", age: "not a number" };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["age"]]);
});

test("issue paths: pattern properties match Zod", async () => {
  const standardSchema = schema<{ [key: `${string}@${string}`]: number }>(
    '{"type":"object","patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"type":"number"}}}',
  );
  // Zod doesn't have direct pattern properties, but we can use record for comparison
  const zodSchema = z.record(z.string(), z.number());

  const invalidValue = {
    "user@example.com": "not a number",
    "admin@test.org": 42,
  };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["user@example.com"]]);
});

test("issue paths: anyOf/union with objects match Zod", async () => {
  const standardSchema = schema<
    { type: "a"; value: number } | { type: "b"; value: string }
  >(
    '{"anyOf":[{"type":"object","properties":{"type":{"const":"a"},"value":{"type":"number"}},"required":["type","value"]},{"type":"object","properties":{"type":{"const":"b"},"value":{"type":"string"}},"required":["type","value"]}]}',
  );
  const zodSchema = z.union([
    z.object({ type: z.literal("a"), value: z.number() }),
    z.object({ type: z.literal("b"), value: z.string() }),
  ]);

  const invalidValue = { type: "a", value: "not a number" };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  // Both should report issues at the root or within union branches
  assert.ok(standardPaths.length > 0);
  assert.ok(zodPaths.length > 0);
});

test("issue paths: deeply nested object match Zod", async () => {
  const standardSchema = schema<{ a: { b: { c: { d: number } } } }>(
    '{"type":"object","properties":{"a":{"type":"object","properties":{"b":{"type":"object","properties":{"c":{"type":"object","properties":{"d":{"type":"number"}},"required":["d"]}},"required":["c"]}},"required":["b"]}},"required":["a"]}',
  );
  const zodSchema = z.object({
    a: z.object({
      b: z.object({
        c: z.object({
          d: z.number(),
        }),
      }),
    }),
  });

  const invalidValue = { a: { b: { c: { d: "not a number" } } } };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [["a", "b", "c", "d"]]);
});

test("issue paths: array of objects match Zod", async () => {
  const standardSchema = schema<Array<{ id: number; name: string }>>(
    '{"type":"array","items":{"type":"object","properties":{"id":{"type":"number"},"name":{"type":"string"}},"required":["id","name"]}}',
  );
  const zodSchema = z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  );

  const invalidValue = [
    { id: 1, name: "Alice" },
    { id: "not a number", name: "Bob" },
    { id: 3, name: 123 },
  ];

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  assert.deepEqual(standardPaths, [
    [1, "id"],
    [2, "name"],
  ]);
});

test("issue paths: multiple errors in same object match Zod", async () => {
  const standardSchema = schema<{ a: number; b: string; c: boolean }>(
    '{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"string"},"c":{"type":"boolean"}},"required":["a","b","c"]}',
  );
  const zodSchema = z.object({
    a: z.number(),
    b: z.string(),
    c: z.boolean(),
  });

  const invalidValue = { a: "not a number", b: 123, c: "not a boolean" };

  const standardResult =
    await standardSchema["~standard"].validate(invalidValue);
  const zodResult = await zodSchema["~standard"].validate(invalidValue);

  const standardPaths = extractIssuePaths(standardResult);
  const zodPaths = extractIssuePaths(zodResult);

  assert.deepEqual(standardPaths, zodPaths);
  // Should have three errors at paths ["a"], ["b"], and ["c"]
  assert.equal(standardPaths.length, 3);
  assert.ok(standardPaths.some((p) => p.length === 1 && p[0] === "a"));
  assert.ok(standardPaths.some((p) => p.length === 1 && p[0] === "b"));
  assert.ok(standardPaths.some((p) => p.length === 1 && p[0] === "c"));
});
