// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "golang_statement",
  },
  golang_statement: {
    alt: [
      {
        ref: "package_declaration",
      },
      {
        ref: "import_declaration",
      },
      {
        ref: "function_declaration",
      },
      {
        ref: "struct_declaration",
      },
      {
        ref: "interface_declaration",
      },
      {
        ref: "variable_declaration",
      },
      {
        ref: "constant_declaration",
      },
      {
        ref: "type_declaration",
      },
      {
        ref: "comment",
      },
    ],
  },
  package_declaration: {
    seq: [
      {
        ref: "kw_package",
      },
      " ",
      {
        ref: "golang_package_name",
      },
    ],
  },
  import_declaration: {
    alt: [
      {
        seq: [
          {
            ref: "kw_import",
          },
          " ",
          "(",
          " ",
          {
            ref: "import_list",
          },
          " ",
          ")",
        ],
      },
      {
        seq: [
          {
            ref: "kw_import",
          },
          " ",
          {
            ref: "import_spec",
          },
        ],
      },
    ],
  },
  import_list: {
    seq: [
      {
        ref: "import_spec",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "import_spec",
            },
          ],
        },
      },
    ],
  },
  import_spec: {
    alt: [
      {
        ref: "golang_string_literal",
      },
      {
        seq: [
          {
            ref: "golang_import_alias",
          },
          " ",
          {
            ref: "golang_string_literal",
          },
        ],
      },
    ],
  },
  golang_import_alias: {
    ref: "golang_identifier",
  },
  function_declaration: {
    seq: [
      {
        ref: "kw_func",
      },
      " ",
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "receiver",
            },
            " ",
          ],
        },
      },
      {
        ref: "golang_function_name",
      },
      " ",
      "(",
      " ",
      {
        ref: "parameter_list",
      },
      " ",
      ")",
      " ",
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "return_spec",
            },
            " ",
          ],
        },
      },
      {
        ref: "function_body",
      },
    ],
  },
  receiver: {
    seq: [
      "(",
      " ",
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "golang_identifier",
            },
            " ",
          ],
        },
      },
      {
        ref: "golang_type",
      },
      " ",
      ")",
    ],
  },
  return_spec: {
    alt: [
      {
        ref: "golang_type",
      },
      {
        seq: [
          "(",
          " ",
          {
            ref: "return_params",
          },
          " ",
          ")",
        ],
      },
    ],
  },
  return_params: {
    seq: [
      {
        ref: "golang_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ",",
            " ",
            {
              ref: "golang_type",
            },
          ],
        },
      },
    ],
  },
  function_body: {
    seq: [
      "{",
      " ",
      {
        ref: "golang_statement_list",
      },
      " ",
      "}",
    ],
  },
  golang_statement_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "golang_statement",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              {
                ref: "golang_statement",
              },
            ],
          },
        },
      ],
    },
  },
  struct_declaration: {
    seq: [
      {
        ref: "kw_type",
      },
      " ",
      {
        ref: "golang_type_name",
      },
      " ",
      {
        ref: "kw_struct",
      },
      " ",
      "{",
      " ",
      {
        ref: "struct_field_list",
      },
      " ",
      "}",
    ],
  },
  struct_field_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "struct_field",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              {
                ref: "struct_field",
              },
            ],
          },
        },
      ],
    },
  },
  struct_field: {
    seq: [
      {
        ref: "golang_identifier_list",
      },
      " ",
      {
        ref: "golang_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "struct_tag",
            },
          ],
        },
      },
    ],
  },
  struct_tag: {
    ref: "golang_string_literal",
  },
  golang_identifier_list: {
    seq: [
      {
        ref: "golang_identifier",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ",",
            " ",
            {
              ref: "golang_identifier",
            },
          ],
        },
      },
    ],
  },
  interface_declaration: {
    seq: [
      {
        ref: "kw_type",
      },
      " ",
      {
        ref: "golang_type_name",
      },
      " ",
      {
        ref: "kw_interface",
      },
      " ",
      "{",
      " ",
      {
        ref: "interface_method_list",
      },
      " ",
      "}",
    ],
  },
  interface_method_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "interface_method_spec",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              {
                ref: "interface_method_spec",
              },
            ],
          },
        },
      ],
    },
  },
  interface_method_spec: {
    seq: [
      {
        ref: "golang_method_name",
      },
      " ",
      "(",
      " ",
      {
        ref: "parameter_list",
      },
      " ",
      ")",
      " ",
      {
        f: 0.5,
        opt: {
          ref: "return_spec",
        },
      },
    ],
  },
  variable_declaration: {
    alt: [
      {
        seq: [
          {
            ref: "kw_var",
          },
          " ",
          {
            ref: "variable_spec",
          },
        ],
      },
      {
        ref: "short_variable_declaration",
      },
    ],
  },
  variable_spec: {
    seq: [
      {
        ref: "golang_identifier_list",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "golang_type",
            },
          ],
        },
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "=",
            " ",
            {
              ref: "expression_list",
            },
          ],
        },
      },
    ],
  },
  short_variable_declaration: {
    seq: [
      {
        ref: "golang_identifier_list",
      },
      " ",
      ":=",
      " ",
      {
        ref: "expression_list",
      },
    ],
  },
  expression_list: {
    seq: [
      {
        ref: "golang_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ",",
            " ",
            {
              ref: "golang_expression",
            },
          ],
        },
      },
    ],
  },
  constant_declaration: {
    seq: [
      {
        ref: "kw_const",
      },
      " ",
      {
        ref: "constant_spec",
      },
    ],
  },
  constant_spec: {
    seq: [
      {
        ref: "golang_identifier_list",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "golang_type",
            },
          ],
        },
      },
      " ",
      "=",
      " ",
      {
        ref: "expression_list",
      },
    ],
  },
  type_declaration: {
    seq: [
      {
        ref: "kw_type",
      },
      " ",
      {
        ref: "type_spec",
      },
    ],
  },
  type_spec: {
    seq: [
      {
        ref: "golang_type_name",
      },
      " ",
      {
        ref: "golang_type",
      },
    ],
  },
  parameter_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "parameter",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              ",",
              " ",
              {
                ref: "parameter",
              },
            ],
          },
        },
      ],
    },
  },
  parameter: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "golang_identifier_list",
            },
            " ",
          ],
        },
      },
      {
        ref: "golang_type",
      },
    ],
  },
  golang_type: {
    alt: [
      {
        ref: "golang_basic_type",
      },
      {
        ref: "golang_reference_type",
      },
      {
        ref: "golang_struct_type",
      },
      {
        ref: "golang_interface_type",
      },
      {
        ref: "golang_array_type",
      },
      {
        ref: "golang_slice_type",
      },
      {
        ref: "golang_map_type",
      },
      {
        ref: "golang_channel_type",
      },
      {
        ref: "golang_function_type",
      },
    ],
  },
  golang_basic_type: {
    alt: [
      {
        ref: "kw_bool",
      },
      {
        ref: "kw_int",
      },
      {
        ref: "kw_int8",
      },
      {
        ref: "kw_int16",
      },
      {
        ref: "kw_int32",
      },
      {
        ref: "kw_int64",
      },
      {
        ref: "kw_uint",
      },
      {
        ref: "kw_uint8",
      },
      {
        ref: "kw_uint16",
      },
      {
        ref: "kw_uint32",
      },
      {
        ref: "kw_uint64",
      },
      {
        ref: "kw_float32",
      },
      {
        ref: "kw_float64",
      },
      {
        ref: "kw_complex64",
      },
      {
        ref: "kw_complex128",
      },
      {
        ref: "kw_string",
      },
      {
        ref: "kw_rune",
      },
      {
        ref: "kw_byte",
      },
    ],
  },
  golang_reference_type: {
    seq: [
      "*",
      " ",
      {
        ref: "golang_type",
      },
    ],
  },
  golang_struct_type: {
    seq: [
      {
        ref: "kw_struct",
      },
      " ",
      "{",
      " ",
      {
        ref: "struct_field_list",
      },
      " ",
      "}",
    ],
  },
  golang_interface_type: {
    seq: [
      {
        ref: "kw_interface",
      },
      " ",
      "{",
      " ",
      {
        ref: "interface_method_list",
      },
      " ",
      "}",
    ],
  },
  golang_array_type: {
    seq: [
      "[",
      " ",
      {
        ref: "golang_expression",
      },
      " ",
      "]",
      " ",
      {
        ref: "golang_type",
      },
    ],
  },
  golang_slice_type: {
    seq: [
      "[]",
      " ",
      {
        ref: "golang_type",
      },
    ],
  },
  golang_map_type: {
    seq: [
      {
        ref: "kw_map",
      },
      " ",
      "[",
      " ",
      {
        ref: "golang_type",
      },
      " ",
      "]",
      " ",
      {
        ref: "golang_type",
      },
    ],
  },
  golang_channel_type: {
    alt: [
      {
        seq: [
          {
            ref: "kw_chan",
          },
          " ",
          {
            ref: "golang_type",
          },
        ],
      },
      {
        seq: [
          "<-",
          " ",
          {
            ref: "kw_chan",
          },
          " ",
          {
            ref: "golang_type",
          },
        ],
      },
      {
        seq: [
          {
            ref: "kw_chan",
          },
          " ",
          "<-",
          " ",
          {
            ref: "golang_type",
          },
        ],
      },
    ],
  },
  golang_function_type: {
    seq: [
      {
        ref: "kw_func",
      },
      " ",
      "(",
      " ",
      {
        ref: "parameter_list",
      },
      " ",
      ")",
      " ",
      {
        f: 0.5,
        opt: {
          ref: "return_spec",
        },
      },
    ],
  },
  golang_expression: {
    alt: [
      {
        ref: "golang_identifier",
      },
      {
        ref: "golang_literal",
      },
      {
        ref: "golang_function_call",
      },
      {
        ref: "unary_expression",
      },
      {
        ref: "binary_expression",
      },
    ],
  },
  unary_expression: {
    seq: [
      {
        ref: "unary_operator",
      },
      " ",
      {
        ref: "golang_expression",
      },
    ],
  },
  unary_operator: {
    alt: ["&", "*", "+", "-", "!", "^", "<-"],
  },
  binary_expression: {
    seq: [
      {
        ref: "golang_expression",
      },
      " ",
      {
        ref: "binary_operator",
      },
      " ",
      {
        ref: "golang_expression",
      },
    ],
  },
  binary_operator: {
    alt: [
      "+",
      "-",
      "*",
      "/",
      "%",
      "&",
      "|",
      "^",
      "<<",
      ">>",
      "&&",
      "||",
      "==",
      "!=",
      "<",
      "<=",
      ">",
      ">=",
    ],
  },
  golang_literal: {
    alt: [
      {
        ref: "golang_number_literal",
      },
      {
        ref: "golang_string_literal",
      },
      {
        ref: "golang_boolean_literal",
      },
      {
        ref: "golang_nil_literal",
      },
    ],
  },
  golang_number_literal: {
    alt: ["0", "1", "2", "42", "100", "200", "404"],
  },
  golang_string_literal: {
    alt: [
      {
        seq: ['"', '"'],
      },
      {
        seq: ["`", "`"],
      },
    ],
  },
  golang_boolean_literal: {
    alt: ["true", "false"],
  },
  golang_nil_literal: "nil",
  golang_function_call: {
    seq: [
      {
        ref: "golang_identifier",
      },
      " ",
      "(",
      " ",
      {
        ref: "argument_list",
      },
      " ",
      ")",
    ],
  },
  argument_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "golang_expression",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              ",",
              " ",
              {
                ref: "golang_expression",
              },
            ],
          },
        },
      ],
    },
  },
  golang_identifier: {
    alt: ["x", "y", "z", "result", "data", "input", "err", "val"],
  },
  golang_function_name: {
    alt: [
      "main",
      "calculate",
      "setValue",
      "getResult",
      "init",
      "String",
      "Error",
    ],
  },
  golang_type_name: {
    alt: [
      "string",
      "int",
      "bool",
      "float64",
      "CustomType",
      "Error",
      "Reader",
      "Writer",
    ],
  },
  golang_package_name: {
    alt: [
      "main",
      "fmt",
      "strings",
      "math",
      "os",
      "io",
      "net/http",
      "encoding/json",
    ],
  },
  golang_method_name: {
    alt: ["Read", "Write", "String", "Error", "Close", "Parse"],
  },
  comment: {
    alt: [
      {
        ref: "single_line_comment",
      },
      {
        ref: "multi_line_comment",
      },
    ],
  },
  single_line_comment: {
    seq: [
      "//",
      " ",
      {
        ref: "comment_text",
      },
    ],
  },
  multi_line_comment: {
    seq: [
      "/*",
      " ",
      {
        ref: "comment_text",
      },
      " ",
      "*/",
    ],
  },
  comment_text: {
    alt: [
      "Function to calculate the result",
      "TODO: Improve performance",
      "This is a constructor",
      "Package documentation",
      "Returns value with error",
      "Implements interface",
      "Deprecated: Use alternative function",
    ],
  },
  kw_package: "package",
  kw_import: "import",
  kw_func: "func",
  kw_type: "type",
  kw_struct: "struct",
  kw_interface: "interface",
  kw_var: "var",
  kw_const: "const",
  kw_map: "map",
  kw_chan: "chan",
  kw_bool: "bool",
  kw_int: "int",
  kw_int8: "int8",
  kw_int16: "int16",
  kw_int32: "int32",
  kw_int64: "int64",
  kw_uint: "uint",
  kw_uint8: "uint8",
  kw_uint16: "uint16",
  kw_uint32: "uint32",
  kw_uint64: "uint64",
  kw_float32: "float32",
  kw_float64: "float64",
  kw_complex64: "complex64",
  kw_complex128: "complex128",
  kw_string: "string",
  kw_rune: "rune",
  kw_byte: "byte",
} as Rules;
