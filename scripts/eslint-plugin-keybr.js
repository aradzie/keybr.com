import { getCodePointName } from "./lib/codepoints.js";

const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Checks code point name comments.",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (
          node.type === "Literal" &&
          typeof node.value === "number" &&
          /0x[0-9a-fA-F]{4}/.test(node.raw)
        ) {
          const [comment] = context.sourceCode.getCommentsBefore(node);
          if (comment?.type === "Block") {
            const name1 =
              node.value === /* QUOTATION MARK */ 0x0022
                ? ` '"' `
                : ` "${String.fromCodePoint(node.value)}" `;
            const name2 = ` ${getCodePointName(node.value)} `;
            if (comment.value !== name1 && comment.value !== name2) {
              const expected = comment.value.includes('"')
                ? `/*${name1}*/`
                : `/*${name2}*/`;
              context.report({
                node,
                message:
                  "Invalid code point name comment, expected: {{ expected }}",
                data: {
                  expected,
                },
                fix(fixer) {
                  return fixer.replaceText(comment, expected);
                },
              });
            }
          }
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "eslint-plugin-keybr",
    version: "0.0.0",
  },
  configs: {},
  rules: {
    "codepoint-names": rule,
  },
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      keybr: plugin,
    },
    rules: {
      "keybr/codepoint-names": "error",
    },
  },
});

export default plugin;
