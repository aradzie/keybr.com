// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "rust_statement",
  },
  rust_statement: {
    alt: [
      {
        ref: "rust_function_definition",
      },
      {
        ref: "rust_struct_definition",
      },
      {
        ref: "rust_assign",
      },
      {
        ref: "rust_return",
      },
      {
        flag: "comments",
        inv: false,
        cond: {
          ref: "rust_comment",
        },
      },
    ],
  },
  rust_function_definition: {
    seq: [
      {
        ref: "kw_fn",
      },
      " ",
      {
        ref: "rust_function_name",
      },
      "(",
      {
        ref: "rust_arguments",
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "->",
            " ",
            {
              ref: "rust_type",
            },
          ],
        },
      },
      "{",
    ],
  },
  rust_struct_definition: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_pub",
            },
            " ",
          ],
        },
      },
      {
        ref: "kw_struct",
      },
      " ",
      {
        ref: "rust_struct_name",
      },
      " ",
      "{",
    ],
  },
  rust_assign: {
    seq: [
      {
        ref: "kw_let",
      },
      " ",
      {
        ref: "rust_variable_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ":",
            " ",
            {
              ref: "rust_type",
            },
          ],
        },
      },
      " ",
      "=",
      " ",
      {
        ref: "rust_expression",
      },
      ";",
    ],
  },
  rust_return: {
    seq: [
      {
        ref: "kw_return",
      },
      " ",
      {
        ref: "rust_expression",
      },
      ";",
    ],
  },
  rust_arguments: {
    seq: [
      {
        ref: "rust_argument",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "rust_argument",
            },
          ],
        },
      },
    ],
  },
  rust_argument: {
    seq: [
      {
        ref: "rust_variable_name",
      },
      ":",
      " ",
      {
        ref: "rust_type",
      },
    ],
  },
  rust_expression: {
    alt: [
      {
        ref: "rust_literal",
      },
      {
        ref: "rust_unary_operation",
      },
      {
        ref: "rust_binary_operation",
      },
      {
        seq: [
          "(",
          {
            ref: "rust_expression",
          },
          ")",
        ],
      },
      {
        ref: "rust_array_definition",
      },
      {
        ref: "rust_struct_instantiation",
      },
      {
        ref: "rust_function_call",
      },
    ],
  },
  rust_unary_operation: {
    alt: [
      {
        seq: [
          "!",
          {
            ref: "rust_expression",
          },
        ],
      },
      {
        seq: [
          "-",
          {
            ref: "rust_expression",
          },
        ],
      },
      {
        seq: [
          "*",
          {
            ref: "rust_expression",
          },
        ],
      },
      {
        seq: [
          "&",
          {
            ref: "rust_expression",
          },
        ],
      },
    ],
  },
  rust_binary_operation: {
    seq: [
      {
        ref: "rust_expression",
      },
      " ",
      {
        ref: "rust_binary_operator",
      },
      " ",
      {
        ref: "rust_expression",
      },
    ],
  },
  rust_function_call: {
    seq: [
      {
        ref: "rust_function_name",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "rust_function_args",
        },
      },
      ")",
    ],
  },
  rust_function_args: {
    seq: [
      {
        ref: "rust_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "rust_expression",
            },
          ],
        },
      },
    ],
  },
  rust_type: {
    alt: [
      {
        ref: "rust_primitive_type",
      },
      {
        seq: [
          "&",
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  ref: "kw_mut",
                },
                " ",
              ],
            },
          },
          {
            ref: "rust_type",
          },
        ],
      },
      {
        seq: [
          {
            ref: "rust_type",
          },
          " ",
          "<",
          {
            ref: "rust_type",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ",",
                " ",
                {
                  ref: "rust_type",
                },
              ],
            },
          },
          ">",
        ],
      },
      {
        seq: [
          "[",
          {
            ref: "rust_type",
          },
          ";",
          " ",
          {
            ref: "rust_number_literal",
          },
          "]",
        ],
      },
      {
        seq: [
          "(",
          {
            ref: "rust_type",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ",",
                " ",
                {
                  ref: "rust_type",
                },
              ],
            },
          },
          ")",
        ],
      },
    ],
  },
  rust_primitive_type: {
    alt: [
      {
        ref: "rust_struct_name",
      },
      {
        ref: "kw_u32",
      },
      {
        ref: "kw_u64",
      },
      {
        ref: "kw_i32",
      },
      {
        ref: "kw_i64",
      },
      {
        ref: "kw_f32",
      },
      {
        ref: "kw_f64",
      },
      {
        ref: "kw_usize",
      },
      {
        ref: "kw_isize",
      },
      {
        ref: "kw_bool",
      },
      {
        ref: "kw_char",
      },
      {
        ref: "kw_str",
      },
      "String",
    ],
  },
  rust_binary_operator: {
    alt: [
      "+",
      "-",
      "*",
      "/",
      "%",
      "&&",
      "||",
      "==",
      "!=",
      "<",
      "<=",
      ">",
      ">=",
      "<<",
      ">>",
      "&",
      "|",
      "^",
    ],
  },
  rust_array_definition: {
    alt: [
      {
        seq: [
          "[",
          {
            ref: "rust_expression",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ",",
                " ",
                {
                  ref: "rust_expression",
                },
              ],
            },
          },
          "]",
        ],
      },
      {
        seq: [
          "[",
          {
            ref: "rust_expression",
          },
          ";",
          " ",
          {
            ref: "rust_number_literal",
          },
          "]",
        ],
      },
    ],
  },
  rust_struct_instantiation: {
    seq: [
      {
        ref: "rust_struct_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "rust_struct_fields",
      },
      " ",
      "}",
    ],
  },
  rust_struct_fields: {
    seq: [
      {
        ref: "rust_field_assignment",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "rust_field_assignment",
            },
          ],
        },
      },
    ],
  },
  rust_field_assignment: {
    seq: [
      {
        ref: "rust_variable_name",
      },
      ":",
      " ",
      {
        ref: "rust_expression",
      },
    ],
  },
  rust_literal: {
    alt: [
      {
        ref: "rust_string_literal",
      },
      {
        ref: "rust_number_literal",
      },
      {
        ref: "rust_boolean_literal",
      },
      {
        ref: "rust_char_literal",
      },
    ],
  },
  rust_string_literal: {
    cls: "string",
    span: {
      seq: [
        '"',
        {
          ref: "rust_string_value",
        },
        '"',
      ],
    },
  },
  rust_char_literal: {
    cls: "string",
    span: {
      seq: [
        "'",
        {
          ref: "rust_char_value",
        },
        "'",
      ],
    },
  },
  rust_boolean_literal: {
    alt: [
      {
        ref: "kw_true",
      },
      {
        ref: "kw_false",
      },
    ],
  },
  rust_variable_name: {
    ref: "generic_variable_name",
  },
  rust_function_name: {
    ref: "generic_function_name",
  },
  rust_struct_name: {
    ref: "generic_class_name",
  },
  rust_string_value: {
    alt: [
      "",
      "Hello, world!",
      "Error",
      "OK",
      "Test",
      "Name",
      "Value",
      "Message",
      "Key",
      "Input",
      "Output",
      "Data",
      "Result",
      "Success",
      "Failure",
      "Warning",
      "Info",
      "Debug",
      "Rust",
      "Sample",
    ],
  },
  rust_char_value: {
    alt: ["a", "b", "c", "x", "y", "z", "0", "1", "2", "\\n", "\\t", "\\r"],
  },
  rust_number_literal: {
    cls: "number",
    span: {
      alt: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "10",
        "100",
        "123i32",
        "0.0",
        "0.5",
        "1.5",
        "2.5_f64",
        "3.14f32",
        "42",
        "255",
        "256",
        "1024",
        "1_000_000",
      ],
    },
  },
  rust_comment: {
    cls: "comment",
    span: {
      alt: [
        {
          seq: [
            "//",
            " ",
            {
              ref: "rust_comment_text",
            },
          ],
        },
        {
          seq: [
            "//!",
            " ",
            {
              ref: "rust_comment_text",
            },
          ],
        },
        {
          seq: [
            "/*",
            " ",
            {
              ref: "rust_comment_text",
            },
            " ",
            "*/",
          ],
        },
        {
          seq: [
            "/*!",
            " ",
            {
              ref: "rust_comment_text",
            },
            " ",
            "*/",
          ],
        },
      ],
    },
  },
  rust_comment_text: {
    alt: [
      "TODO: Implement error handling",
      "FIXME: Potential race condition",
      "Unsafe: Raw pointer manipulation",
      "Optimize memory allocation",
      "Ensure thread safety",
      "Zero-copy deserialization",
      "Handle lifetime issues",
      "Implement Drop trait",
      "Lock-free data structure",
      "FFI: C interop",
      "Benchmark performance",
      "Async/await transformation",
      "Check for integer overflow",
    ],
  },
} as Rules;
