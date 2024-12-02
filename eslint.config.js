/* eslint-disable n/no-extraneous-import */

import js from "@eslint/js";
import keybr from "@keybr/scripts/eslint-plugin-keybr.js";
import confusingBrowserGlobals from "confusing-browser-globals";
import formatjs from "eslint-plugin-formatjs";
import node from "eslint-plugin-n";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import ts from "typescript-eslint";
import pkg from "./package.json" with { type: "json" };

export default [
  {
    files: ["**/*.{js,ts,tsx}"],
  },
  {
    ignores: [
      "**/.types/",
      "**/build/",
      "**/sandbox/",
      "**/tmp/",
      "root/",
      "packages/keybr-code/lib/parser.js",
    ],
  },
  js.configs["recommended"],
  ...ts.configs["recommended"],
  react.configs.flat["recommended"],
  react.configs.flat["jsx-runtime"],
  node.configs["flat/recommended-module"],
  keybr.configs["recommended"],
  {
    ignores: [
      "packages/server/**",
      "packages/server-cli/**",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
    plugins: {
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "formatjs": formatjs,
    },
    rules: {
      // configure simple-import-sort
      "simple-import-sort/imports": [
        "error",
        { groups: [["^\\u0000", "^node:", "^@?\\w", "^", "^\\."]] },
      ],
      "simple-import-sort/exports": ["error"],
      // configure eslint
      "eqeqeq": ["error", "always", { null: "never" }],
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-implicit-coercion": "error",
      "no-restricted-globals": ["error", ...confusingBrowserGlobals],
      "prefer-const": "off",
      // configure @typescript-eslint
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": [
        "error",
        { ignoreParameters: true, ignoreProperties: true },
      ],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // configure react
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-handler-names": ["error", {}],
      "react/no-unknown-property": ["error", { ignore: ["prefix"] }],
      // configure formatjs
      "formatjs/enforce-id": "error",
      "formatjs/enforce-default-message": ["error", "literal"],
      "formatjs/enforce-placeholders": [
        "error",
        { ignoreList: "h1,h2,h3,p,ol,ul,li,dl,dt,dd,em,strong,br".split(/,/g) },
      ],
      "formatjs/no-invalid-icu": "error",
      "formatjs/no-multiple-whitespaces": "error",
      // configure node
      "n/file-extension-in-import": ["error", "always"],
      "n/hashbang": "off",
      "n/no-process-exit": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "n/prefer-global/buffer": ["error", "always"],
      "n/prefer-global/console": ["error", "always"],
      "n/prefer-global/process": ["error", "always"],
      "n/prefer-global/text-decoder": ["error", "always"],
      "n/prefer-global/text-encoder": ["error", "always"],
      "n/prefer-global/url": ["error", "always"],
      "n/prefer-global/url-search-params": ["error", "always"],
      "n/prefer-node-protocol": "error",
      "n/prefer-promises/dns": "error",
      "n/prefer-promises/fs": "error",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      node: {
        version: ">=22",
        allowModules: [
          ...Object.keys(pkg.dependencies),
          ...Object.keys(pkg.devDependencies),
        ],
        typescriptExtensionMap: [
          [".ts", ".ts"],
          [".tsx", ".tsx"],
        ],
      },
    },
  },
];
