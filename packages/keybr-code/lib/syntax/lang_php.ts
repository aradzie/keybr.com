// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "start": {
    "ref": "php_statement"
  },
  "start_laravel": {
    "ref": "laravel_statement"
  },
  "php_statement": {
    "alt": [
      {
        "ref": "php_variable_declaration"
      },
      {
        "ref": "php_array_declaration"
      },
      {
        "ref": "php_foreach_statement"
      },
      {
        "ref": "php_if_statement"
      },
      {
        "ref": "php_function_declaration"
      },
      {
        "ref": "php_class_method_call"
      },
      {
        "ref": "php_arrow_function"
      },
      {
        "ref": "php_namespace_statement"
      },
      {
        "ref": "php_use_statement"
      }
    ]
  },
  "laravel_statement": {
    "alt": [
      {
        "ref": "laravel_route"
      },
      {
        "ref": "laravel_eloquent"
      },
      {
        "ref": "laravel_blade"
      },
      {
        "ref": "laravel_request"
      },
      {
        "ref": "php_statement"
      }
    ]
  },
  "php_variable_declaration": {
    "seq": [
      {
        "ref": "php_variable"
      },
      " ",
      "=",
      " ",
      {
        "ref": "php_expression"
      },
      ";"
    ]
  },
  "php_array_declaration": {
    "seq": [
      {
        "ref": "php_variable"
      },
      " ",
      "=",
      " ",
      {
        "ref": "php_array_literal"
      },
      ";"
    ]
  },
  "php_array_literal": {
    "alt": [
      {
        "seq": [
          "[",
          {
            "ref": "php_array_elements"
          },
          "]"
        ]
      },
      {
        "seq": [
          "[",
          {
            "ref": "php_assoc_elements"
          },
          "]"
        ]
      }
    ]
  },
  "php_array_elements": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "php_expression"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              ",",
              " ",
              {
                "ref": "php_expression"
              }
            ]
          }
        }
      ]
    }
  },
  "php_assoc_elements": {
    "seq": [
      {
        "ref": "php_assoc_pair"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            ",",
            " ",
            {
              "ref": "php_assoc_pair"
            }
          ]
        }
      }
    ]
  },
  "php_assoc_pair": {
    "seq": [
      {
        "ref": "php_string_literal"
      },
      " ",
      "=>",
      " ",
      {
        "ref": "php_expression"
      }
    ]
  },
  "php_expression": {
    "alt": [
      {
        "ref": "php_variable"
      },
      {
        "ref": "php_literal"
      },
      {
        "ref": "php_array_literal"
      },
      {
        "ref": "php_class_method_call"
      },
      {
        "ref": "php_arrow_function"
      },
      {
        "ref": "php_null_coalesce"
      },
      {
        "ref": "php_nullsafe_call"
      }
    ]
  },
  "php_null_coalesce": {
    "seq": [
      {
        "ref": "php_variable"
      },
      " ",
      "??",
      " ",
      {
        "ref": "php_expression"
      }
    ]
  },
  "php_nullsafe_call": {
    "seq": [
      {
        "ref": "php_variable"
      },
      "?->",
      {
        "ref": "php_method_name"
      },
      "()"
    ]
  },
  "php_literal": {
    "alt": [
      {
        "ref": "php_string_literal"
      },
      {
        "ref": "php_number_literal"
      },
      {
        "ref": "php_boolean_literal"
      },
      {
        "ref": "kw_null"
      }
    ]
  },
  "php_string_literal": {
    "cls": "string",
    "span": {
      "seq": [
        "\"",
        {
          "ref": "php_string_content"
        },
        "\""
      ]
    }
  },
  "php_string_content": {
    "alt": [
      "value",
      "key",
      "name",
      "id",
      "email",
      "status",
      "active"
    ]
  },
  "php_number_literal": {
    "cls": "number",
    "span": {
      "alt": [
        "0",
        "1",
        "2",
        "10",
        "42",
        "100"
      ]
    }
  },
  "php_boolean_literal": {
    "alt": [
      {
        "ref": "kw_true"
      },
      {
        "ref": "kw_false"
      }
    ]
  },
  "php_variable": {
    "seq": [
      "$",
      {
        "ref": "php_var_name"
      }
    ]
  },
  "php_var_name": {
    "alt": [
      "arr",
      "data",
      "id",
      "item",
      "key",
      "name",
      "result",
      "user",
      "val",
      "value",
      "x",
      "this"
    ]
  },
  "php_foreach_statement": {
    "seq": [
      {
        "ref": "kw_foreach"
      },
      " ",
      "(",
      {
        "ref": "php_variable"
      },
      " ",
      {
        "ref": "kw_as"
      },
      " ",
      {
        "ref": "php_variable"
      },
      " ",
      "=>",
      " ",
      {
        "ref": "php_variable"
      },
      ")",
      " ",
      "{",
      " ",
      "}"
    ]
  },
  "php_if_statement": {
    "seq": [
      {
        "ref": "kw_if"
      },
      " ",
      "(",
      {
        "ref": "php_condition"
      },
      ")",
      " ",
      "{",
      " ",
      {
        "ref": "php_statement"
      },
      " ",
      "}"
    ]
  },
  "php_condition": {
    "seq": [
      {
        "ref": "php_variable"
      },
      " ",
      {
        "ref": "php_comparison_op"
      },
      " ",
      {
        "ref": "php_expression"
      }
    ]
  },
  "php_comparison_op": {
    "alt": [
      "===",
      "!==",
      "==",
      "!=",
      ">",
      "<",
      ">=",
      "<="
    ]
  },
  "php_function_declaration": {
    "seq": [
      {
        "ref": "kw_function"
      },
      " ",
      {
        "ref": "php_func_name"
      },
      "(",
      {
        "ref": "php_param_list"
      },
      ")",
      " ",
      "{",
      " ",
      {
        "ref": "kw_return"
      },
      " ",
      {
        "ref": "php_expression"
      },
      ";",
      " ",
      "}"
    ]
  },
  "php_arrow_function": {
    "seq": [
      {
        "ref": "kw_fn"
      },
      "(",
      {
        "ref": "php_param_list"
      },
      ")",
      " ",
      "=>",
      " ",
      {
        "ref": "php_expression"
      }
    ]
  },
  "php_param_list": {
    "f": 0.5,
    "opt": {
      "seq": [
        {
          "ref": "php_variable"
        },
        {
          "f": 0.5,
          "opt": {
            "seq": [
              ",",
              " ",
              {
                "ref": "php_variable"
              }
            ]
          }
        }
      ]
    }
  },
  "php_func_name": {
    "alt": [
      "getValue",
      "process",
      "handle",
      "create",
      "update",
      "delete"
    ]
  },
  "php_class_method_call": {
    "alt": [
      {
        "ref": "php_this_call"
      },
      {
        "ref": "php_static_call"
      },
      {
        "ref": "php_object_call"
      }
    ]
  },
  "php_this_call": {
    "seq": [
      "$this->",
      {
        "ref": "php_property_name"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            " ",
            "=",
            " ",
            {
              "ref": "php_expression"
            }
          ]
        }
      }
    ]
  },
  "php_static_call": {
    "seq": [
      {
        "ref": "php_class_name"
      },
      "::",
      {
        "ref": "php_method_name"
      },
      "()"
    ]
  },
  "php_object_call": {
    "seq": [
      {
        "ref": "php_variable"
      },
      "->",
      {
        "ref": "php_method_name"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "php_expression"
        }
      },
      ")"
    ]
  },
  "php_property_name": {
    "alt": [
      "name",
      "value",
      "data",
      "id",
      "status"
    ]
  },
  "php_method_name": {
    "alt": [
      "get",
      "set",
      "find",
      "create",
      "update",
      "delete",
      "getName",
      "getValue"
    ]
  },
  "php_class_name": {
    "alt": [
      "User",
      "Post",
      "Model",
      "Controller",
      "Request"
    ]
  },
  "php_namespace_statement": {
    "seq": [
      {
        "ref": "kw_namespace"
      },
      " ",
      {
        "ref": "php_namespace_path"
      },
      ";"
    ]
  },
  "php_use_statement": {
    "seq": [
      {
        "ref": "kw_use"
      },
      " ",
      {
        "ref": "php_namespace_path"
      },
      ";"
    ]
  },
  "php_namespace_path": {
    "seq": [
      {
        "ref": "php_namespace_segment"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            "\\",
            {
              "ref": "php_namespace_segment"
            }
          ]
        }
      }
    ]
  },
  "php_namespace_segment": {
    "alt": [
      "App",
      "Controller",
      "Model",
      "Http",
      "Request",
      "Service"
    ]
  },
  "laravel_route": {
    "seq": [
      "Route::",
      {
        "ref": "laravel_http_method"
      },
      "(",
      {
        "ref": "php_string_literal"
      },
      ",",
      " ",
      {
        "ref": "laravel_route_action"
      },
      ")"
    ]
  },
  "laravel_http_method": {
    "alt": [
      "get",
      "post",
      "put",
      "patch",
      "delete"
    ]
  },
  "laravel_route_action": {
    "seq": [
      "[",
      {
        "ref": "php_class_name"
      },
      "::class,",
      " ",
      {
        "ref": "php_string_literal"
      },
      "]"
    ]
  },
  "laravel_eloquent": {
    "alt": [
      {
        "ref": "laravel_eloquent_query"
      },
      {
        "ref": "laravel_eloquent_create"
      },
      {
        "ref": "laravel_eloquent_update"
      }
    ]
  },
  "laravel_eloquent_query": {
    "seq": [
      {
        "ref": "php_class_name"
      },
      "::",
      {
        "ref": "laravel_query_method"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "php_expression"
        }
      },
      ")",
      {
        "f": 0.5,
        "opt": {
          "seq": [
            "->",
            {
              "ref": "laravel_chain_method"
            },
            "(",
            {
              "f": 0.5,
              "opt": {
                "ref": "php_expression"
              }
            },
            ")"
          ]
        }
      }
    ]
  },
  "laravel_query_method": {
    "alt": [
      "where",
      "find",
      "findOrFail",
      "first",
      "firstOrFail",
      "all",
      "get"
    ]
  },
  "laravel_chain_method": {
    "alt": [
      "where",
      "orderBy",
      "with",
      "paginate",
      "get",
      "first",
      "count"
    ]
  },
  "laravel_eloquent_create": {
    "seq": [
      {
        "ref": "php_class_name"
      },
      "::create(",
      {
        "ref": "php_array_literal"
      },
      ")"
    ]
  },
  "laravel_eloquent_update": {
    "seq": [
      {
        "ref": "php_variable"
      },
      "->update(",
      {
        "ref": "php_array_literal"
      },
      ")"
    ]
  },
  "laravel_blade": {
    "alt": [
      {
        "ref": "laravel_blade_echo"
      },
      {
        "ref": "laravel_blade_directive"
      }
    ]
  },
  "laravel_blade_echo": {
    "seq": [
      "{{",
      " ",
      {
        "ref": "php_variable"
      },
      "->",
      {
        "ref": "php_property_name"
      },
      " ",
      "}}"
    ]
  },
  "laravel_blade_directive": {
    "alt": [
      {
        "seq": [
          "@if(",
          {
            "ref": "php_variable"
          },
          ")"
        ]
      },
      {
        "seq": [
          "@foreach(",
          {
            "ref": "php_variable"
          },
          " ",
          {
            "ref": "kw_as"
          },
          " ",
          {
            "ref": "php_variable"
          },
          ")"
        ]
      },
      {
        "seq": [
          "@extends('",
          {
            "ref": "laravel_view_name"
          },
          "')"
        ]
      },
      {
        "seq": [
          "@section('",
          {
            "ref": "laravel_section_name"
          },
          "')"
        ]
      },
      {
        "seq": [
          "@yield('",
          {
            "ref": "laravel_section_name"
          },
          "')"
        ]
      },
      {
        "seq": [
          "@include('",
          {
            "ref": "laravel_view_name"
          },
          "')"
        ]
      },
      "@csrf",
      {
        "seq": [
          "@method('",
          {
            "ref": "laravel_http_method_upper"
          },
          "')"
        ]
      }
    ]
  },
  "laravel_view_name": {
    "alt": [
      "layouts.app",
      "partials.header",
      "components.alert"
    ]
  },
  "laravel_section_name": {
    "alt": [
      "content",
      "title",
      "scripts",
      "styles"
    ]
  },
  "laravel_http_method_upper": {
    "alt": [
      "PUT",
      "PATCH",
      "DELETE"
    ]
  },
  "laravel_request": {
    "seq": [
      {
        "ref": "php_variable"
      },
      "->",
      {
        "ref": "laravel_request_method"
      },
      "(",
      {
        "f": 0.5,
        "opt": {
          "ref": "php_string_literal"
        }
      },
      ")"
    ]
  },
  "laravel_request_method": {
    "alt": [
      "validate",
      "validated",
      "input",
      "has",
      "file"
    ]
  }
} as Rules;
