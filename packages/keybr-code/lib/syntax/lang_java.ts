// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "java_statement",
  },
  java_statement: {
    alt: [
      {
        ref: "class_declaration",
      },
      {
        ref: "interface_declaration",
      },
      {
        ref: "enum_declaration",
      },
      {
        ref: "method_signature",
      },
      {
        ref: "variable_declaration",
      },
      {
        ref: "comment",
      },
    ],
  },
  class_declaration: {
    seq: [
      {
        ref: "kw_class",
      },
      " ",
      {
        ref: "java_type_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "class_body",
      },
      " ",
      "}",
    ],
  },
  class_body: {
    seq: [
      {
        ref: "class_member",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ";",
            " ",
            {
              ref: "class_member",
            },
          ],
        },
      },
    ],
  },
  class_member: {
    alt: [
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  ref: "access_modifier",
                },
                " ",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  ref: "kw_static",
                },
                " ",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  ref: "kw_final",
                },
                " ",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  f: 0.5,
                  opt: {
                    alt: [
                      {
                        ref: "kw_private",
                      },
                      {
                        ref: "kw_public",
                      },
                      {
                        ref: "kw_protected",
                      },
                    ],
                  },
                },
                " ",
              ],
            },
          },
          {
            ref: "method_signature",
          },
        ],
      },
      {
        ref: "variable_declaration",
      },
    ],
  },
  method_signature: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "access_modifier",
            },
            " ",
          ],
        },
      },
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_static",
            },
            " ",
          ],
        },
      },
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_final",
            },
            " ",
          ],
        },
      },
      {
        ref: "return_type",
      },
      " ",
      {
        ref: "java_method_name",
      },
      "(",
      " ",
      {
        ref: "parameter_list",
      },
      ")",
    ],
  },
  return_type: {
    alt: [
      {
        ref: "kw_void",
      },
      {
        ref: "java_type",
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
        ref: "java_type",
      },
      " ",
      {
        ref: "java_variable_name",
      },
    ],
  },
  variable_declaration: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_final",
            },
            " ",
          ],
        },
      },
      {
        ref: "java_type",
      },
      " ",
      {
        ref: "java_variable_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "=",
            " ",
            {
              ref: "java_expression",
            },
          ],
        },
      },
      ";",
    ],
  },
  java_type: {
    alt: [
      {
        ref: "kw_int",
      },
      {
        ref: "kw_string",
      },
      {
        ref: "kw_boolean",
      },
      {
        ref: "kw_double",
      },
      {
        ref: "kw_float",
      },
      {
        ref: "kw_char",
      },
      {
        ref: "kw_long",
      },
      {
        ref: "kw_short",
      },
      {
        ref: "kw_byte",
      },
      {
        ref: "kw_void",
      },
      {
        ref: "java_reference_type",
      },
    ],
  },
  java_reference_type: {
    alt: [
      {
        ref: "class_type",
      },
      {
        ref: "interface_type",
      },
      {
        ref: "array_type",
      },
    ],
  },
  class_type: {
    ref: "java_type_name",
  },
  interface_type: {
    seq: [
      {
        ref: "kw_interface",
      },
      " ",
      {
        ref: "java_type_name",
      },
    ],
  },
  array_type: {
    seq: [
      {
        ref: "java_type",
      },
      "[]",
    ],
  },
  java_expression: {
    alt: [
      {
        ref: "java_variable_name",
      },
      {
        ref: "java_literal",
      },
      {
        ref: "java_method_call",
      },
    ],
  },
  java_literal: {
    alt: [
      {
        ref: "java_number_literal",
      },
      {
        ref: "java_string_literal",
      },
      {
        ref: "java_boolean_literal",
      },
    ],
  },
  java_number_literal: {
    alt: ["0", "1", "2", "42", "100", "200", "404"],
  },
  java_string_literal: {
    seq: ['"', '"'],
  },
  java_boolean_literal: {
    alt: ["true", "false"],
  },
  java_method_call: {
    seq: [
      {
        ref: "java_variable_name",
      },
      "(",
      " ",
      {
        ref: "argument_list",
      },
      ")",
    ],
  },
  argument_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "java_expression",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              ",",
              " ",
              {
                ref: "java_expression",
              },
            ],
          },
        },
      ],
    },
  },
  java_variable_name: {
    alt: ["x", "y", "z", "result", "data", "input"],
  },
  java_method_name: {
    alt: ["main", "calculate", "setValue", "getResult"],
  },
  java_type_name: {
    alt: ["String", "Integer", "Double", "Float", "Object", "CustomType"],
  },
  interface_declaration: {
    seq: [
      {
        ref: "kw_interface",
      },
      " ",
      {
        ref: "java_type_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "interface_body",
      },
      " ",
      "}",
    ],
  },
  interface_body: {
    seq: [
      {
        ref: "interface_method_signature",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ";",
            " ",
            {
              ref: "interface_method_signature",
            },
          ],
        },
      },
    ],
  },
  interface_method_signature: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_static",
            },
            " ",
          ],
        },
      },
      {
        ref: "return_type",
      },
      " ",
      {
        ref: "java_method_name",
      },
      "(",
      " ",
      {
        ref: "parameter_list",
      },
      ")",
    ],
  },
  enum_declaration: {
    seq: [
      {
        ref: "kw_enum",
      },
      " ",
      {
        ref: "java_type_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "enum_member_list",
      },
      " ",
      "}",
    ],
  },
  enum_member_list: {
    seq: [
      {
        ref: "enum_member",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            ",",
            " ",
            {
              ref: "enum_member",
            },
          ],
        },
      },
    ],
  },
  enum_member: {
    seq: [
      {
        ref: "java_variable_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "=",
            " ",
            {
              ref: "java_expression",
            },
          ],
        },
      },
    ],
  },
  access_modifier: {
    alt: [
      {
        ref: "kw_public",
      },
      {
        ref: "kw_private",
      },
      {
        ref: "kw_protected",
      },
    ],
  },
  comment: {
    alt: [
      {
        ref: "single_line_comment",
      },
      {
        ref: "multi_line_comment",
      },
      {
        ref: "javadoc_comment",
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
  javadoc_comment: {
    seq: [
      "/**",
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
      "Method to calculate the result",
      "TODO: Improve performance",
      "This is a constructor",
      "@param description",
      "@returns description",
      "@throws exception",
      "@deprecated Use alternative method",
    ],
  },
  kw_class: "class",
  kw_interface: "interface",
  kw_enum: "enum",
  kw_static: "static",
  kw_final: "final",
  kw_private: "private",
  kw_public: "public",
  kw_protected: "protected",
  kw_void: "void",
  kw_int: "int",
  kw_string: "String",
  kw_boolean: "boolean",
  kw_double: "double",
  kw_float: "float",
  kw_char: "char",
  kw_long: "long",
  kw_short: "short",
  kw_byte: "byte",
} as Rules;
