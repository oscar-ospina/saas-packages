import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/storybook-static/**",
    "**/coverage/**",
    "**/node_modules/**",
    "**/*.d.ts",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{mjs,cjs,js}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // Keep this LAST: turns off rules that conflict with Prettier formatting.
  prettier,
]);
