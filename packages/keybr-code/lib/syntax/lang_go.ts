// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "go_statement",
  },
  start_capitalization: {
    ref: "go_statement",
  },
  start_numbers: {
    ref: "go_statement",
  },
  start_capitalization_and_numbers: {
    ref: "go_statement",
  },
  go_statement: {
    alt: [
      {
        ref: "go_function_definition",
      },
      {
        ref: "go_struct_definition",
      },
      {
        ref: "go_assign",
      },
      {
        ref: "go_return",
      },
      {
        ref: "go_comment",
      },
    ],
  },
  go_function_definition: {
    seq: [
      "func ",
      {
        ref: "go_function_name",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "go_parameters",
        },
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "go_return_type",
            },
          ],
        },
      },
      "{",
    ],
  },
  go_struct_definition: {
    seq: [
      "type ",
      {
        ref: "go_struct_name",
      },
      " struct {",
    ],
  },
  go_assign: {
    alt: [
      {
        seq: [
          "var ",
          {
            ref: "go_variable_name",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                " ",
                {
                  ref: "go_type",
                },
              ],
            },
          },
          " = ",
          {
            ref: "go_expression",
          },
        ],
      },
      {
        seq: [
          {
            ref: "go_variable_name",
          },
          " := ",
          {
            ref: "go_expression",
          },
        ],
      },
    ],
  },
  go_return: {
    seq: [
      "return ",
      {
        ref: "go_expression",
      },
    ],
  },
  go_parameters: {
    seq: [
      {
        ref: "go_parameter",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "go_parameter",
            },
          ],
        },
      },
    ],
  },
  go_parameter: {
    seq: [
      {
        ref: "go_variable_name",
      },
      " ",
      {
        ref: "go_type",
      },
    ],
  },
  go_expression: {
    alt: [
      {
        ref: "go_literal",
      },
      {
        ref: "go_unary_operation",
      },
      {
        ref: "go_binary_operation",
      },
      {
        seq: [
          "(",
          {
            ref: "go_expression",
          },
          ")",
        ],
      },
      {
        ref: "go_array_definition",
      },
      {
        ref: "go_map_definition",
      },
      {
        ref: "go_function_call",
      },
    ],
  },
  go_unary_operation: {
    alt: [
      {
        seq: [
          "!",
          {
            ref: "go_expression",
          },
        ],
      },
      {
        seq: [
          "-",
          {
            ref: "go_expression",
          },
        ],
      },
      {
        seq: [
          "&",
          {
            ref: "go_expression",
          },
        ],
      },
      {
        seq: [
          "*",
          {
            ref: "go_expression",
          },
        ],
      },
    ],
  },
  go_binary_operation: {
    seq: [
      {
        ref: "go_expression",
      },
      " ",
      {
        ref: "go_binary_operator",
      },
      " ",
      {
        ref: "go_expression",
      },
    ],
  },
  go_function_call: {
    seq: [
      {
        ref: "go_function_name",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "go_arguments",
        },
      },
      ")",
    ],
  },
  go_arguments: {
    seq: [
      {
        ref: "go_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "go_expression",
            },
          ],
        },
      },
    ],
  },
  go_return_type: {
    ref: "go_type",
  },
  go_type: {
    alt: [
      {
        ref: "go_primitive_type",
      },
      {
        seq: [
          "*",
          {
            ref: "go_type",
          },
        ],
      },
      {
        seq: [
          "[]",
          {
            ref: "go_type",
          },
        ],
      },
      {
        seq: [
          "map[",
          {
            ref: "go_type",
          },
          "]",
          {
            ref: "go_type",
          },
        ],
      },
      {
        seq: [
          "chan ",
          {
            ref: "go_type",
          },
        ],
      },
      "interface{}",
    ],
  },
  go_primitive_type: {
    alt: [
      {
        ref: "go_struct_name",
      },
      "int",
      "int32",
      "int64",
      "uint",
      "float32",
      "float64",
      "bool",
      "string",
      "byte",
      "rune",
      "error",
    ],
  },
  go_binary_operator: {
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
      "&",
      "|",
      "^",
      "<<",
      ">>",
    ],
  },
  go_array_definition: {
    seq: [
      "[]",
      {
        ref: "go_type",
      },
      "{",
      {
        ref: "go_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "go_expression",
            },
          ],
        },
      },
      "}",
    ],
  },
  go_map_definition: {
    seq: [
      "map[",
      {
        ref: "go_type",
      },
      "]",
      {
        ref: "go_type",
      },
      "{",
      {
        ref: "go_map_key_value_pairs",
      },
      "}",
    ],
  },
  go_map_key_value_pairs: {
    seq: [
      {
        ref: "go_expression",
      },
      ": ",
      {
        ref: "go_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "go_expression",
            },
            ": ",
            {
              ref: "go_expression",
            },
          ],
        },
      },
    ],
  },
  go_literal: {
    alt: [
      {
        ref: "go_string_literal",
      },
      {
        ref: "go_number_literal",
      },
      {
        ref: "go_boolean_literal",
      },
      {
        ref: "go_rune_literal",
      },
    ],
  },
  go_string_literal: {
    seq: [
      '"',
      {
        ref: "go_string_value",
      },
      '"',
    ],
  },
  go_rune_literal: {
    seq: [
      "'",
      {
        ref: "go_rune_value",
      },
      "'",
    ],
  },
  go_boolean_literal: {
    alt: ["true", "false"],
  },
  go_variable_name: {
    alt: [
      "x",
      "y",
      "z",
      "i",
      "j",
      "k",
      "value",
      "result",
      "data",
      "index",
      "count",
      "name",
      "size",
      "buffer",
      "ptr",
      "slice",
      "map",
      "item",
      "key",
      "val",
      "left",
      "right",
      "flag",
      "temp",
      "num",
      "sum",
      "acc",
      "iter",
      "len",
    ],
  },
  go_function_name: {
    alt: [
      "main",
      "New",
      "Len",
      "Append",
      "Delete",
      "Insert",
      "Remove",
      "Get",
      "Set",
      "Update",
      "Compute",
      "Process",
      "Run",
      "Execute",
      "Handle",
      "Read",
      "Write",
      "Calculate",
      "Draw",
      "Render",
      "Add",
      "Subtract",
      "Multiply",
      "Divide",
      "Print",
      "Printf",
    ],
  },
  go_struct_name: {
    alt: [
      "Point",
      "Node",
      "Tree",
      "List",
      "Map",
      "Slice",
      "Option",
      "Result",
      "Buffer",
      "Config",
      "Rectangle",
      "Circle",
      "Color",
      "Person",
      "User",
      "Message",
      "Command",
      "Request",
      "Response",
    ],
  },
  go_string_value: {
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
      "Go",
      "Sample",
    ],
  },
  go_rune_value: {
    alt: ["a", "b", "c", "x", "y", "z", "0", "1", "2", "\\n", "\\t", "\\r"],
  },
  go_number_literal: {
    alt: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "10",
      "100",
      "1000",
      "0.0",
      "0.5",
      "1.5",
      "2.5",
      "3.14",
      "42",
      "255",
      "256",
      "1024",
      "1e6",
    ],
  },
  go_comment: {
    seq: [
      "//",
      {
        ref: "go_comment_text",
      },
    ],
  },
  go_comment_text: {
    alt: [
      "TODO: Implement error handling",
      "FIXME: Possible data race",
      "Goroutine synchronization",
      "Defer resource cleanup",
      "Handle context cancellation",
      "Optimize for concurrent access",
      "Use sync.Pool for performance",
      "Implement io.Reader interface",
      "Docker container configuration",
      "gRPC service definition",
      "Kubernetes deployment spec",
      "Unmarshal JSON response",
      "Middleware chain setup",
    ],
  },
} as Rules;
