// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "start": {
    "ref": "csharp_statement"
  },
  "csharp_statement": {
    "alt": [
      {
        "ref": "namespace_declaration"
      },
      {
        "ref": "using_declaration"
      },
      {
        "ref": "class_declaration"
      },
      {
        "ref": "interface_declaration"
      },
      {
        "ref": "method_declaration"
      },
      {
        "ref": "field_declaration"
      },
      {
        "ref": "property_declaration"
      },
      {
        "ref": "variable_declaration"
      },
      {
        "ref": "constant_declaration"
      },
      {
        "ref": "comment"
      }
    ]
  },
  "namespace_declaration": {
    "seq": [
      {
        "ref": "kw_namespace"
      },
      " ",
      {
        "ref": "csharp_namespace_name"
      },
      " ",
      "{",
      " ",
      {
        "ref": "csharp_statement_list"
      },
      " ",
      "}"
    ]
  },
  "using_declaration": {
    "seq": [
      {
        "ref": "kw_using"
      },
      " ",
      {
        "ref": "csharp_namespace_name"
      },
      ";"
    ]
  },
  "class_declaration": {
    "seq": [
      {
        "ref": "class_modifiers"
      },
      " ",
      {
        "ref": "kw_class"
      },
      " ",
      {
        "ref": "csharp_type_name"
      },
      " ",
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ":",
            " ",
            {
              "ref": "base_type_list"
            }
          ]
        }
      },
      " ",
      "{",
      " ",
      {
        "ref": "class_member_list"
      },
      " ",
      "}"
    ]
  },
  "class_modifiers": {
    "f": 0.5,
    "opt": {
      "alt": [
        {
          "ref": "kw_public"
        },
        {
          "ref": "kw_private"
        },
        {
          "ref": "kw_protected"
        },
        {
          "ref": "kw_internal"
        },
        {
          "ref": "kw_abstract"
        },
        {
          "ref": "kw_sealed"
        },
        {
          "ref": "kw_static"
        }
      ]
    }
  },
  "base_type_list": {
    "seq": [
      {
        "ref": "csharp_type_name"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            ",",
            " ",
            {
              "ref": "csharp_type_name"
            }
          ]
        }
      }
    ]
  },
  "class_member_list": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "class_member"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              " ",
              {
                "ref": "class_member"
              }
            ]
          }
        }
      ]
    }
  },
  "class_member": {
    "alt": [
      {
        "ref": "method_declaration"
      },
      {
        "ref": "field_declaration"
      },
      {
        "ref": "property_declaration"
      },
      {
        "ref": "constructor_declaration"
      },
      {
        "ref": "comment"
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
        "ref": "csharp_type_name"
      },
      " ",
      "{",
      " ",
      {
        "ref": "interface_member_list"
      },
      " ",
      "}"
    ]
  },
  "interface_member_list": {
    "f": 0.5,
    "opt": {
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
              }
            ]
          }
        }
      ]
    }
  },
  "interface_member": {
    "alt": [
      {
        "ref": "method_declaration"
      },
      {
        "ref": "property_declaration"
      },
      {
        "ref": "comment"
      }
    ]
  },
  "method_declaration": {
    "seq": [
      {
        "ref": "method_modifiers"
      },
      " ",
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_method_name"
      },
      " ",
      "(",
      " ",
      {
        "ref": "parameter_list"
      },
      " ",
      ")",
      " ",
      {
        "ref": "method_body"
      }
    ]
  },
  "method_modifiers": {
    "f": 0.5,
    "opt": {
      "alt": [
        {
          "ref": "kw_public"
        },
        {
          "ref": "kw_private"
        },
        {
          "ref": "kw_protected"
        },
        {
          "ref": "kw_internal"
        },
        {
          "ref": "kw_static"
        },
        {
          "ref": "kw_virtual"
        },
        {
          "ref": "kw_override"
        },
        {
          "ref": "kw_abstract"
        }
      ]
    }
  },
  "method_body": {
    "seq": [
      "{",
      " ",
      {
        "ref": "csharp_statement_list"
      },
      " ",
      "}"
    ]
  },
  "csharp_statement_list": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "csharp_statement"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              " ",
              {
                "ref": "csharp_statement"
              }
            ]
          }
        }
      ]
    }
  },
  "constructor_declaration": {
    "seq": [
      {
        "ref": "method_modifiers"
      },
      " ",
      {
        "ref": "csharp_type_name"
      },
      " ",
      "(",
      " ",
      {
        "ref": "parameter_list"
      },
      " ",
      ")",
      " ",
      {
        "ref": "method_body"
      }
    ]
  },
  "field_declaration": {
    "seq": [
      {
        "ref": "field_modifiers"
      },
      " ",
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_identifier"
      },
      ";"
    ]
  },
  "field_modifiers": {
    "f": 0.5,
    "opt": {
      "alt": [
        {
          "ref": "kw_public"
        },
        {
          "ref": "kw_private"
        },
        {
          "ref": "kw_protected"
        },
        {
          "ref": "kw_internal"
        },
        {
          "ref": "kw_static"
        },
        {
          "ref": "kw_readonly"
        }
      ]
    }
  },
  "property_declaration": {
    "seq": [
      {
        "ref": "property_modifiers"
      },
      " ",
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_identifier"
      },
      " ",
      "{",
      " ",
      {
        "ref": "accessor_list"
      },
      " ",
      "}"
    ]
  },
  "property_modifiers": {
    "f": 0.5,
    "opt": {
      "alt": [
        {
          "ref": "kw_public"
        },
        {
          "ref": "kw_private"
        },
        {
          "ref": "kw_protected"
        },
        {
          "ref": "kw_internal"
        },
        {
          "ref": "kw_static"
        }
      ]
    }
  },
  "accessor_list": {
    "seq": [
      {
        "ref": "accessor"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            {
              "ref": "accessor"
            }
          ]
        }
      }
    ]
  },
  "accessor": {
    "alt": [
      {
        "seq": [
          {
            "ref": "kw_get"
          },
          " ",
          {
            "ref": "method_body"
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "kw_set"
          },
          " ",
          {
            "ref": "method_body"
          }
        ]
      }
    ]
  },
  "variable_declaration": {
    "seq": [
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_identifier"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            "=",
            " ",
            {
              "ref": "csharp_expression"
            }
          ]
        }
      },
      ";"
    ]
  },
  "constant_declaration": {
    "seq": [
      {
        "ref": "kw_const"
      },
      " ",
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_identifier"
      },
      " ",
      "=",
      " ",
      {
        "ref": "csharp_expression"
      },
      ";"
    ]
  },
  "parameter_list": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "parameter"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              " ",
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
  },
  "parameter": {
    "seq": [
      {
        "ref": "csharp_type"
      },
      " ",
      {
        "ref": "csharp_identifier"
      }
    ]
  },
  "csharp_type": {
    "alt": [
      {
        "ref": "csharp_basic_type"
      },
      {
        "ref": "csharp_type_name"
      },
      {
        "ref": "csharp_array_type"
      },
      {
        "ref": "csharp_generic_type"
      }
    ]
  },
  "csharp_basic_type": {
    "alt": [
      {
        "ref": "kw_int"
      },
      {
        "ref": "kw_string"
      },
      {
        "ref": "kw_bool"
      },
      {
        "ref": "kw_double"
      },
      {
        "ref": "kw_float"
      },
      {
        "ref": "kw_char"
      },
      {
        "ref": "kw_object"
      },
      {
        "ref": "kw_void"
      }
    ]
  },
  "csharp_array_type": {
    "seq": [
      {
        "ref": "csharp_type"
      },
      "[",
      "]"
    ]
  },
  "csharp_generic_type": {
    "seq": [
      {
        "ref": "csharp_type_name"
      },
      "<",
      " ",
      {
        "ref": "csharp_type"
      },
      " ",
      ">"
    ]
  },
  "csharp_expression": {
    "alt": [
      {
        "ref": "csharp_identifier"
      },
      {
        "ref": "csharp_literal"
      },
      {
        "ref": "csharp_method_call"
      }
    ]
  },
  "csharp_method_call": {
    "seq": [
      {
        "ref": "csharp_identifier"
      },
      " ",
      "(",
      " ",
      {
        "ref": "argument_list"
      },
      " ",
      ")"
    ]
  },
  "argument_list": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "csharp_expression"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              " ",
              ",",
              " ",
              {
                "ref": "csharp_expression"
              }
            ]
          }
        }
      ]
    }
  },
  "csharp_literal": {
    "alt": [
      {
        "ref": "csharp_number_literal"
      },
      {
        "ref": "csharp_string_literal"
      },
      {
        "ref": "csharp_boolean_literal"
      },
      {
        "ref": "csharp_null_literal"
      }
    ]
  },
  "csharp_number_literal": {
    "alt": [
      "0",
      "1",
      "2",
      "42",
      "100",
      "200",
      "404"
    ]
  },
  "csharp_string_literal": {
    "alt": [
      "",
      "hello"
    ]
  },
  "csharp_boolean_literal": {
    "alt": [
      "true",
      "false"
    ]
  },
  "csharp_null_literal": "null",
  "csharp_identifier": {
    "alt": [
      "x",
      "y",
      "z",
      "result",
      "data",
      "input",
      "err",
      "val"
    ]
  },
  "csharp_method_name": {
    "alt": [
      "Main",
      "Calculate",
      "SetValue",
      "GetResult",
      "ToString",
      "Equals",
      "Dispose"
    ]
  },
  "csharp_type_name": {
    "alt": [
      "string",
      "int",
      "bool",
      "double",
      "float",
      "CustomType",
      "Exception",
      "Stream",
      "List"
    ]
  },
  "csharp_namespace_name": {
    "alt": [
      "System",
      "System.Collections.Generic",
      "MyApp",
      "MyApp.Models"
    ]
  },
  "comment": {
    "alt": [
      {
        "ref": "single_line_comment"
      },
      {
        "ref": "multi_line_comment"
      }
    ]
  },
  "single_line_comment": {
    "seq": [
      "//",
      " ",
      {
        "ref": "comment_text"
      }
    ]
  },
  "multi_line_comment": {
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
} as Rules;
