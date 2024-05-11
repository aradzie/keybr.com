// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    seq: [
      "/",
      {
        f: 0.5,
        opt: "^",
      },
      {
        ref: "item",
      },
      {
        f: 0.5,
        opt: "$",
      },
      "/",
      {
        f: 0.5,
        opt: "i",
      },
      {
        f: 0.5,
        opt: "g",
      },
    ],
  },
  item: {
    seq: [
      {
        alt: [
          {
            ref: "group",
          },
          {
            ref: "union",
          },
        ],
      },
      {
        ref: "quantifier",
      },
    ],
  },
  group: {
    seq: [
      "(",
      {
        f: 0.5,
        opt: {
          alt: [
            {
              ref: "group_name",
            },
            "?:",
          ],
        },
      },
      {
        ref: "group_item",
      },
      ")",
    ],
  },
  group_name: {
    seq: [
      "?<",
      {
        alt: ["name", "item", "email", "url", "param", "id"],
      },
      ">",
    ],
  },
  group_item: {
    alt: [
      {
        ref: "char_class",
      },
      {
        ref: "char",
      },
    ],
  },
  union: {
    seq: [
      {
        ref: "union_item",
      },
      "|",
      {
        ref: "union_item",
      },
    ],
  },
  union_item: {
    alt: [
      {
        ref: "char_class",
      },
      {
        ref: "char",
      },
    ],
  },
  char_class: {
    seq: [
      "[",
      {
        f: 0.5,
        opt: "^",
      },
      {
        f: 0.5,
        opt: "-",
      },
      {
        f: 0.5,
        opt: ".",
      },
      {
        f: 0.5,
        opt: {
          ref: "escaped_char",
        },
      },
      {
        alt: ["a-z", "a-f"],
      },
      "]",
    ],
  },
  char: {
    alt: [
      ".",
      "\\d",
      "\\s",
      {
        seq: [
          {
            ref: "literal_char",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  ref: "literal_char",
                },
                {
                  f: 0.5,
                  opt: {
                    ref: "literal_char",
                  },
                },
              ],
            },
          },
        ],
      },
      {
        ref: "escaped_char",
      },
      {
        ref: "unicode_char",
      },
    ],
  },
  literal_char: {
    alt: ["a", "b", "c", "d", "e", "f"],
  },
  escaped_char: {
    alt: ["\\t", "\\n"],
  },
  unicode_char: {
    seq: [
      {
        alt: ["\\p", "\\P"],
      },
      "{",
      {
        ref: "unicode_category",
      },
      "}",
    ],
  },
  unicode_category: {
    alt: ["L", "Lu", "Ll", "Lt", "N", "Z"],
  },
  quantifier: {
    alt: ["*", "+", "?"],
  },
} as Rules;
