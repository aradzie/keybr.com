// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "js_variable_statement",
  },
  js_variable_statement: {
    seq: [
      {
        alt: [
          {
            ref: "kw_let",
          },
          {
            ref: "kw_const",
          },
        ],
      },
      " ",
      {
        ref: "js_var_id",
      },
      " ",
      "=",
      " ",
      {
        ref: "js_primary_exp",
      },
      ";",
    ],
  },
  js_primary_exp: {
    alt: [
      {
        ref: "js_literal",
      },
      {
        ref: "js_array_literal",
      },
      {
        ref: "js_object_literal",
      },
      {
        ref: "js_function_exp",
      },
      {
        ref: "js_call_exp",
      },
    ],
  },
  js_array_literal: {
    seq: [
      "[",
      {
        ref: "js_primary_exp",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "js_primary_exp",
            },
          ],
        },
      },
      "]",
    ],
  },
  js_object_literal: {
    seq: [
      "{",
      " ",
      {
        ref: "js_property_name",
      },
      ":",
      " ",
      {
        ref: "js_property_value",
      },
      " ",
      "}",
    ],
  },
  js_property_name: {
    alt: [
      {
        ref: "js_id",
      },
      {
        seq: [
          "[",
          {
            ref: "js_id",
          },
          "]",
        ],
      },
    ],
  },
  js_property_value: {
    ref: "js_primary_exp",
  },
  js_function_exp: {
    seq: [
      {
        ref: "js_function_args",
      },
      " ",
      "=>",
      " ",
      {
        ref: "js_primary_exp",
      },
    ],
  },
  js_function_args: {
    alt: [
      {
        ref: "js_single_arg",
      },
      {
        ref: "js_multi_args",
      },
    ],
  },
  js_single_arg: {
    ref: "js_arg",
  },
  js_multi_args: {
    seq: [
      "(",
      {
        ref: "js_arg",
      },
      ",",
      " ",
      {
        ref: "js_arg",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "js_tail_arg",
            },
          ],
        },
      },
      ")",
    ],
  },
  js_arg: {
    seq: [
      {
        ref: "js_var_id",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "=",
            " ",
            {
              ref: "js_primary_exp",
            },
          ],
        },
      },
    ],
  },
  js_tail_arg: {
    seq: [
      "...",
      {
        ref: "js_var_id",
      },
    ],
  },
  js_call_exp: {
    seq: [
      {
        ref: "js_func_id",
      },
      "(",
      {
        ref: "js_primary_exp",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "js_primary_exp",
            },
          ],
        },
      },
      ")",
    ],
  },
  js_var_id: {
    ref: "js_id",
  },
  js_func_id: {
    alt: [
      "all",
      "entries",
      "every",
      "filter",
      "find",
      "has",
      "includes",
      "keys",
      "length",
      "map",
      "size",
      "values",
    ],
  },
  js_id: {
    alt: [
      "a",
      "b",
      "c",
      "x",
      "y",
      "i",
      "j",
      "char",
      "end",
      "err",
      "event",
      "id",
      "item",
      "key",
      "length",
      "line",
      "list",
      "map",
      "name",
      "path",
      "pos",
      "start",
      "str",
      "text",
      "value",
    ],
  },
  js_literal: {
    alt: [
      {
        ref: "kw_null",
      },
      {
        ref: "kw_true",
      },
      {
        ref: "kw_false",
      },
      {
        ref: "js_string_literal",
      },
      {
        ref: "js_template_literal",
      },
    ],
  },
  js_string_literal: {
    cls: "string",
    span: {
      alt: ['"a"', '"b"', '"c"'],
    },
  },
  js_template_literal: {
    cls: "string",
    span: {
      seq: [
        "`abc=${",
        {
          ref: "js_id",
        },
        "}`",
      ],
    },
  },
} as Rules;
