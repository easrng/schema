/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TSToJSONSchema } from "../dist/type-level.js";

type ExpectEqual<_ extends E, E> = never;

// ============================================================================
// Basic Primitives
// ============================================================================

type TestBoolean = ExpectEqual<TSToJSONSchema<boolean>, '{"type":"boolean"}'>;

type TestNumber = ExpectEqual<TSToJSONSchema<number>, '{"type":"number"}'>;

type TestString = ExpectEqual<TSToJSONSchema<string>, '{"type":"string"}'>;

type TestNull = ExpectEqual<TSToJSONSchema<null>, '{"type":"null"}'>;

// ============================================================================
// Literal Types
// ============================================================================

type TestBooleanLiteral = ExpectEqual<TSToJSONSchema<true>, '{"const":true}'>;

type TestBooleanLiteralFalse = ExpectEqual<
  TSToJSONSchema<false>,
  '{"const":false}'
>;

type TestNumberLiteral = ExpectEqual<TSToJSONSchema<42>, '{"const":42}'>;

type TestStringLiteral = ExpectEqual<
  TSToJSONSchema<"hello">,
  '{"const":"hello"}'
>;

// ============================================================================
// Special Types
// ============================================================================

type TestUnknown = ExpectEqual<TSToJSONSchema<unknown>, "{}">;

type TestNever = ExpectEqual<TSToJSONSchema<never>, '{"not":{}}'>;

type TestObject = ExpectEqual<TSToJSONSchema<object>, '{"type":"object"}'>;

// ============================================================================
// Unsupported Types
// ============================================================================

type TestFunction = ExpectEqual<
  TSToJSONSchema<() => void>,
  '{"error":"Functions cannot be represented in JSON Schema"}'
>;

type TestConstructor = ExpectEqual<
  TSToJSONSchema<new () => object>,
  '{"error":"Constructors cannot be represented in JSON Schema"}'
>;

type TestSymbol = ExpectEqual<
  TSToJSONSchema<symbol>,
  '{"error":"Symbols cannot be represented in JSON Schema"}'
>;

type TestBigInt = ExpectEqual<TSToJSONSchema<bigint>, '{"type":"bigint"}'>;

type TestBigIntLiteral = ExpectEqual<
  TSToJSONSchema<1n>,
  '{"type":"bigint","const":"1"}'
>;

type TestUndefined = ExpectEqual<
  TSToJSONSchema<undefined>,
  '{"type":"undefined"}'
>;

type TestVoid = ExpectEqual<TSToJSONSchema<void>, "{}">;

// ============================================================================
// Arrays
// ============================================================================

type TestArrayOfNumbers = ExpectEqual<
  TSToJSONSchema<number[]>,
  '{"type":"array","items":{"type":"number"}}'
>;

type TestArrayOfStrings = ExpectEqual<
  TSToJSONSchema<string[]>,
  '{"type":"array","items":{"type":"string"}}'
>;

type TestTuple = ExpectEqual<
  TSToJSONSchema<[number, string]>,
  '{"type":"array","additionalItems":false,"items":[{"type":"number"},{"type":"string"}]}'
>;

// TODO: [string, ...number[]] isn't the same as (string | number)[]

type TestEmptyTuple = ExpectEqual<
  TSToJSONSchema<[]>,
  '{"type":"array","additionalItems":false,"items":[]}'
>;

type TestTupleWithLiterals = ExpectEqual<
  TSToJSONSchema<[1, "hello", true]>,
  '{"type":"array","additionalItems":false,"items":[{"const":1},{"const":"hello"},{"const":true}]}'
>;

type TestArrayLike = ExpectEqual<
  TSToJSONSchema<ArrayLike<number>>,
  '{"type":"object","properties":{"length":{"type":"number"}},"patternProperties":{"^(?:-?(?:[1-9][0-9]{0,20}|0)(?:\\\\.[0-9]{0,5}[1-9])?|-[0-9](?:\\\\.[0-9]*[1-9])?e-(?:[7-9]|[1-9][0-9]+)|[0-9](?:\\\\.[0-9]*[1-9])?e\\\\+(?:2[1-9]|[3-9][0-9]|[1-9][0-9]{2,}))$":{"type":"number"}},"required":["length"]}'
>;

// ============================================================================
// Collections
// ============================================================================

type TestSet = ExpectEqual<
  TSToJSONSchema<Set<number>>,
  '{"type":"set","items":{"type":"number"}}'
>;

type TestMap = ExpectEqual<
  TSToJSONSchema<Map<{ a: 1 }, number>>,
  '{"type":"map","items":{"type":"array","additionalItems":false,"items":[{"type":"object","properties":{"a":{"const":1}},"required":["a"]},{"type":"number"}]}}'
>;

// ============================================================================
// Simple Objects
// ============================================================================

type TestEmptyObject = ExpectEqual<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  TSToJSONSchema<{}>,
  '{"not":{"type":"null"}}'
>;

type TestSimpleObject = ExpectEqual<
  TSToJSONSchema<{ a: number }>,
  '{"type":"object","properties":{"a":{"type":"number"}},"required":["a"]}'
>;

type TestObjectWithMultipleProps = ExpectEqual<
  TSToJSONSchema<{ a: number; b: string }>,
  '{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"string"}},"required":["a","b"]}'
>;

// ============================================================================
// Optional Properties
// ============================================================================
type TestOptionalProperty = ExpectEqual<
  TSToJSONSchema<{ a?: number }>,
  '{"type":"object","properties":{"a":{"type":"number"}}}'
>;

type TestMixedRequired = ExpectEqual<
  TSToJSONSchema<{ a: number; b?: string }>,
  '{"type":"object","properties":{"a":{"type":"number"},"b":{"type":"string"}},"required":["a"]}'
>;

type TestUndefinedUnion = ExpectEqual<
  TSToJSONSchema<{ a: number | undefined }>,
  '{"type":"object","properties":{"a":{"type":"number"}}}'
>;

// ============================================================================
// Pattern Properties (Index Signatures)
// ============================================================================

type TestIndexSignature = ExpectEqual<
  TSToJSONSchema<Record<string, string>>,
  '{"type":"object","additionalProperties":{"type":"string"}}'
>;

type TestPatternProperty = ExpectEqual<
  TSToJSONSchema<{ [key: `${string}@${string}`]: string }>,
  '{"type":"object","patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"type":"string"}}}'
>;

type TestMixedPropsAndPattern = ExpectEqual<
  TSToJSONSchema<{
    a: number;
    [key: `${string}@${string}`]: string;
  }>,
  '{"type":"object","properties":{"a":{"type":"number"}},"patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"type":"string"}},"required":["a"]}'
>;

// ============================================================================
// Union Types
// ============================================================================

type TestSimpleUnion = ExpectEqual<
  TSToJSONSchema<number | string>,
  '{"anyOf":[{"type":"number"},{"type":"string"}]}'
>;

type TestUnionWithNull = ExpectEqual<
  TSToJSONSchema<number | null>,
  '{"anyOf":[{"type":"null"},{"type":"number"}]}'
>;

type TestLiteralUnion = ExpectEqual<
  TSToJSONSchema<1 | 2 | 3>,
  '{"anyOf":[{"const":1},{"const":2},{"const":3}]}'
>;

type TestStringLiteralUnion = ExpectEqual<
  TSToJSONSchema<"a" | "b" | "c">,
  '{"anyOf":[{"const":"a"},{"const":"b"},{"const":"c"}]}'
>;

// ============================================================================
// Complex Nested Objects
// ============================================================================

type TestNestedObject = ExpectEqual<
  TSToJSONSchema<{ a: { b: number } }>,
  '{"type":"object","properties":{"a":{"type":"object","properties":{"b":{"type":"number"}},"required":["b"]}},"required":["a"]}'
>;

type TestObjectWithArray = ExpectEqual<
  TSToJSONSchema<{ items: number[] }>,
  '{"type":"object","properties":{"items":{"type":"array","items":{"type":"number"}}},"required":["items"]}'
>;

// ============================================================================
// Complex Example from Original Code
// ============================================================================

type TestComplexExample = ExpectEqual<
  TSToJSONSchema<{
    a: 1;
    b: 2 | undefined;
    c?: null;
    d: null;
    [_: `${string}@${string}`]: "email";
  }>,
  '{"type":"object","properties":{"a":{"const":1},"b":{"const":2},"c":{"type":"null"},"d":{"type":"null"}},"patternProperties":{"^[\\\\s\\\\S]*@[\\\\s\\\\S]*$":{"const":"email"}},"required":["a","d"]}'
>;

type Email = ExpectEqual<
  TSToJSONSchema<`${string}@${string}}`>,
  '{"type":"string","pattern":"^[\\\\s\\\\S]*@[\\\\s\\\\S]*\\\\}$"}'
>;

// ============================================================================
// Edge Cases
// ============================================================================

type TestReadonlyArray = ExpectEqual<
  TSToJSONSchema<readonly number[]>,
  '{"type":"array","items":{"type":"number"}}'
>;

type TestReadonlyTuple = ExpectEqual<
  TSToJSONSchema<readonly [number, string]>,
  '{"type":"array","additionalItems":false,"items":[{"type":"number"},{"type":"string"}]}'
>;

type TestUnionWithMultipleTypes = ExpectEqual<
  TSToJSONSchema<string | number | boolean | null>,
  '{"anyOf":[{"type":"boolean"},{"type":"null"},{"type":"number"},{"type":"string"}]}'
>;

type TestNestedUnion = ExpectEqual<
  TSToJSONSchema<{ a: number | string | null }>,
  '{"type":"object","properties":{"a":{"anyOf":[{"type":"null"},{"type":"number"},{"type":"string"}]}},"required":["a"]}'
>;
