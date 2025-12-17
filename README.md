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
import { schema, Schema } from "@easrng/schema";

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
import { schema, Schema } from "@easrng/schema";

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
