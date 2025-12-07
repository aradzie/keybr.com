// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "start": {
    "ref": "python_statement"
  },
  "python_statement": {
    "alt": [
      {
        "ref": "python_function_definition"
      },
      {
        "ref": "python_function_definition"
      },
      {
        "ref": "python_class_definition"
      },
      {
        "ref": "python_class_definition"
      },
      {
        "ref": "python_assign"
      },
      {
        "ref": "python_assign"
      },
      {
        "ref": "python_return"
      },
      {
        "ref": "python_return"
      },
      {
        "flag": "comments",
        "inv": false,
        "cond": {
          "ref": "python_comment"
        }
      }
    ]
  },
  "python_function_definition": {
    "seq": [
      {
        "ref": "kw_def"
      },
      " ",
      {
        "ref": "python_function_name"
      },
      "(",
      {
        "ref": "python_arguments"
      },
      ")",
      {
        "flag": "types",
        "inv": false,
        "cond": {
          "seq": [
            " ",
            "->",
            " ",
            {
              "ref": "python_type"
            }
          ]
        }
      },
      ":"
    ]
  },
  "python_class_definition": {
    "seq": [
      {
        "ref": "kw_class"
      },
      " ",
      {
        "ref": "python_class_name"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            "(",
            {
              "ref": "python_class_name"
            },
            ")"
          ]
        }
      },
      ":"
    ]
  },
  "python_assign": {
    "seq": [
      {
        "ref": "python_variable_name"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            "[",
            {
              "ref": "python_literal"
            },
            "]"
          ]
        }
      },
      " ",
      "=",
      " ",
      {
        "ref": "python_expression"
      }
    ]
  },
  "python_return": {
    "seq": [
      {
        "ref": "kw_return"
      },
      " ",
      {
        "ref": "python_expression"
      }
    ]
  },
  "python_arguments": {
    "seq": [
      {
        "ref": "python_argument"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "python_argument"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  ",",
                  " ",
                  {
                    "ref": "python_argument"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "python_argument": {
    "seq": [
      {
        "ref": "python_variable_name"
      },
      {
        "flag": "types",
        "inv": false,
        "cond": {
          "seq": [
            ":",
            " ",
            {
              "ref": "python_type"
            }
          ]
        }
      }
    ]
  },
  "python_expression": {
    "alt": [
      {
        "ref": "python_literal"
      },
      {
        "ref": "python_unary_operation"
      },
      {
        "ref": "python_binary_operation"
      },
      {
        "seq": [
          "(",
          {
            "ref": "python_expression"
          },
          ")"
        ]
      },
      {
        "ref": "python_list_definition"
      },
      {
        "ref": "python_dict_definition"
      },
      {
        "ref": "python_function_call"
      }
    ]
  },
  "python_unary_operation": {
    "alt": [
      {
        "seq": [
          {
            "ref": "python_expression"
          },
          " ",
          {
            "ref": "kw_is"
          },
          " ",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "kw_not"
                },
                " "
              ]
            }
          },
          {
            "ref": "kw_None"
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "kw_not"
          },
          " ",
          {
            "ref": "python_expression"
          }
        ]
      },
      {
        "seq": [
          "~",
          {
            "ref": "python_expression"
          }
        ]
      }
    ]
  },
  "python_binary_operation": {
    "seq": [
      {
        "ref": "python_expression"
      },
      " ",
      {
        "ref": "python_binary_operator"
      },
      " ",
      {
        "ref": "python_expression"
      }
    ]
  },
  "python_function_call": {
    "seq": [
      {
        "ref": "python_function_name"
      },
      "(",
      {
        "ref": "python_function_arg"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "python_function_arg"
            }
          ]
        }
      }
    ]
  },
  "python_function_arg": {
    "seq": [
      {
        "ref": "python_variable_name"
      },
      "=",
      {
        "ref": "python_expression"
      }
    ]
  },
  "python_type": {
    "alt": [
      {
        "ref": "python_class_name"
      },
      {
        "ref": "python_class_name"
      },
      {
        "ref": "python_class_name"
      },
      {
        "ref": "python_primitive_type"
      },
      {
        "ref": "python_primitive_type"
      },
      {
        "seq": [
          "list[",
          {
            "ref": "python_primitive_type"
          },
          "]"
        ]
      },
      {
        "seq": [
          "dict[",
          {
            "ref": "python_primitive_type"
          },
          ",",
          " ",
          {
            "ref": "python_primitive_type"
          },
          "]"
        ]
      },
      {
        "seq": [
          "tuple[",
          {
            "ref": "python_primitive_type"
          },
          ",",
          " ",
          "...]"
        ]
      },
      {
        "seq": [
          {
            "ref": "python_primitive_type"
          },
          " ",
          "|",
          " ",
          {
            "ref": "python_primitive_type"
          }
        ]
      }
    ]
  },
  "python_primitive_type": {
    "alt": [
      {
        "ref": "kw_int"
      },
      {
        "ref": "kw_str"
      },
      {
        "ref": "kw_bool"
      },
      {
        "ref": "kw_float"
      },
      {
        "ref": "kw_None"
      }
    ]
  },
  "python_binary_operator": {
    "alt": [
      "+",
      "-",
      "*",
      "/",
      "//",
      "%",
      "**",
      "@",
      "&",
      "|",
      ">",
      "<",
      ">=",
      "<=",
      "==",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "kw_not"
                },
                " "
              ]
            }
          },
          {
            "ref": "kw_in"
          }
        ]
      },
      "^"
    ]
  },
  "python_list_definition": {
    "seq": [
      "[",
      {
        "ref": "python_expression"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "python_expression"
            }
          ]
        }
      },
      "]"
    ]
  },
  "python_dict_definition": {
    "seq": [
      "{",
      {
        "ref": "python_dict_key_value_pair"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "python_dict_key_value_pair"
            }
          ]
        }
      },
      "}"
    ]
  },
  "python_dict_key_value_pair": {
    "seq": [
      {
        "ref": "python_literal"
      },
      ":",
      " ",
      {
        "ref": "python_expression"
      }
    ]
  },
  "python_literal": {
    "seq": [
      {
        "flag": "numbers",
        "inv": false,
        "cond": {
          "alt": [
            {
              "ref": "python_string_literal"
            },
            {
              "ref": "python_number_literal"
            }
          ]
        }
      },
      {
        "flag": "numbers",
        "inv": true,
        "cond": {
          "ref": "python_string_literal"
        }
      }
    ]
  },
  "python_string_literal": {
    "alt": [
      {
        "cls": "string",
        "span": {
          "seq": [
            "\"",
            {
              "ref": "generic_string_content"
            },
            "\""
          ]
        }
      },
      {
        "cls": "string",
        "span": {
          "seq": [
            "'",
            {
              "ref": "generic_string_content"
            },
            "'"
          ]
        }
      },
      {
        "cls": "string",
        "span": {
          "seq": [
            "\"\"\"",
            {
              "ref": "generic_string_content"
            },
            "\"\"\""
          ]
        }
      },
      {
        "cls": "string",
        "span": {
          "seq": [
            "'''",
            {
              "ref": "generic_string_content"
            },
            "'''"
          ]
        }
      }
    ]
  },
  "python_variable_name": {
    "ref": "generic_variable_name"
  },
  "python_function_name": {
    "alt": [
      {
        "ref": "python_builtin_function_name"
      },
      {
        "ref": "generic_function_name"
      },
      {
        "ref": "generic_function_name"
      },
      {
        "ref": "generic_function_name"
      }
    ]
  },
  "python_builtin_function_name": {
    "alt": [
      "__call__",
      "__enter__",
      "__eq__",
      "__exit__",
      "__getattr__",
      "__getitem__",
      "__init__",
      "__iter__",
      "__len__",
      "__ne__",
      "__new__",
      "__repr__",
      "__setattr__",
      "__setitem__",
      "__str__"
    ]
  },
  "python_class_name": {
    "ref": "generic_class_name"
  },
  "python_number_literal": {
    "cls": "number",
    "span": {
      "ref": "numeric_literal"
    }
  },
  "python_comment": {
    "cls": "comment",
    "span": {
      "seq": [
        "# ",
        {
          "ref": "comment_text"
        }
      ]
    }
  }
} as Rules;
