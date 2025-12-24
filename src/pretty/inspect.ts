import type * as Standard from "../standard.js";
import { styleText } from "./styleText.js";
const inspect = /** @__PURE__ */ (() =>
  typeof process !== "undefined" &&
  (process as typeof process | undefined)?.getBuiltinModule
    ? process.getBuiltinModule("node:util").inspect
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (value: unknown, _opts: unknown): string => {
        const t = value === null ? "undefined" : typeof value;
        switch (t) {
          case "string":
            return styleText("green", JSON.stringify(value));
          case "number":
            return styleText(
              "yellow",
              Object.is(value, -0) ? "-0" : value + "",
            );
          case "bigint":
            return styleText("yellow", value + "n");
          case "boolean":
            return styleText("yellow", value + "");
          case "symbol":
            return styleText("green", (value as symbol).toString());
          case "undefined":
            return styleText("gray", value + "");
          case "object":
            return styleText("cyan", Object.prototype.toString.call(value));
          case "function":
            return styleText(
              "cyan",
              `[${(value as () => void).constructor.name}${
                (value as () => void).name
                  ? " (anonymous)"
                  : (value as () => void).name
              }]`,
            );
          default:
            throw t satisfies never;
        }
      })();
const setHas = Set.prototype.has;
function isSet(value: unknown) {
  try {
    setHas.call(value, null);
    return true;
  } catch {
    return false;
  }
}
const mapHas = Map.prototype.has;
function isMap(value: unknown) {
  try {
    mapHas.call(value, null);
    return true;
  } catch {
    return false;
  }
}
export interface IssueTree {
  issues: Standard.SchemaV1.Issue[];
  children: Record<PropertyKey, IssueTree>;
}
function collectIssues(
  tree: IssueTree,
  issues: Standard.SchemaV1.Issue[] = [],
) {
  issues.push(...tree.issues);
  for (const k of Reflect.ownKeys(tree.children)) {
    collectIssues(tree.children[k]!, issues);
  }
  return issues;
}
function toIndexOrNull(key: PropertyKey): number | null {
  if (typeof key === "symbol") {
    return null;
  }
  if (typeof key === "number") {
    return Number.isInteger(key) && key >= 0 && key < 2 ** 32 - 1 ? key : null;
  }
  const num = +key;
  return "" + num === key ? toIndexOrNull(num) : null;
}
function keysToPrint(value: unknown, extraKeys: PropertyKey[]): PropertyKey[] {
  if (typeof value !== "object" || value === null) return [];
  const isArray = Array.isArray(value);
  let maxIdx = isArray ? value.length - 1 : -1;
  const strings: string[] = [];
  const symbols: symbol[] = [];
  const seen: Set<PropertyKey> = new Set();
  if (isArray) seen.add("length");
  const keys = [...Reflect.ownKeys(value), ...extraKeys];
  for (const key of keys) {
    const idx = toIndexOrNull(key);
    if (typeof key === "symbol") {
      if (!seen.has(key)) {
        seen.add(key);
        symbols.push(key);
      }
    } else if (idx !== null) {
      if (idx > maxIdx) {
        maxIdx = idx;
      }
    } else {
      const str = String(key);
      if (!seen.has(str)) {
        seen.add(str);
        strings.push(str);
      }
    }
  }

  return [
    ...(maxIdx !== -1 ? Array.from({ length: maxIdx + 1 }, (_, i) => i) : []),
    ...strings,
    ...symbols,
  ];
}
export type Segment = {
  value: string;
  errors?: string[] | true | undefined;
};
const ident = /^[$_\p{ID_Start}\\][$_\u200C\u200D\p{ID_Continue}]*$/u;
export function prettyPrint(
  value: unknown,
  issueTree: IssueTree | undefined,
  isEntry: boolean,
  comma: boolean,
  isEmpty: boolean,
): Segment[] {
  const valueIsMap = isMap(value);
  const valueIsSet = isSet(value);
  const valueProto =
    typeof value === "object" && value !== null && Object.getPrototypeOf(value);
  const valueIsPOJO =
    typeof value === "object" &&
    value !== null &&
    (valueProto === null ||
      (Object.hasOwn(valueProto, "hasOwnProperty") &&
        Object.getPrototypeOf(valueProto) === null));
  const valueIsArray = Array.isArray(value);
  const childKeys = issueTree ? Reflect.ownKeys(issueTree.children) : [];
  let containerChildren;
  containers: if (valueIsSet || valueIsMap) {
    for (const key of childKeys) {
      if (typeof key === "symbol") break containers;
      if (toIndexOrNull(key) === null) {
        break containers;
      }
    }
    containerChildren = [...(value as Iterable<unknown>)];
  }
  const effectiveValue = containerChildren ?? value;
  const allKeys = keysToPrint(effectiveValue as object, childKeys);
  if (
    allKeys.length &&
    (valueIsPOJO ||
      valueIsArray ||
      ((valueIsSet || valueIsMap) && containerChildren))
  ) {
    // recurse
    const segments: Segment[] = [
      {
        value: valueIsArray
          ? isEntry
            ? ""
            : "["
          : valueIsMap
            ? `Map(${(effectiveValue as unknown[]).length}) {`
            : valueIsSet
              ? `Set(${(effectiveValue as unknown[]).length}) {`
              : "{",
        errors: issueTree?.issues.map((e) => e.message),
      },
    ];
    let i = 0;
    for (const key of allKeys) {
      i++;
      const newVal = (effectiveValue as Record<PropertyKey, unknown>)[key];
      const newTree = issueTree?.children[key];
      segments.push(
        {
          value:
            (isEntry ? (i - 1 ? " => " : "") : "\n  ") +
            (containerChildren || (valueIsArray && i - 1 === key)
              ? ""
              : (typeof key === "string" && ident.test(key)
                  ? key
                  : typeof key === "symbol"
                    ? `[${inspect(key, { colors: true })}]`
                    : inspect(key + "", { colors: true })) + ": "),
        },
        ...prettyPrint(
          newVal,
          newTree,
          valueIsMap,
          !isEntry && i !== allKeys.length,
          !(key in (effectiveValue as Record<PropertyKey, unknown>)),
        ).map((e) => ({
          ...e,
          value: isEntry
            ? e.value.replace(/\n\s*/, " ")
            : e.value.replaceAll("\n", "\n  "),
        })),
      );
    }
    segments.push({
      value:
        (isEntry ? "" : "\n" + (valueIsArray ? "]" : "}")) + (comma ? "," : ""),
    });
    return segments;
  }
  const issues = issueTree ? collectIssues(issueTree) : [];
  return [
    {
      value: isEmpty
        ? styleText("gray", "<empty>")
        : inspect(value, { colors: true }),
      errors: issues?.map((e) => e.message),
    },
    { value: comma ? "," : "" },
  ];
}
