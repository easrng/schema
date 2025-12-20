import { type IssueTree, prettyPrint } from "./pretty/inspect.js";
import { formatSegments } from "./pretty/layout.js";
import { styleText } from "./pretty/styleText.js";
import type * as Standard from "./standard.js";

// eslint-disable-next-line no-control-regex
const colorCode = /\u001b\[(\d+)m/g;
const colorMap: Record<string, string> = {
  31: "light-dark(var(--red-70, #a4000f), var(--red-50, #ff0039))",
  32: "light-dark(var(--green-70, #058b00), var(--green-60, #12bc00))",
  33: "light-dark(var(--yellow-80, #715100), var(--yellow-65, #be9b00))",
  34: "light-dark(var(--blue-70, #003eaa), var(--blue-50, #0a84ff))",
  35: "light-dark(var(--magenta-70, #b5007f), var(--magenta-65, #dd00a9))",
  36: "light-dark(var(--teal-70, #008ea4), var(--teal-60, #00c8d7))",
  90: "var(--gray-50, #737373)",
  91: "light-dark(var(--red-60, #d70022), var(--red-40, #ff3b6b))",
  92: "light-dark(var(--green-60, #12bc00), var(--green-50, #30e60b))",
  93: "light-dark(var(--yellow-70, #a47f00), var(--yellow-50, #ffe900))",
  94: "light-dark(var(--blue-60, #0060df), var(--blue-40, #45a1ff))",
  95: "light-dark(var(--magenta-65, #dd00a9), var(--magenta-50, #ff1ad9))",
  96: "var(--teal-70, #008ea4)",
};
declare const document: object | undefined;
function logAnsi(str: string) {
  // if we're in a browser, convert to %c format
  if (typeof document !== "undefined") {
    const parts = str.split(colorCode);

    let formatCode = "%s";
    const result = [parts[0] ?? ""];

    for (let i = 1; i < parts.length; i += 2) {
      const colorCode = parts[i];
      const text = parts[i + 1];

      if (text) {
        formatCode += "%c%s";
        const cssColor = colorCode ? colorMap[colorCode] : "";
        result.push(cssColor ? `color:${cssColor}` : "", text);
      }
    }

    console.log(formatCode, ...result);
  } else {
    console.error(str);
  }
}

export function logStandardFailure(
  value: unknown,
  result: Standard.SchemaV1.FailureResult,
) {
  const issueTree: IssueTree = { children: Object.create(null), issues: [] };
  for (let i = 0; i < result.issues.length; i++) {
    const issue = result.issues[i]!;
    let treeNode = issueTree;
    if (issue.path) {
      for (let j = 0; j < issue.path.length; j++) {
        let key = issue.path[j];
        if (typeof key === "object" && key !== null) {
          key = key.key;
        }
        if (
          !(
            typeof key === "string" ||
            typeof key === "number" ||
            typeof key === "symbol"
          )
        ) {
          break;
        }
        treeNode.children[key] ??= {
          children: Object.create(null),
          issues: [],
        };
        treeNode = treeNode.children[key]!;
      }
    }
    treeNode.issues.push(issue);
  }
  const terminalWidth =
    ((typeof process !== "undefined"
      ? process
      : undefined
    )?.stderr?.getWindowSize()[0] ?? 80) - 3;

  logAnsi(
    styleText("red", "×") +
      " Schema validation failed:\n" +
      formatSegments(
        prettyPrint(value, issueTree, false, false, false),
        terminalWidth,
      ),
  );
}

export function assert<Schema extends Standard.SchemaV1>(
  schema: Schema,
  value: unknown,
): asserts value is Standard.TypedV1.InferInput<Schema> {
  const result = schema["~standard"].validate(value);
  if ("then" in result && typeof result.then === "function") {
    throw new TypeError("unexpected async schema");
  }
  if ((result as Awaited<typeof result>).issues) {
    logStandardFailure(value, result as Standard.SchemaV1.FailureResult);
    throw new TypeError("Value didn't match schema");
  }
}
