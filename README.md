# @easrng/schema

Create efficient runtime validators from your TypeScript types, right in your editor, with idiomatic isolatedDeclarations support.

## Installation

```bash
pnpm install @easrng/schema
# or
npm install @easrng/schema
# or
yarn add @easrng/schema
```

## Usage

Write your TypeScript type:

```ts
interface MySchema {
  hello: "world";
}
```

Declare a schema, then autocomplete the string:

```ts
import { schema, type Schema } from "@easrng/schema";

interface MySchema {
  hello: "world";
}
const mySchema: Schema<MySchema> = schema("│");
//                                        ╭^──────────────────┄┄
//                                        │ '{"type":"object"…
//                                        ╰─────────────────┄┄┄
```

Use your new schema:

```ts
import { schema, type Schema } from "@easrng/schema";

interface MySchema {
  hello: "world";
}
const mySchema: Schema<MySchema> = schema(
  '{"type":"object","properties":{"hello":{"const":"world"}},"required":["hello"]}',
);
const result = mySchema.validate(0);
if (result.issues) {
  console.error(result.issues);
} else {
  console.log(result.value);
}
```

## Standard Schema utilities

This package also provides helper functions for any Standard Schema:

```ts
import { is } from "@easrng/schema/util";
const s = "some string" as unknown;
if (is(stringSchema, s)) {
  console.log("works with TypeScript");
  void s;
  //   ^? const s: string
}
```

```ts
import { assert } from "@easrng/schema/pretty";
import { schema, type Schema } from "@easrng/schema";

const mySchema: Schema<{ prop: number }> = schema(
  '{"type":"object","properties":{"prop":{"type":"number"}},"required":["prop"]}',
);
assert(mySchema, {
  prop: "invalid value",
});

/**
 * Prints:
 *
 *  × Schema validation failed:
 *  ╭──┄┄
 *  │ {
 *  │   prop: 'invalid value'
 *  ┊        ╶───────┬───────╴
 *  ┊                ╰─ expected number
 *  │ }
 *  ╰──┄┄
 *
 */
```
