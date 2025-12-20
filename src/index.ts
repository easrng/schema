import type * as Standard from "./standard.js";
import type { TSToJSONSchema } from "./type-level.js";
import type { InputSchema, InputSchema2020, InputSchema4 } from "./types.js";
const head = Symbol();
class List<T> {
  #value: T | typeof head;
  #prev: List<T> | null;
  constructor(value: T | typeof head, prev: List<T> | null) {
    this.#value = value;
    this.#prev = prev;
  }
  push(value: T) {
    if (this.#value !== head) {
      this.#prev = new List(this.#value, this.#prev);
    }
    this.#value = value;
  }
  toArray() {
    const array = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: List<T> | null = this;
    while (current && current.#value !== head) {
      array.push(current.#value);
      current = current.#prev;
    }
    return array;
  }
  isHead() {
    return this.#value === head;
  }
  static head<T>(): List<T> {
    return new List<T>(head, null);
  }
}

interface Issue {
  readonly message: string;
  readonly path: List<PropertyKey> | null;
}

type Validator<Opts extends unknown[] = []> = (
  ..._: [
    ...Opts,
    path: List<PropertyKey> | null,
    value: unknown,
    issues: List<Issue>,
  ]
) => void;
type BoundValidator = (
  path: List<PropertyKey> | null,
  value: unknown,
  issues: List<Issue>,
) => void;

const nullValidator: Validator = (path, value, issues) =>
  value !== null && issues.push({ path, message: "expected null" });
const booleanValidator: Validator = (path, value, issues) =>
  typeof value !== "boolean" &&
  issues.push({ path, message: "expected boolean" });
const numberValidator: Validator = (path, value, issues) =>
  typeof value !== "number" &&
  issues.push({ path, message: "expected number" });
const stringValidator: Validator = (path, value, issues) =>
  typeof value !== "string" &&
  issues.push({ path, message: "expected string" });
const patternValidator: Validator<[pattern: RegExp]> = (
  pattern,
  path,
  value,
  issues,
) =>
  (typeof value !== "string" || !pattern.test(value)) &&
  issues.push({ path, message: `expected string matching ${pattern}` });
const constValidator: Validator<[expected: unknown]> = (
  expected,
  path,
  value,
  issues,
) =>
  value !== expected &&
  issues.push({ path, message: `expected ${JSON.stringify(expected)}` });
const anyOfValidator: Validator<[validators: BoundValidator[]]> = (
  validators,
  path,
  value,
  issues,
) => {
  for (let i = 0; i < validators.length; i++) {
    const localIssues: List<Issue> = List.head();
    validators[i]!(path, value, localIssues);
    if (localIssues.toArray().length === 0) return;
  }
  issues.push({ path, message: "expected value to match one of the schemas" });
};
const notNullValidator: Validator = (path, value, issues) =>
  value === null && issues.push({ path, message: "expected not null" });
const arrayValidator: Validator<[itemValidator: BoundValidator]> = (
  itemValidator,
  path,
  value,
  issues,
) => {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "expected array" });
    return;
  }
  for (let i = 0; i < value.length; i++) {
    itemValidator(new List(i, path), value[i], issues);
  }
};
const tupleValidator: Validator<[itemValidators: BoundValidator[]]> = (
  itemValidators,
  path,
  value,
  issues,
) => {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "expected array" });
    return;
  }
  if (value.length !== itemValidators.length) {
    issues.push({
      path,
      message: `expected array of length ${itemValidators.length}`,
    });
    return;
  }
  for (let i = 0; i < itemValidators.length; i++) {
    itemValidators[i]!(new List(i, path), value[i], issues);
  }
};
const objectValidator: Validator<
  [
    propValidators: Record<string, BoundValidator> | undefined,
    patternValidators: [RegExp, BoundValidator][] | undefined,
    additionalValidator: BoundValidator | undefined,
    required: string[] | undefined,
  ]
> = (
  propValidators,
  patternValidators,
  additionalValidator,
  required,
  path,
  value,
  issues,
) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    issues.push({ path, message: "expected object" });
    return;
  }
  const obj = value as Record<string, unknown>;
  if (required) {
    for (let i = 0; i < required.length; i++) {
      const key = required[i]!;
      if (!(key in obj)) {
        issues.push({
          path: new List(key, path),
          message: `missing required property`,
        });
      }
    }
  }
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    if (obj[key] === undefined) continue;
    const subpath = new List(key, path);
    if (propValidators && key in propValidators) {
      propValidators[key]!(subpath, obj[key], issues);
    } else if (patternValidators) {
      let matched = false;
      for (let j = 0; j < patternValidators.length; j++) {
        if (patternValidators[j]![0].test(key)) {
          patternValidators[j]![1](subpath, obj[key], issues);
          matched = true;
          break;
        }
      }
      if (!matched && additionalValidator) {
        additionalValidator(subpath, obj[key], issues);
      }
    } else if (additionalValidator) {
      additionalValidator(subpath, obj[key], issues);
    }
  }
};
const neverValidator: Validator = (path, _value, issues) =>
  issues.push({ path, message: "expected never" });
const noopValidator: BoundValidator = () => {};

function makeValidator(schema: InputSchema): BoundValidator {
  if (schema.error !== undefined) {
    throw new TypeError(schema.error);
  }
  if (schema.const !== undefined) {
    return constValidator.bind(null, schema.const);
  }
  if (schema.anyOf !== undefined) {
    const validators = schema.anyOf.map(makeValidator);
    return anyOfValidator.bind(null, validators);
  }
  if (schema.not !== undefined) {
    if (schema.not.type === "null") {
      return notNullValidator;
    }
    return neverValidator;
  }
  if (schema.type !== undefined) {
    switch (schema.type) {
      case "null":
        return nullValidator;
      case "boolean":
        return booleanValidator;
      case "number":
        return numberValidator;
      case "string":
        if (schema.pattern !== undefined) {
          return patternValidator.bind(null, new RegExp(schema.pattern));
        }
        return stringValidator;
      case "array":
        if (Array.isArray(schema.items)) {
          const validators = schema.items.map(makeValidator);
          return tupleValidator.bind(null, validators);
        }
        return arrayValidator.bind(null, makeValidator(schema.items!));
      case "object": {
        const propValidators = schema.properties
          ? Object.fromEntries(
              // eslint-disable-next-line no-restricted-syntax
              Object.entries(schema.properties).map(([k, v]) => [
                k,
                makeValidator(v),
              ]),
            )
          : undefined;
        const patternValidators = schema.patternProperties
          ? Object.entries(schema.patternProperties).map(
              // eslint-disable-next-line no-restricted-syntax
              ([pattern, s]) =>
                [new RegExp(pattern), makeValidator(s)] as [
                  RegExp,
                  BoundValidator,
                ],
            )
          : undefined;
        const additionalValidator = schema.additionalProperties
          ? makeValidator(schema.additionalProperties)
          : undefined;
        return objectValidator.bind(
          null,
          propValidators,
          patternValidators,
          additionalValidator,
          schema.required,
        );
      }
    }
  }
  return noopValidator;
}

const jsonSchema2020Replacer = (
  _key: string,
  value: InputSchema,
): InputSchema2020 => {
  if (Array.isArray(value.items)) {
    (value as Record<string, unknown>).prefixItems = value.items;
    delete value.items;
  }
  return value as InputSchema2020;
};
const jsonSchema4Replacer = (
  _key: string,
  value: InputSchema,
): InputSchema4 => {
  return value.const ? { enum: [value.const] } : value;
};
const genericConverter = (
  json: string,
  options: Standard.JSONSchemaV1.Options,
): Record<string, unknown> => {
  switch (options.target) {
    case "draft-2020-12":
      return JSON.parse(json, jsonSchema2020Replacer);
    case "draft-06":
    case "draft-07":
    case "draft-2019-09":
      return JSON.parse(json);
    case "draft-04":
    case "openapi-3.0":
      return JSON.parse(json, jsonSchema4Replacer);
    default:
      throw new Error(
        "JSON Schema version " + options.target + " is not supported.",
      );
  }
};

const StandardIssue = /** @__PURE__ */ (() =>
  class StandardIssue {
    message: string;
    #path: List<PropertyKey> | null;
    #pathArray?: PropertyKey[] | undefined | null;
    constructor(message: string, path: List<PropertyKey> | null) {
      this.message = message;
      this.#path = path;
      this.#pathArray = null;
    }
    get path() {
      const pathArray = this.#pathArray;
      if (pathArray !== null) {
        return pathArray;
      }
      return (this.#pathArray = this.#path?.toArray().reverse() ?? undefined);
    }
    [Symbol.for("nodejs.util.inspect.custom")](
      _depth: number,
      options: any,
      inspect: (object: any, options?: any) => string,
    ) {
      return inspect(
        { message: this.message, path: this.path },
        {
          ...options,
          depth: options?.depth ? options.depth - 1 : null,
        },
      );
    }
  })();
const issueToStandardIssue = (issue: Issue): Standard.SchemaV1.Issue =>
  new StandardIssue(issue.message, issue.path);
const genericValidate = (validator: BoundValidator, value: unknown) => {
  const issues: List<Issue> = List.head();
  validator(null, value, issues);
  return issues.isHead()
    ? { value: value as any }
    : {
        issues: issues.toArray().reverse().map(issueToStandardIssue),
      };
};
export function schema<T>(json: TSToJSONSchema<T>): Schema<T> {
  const converter = genericConverter.bind(null, json);
  const validate = genericValidate.bind(null, makeValidator(JSON.parse(json)));
  return {
    validate,
    "~standard": {
      version: 1,
      vendor: "@easrng/schema",
      validate,
      jsonSchema: {
        input: converter,
        output: converter,
      },
    },
  };
}

export interface Schema<T> extends Standard<T> {
  readonly validate: (
    value: unknown,
    options?: Standard.SchemaV1.Options | undefined,
  ) => Standard.SchemaV1.Result<T>;
}
type Standard<T> = Standard.JSONSchemaV1<T> & Standard.SchemaV1<T>;
