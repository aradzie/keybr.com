// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "start": {
    "ref": "statement"
  },
  "statement": {
    "alt": [
      {
        "ref": "class_declaration"
      },
      {
        "ref": "interface_declaration"
      },
      {
        "ref": "enum_declaration"
      },
      {
        "flag": "comments",
        "inv": false,
        "cond": {
          "ref": "comment"
        }
      }
    ]
  },
  "class_declaration": {
    "seq": [
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "annotations"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "alt": [
                {
                  "ref": "kw_final"
                },
                {
                  "ref": "kw_abstract"
                }
              ]
            },
            " "
          ]
        }
      },
      {
        "ref": "kw_class"
      },
      " ",
      {
        "ref": "class_name"
      },
      {
        "f": 0.5,
        "opt": {
          "ref": "generic_signature"
        }
      },
      " ",
      "{",
      " ",
      {
        "ref": "class_body"
      },
      " ",
      "}"
    ]
  },
  "class_body": {
    "seq": [
      {
        "ref": "class_field_member"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "class_field_member"
            }
          ]
        }
      },
      " ",
      {
        "ref": "class_method_member"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "class_method_member"
            }
          ]
        }
      }
    ]
  },
  "class_field_member": {
    "seq": [
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "annotations"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "access_modifier"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "kw_static"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "kw_final"
            },
            " "
          ]
        }
      },
      {
        "ref": "type"
      },
      " ",
      {
        "ref": "variable_name"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            "=",
            " ",
            {
              "ref": "expression"
            }
          ]
        }
      },
      ";"
    ]
  },
  "class_method_member": {
    "seq": [
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "annotations"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "access_modifier"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "kw_static"
            },
            " "
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "kw_final"
            },
            " "
          ]
        }
      },
      {
        "ref": "method_signature"
      },
      {
        "alt": [
          {
            "seq": [
              " ",
              {
                "ref": "method_body"
              }
            ]
          },
          ";"
        ]
      }
    ]
  },
  "interface_declaration": {
    "seq": [
      {
        "ref": "kw_interface"
      },
      " ",
      {
        "ref": "class_name"
      },
      {
        "f": 0.5,
        "opt": {
          "ref": "generic_signature"
        }
      },
      " ",
      "{",
      " ",
      {
        "ref": "interface_body"
      },
      " ",
      "}"
    ]
  },
  "interface_body": {
    "seq": [
      {
        "ref": "interface_member"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "interface_member"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  " ",
                  {
                    "ref": "interface_member"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "interface_member": {
    "seq": [
      {
        "ref": "method_signature"
      },
      ";"
    ]
  },
  "enum_declaration": {
    "seq": [
      {
        "ref": "kw_enum"
      },
      " ",
      {
        "ref": "class_name"
      },
      " ",
      "{",
      " ",
      {
        "ref": "enum_member_list"
      },
      " ",
      "}"
    ]
  },
  "enum_member_list": {
    "seq": [
      {
        "ref": "enum_member"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "enum_member"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  ",",
                  " ",
                  {
                    "ref": "enum_member"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "enum_member": {
    "ref": "variable_name"
  },
  "method_signature": {
    "seq": [
      {
        "ref": "return_type"
      },
      " ",
      {
        "ref": "method_name"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "parameter_list"
        }
      },
      ")"
    ]
  },
  "parameter_list": {
    "seq": [
      {
        "ref": "parameter"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "parameter"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  ",",
                  " ",
                  {
                    "ref": "parameter"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "parameter": {
    "seq": [
      {
        "ref": "type"
      },
      " ",
      {
        "ref": "variable_name"
      }
    ]
  },
  "method_body": {
    "seq": [
      "{",
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "kw_return"
            },
            " ",
            {
              "ref": "expression"
            },
            ";",
            " "
          ]
        }
      },
      "}"
    ]
  },
  "access_modifier": {
    "alt": [
      {
        "ref": "kw_public"
      },
      {
        "ref": "kw_private"
      },
      {
        "ref": "kw_protected"
      }
    ]
  },
  "class_name": {
    "ref": "generic_class_name"
  },
  "return_type": {
    "alt": [
      {
        "ref": "kw_void"
      },
      {
        "ref": "type"
      }
    ]
  },
  "type": {
    "alt": [
      {
        "ref": "primitive_type"
      },
      {
        "ref": "reference_type"
      },
      "T"
    ]
  },
  "primitive_type": {
    "alt": [
      {
        "ref": "kw_boolean"
      },
      {
        "ref": "kw_byte"
      },
      {
        "ref": "kw_char"
      },
      {
        "ref": "kw_double"
      },
      {
        "ref": "kw_float"
      },
      {
        "ref": "kw_int"
      },
      {
        "ref": "kw_long"
      },
      {
        "ref": "kw_short"
      },
      "String",
      "Object"
    ]
  },
  "reference_type": {
    "seq": [
      {
        "ref": "class_name"
      },
      {
        "f": 0.5,
        "opt": "[]"
      }
    ]
  },
  "expression": {
    "alt": [
      {
        "ref": "var_exp"
      },
      {
        "ref": "call_exp"
      },
      {
        "ref": "new_exp"
      },
      {
        "ref": "literal"
      }
    ]
  },
  "var_exp": {
    "seq": [
      {
        "ref": "variable_name"
      },
      {
        "f": 0.5,
        "opt": {
          "flag": "numbers",
          "inv": false,
          "cond": {
            "seq": [
              "[",
              {
                "ref": "number_literal"
              },
              "]"
            ]
          }
        }
      }
    ]
  },
  "call_exp": {
    "seq": [
      {
        "f": 0.5,
        "opt": {
          "seq": [
            "System",
            "."
          ]
        }
      },
      {
        "ref": "method_name"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "argument_list"
        }
      },
      ")"
    ]
  },
  "new_exp": {
    "seq": [
      "new",
      " ",
      {
        "ref": "class_name"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "argument_list"
        }
      },
      ")"
    ]
  },
  "argument_list": {
    "seq": [
      {
        "ref": "expression"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "expression"
            }
          ]
        }
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "expression"
            }
          ]
        }
      }
    ]
  },
  "literal": {
    "alt": [
      {
        "ref": "kw_null"
      },
      {
        "alt": [
          {
            "ref": "kw_true"
          },
          {
            "ref": "kw_false"
          }
        ]
      },
      {
        "flag": "numbers",
        "inv": false,
        "cond": {
          "ref": "number_literal"
        }
      },
      {
        "flag": "strings",
        "inv": false,
        "cond": {
          "ref": "string_literal"
        }
      }
    ]
  },
  "number_literal": {
    "cls": "number",
    "span": {
      "ref": "numeric_literal"
    }
  },
  "string_literal": {
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
  "generic_signature": {
    "seq": [
      "<",
      "T",
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "kw_extends"
            },
            " ",
            {
              "ref": "class_name"
            },
            {
              "f": 0.5,
              "opt": "<T>"
            }
          ]
        }
      },
      ">"
    ]
  },
  "annotations": {
    "seq": [
      {
        "ref": "annotation_name"
      },
      {
        "f": 0.5,
        "opt": {
          "flag": "strings",
          "inv": false,
          "cond": {
            "seq": [
              "(",
              {
                "ref": "string_literal"
              },
              ")"
            ]
          }
        }
      }
    ]
  },
  "annotation_name": {
    "alt": [
      "@After",
      "@Before",
      "@Component",
      "@Controller",
      "@Entity",
      "@Get",
      "@Id",
      "@Inject",
      "@Named",
      "@NotNull",
      "@Param",
      "@Path",
      "@Post",
      "@PostConstruct",
      "@PreDestroy",
      "@Query",
      "@Scope",
      "@Service",
      "@Singleton",
      "@Test"
    ]
  },
  "variable_name": {
    "alt": [
      "body",
      "component",
      "connection",
      "container",
      "data",
      "db",
      "headers",
      "input",
      "query",
      "request",
      "response",
      "result",
      "service",
      "x",
      "y",
      "z"
    ]
  },
  "method_name": {
    "alt": [
      "main",
      "process",
      "handle",
      "accept",
      "update",
      "serialize",
      "send",
      "setValue",
      "getResult"
    ]
  },
  "comment": {
    "cls": "comment",
    "span": {
      "alt": [
        {
          "seq": [
            "//",
            " ",
            {
              "ref": "comment_text"
            }
          ]
        },
        {
          "seq": [
            "/*",
            " ",
            {
              "ref": "comment_text"
            },
            " ",
            "*/"
          ]
        }
      ]
    }
  }
} as Rules;
