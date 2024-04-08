"use strict";

const pkg = require("./package.json");

module.exports = {
  root: true,
  env: {
    es2022: true,
    browser: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "formatjs", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:n/recommended",
    "plugin:ava/recommended",
  ],
  rules: {
    // configure eslint
    "eqeqeq": ["error", "always", { null: "never" }],
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-implicit-coercion": "error",
    "no-restricted-globals": ["error", ...require("confusing-browser-globals")],
    "prefer-const": "off",
    // configure simple-import-sort
    "simple-import-sort/imports": [
      "error",
      { groups: [["^\\u0000", "^node:", "^@?\\w", "^", "^\\."]] },
    ],
    "simple-import-sort/exports": ["error"],
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
    "n/no-unsupported-features/es-builtins": "off",
    "n/no-unsupported-features/es-syntax": "off",
    "n/no-unsupported-features/node-builtins": "off",
    "n/prefer-global/buffer": ["error", "always"],
    "n/prefer-global/console": ["error", "always"],
    "n/prefer-global/process": ["error", "always"],
    "n/prefer-global/url": ["error", "always"],
    "n/prefer-global/url-search-params": ["error", "always"],
    "n/prefer-node-protocol": "error",
    "n/prefer-promises/dns": "error",
    "n/prefer-promises/fs": "error",
  },
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "script",
      },
      rules: {
        "strict": ["error", "global"],
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
    node: {
      version: ">=20",
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
  parserOptions: {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
  },
};
