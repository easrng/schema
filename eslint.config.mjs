// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/index.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: ":function > BlockStatement :function",
          message:
            "Functions inside functions are not allowed, use .bind instead of closures.",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  { ignores: ["dist"] }
);
