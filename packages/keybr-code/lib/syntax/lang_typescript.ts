// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "ts_statement",
  },
  ts_statement: {
    alt: [
      {
        ref: "ts_interface_declaration",
      },
      {
        ref: "ts_type_declaration",
      },
      {
        ref: "ts_enum_declaration",
      },
      {
        ref: "ts_namespace_declaration",
      },
      {
        ref: "ts_function_signature",
      },
      {
        ref: "ts_variable_declaration",
      },
      {
        flag: "comments",
        inv: false,
        cond: {
          ref: "ts_comment",
        },
      },
    ],
  },
  ts_interface_declaration: {
    seq: [
      {
        ref: "kw_interface",
      },
      " ",
      {
        ref: "ts_type_name",
      },
      " ",
      {
        ref: "ts_type_parameters",
      },
      " ",
      "{",
      " ",
      {
        ref: "ts_interface_body",
      },
      " ",
      "}",
    ],
  },
  ts_interface_body: {
    seq: [
      {
        ref: "ts_property_signature",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ";",
            " ",
            {
              ref: "ts_property_signature",
            },
          ],
        },
      },
      ";",
    ],
  },
  ts_property_signature: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "ts_access_modifier",
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
              ref: "kw_readonly",
            },
            " ",
          ],
        },
      },
      {
        ref: "ts_property_name",
      },
      {
        f: 0.5,
        opt: "?",
      },
      ":",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_type_declaration: {
    seq: [
      {
        ref: "kw_type",
      },
      " ",
      {
        ref: "ts_type_name",
      },
      " ",
      {
        ref: "ts_type_parameters",
      },
      " ",
      "=",
      " ",
      {
        ref: "ts_type",
      },
      ";",
    ],
  },
  ts_type: {
    alt: [
      {
        ref: "ts_primitive_type",
      },
      {
        ref: "ts_union_type",
      },
      {
        ref: "ts_intersection_type",
      },
      {
        ref: "ts_array_type",
      },
      {
        ref: "ts_tuple_type",
      },
      {
        ref: "ts_function_type",
      },
      {
        ref: "ts_object_type",
      },
      {
        ref: "ts_mapped_type",
      },
      {
        ref: "ts_conditional_type",
      },
      {
        ref: "ts_type_reference",
      },
      {
        seq: [
          "(",
          {
            ref: "ts_type",
          },
          ")",
        ],
      },
    ],
  },
  ts_primitive_type: {
    alt: [
      {
        ref: "kw_string",
      },
      {
        ref: "kw_number",
      },
      {
        ref: "kw_boolean",
      },
      {
        ref: "kw_null",
      },
      {
        ref: "kw_undefined",
      },
      {
        ref: "kw_void",
      },
      {
        ref: "kw_any",
      },
      {
        ref: "kw_never",
      },
      {
        ref: "kw_unknown",
      },
      {
        ref: "kw_object",
      },
      {
        ref: "kw_symbol",
      },
      {
        ref: "kw_bigint",
      },
    ],
  },
  ts_union_type: {
    seq: [
      {
        ref: "ts_type",
      },
      " ",
      "|",
      " ",
      {
        ref: "ts_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "|",
            " ",
            {
              ref: "ts_type",
            },
          ],
        },
      },
    ],
  },
  ts_intersection_type: {
    seq: [
      {
        ref: "ts_type",
      },
      " ",
      "&",
      " ",
      {
        ref: "ts_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            "&",
            " ",
            {
              ref: "ts_type",
            },
          ],
        },
      },
    ],
  },
  ts_array_type: {
    seq: [
      {
        ref: "ts_type",
      },
      "[]",
    ],
  },
  ts_tuple_type: {
    seq: [
      "[",
      {
        ref: "ts_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "ts_type",
            },
          ],
        },
      },
      "]",
    ],
  },
  ts_function_type: {
    seq: [
      "(",
      {
        ref: "ts_parameter_list",
      },
      ")",
      " ",
      "=>",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_object_type: {
    seq: [
      "{",
      " ",
      {
        ref: "ts_object_member_list",
      },
      " ",
      "}",
    ],
  },
  ts_object_member_list: {
    seq: [
      {
        ref: "ts_object_member",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ";",
            " ",
            {
              ref: "ts_object_member",
            },
          ],
        },
      },
    ],
  },
  ts_object_member: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_readonly",
            },
            " ",
          ],
        },
      },
      {
        ref: "ts_property_name",
      },
      {
        f: 0.5,
        opt: "?",
      },
      ":",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_mapped_type: {
    seq: [
      "{",
      " ",
      {
        f: 0.5,
        opt: {
          alt: ["+", "-"],
        },
      },
      {
        f: 0.5,
        opt: {
          ref: "kw_readonly",
        },
      },
      " ",
      "[",
      {
        ref: "ts_type_parameter",
      },
      " ",
      {
        ref: "kw_in",
      },
      " ",
      {
        ref: "ts_type",
      },
      "]",
      {
        f: 0.5,
        opt: {
          alt: ["+", "-"],
        },
      },
      {
        f: 0.5,
        opt: "?",
      },
      ":",
      " ",
      {
        ref: "ts_type",
      },
      " ",
      "}",
    ],
  },
  ts_conditional_type: {
    seq: [
      {
        ref: "ts_type",
      },
      " ",
      {
        ref: "kw_extends",
      },
      " ",
      {
        ref: "ts_type",
      },
      " ",
      "?",
      " ",
      {
        ref: "ts_type",
      },
      " ",
      ":",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_type_reference: {
    seq: [
      {
        ref: "ts_type_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            "<",
            {
              ref: "ts_type_argument_list",
            },
            ">",
          ],
        },
      },
    ],
  },
  ts_type_argument_list: {
    seq: [
      {
        ref: "ts_type",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "ts_type",
            },
          ],
        },
      },
    ],
  },
  ts_enum_declaration: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_const",
            },
            " ",
          ],
        },
      },
      {
        ref: "kw_enum",
      },
      " ",
      {
        ref: "ts_enum_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "ts_enum_member_list",
      },
      " ",
      "}",
    ],
  },
  ts_enum_member_list: {
    seq: [
      {
        ref: "ts_enum_member",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "ts_enum_member",
            },
          ],
        },
      },
    ],
  },
  ts_enum_member: {
    seq: [
      {
        ref: "ts_identifier",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            "=",
            " ",
            {
              alt: [
                {
                  ref: "ts_number_literal",
                },
                {
                  ref: "ts_string_literal",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  ts_namespace_declaration: {
    seq: [
      {
        ref: "kw_namespace",
      },
      " ",
      {
        ref: "ts_namespace_name",
      },
      " ",
      "{",
      " ",
      {
        ref: "ts_namespace_body",
      },
      " ",
      "}",
    ],
  },
  ts_namespace_body: {
    f: 0.5,
    opt: {
      ref: "ts_statement",
    },
  },
  ts_function_signature: {
    seq: [
      {
        ref: "kw_function",
      },
      " ",
      {
        ref: "ts_function_name",
      },
      " ",
      {
        ref: "ts_type_parameters",
      },
      " ",
      "(",
      {
        ref: "ts_parameter_list",
      },
      ")",
      " ",
      {
        f: 0.5,
        opt: {
          seq: [
            ":",
            " ",
            {
              ref: "ts_type",
            },
          ],
        },
      },
      ";",
    ],
  },
  ts_variable_declaration: {
    seq: [
      {
        f: 0.5,
        opt: {
          seq: [
            {
              ref: "kw_declare",
            },
            " ",
          ],
        },
      },
      {
        f: 0.5,
        opt: {
          alt: [
            {
              ref: "kw_const",
            },
            {
              ref: "kw_let",
            },
          ],
        },
      },
      " ",
      {
        ref: "ts_identifier",
      },
      ":",
      " ",
      {
        ref: "ts_type",
      },
      ";",
    ],
  },
  ts_parameter_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "ts_parameter",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              ",",
              " ",
              {
                ref: "ts_parameter",
              },
            ],
          },
        },
      ],
    },
  },
  ts_parameter: {
    f: 0.5,
    opt: {
      alt: [
        {
          ref: "ts_rest_parameter",
        },
        {
          ref: "ts_optional_parameter",
        },
        {
          ref: "ts_required_parameter",
        },
      ],
    },
  },
  ts_required_parameter: {
    seq: [
      {
        ref: "ts_identifier",
      },
      ":",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_optional_parameter: {
    seq: [
      {
        ref: "ts_identifier",
      },
      "?",
      ":",
      " ",
      {
        ref: "ts_type",
      },
    ],
  },
  ts_rest_parameter: {
    seq: [
      "...",
      {
        ref: "ts_identifier",
      },
      ":",
      " ",
      {
        ref: "ts_array_type",
      },
    ],
  },
  ts_type_parameters: {
    f: 0.5,
    opt: {
      seq: [
        "<",
        {
          ref: "ts_type_parameter_list",
        },
        ">",
      ],
    },
  },
  ts_type_parameter_list: {
    seq: [
      {
        ref: "ts_type_parameter",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ",",
            " ",
            {
              ref: "ts_type_parameter",
            },
          ],
        },
      },
    ],
  },
  ts_type_parameter: {
    seq: [
      {
        ref: "ts_identifier",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "kw_extends",
            },
            " ",
            {
              ref: "ts_type",
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
              ref: "ts_type",
            },
          ],
        },
      },
    ],
  },
  ts_property_name: {
    alt: [
      {
        ref: "ts_identifier",
      },
      {
        ref: "ts_string_literal",
      },
    ],
  },
  ts_access_modifier: {
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
  ts_type_name: {
    ref: "ts_identifier",
  },
  ts_enum_name: {
    ref: "ts_identifier",
  },
  ts_namespace_name: {
    ref: "ts_identifier",
  },
  ts_function_name: {
    ref: "ts_identifier",
  },
  ts_identifier: {
    alt: [
      "T",
      "U",
      "V",
      "K",
      "P",
      "R",
      "Props",
      "State",
      "Config",
      "Options",
      "Result",
      "UserData",
      "ApiResponse",
      "Callback",
      "Handler",
      "EventData",
      "Partial",
      "Readonly",
      "Record",
      "Pick",
      "Omit",
      "Exclude",
      "Extract",
      "NonNullable",
      "Required",
      "ReturnType",
      "InstanceType",
      "Parameters",
      "ConstructorParameters",
      "ThisType",
    ],
  },
  ts_number_literal: {
    cls: "number",
    span: {
      alt: ["0", "1", "2", "42", "100", "200", "404", "500"],
    },
  },
  ts_string_literal: {
    cls: "string",
    span: {
      alt: ['"error"', '"success"', '"pending"', '"data"', '"key"', '"value"'],
    },
  },
  ts_comment: {
    cls: "comment",
    span: {
      alt: [
        {
          seq: [
            "//",
            " ",
            {
              ref: "ts_comment_text",
            },
          ],
        },
        {
          seq: [
            "/*",
            " ",
            {
              ref: "ts_comment_text",
            },
            " ",
            "*/",
          ],
        },
        {
          seq: [
            "/**",
            " ",
            {
              ref: "ts_comment_text",
            },
            " ",
            "*/",
          ],
        },
      ],
    },
  },
  ts_comment_text: {
    alt: [
      "Type definition",
      "Interface for API response",
      "Generic type parameter",
      "Utility type",
      "TODO: Add validation",
      "FIXME: Handle edge case",
      "@param description",
      "@returns description",
      "@template T The type parameter",
      "@deprecated Use alternative instead",
    ],
  },
} as Rules;
