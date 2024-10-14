// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    alt: [
      {
        ref: "rust_function_definition_no_caps_no_numbers",
      },
      {
        ref: "rust_assign_no_caps_no_numbers",
      },
      {
        ref: "rust_return_no_caps_no_numbers",
      },
      {
        ref: "rust_comment_no_caps_no_numbers",
      },
    ],
  },
  start_capitalization: {
    alt: [
      {
        ref: "rust_function_definition_caps_no_numbers",
      },
      {
        ref: "rust_struct_definition_caps_no_numbers",
      },
      {
        ref: "rust_assign_caps_no_numbers",
      },
      {
        ref: "rust_return_caps_no_numbers",
      },
      {
        ref: "rust_comment_caps_no_numbers",
      },
    ],
  },
  start_numbers: {
    alt: [
      {
        ref: "rust_function_definition_no_caps_numbers",
      },
      {
        ref: "rust_assign_no_caps_numbers",
      },
      {
        ref: "rust_return_no_caps_numbers",
      },
      {
        ref: "rust_comment_no_caps_no_numbers",
      },
    ],
  },
  start_capitalization_and_numbers: {
    alt: [
      {
        ref: "rust_function_definition_caps_numbers",
      },
      {
        ref: "rust_struct_definition_caps_no_numbers",
      },
      {
        ref: "rust_assign_caps_numbers",
      },
      {
        ref: "rust_return_caps_numbers",
      },
      {
        ref: "rust_comment_caps_no_numbers",
      },
    ],
  },
  rust_function_definition_no_caps_no_numbers: {
    seq: [
      "fn ",
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        ref: "rust_arguments_no_caps_no_numbers",
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            "-> ",
            {
              ref: "rust_type_no_caps_no_numbers",
            },
          ],
        },
      },
      "{",
    ],
  },
  rust_function_definition_caps_no_numbers: {
    seq: [
      "fn ",
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        ref: "rust_arguments_caps_no_numbers",
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            "-> ",
            {
              ref: "rust_type_no_caps_no_numbers",
            },
          ],
        },
      },
      "{",
    ],
  },
  rust_function_definition_no_caps_numbers: {
    seq: [
      "fn ",
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        ref: "rust_arguments_no_caps_numbers",
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            "-> ",
            {
              ref: "rust_type_no_caps_no_numbers",
            },
          ],
        },
      },
      "{",
    ],
  },
  rust_function_definition_caps_numbers: {
    seq: [
      "fn ",
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        ref: "rust_arguments_caps_numbers",
      },
      ")",
      {
        f: 0.5,
        opt: {
          seq: [
            "-> ",
            {
              ref: "rust_type_no_caps_no_numbers",
            },
          ],
        },
      },
      "{",
    ],
  },
  rust_struct_definition_caps_no_numbers: {
    seq: [
      {
        f: 0.5,
        opt: "pub ",
      },
      "struct ",
      {
        ref: "rust_struct_name_caps_no_numbers",
      },
      "{",
    ],
  },
  rust_assign_no_caps_no_numbers: {
    seq: [
      "let ",
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ": ",
            {
              ref: "rust_type_no_caps_no_numbers",
            },
          ],
        },
      },
      " = ",
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
      ";",
    ],
  },
  rust_assign_caps_no_numbers: {
    seq: [
      "let ",
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ": ",
            {
              ref: "rust_type_caps_no_numbers",
            },
          ],
        },
      },
      " = ",
      {
        ref: "rust_expression_caps_no_numbers",
      },
      ";",
    ],
  },
  rust_assign_no_caps_numbers: {
    seq: [
      "let ",
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ": ",
            {
              ref: "rust_type_no_caps_numbers",
            },
          ],
        },
      },
      " = ",
      {
        ref: "rust_expression_no_caps_numbers",
      },
      ";",
    ],
  },
  rust_assign_caps_numbers: {
    seq: [
      "let ",
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ": ",
            {
              ref: "rust_type_caps_numbers",
            },
          ],
        },
      },
      " = ",
      {
        ref: "rust_expression_caps_numbers",
      },
      ";",
    ],
  },
  rust_return_no_caps_no_numbers: {
    seq: [
      "return ",
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
      ";",
    ],
  },
  rust_return_caps_no_numbers: {
    seq: [
      "return ",
      {
        ref: "rust_expression_caps_no_numbers",
      },
      ";",
    ],
  },
  rust_return_no_caps_numbers: {
    seq: [
      "return ",
      {
        ref: "rust_expression_no_caps_numbers",
      },
      ";",
    ],
  },
  rust_return_caps_numbers: {
    seq: [
      "return ",
      {
        ref: "rust_expression_caps_numbers",
      },
      ";",
    ],
  },
  rust_arguments_no_caps_no_numbers: {
    seq: [
      {
        ref: "rust_argument_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_argument_no_caps_no_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_arguments_caps_no_numbers: {
    seq: [
      {
        ref: "rust_argument_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_argument_caps_no_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_arguments_no_caps_numbers: {
    seq: [
      {
        ref: "rust_argument_no_caps_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_argument_no_caps_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_arguments_caps_numbers: {
    seq: [
      {
        ref: "rust_argument_caps_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_argument_caps_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_argument_no_caps_no_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      " : ",
      {
        ref: "rust_type_no_caps_no_numbers",
      },
    ],
  },
  rust_argument_caps_no_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      " : ",
      {
        ref: "rust_type_caps_no_numbers",
      },
    ],
  },
  rust_argument_no_caps_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      " : ",
      {
        ref: "rust_type_no_caps_numbers",
      },
    ],
  },
  rust_argument_caps_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      " : ",
      {
        ref: "rust_type_caps_numbers",
      },
    ],
  },
  rust_expression_no_caps_no_numbers: {
    alt: [
      {
        ref: "rust_literal_no_caps_no_numbers",
      },
      {
        ref: "rust_unary_operation_no_caps_no_numbers",
      },
      {
        ref: "rust_binary_operation_no_caps_no_numbers",
      },
      {
        seq: [
          "(",
          {
            ref: "rust_expression_no_caps_no_numbers",
          },
          ")",
        ],
      },
      {
        ref: "rust_array_definition_no_caps_no_numbers",
      },
      {
        ref: "rust_function_call_no_caps_no_numbers",
      },
    ],
  },
  rust_expression_caps_no_numbers: {
    alt: [
      {
        ref: "rust_literal_caps_no_numbers",
      },
      {
        ref: "rust_unary_operation_caps_no_numbers",
      },
      {
        ref: "rust_binary_operation_caps_no_numbers",
      },
      {
        seq: [
          "(",
          {
            ref: "rust_expression_caps_no_numbers",
          },
          ")",
        ],
      },
      {
        ref: "rust_array_definition_caps_no_numbers",
      },
      {
        ref: "rust_struct_instantiation_caps_no_numbers",
      },
      {
        ref: "rust_function_call_caps_no_numbers",
      },
    ],
  },
  rust_expression_no_caps_numbers: {
    alt: [
      {
        ref: "rust_literal_no_caps_numbers",
      },
      {
        ref: "rust_unary_operation_no_caps_numbers",
      },
      {
        ref: "rust_binary_operation_no_caps_numbers",
      },
      {
        seq: [
          "(",
          {
            ref: "rust_expression_no_caps_numbers",
          },
          ")",
        ],
      },
      {
        ref: "rust_array_definition_no_caps_numbers",
      },
      {
        ref: "rust_function_call_no_caps_numbers",
      },
    ],
  },
  rust_expression_caps_numbers: {
    alt: [
      {
        ref: "rust_literal_caps_numbers",
      },
      {
        ref: "rust_unary_operation_caps_numbers",
      },
      {
        ref: "rust_binary_operation_caps_numbers",
      },
      {
        seq: [
          "(",
          {
            ref: "rust_expression_caps_numbers",
          },
          ")",
        ],
      },
      {
        ref: "rust_array_definition_caps_numbers",
      },
      {
        ref: "rust_struct_instantiation_caps_numbers",
      },
      {
        ref: "rust_function_call_caps_numbers",
      },
    ],
  },
  rust_unary_operation_no_caps_no_numbers: {
    alt: [
      {
        seq: [
          "! ",
          {
            ref: "rust_expression_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "- ",
          {
            ref: "rust_expression_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "* ",
          {
            ref: "rust_expression_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "& ",
          {
            ref: "rust_expression_no_caps_no_numbers",
          },
        ],
      },
    ],
  },
  rust_unary_operation_caps_no_numbers: {
    alt: [
      {
        seq: [
          "! ",
          {
            ref: "rust_expression_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "- ",
          {
            ref: "rust_expression_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "* ",
          {
            ref: "rust_expression_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "& ",
          {
            ref: "rust_expression_caps_no_numbers",
          },
        ],
      },
    ],
  },
  rust_unary_operation_no_caps_numbers: {
    alt: [
      {
        seq: [
          "! ",
          {
            ref: "rust_expression_no_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "- ",
          {
            ref: "rust_expression_no_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "* ",
          {
            ref: "rust_expression_no_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "& ",
          {
            ref: "rust_expression_no_caps_numbers",
          },
        ],
      },
    ],
  },
  rust_unary_operation_caps_numbers: {
    alt: [
      {
        seq: [
          "! ",
          {
            ref: "rust_expression_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "- ",
          {
            ref: "rust_expression_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "* ",
          {
            ref: "rust_expression_caps_numbers",
          },
        ],
      },
      {
        seq: [
          "& ",
          {
            ref: "rust_expression_caps_numbers",
          },
        ],
      },
    ],
  },
  rust_binary_operation_no_caps_no_numbers: {
    seq: [
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
      " ",
      {
        ref: "rust_binary_operator",
      },
      " ",
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
    ],
  },
  rust_binary_operation_caps_no_numbers: {
    seq: [
      {
        ref: "rust_expression_caps_no_numbers",
      },
      " ",
      {
        ref: "rust_binary_operator",
      },
      " ",
      {
        ref: "rust_expression_caps_no_numbers",
      },
    ],
  },
  rust_binary_operation_no_caps_numbers: {
    seq: [
      {
        ref: "rust_expression_no_caps_numbers",
      },
      " ",
      {
        ref: "rust_binary_operator",
      },
      " ",
      {
        ref: "rust_expression_no_caps_numbers",
      },
    ],
  },
  rust_binary_operation_caps_numbers: {
    seq: [
      {
        ref: "rust_expression_caps_numbers",
      },
      " ",
      {
        ref: "rust_binary_operator",
      },
      " ",
      {
        ref: "rust_expression_caps_numbers",
      },
    ],
  },
  rust_function_call_no_caps_no_numbers: {
    seq: [
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "rust_function_args_no_caps_no_numbers",
        },
      },
      ")",
    ],
  },
  rust_function_call_caps_no_numbers: {
    seq: [
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "rust_function_args_caps_no_numbers",
        },
      },
      ")",
    ],
  },
  rust_function_call_no_caps_numbers: {
    seq: [
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "rust_function_args_no_caps_numbers",
        },
      },
      ")",
    ],
  },
  rust_function_call_caps_numbers: {
    seq: [
      {
        ref: "rust_function_name_no_caps_no_numbers",
      },
      "(",
      {
        f: 0.5,
        opt: {
          ref: "rust_function_args_caps_numbers",
        },
      },
      ")",
    ],
  },
  rust_function_args_no_caps_no_numbers: {
    seq: [
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_no_caps_no_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_function_args_caps_no_numbers: {
    seq: [
      {
        ref: "rust_expression_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_caps_no_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_function_args_no_caps_numbers: {
    seq: [
      {
        ref: "rust_expression_no_caps_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_no_caps_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_function_args_caps_numbers: {
    seq: [
      {
        ref: "rust_expression_caps_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_caps_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_type_no_caps_no_numbers: {
    alt: [
      {
        ref: "rust_primitive_type_no_caps_no_numbers",
      },
      {
        seq: [
          "&",
          {
            f: 0.5,
            opt: "mut ",
          },
          {
            ref: "rust_type_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          {
            ref: "rust_type_no_caps_no_numbers",
          },
          " <",
          {
            ref: "rust_type_no_caps_no_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_no_caps_no_numbers",
                },
              ],
            },
          },
          ">",
        ],
      },
      {
        seq: [
          "(",
          {
            ref: "rust_type_no_caps_no_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_no_caps_no_numbers",
                },
              ],
            },
          },
          ")",
        ],
      },
    ],
  },
  rust_type_caps_no_numbers: {
    alt: [
      {
        ref: "rust_primitive_type_caps_no_numbers",
      },
      {
        seq: [
          "&",
          {
            f: 0.5,
            opt: "mut ",
          },
          {
            ref: "rust_type_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          {
            ref: "rust_type_caps_no_numbers",
          },
          " <",
          {
            ref: "rust_type_caps_no_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_caps_no_numbers",
                },
              ],
            },
          },
          ">",
        ],
      },
      {
        seq: [
          "(",
          {
            ref: "rust_type_caps_no_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_caps_no_numbers",
                },
              ],
            },
          },
          ")",
        ],
      },
    ],
  },
  rust_type_no_caps_numbers: {
    alt: [
      {
        ref: "rust_primitive_type_no_caps_numbers",
      },
      {
        seq: [
          "&",
          {
            f: 0.5,
            opt: "mut ",
          },
          {
            ref: "rust_type_no_caps_numbers",
          },
        ],
      },
      {
        seq: [
          {
            ref: "rust_type_no_caps_numbers",
          },
          " <",
          {
            ref: "rust_type_no_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_no_caps_numbers",
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
            ref: "rust_type_no_caps_numbers",
          },
          "; ",
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
            ref: "rust_type_no_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_no_caps_numbers",
                },
              ],
            },
          },
          ")",
        ],
      },
    ],
  },
  rust_type_caps_numbers: {
    alt: [
      {
        ref: "rust_primitive_type_caps_numbers",
      },
      {
        seq: [
          "&",
          {
            f: 0.5,
            opt: "mut ",
          },
          {
            ref: "rust_type_caps_numbers",
          },
        ],
      },
      {
        seq: [
          {
            ref: "rust_type_caps_numbers",
          },
          " <",
          {
            ref: "rust_type_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_caps_numbers",
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
            ref: "rust_type_caps_numbers",
          },
          "; ",
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
            ref: "rust_type_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_type_caps_numbers",
                },
              ],
            },
          },
          ")",
        ],
      },
    ],
  },
  rust_primitive_type_no_caps_no_numbers: {
    alt: ["bool", "char", "str", "usize", "isize"],
  },
  rust_primitive_type_caps_no_numbers: {
    alt: [
      {
        ref: "rust_struct_name_caps_no_numbers",
      },
      "bool",
      "char",
      "str",
      "String",
      "usize",
      "isize",
    ],
  },
  rust_primitive_type_no_caps_numbers: {
    alt: [
      "i32",
      "u32",
      "f32",
      "bool",
      "char",
      "str",
      "usize",
      "isize",
      "i64",
      "u64",
      "f64",
    ],
  },
  rust_primitive_type_caps_numbers: {
    alt: [
      {
        ref: "rust_struct_name_caps_no_numbers",
      },
      "i32",
      "u32",
      "f32",
      "bool",
      "char",
      "str",
      "String",
      "usize",
      "isize",
      "i64",
      "u64",
      "f64",
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
  rust_array_definition_no_caps_no_numbers: {
    seq: [
      "[",
      {
        ref: "rust_expression_no_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_no_caps_no_numbers",
            },
          ],
        },
      },
      "]",
    ],
  },
  rust_array_definition_caps_no_numbers: {
    seq: [
      "[",
      {
        ref: "rust_expression_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_expression_caps_no_numbers",
            },
          ],
        },
      },
      "]",
    ],
  },
  rust_array_definition_no_caps_numbers: {
    alt: [
      {
        seq: [
          "[",
          {
            ref: "rust_expression_no_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_expression_no_caps_numbers",
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
            ref: "rust_expression_no_caps_numbers",
          },
          "; ",
          {
            ref: "rust_number_literal",
          },
          "]",
        ],
      },
    ],
  },
  rust_array_definition_caps_numbers: {
    alt: [
      {
        seq: [
          "[",
          {
            ref: "rust_expression_caps_numbers",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "rust_expression_caps_numbers",
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
            ref: "rust_expression_caps_numbers",
          },
          "; ",
          {
            ref: "rust_number_literal",
          },
          "]",
        ],
      },
    ],
  },
  rust_struct_instantiation_caps_no_numbers: {
    seq: [
      {
        ref: "rust_struct_name_caps_no_numbers",
      },
      "{",
      {
        ref: "rust_struct_fields_caps_no_numbers",
      },
      "}",
    ],
  },
  rust_struct_instantiation_caps_numbers: {
    seq: [
      {
        ref: "rust_struct_name_caps_no_numbers",
      },
      "{",
      {
        ref: "rust_struct_fields_caps_numbers",
      },
      "}",
    ],
  },
  rust_struct_fields_caps_no_numbers: {
    seq: [
      {
        ref: "rust_field_assignment_caps_no_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_field_assignment_caps_no_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_struct_fields_caps_numbers: {
    seq: [
      {
        ref: "rust_field_assignment_caps_numbers",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "rust_field_assignment_caps_numbers",
            },
          ],
        },
      },
    ],
  },
  rust_field_assignment_caps_no_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      ": ",
      {
        ref: "rust_expression_caps_no_numbers",
      },
    ],
  },
  rust_field_assignment_caps_numbers: {
    seq: [
      {
        ref: "rust_variable_name_no_caps_no_numbers",
      },
      ": ",
      {
        ref: "rust_expression_caps_numbers",
      },
    ],
  },
  rust_literal_no_caps_no_numbers: {
    alt: [
      {
        ref: "rust_string_literal_no_caps_no_numbers",
      },
      {
        ref: "rust_boolean_literal",
      },
      {
        ref: "rust_char_literal_no_caps_no_numbers",
      },
    ],
  },
  rust_literal_caps_no_numbers: {
    alt: [
      {
        ref: "rust_string_literal_caps_no_numbers",
      },
      {
        ref: "rust_boolean_literal",
      },
      {
        ref: "rust_char_literal_no_caps_no_numbers",
      },
    ],
  },
  rust_literal_no_caps_numbers: {
    alt: [
      {
        ref: "rust_string_literal_no_caps_no_numbers",
      },
      {
        ref: "rust_number_literal",
      },
      {
        ref: "rust_boolean_literal",
      },
      {
        ref: "rust_char_literal_no_caps_numbers",
      },
    ],
  },
  rust_literal_caps_numbers: {
    alt: [
      {
        ref: "rust_string_literal_caps_no_numbers",
      },
      {
        ref: "rust_number_literal",
      },
      {
        ref: "rust_boolean_literal",
      },
      {
        ref: "rust_char_literal_no_caps_numbers",
      },
    ],
  },
  rust_string_literal_no_caps_no_numbers: {
    seq: [
      '"',
      {
        ref: "rust_string_value_no_caps_no_numbers",
      },
      '"',
    ],
  },
  rust_string_literal_caps_no_numbers: {
    seq: [
      '"',
      {
        ref: "rust_string_value_caps_no_numbers",
      },
      '"',
    ],
  },
  rust_char_literal_no_caps_no_numbers: {
    seq: [
      "'",
      {
        ref: "rust_char_value_no_caps_no_numbers",
      },
      "'",
    ],
  },
  rust_char_literal_no_caps_numbers: {
    seq: [
      "'",
      {
        ref: "rust_char_value_no_caps_numbers",
      },
      "'",
    ],
  },
  rust_boolean_literal: {
    alt: ["true", "false"],
  },
  rust_variable_name_no_caps_no_numbers: {
    alt: [
      "x",
      "y",
      "z",
      "i",
      "j",
      "k",
      "val",
      "res",
      "data",
      "idx",
      "count",
      "logger",
      "size",
      "buffer",
      "ptr",
      "vec",
      "map",
      "item",
      "key",
      "ctx",
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
  rust_function_name_no_caps_no_numbers: {
    alt: [
      "main",
      "new",
      "len",
      "push",
      "pop",
      "insert",
      "remove",
      "get",
      "set",
      "update",
      "compute",
      "process",
      "run",
      "execute",
      "handle",
      "read",
      "write",
      "calculate",
      "draw",
      "render",
      "add",
      "subtract",
      "multiply",
      "divide",
      "print",
      "println",
    ],
  },
  rust_struct_name_caps_no_numbers: {
    alt: [
      "Config",
      "Client",
      "Server",
      "Connection",
      "Request",
      "Response",
      "Error",
      "State",
      "Builder",
      "Handler",
      "Worker",
      "Parser",
      "Encoder",
      "Decoder",
      "Person",
      "Pool",
      "Cache",
      "Queue",
      "Context",
      "Manager",
    ],
  },
  rust_string_value_caps_no_numbers: {
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
  rust_string_value_no_caps_no_numbers: {
    alt: [
      "",
      "hello, world!",
      "error",
      "ok",
      "test",
      "name",
      "value",
      "message",
      "key",
      "input",
      "output",
      "data",
      "result",
      "success",
      "failure",
      "warning",
      "info",
      "debug",
      "rust",
      "sample",
    ],
  },
  rust_char_value_no_caps_no_numbers: {
    alt: ["a", "b", "c", "x", "y", "z", "\\n", "\\t", "\\r"],
  },
  rust_char_value_no_caps_numbers: {
    alt: ["a", "b", "c", "x", "y", "z", "0", "1", "2", "\\n", "\\t", "\\r"],
  },
  rust_number_literal: {
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
  rust_comment_no_caps_no_numbers: {
    alt: [
      {
        seq: [
          "//",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "///",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "////",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "//!",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "//!!",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "/* ",
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/** ",
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*** ",
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*! ",
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*!! ",
          {
            ref: "rust_comment_text_no_caps_no_numbers",
          },
          " */",
        ],
      },
    ],
  },
  rust_comment_caps_no_numbers: {
    alt: [
      {
        seq: [
          "//",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "///",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "////",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "//!",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "//!!",
          {
            f: 0.5,
            opt: " ",
          },
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
        ],
      },
      {
        seq: [
          "/* ",
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/** ",
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*** ",
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*! ",
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
          " */",
        ],
      },
      {
        seq: [
          "/*!! ",
          {
            ref: "rust_comment_text_caps_no_numbers",
          },
          " */",
        ],
      },
    ],
  },
  rust_comment_text_caps_no_numbers: {
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
  rust_comment_text_no_caps_no_numbers: {
    alt: [
      "todo: implement error handling",
      "fixme: potential race condition",
      "Unsafe: raw pointer manipulation",
      "optimize memory allocation",
      "ensure thread safety",
      "zero-copy deserialization",
      "handle lifetime issues",
      "implement drop trait",
      "lock-free data structure",
      "ffi: c interop",
      "benchmark performance",
      "async/await transformation",
      "check for integer overflow",
    ],
  },
} as Rules;
