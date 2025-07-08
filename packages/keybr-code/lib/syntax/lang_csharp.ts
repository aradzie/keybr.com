// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "csharp_statement",
  },
  csharp_statement: {
    alt: [
      {
        ref: "using_declaration",
      },
      {
        ref: "using_statement",
      },
      {
        ref: "class_declaration",
      },
      {
        ref: "method_declaration",
      },
      {
        ref: "property_declaration",
      },
      {
        ref: "field_declaration",
      },
      {
        ref: "variable_declaration",
      },
      {
        ref: "if_statement",
      },
      {
        ref: "for_statement",
      },
      {
        ref: "foreach_statement",
      },
      {
        ref: "while_statement",
      },
      {
        ref: "switch_statement",
      },
      {
        ref: "try_statement",
      },
      {
        ref: "return_statement",
      },
      {
        ref: "break_statement",
      },
      {
        ref: "continue_statement",
      },
      {
        ref: "throw_statement",
      },
      {
        ref: "expression_statement",
      },
      {
        flag: "comments",
        inv: false,
        cond: {
          ref: "comment",
        },
      },
    ],
  },
  using_declaration: {
    seq: [
      {
        ref: "kw_using",
      },
      " ",
      {
        ref: "csharp_namespace_name",
      },
      ";",
    ],
  },
  class_declaration: {
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
        ref: "kw_class",
      },
      " ",
      {
        ref: "csharp_class_name",
      },
      " ",
      "{",
      {
        ref: "class_body",
      },
      "}",
    ],
  },
  class_body: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "class_member",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              " ",
              {
                ref: "class_member",
              },
            ],
          },
        },
      ],
    },
  },
  class_member: {
    alt: [
      {
        ref: "method_declaration",
      },
      {
        ref: "property_declaration",
      },
      {
        ref: "field_declaration",
      },
    ],
  },
  method_declaration: {
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
              ref: "kw_async",
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
        ref: "csharp_method_name",
      },
      "(",
      {
        ref: "parameter_list",
      },
      ")",
      {
        ref: "method_body",
      },
    ],
  },
  method_body: {
    alt: [
      {
        seq: [
          "{",
          {
            ref: "statement_list",
          },
          "}",
        ],
      },
      {
        seq: [
          "{",
          {
            ref: "simple_statement",
          },
          "}",
        ],
      },
      "{}",
    ],
  },
  simple_statement: {
    alt: [
      {
        ref: "return_statement",
      },
      {
        ref: "variable_declaration",
      },
      {
        seq: [
          {
            ref: "assignment_expression",
          },
          ";",
        ],
      },
      {
        seq: [
          {
            ref: "method_call",
          },
          ";",
        ],
      },
    ],
  },
  statement_list: {
    seq: [
      {
        ref: "csharp_statement",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "csharp_statement",
            },
          ],
        },
      },
    ],
  },
  property_declaration: {
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
        ref: "csharp_type",
      },
      " ",
      {
        ref: "csharp_property_name",
      },
      " ",
      "{",
      "get;",
      "set;",
      "}",
    ],
  },
  field_declaration: {
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
              ref: "kw_readonly",
            },
            " ",
          ],
        },
      },
      {
        ref: "csharp_type",
      },
      " ",
      {
        ref: "csharp_identifier",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " = ",
            {
              ref: "csharp_expression",
            },
            {
              f: 0.5,
              opt: {
                ref: "linq_chain",
              },
            },
          ],
        },
      },
      ";",
    ],
  },
  variable_declaration: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_type",
          },
          " ",
          {
            ref: "csharp_identifier",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                " = ",
                {
                  ref: "csharp_expression",
                },
                {
                  f: 0.5,
                  opt: {
                    ref: "linq_chain",
                  },
                },
              ],
            },
          },
          ";",
        ],
      },
      {
        seq: [
          {
            ref: "kw_var",
          },
          " ",
          {
            ref: "csharp_identifier",
          },
          " = ",
          {
            ref: "csharp_expression",
          },
          {
            f: 0.5,
            opt: {
              ref: "linq_chain",
            },
          },
          ";",
        ],
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
              ", ",
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
    alt: [
      {
        seq: [
          {
            ref: "csharp_type",
          },
          " ",
          {
            ref: "csharp_parameter_name",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_type",
          },
          " ",
          {
            ref: "contextual_parameter_name",
          },
        ],
      },
    ],
  },
  contextual_parameter_name: {
    alt: [
      "id",
      "name",
      "value",
      "count",
      "index",
      "item",
      "entity",
      "model",
      "request",
      "cancellationToken",
    ],
  },
  argument_list: {
    f: 0.5,
    opt: {
      seq: [
        {
          ref: "csharp_expression",
        },
        {
          f: 0.5,
          opt: {
            seq: [
              ", ",
              {
                ref: "csharp_expression",
              },
            ],
          },
        },
      ],
    },
  },
  return_type: {
    alt: [
      {
        ref: "csharp_type",
      },
      {
        ref: "kw_void",
      },
    ],
  },
  csharp_type: {
    alt: [
      {
        ref: "kw_int",
      },
      {
        ref: "kw_string",
      },
      {
        ref: "kw_bool",
      },
      {
        ref: "kw_double",
      },
      {
        ref: "kw_float",
      },
      {
        ref: "kw_decimal",
      },
      {
        ref: "kw_char",
      },
      {
        ref: "kw_byte",
      },
      {
        ref: "kw_long",
      },
      {
        ref: "kw_short",
      },
      {
        ref: "kw_uint",
      },
      {
        ref: "kw_ulong",
      },
      {
        ref: "kw_ushort",
      },
      {
        ref: "kw_object",
      },
      {
        ref: "kw_void",
      },
      "DateTime",
      "TimeSpan",
      "Guid",
      {
        ref: "csharp_class_name",
      },
      {
        seq: [
          "List<",
          {
            ref: "csharp_simple_type",
          },
          ">",
        ],
      },
      {
        seq: [
          "Dictionary<",
          {
            ref: "csharp_simple_type",
          },
          ", ",
          {
            ref: "csharp_simple_type",
          },
          ">",
        ],
      },
      {
        seq: [
          "IEnumerable<",
          {
            ref: "csharp_simple_type",
          },
          ">",
        ],
      },
      {
        seq: [
          "Task<",
          {
            ref: "csharp_simple_type",
          },
          ">",
        ],
      },
      "Task",
      {
        seq: [
          {
            ref: "csharp_simple_type",
          },
          "[]",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_simple_type",
          },
          "?",
        ],
      },
    ],
  },
  csharp_simple_type: {
    alt: [
      {
        ref: "kw_int",
      },
      {
        ref: "kw_string",
      },
      {
        ref: "kw_bool",
      },
      {
        ref: "kw_double",
      },
      {
        ref: "kw_float",
      },
      {
        ref: "kw_decimal",
      },
      {
        ref: "kw_char",
      },
      {
        ref: "kw_byte",
      },
      "DateTime",
      "Guid",
      {
        ref: "csharp_class_name",
      },
    ],
  },
  csharp_expression: {
    alt: [
      {
        ref: "csharp_literal",
      },
      {
        ref: "csharp_identifier",
      },
      {
        ref: "method_call",
      },
      {
        ref: "property_access",
      },
      {
        ref: "simple_binary_expression",
      },
      {
        ref: "simple_linq_expression",
      },
      {
        ref: "new_expression",
      },
      {
        ref: "cast_expression",
      },
      {
        ref: "lambda_expression",
      },
      {
        ref: "conditional_expression",
      },
      {
        ref: "await_expression",
      },
      {
        ref: "assignment_expression",
      },
      {
        ref: "null_check_expression",
      },
      {
        ref: "string_interpolation",
      },
    ],
  },
  null_check_expression: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " ?? ",
          {
            ref: "csharp_expression",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          "?.",
          {
            ref: "csharp_property_name",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          "?.",
          {
            ref: "csharp_method_name",
          },
          "()",
        ],
      },
    ],
  },
  string_interpolation: {
    seq: [
      '$"',
      {
        ref: "interpolation_content",
      },
      '"',
    ],
  },
  interpolation_content: {
    alt: [
      {
        seq: [
          "Result: {",
          {
            ref: "csharp_identifier",
          },
          "}",
        ],
      },
      {
        seq: [
          "Count: {",
          {
            ref: "csharp_identifier",
          },
          ".Count}",
        ],
      },
      {
        seq: [
          "Value: {",
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          "}",
        ],
      },
      {
        seq: [
          "Status: {",
          {
            ref: "csharp_identifier",
          },
          ".Status}",
        ],
      },
    ],
  },
  method_call: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          "(",
          {
            ref: "argument_list",
          },
          ")",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_method_name",
          },
          "(",
          {
            ref: "argument_list",
          },
          ")",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_method_name",
          },
          "()",
        ],
      },
    ],
  },
  property_access: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
        ],
      },
      {
        seq: [
          "this.",
          {
            ref: "csharp_property_name",
          },
        ],
      },
    ],
  },
  simple_binary_expression: {
    seq: [
      {
        ref: "csharp_identifier",
      },
      " ",
      {
        ref: "simple_operator",
      },
      " ",
      {
        ref: "csharp_literal",
      },
    ],
  },
  simple_operator: {
    alt: ["+", "-", "*", "/", "==", "!=", "<", ">", "&&", "||"],
  },
  simple_linq_expression: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "linq_method",
          },
          "(",
          {
            ref: "simple_lambda",
          },
          ")",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "linq_method",
          },
          "()",
        ],
      },
    ],
  },
  linq_chain: {
    alt: [
      {
        seq: [
          ".",
          {
            ref: "linq_method",
          },
          "(",
          {
            ref: "simple_lambda",
          },
          ")",
        ],
      },
      {
        seq: [
          ".",
          {
            ref: "linq_method",
          },
          "()",
        ],
      },
      {
        seq: [
          ".Where(",
          {
            ref: "simple_lambda",
          },
          ").Select(",
          {
            ref: "simple_lambda",
          },
          ")",
        ],
      },
      {
        seq: [
          ".Where(",
          {
            ref: "simple_lambda",
          },
          ").Count()",
        ],
      },
      {
        seq: [
          ".OrderBy(",
          {
            ref: "simple_lambda",
          },
          ").ToList()",
        ],
      },
    ],
  },
  linq_method: {
    alt: [
      "Where",
      "Select",
      "First",
      "FirstOrDefault",
      "Last",
      "LastOrDefault",
      "Any",
      "All",
      "Count",
      "Sum",
      "Max",
      "Min",
      "Average",
      "ToList",
      "ToArray",
      "OrderBy",
      "OrderByDescending",
      "GroupBy",
      "Distinct",
      "Skip",
      "Take",
    ],
  },
  simple_lambda: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "csharp_parameter_name",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "csharp_parameter_name",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " == ",
          {
            ref: "csharp_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "csharp_parameter_name",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " != null",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "csharp_parameter_name",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " > ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
    ],
  },
  csharp_literal: {
    alt: [
      {
        ref: "csharp_string_literal",
      },
      {
        ref: "csharp_number_literal",
      },
      {
        ref: "csharp_boolean_literal",
      },
      {
        ref: "csharp_null_literal",
      },
      {
        ref: "csharp_char_literal",
      },
    ],
  },
  csharp_string_literal: {
    alt: [
      {
        seq: ['"', "Hello World", '"'],
      },
      {
        seq: ['"', "Test", '"'],
      },
      {
        seq: ['"', "Example", '"'],
      },
      {
        seq: ['"', "Data", '"'],
      },
      {
        seq: ['"', "Config", '"'],
      },
      {
        seq: ['"', "File", '"'],
      },
      {
        seq: ['"', "Item", '"'],
      },
      {
        seq: ['"', "Value", '"'],
      },
      {
        seq: ['"', "Result", '"'],
      },
      {
        seq: ['"', "Output", '"'],
      },
      {
        seq: ['"', "Input", '"'],
      },
      {
        seq: ['"', "Message", '"'],
      },
      {
        seq: ['"', "Error", '"'],
      },
      {
        seq: ['"', "Success", '"'],
      },
      {
        seq: ['"', "en-US", '"'],
      },
      {
        seq: ['"', "admin@example.com", '"'],
      },
      {
        seq: ['"', "https://example.com", '"'],
      },
      {
        seq: ['$"', "Item {id}", '"'],
      },
      {
        seq: ['$"', "Count: {count}", '"'],
      },
      {
        seq: ['$"', "Value: {value}", '"'],
      },
    ],
  },
  csharp_number_literal: {
    alt: [
      "0",
      "1",
      "5",
      "10",
      "25",
      "50",
      "100",
      "120",
      "200",
      "500",
      "1000",
      "60.0",
      "95.5",
      "99.9",
      "3.14159",
      "2.5",
      "0.95",
      "1.0",
    ],
  },
  csharp_boolean_literal: {
    alt: ["true", "false"],
  },
  csharp_null_literal: "null",
  csharp_char_literal: {
    alt: ["'a'", "'Z'", "'\\n'", "'\\t'"],
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
  csharp_identifier: {
    alt: [
      {
        ref: "generic_variable_name",
      },
      {
        ref: "contextual_variable_name",
      },
    ],
  },
  contextual_variable_name: {
    alt: [
      "users",
      "items",
      "data",
      "list",
      "result",
      "config",
      "settings",
      "manager",
      "service",
      "repository",
      "context",
      "request",
      "response",
      "model",
      "entity",
      "dto",
    ],
  },
  csharp_method_name: {
    alt: [
      {
        ref: "generic_function_name",
      },
      "Main",
      "ToString",
      "Equals",
      "GetHashCode",
      "GetValue",
      "SetValue",
      "Calculate",
      "Process",
      "Execute",
      "Initialize",
      "Validate",
      "Parse",
      "Format",
      "Convert",
      "Create",
      "Update",
      "Delete",
      "Save",
      "Load",
      "Reset",
      "Start",
      "Stop",
      "Pause",
      "Resume",
      "GetItems",
      "GetData",
      "Calculate",
      "ProcessData",
      "StartTask",
      "EndTask",
      "SaveState",
      "LoadConfig",
      "GenerateReport",
      "SubmitForm",
    ],
  },
  csharp_property_name: {
    alt: [
      "Id",
      "Name",
      "Value",
      "Count",
      "Length",
      "Text",
      "Content",
      "Data",
      "Result",
      "Size",
      "Width",
      "Height",
      "Index",
      "Status",
      "IsActive",
      "IsValid",
      "IsEnabled",
      "CreatedAt",
      "UpdatedAt",
      "StartTime",
      "EndTime",
      "Duration",
      "Type",
      "Category",
      "Priority",
    ],
  },
  csharp_parameter_name: {
    alt: [
      {
        ref: "generic_variable_name",
      },
      "value",
      "index",
      "item",
      "data",
      "text",
      "name",
      "id",
      "size",
      "count",
      "result",
      "input",
      "output",
      "config",
      "options",
      "request",
      "response",
      "context",
      "cancellationToken",
    ],
  },
  csharp_class_name: {
    alt: [
      {
        ref: "generic_class_name",
      },
      "Program",
      "User",
      "Data",
      "Config",
      "Settings",
      "Service",
      "Manager",
      "Handler",
      "Controller",
      "Repository",
      "Factory",
      "Builder",
      "Processor",
      "Calculator",
      "Validator",
      "Parser",
      "Formatter",
      "Converter",
      "DatabaseContext",
      "ApiController",
      "HomeController",
      "DataController",
    ],
  },
  csharp_namespace_name: {
    alt: [
      "System",
      "System.Collections.Generic",
      "System.Linq",
      "System.Threading.Tasks",
      "System.ComponentModel.DataAnnotations",
      "Microsoft.AspNetCore.Mvc",
      "Microsoft.EntityFrameworkCore",
      "MyApp.Core",
      "MyApp.Models",
      "MyApp.Services",
      "MyApp.Controllers",
      "MyApp.Data",
      "MyApp.Api",
      "MyApp.Web",
      "MyApp.Common",
      "Company.Product",
      "Company.Services",
      "Example.Data",
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
    ],
  },
  single_line_comment: {
    cls: "comment",
    span: {
      seq: [
        "// ",
        {
          ref: "comment_text",
        },
      ],
    },
  },
  multi_line_comment: {
    cls: "comment",
    span: {
      seq: [
        "/* ",
        {
          ref: "comment_text",
        },
        " */",
      ],
    },
  },
  comment_text: {
    alt: [
      "TODO: Implement this method",
      "TODO: Add validation",
      "TODO: Optimize performance",
      "FIXME: Handle null values",
      "HACK: Temporary workaround",
      "NOTE: This could be refactored",
      "BUG: Edge case not handled",
      "Calculate result",
      "Process input data",
      "Initialize configuration",
      "Main entry point",
      "Validate input",
      "Save data to database",
      "Generate report",
      "Calculate percentage",
      "Update statistics",
      "Load configuration",
      "Handle events",
      "Track progress",
      "Export data",
      "Import configuration",
    ],
  },
  new_expression: {
    alt: [
      {
        seq: [
          {
            ref: "kw_new",
          },
          " ",
          {
            ref: "csharp_class_name",
          },
          "(",
          {
            ref: "argument_list",
          },
          ")",
        ],
      },
      {
        seq: [
          {
            ref: "kw_new",
          },
          " ",
          {
            ref: "csharp_class_name",
          },
          "()",
        ],
      },
      {
        seq: [
          {
            ref: "kw_new",
          },
          " ",
          {
            ref: "csharp_type",
          },
          " {",
          {
            ref: "object_initializer",
          },
          "}",
        ],
      },
      {
        seq: [
          {
            ref: "kw_new",
          },
          " List<",
          {
            ref: "csharp_simple_type",
          },
          ">()",
        ],
      },
      {
        seq: [
          {
            ref: "kw_new",
          },
          " Dictionary<",
          {
            ref: "csharp_simple_type",
          },
          ", ",
          {
            ref: "csharp_simple_type",
          },
          ">()",
        ],
      },
    ],
  },
  cast_expression: {
    seq: [
      "(",
      {
        ref: "csharp_type",
      },
      ")",
      {
        ref: "csharp_expression",
      },
    ],
  },
  object_initializer: {
    seq: [
      {
        ref: "property_initializer",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "property_initializer",
            },
          ],
        },
      },
    ],
  },
  property_initializer: {
    seq: [
      {
        ref: "csharp_property_name",
      },
      " = ",
      {
        ref: "csharp_expression",
      },
    ],
  },
  using_statement: {
    seq: [
      {
        ref: "kw_using",
      },
      " (",
      {
        ref: "variable_declaration",
      },
      ") ",
      {
        ref: "statement_block",
      },
    ],
  },
  if_statement: {
    alt: [
      {
        seq: [
          {
            ref: "kw_if",
          },
          " (",
          {
            ref: "if_condition",
          },
          ") ",
          {
            ref: "statement_block",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                " ",
                {
                  ref: "kw_else",
                },
                " ",
                {
                  ref: "statement_block",
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          {
            ref: "kw_if",
          },
          " (",
          {
            ref: "if_condition",
          },
          ") ",
          {
            ref: "statement_block",
          },
          " ",
          {
            ref: "kw_else",
          },
          " ",
          {
            ref: "if_statement",
          },
        ],
      },
    ],
  },
  if_condition: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " != null",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " == null",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " == ",
          {
            ref: "csharp_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " != ",
          {
            ref: "csharp_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".Count > ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".Any()",
        ],
      },
    ],
  },
  for_statement: {
    seq: [
      {
        ref: "kw_for",
      },
      " (",
      {
        ref: "for_initializer",
      },
      "; ",
      {
        ref: "for_condition",
      },
      "; ",
      {
        ref: "for_iterator",
      },
      ") ",
      {
        ref: "statement_block",
      },
    ],
  },
  for_initializer: {
    alt: [
      {
        seq: [
          {
            ref: "kw_int",
          },
          " ",
          {
            ref: "csharp_identifier",
          },
          " = ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "kw_var",
          },
          " ",
          {
            ref: "csharp_identifier",
          },
          " = ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
    ],
  },
  for_condition: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " < ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " <= ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " > ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " >= ",
          {
            ref: "csharp_number_literal",
          },
        ],
      },
    ],
  },
  for_iterator: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          "++",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          "--",
        ],
      },
      {
        seq: [
          "++",
          {
            ref: "csharp_identifier",
          },
        ],
      },
      {
        seq: [
          "--",
          {
            ref: "csharp_identifier",
          },
        ],
      },
    ],
  },
  foreach_statement: {
    seq: [
      {
        ref: "kw_foreach",
      },
      " (",
      {
        ref: "foreach_variable",
      },
      " ",
      {
        ref: "kw_in",
      },
      " ",
      {
        ref: "foreach_collection",
      },
      ") ",
      {
        ref: "statement_block",
      },
    ],
  },
  foreach_variable: {
    seq: [
      {
        ref: "csharp_type",
      },
      " ",
      {
        ref: "csharp_identifier",
      },
    ],
  },
  foreach_collection: {
    alt: [
      {
        ref: "csharp_identifier",
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".ToList()",
        ],
      },
      "items",
      "list",
      "collection",
      "data",
    ],
  },
  while_statement: {
    seq: [
      {
        ref: "kw_while",
      },
      " (",
      {
        ref: "csharp_expression",
      },
      ") ",
      {
        ref: "statement_block",
      },
    ],
  },
  switch_statement: {
    alt: [
      {
        seq: [
          {
            ref: "kw_switch",
          },
          " (",
          {
            ref: "csharp_expression",
          },
          ") {",
          {
            ref: "switch_cases",
          },
          "}",
        ],
      },
      {
        seq: [
          {
            ref: "csharp_expression",
          },
          " ",
          {
            ref: "kw_switch",
          },
          " {",
          {
            ref: "switch_expressions",
          },
          "}",
        ],
      },
    ],
  },
  switch_cases: {
    seq: [
      {
        ref: "switch_case",
      },
      {
        f: 0.5,
        opt: {
          ref: "switch_case",
        },
      },
    ],
  },
  switch_case: {
    alt: [
      {
        seq: [
          {
            ref: "kw_case",
          },
          " ",
          {
            ref: "csharp_literal",
          },
          ": ",
          {
            ref: "statement_list",
          },
          " ",
          {
            ref: "kw_break",
          },
          ";",
        ],
      },
      {
        seq: [
          {
            ref: "kw_default",
          },
          ": ",
          {
            ref: "statement_list",
          },
          " ",
          {
            ref: "kw_break",
          },
          ";",
        ],
      },
    ],
  },
  switch_expressions: {
    seq: [
      {
        ref: "switch_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "switch_expression",
            },
          ],
        },
      },
    ],
  },
  switch_expression: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_literal",
          },
          " => ",
          {
            ref: "csharp_expression",
          },
        ],
      },
      {
        seq: [
          "_ => ",
          {
            ref: "csharp_expression",
          },
        ],
      },
    ],
  },
  try_statement: {
    seq: [
      {
        ref: "kw_try",
      },
      " ",
      {
        ref: "statement_block",
      },
      " ",
      {
        ref: "catch_clauses",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "finally_clause",
            },
          ],
        },
      },
    ],
  },
  catch_clauses: {
    seq: [
      {
        ref: "catch_clause",
      },
      {
        f: 0.5,
        opt: {
          ref: "catch_clause",
        },
      },
    ],
  },
  catch_clause: {
    seq: [
      {
        ref: "kw_catch",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " (",
            {
              ref: "csharp_type",
            },
            {
              f: 0.5,
              opt: {
                seq: [
                  " ",
                  {
                    ref: "csharp_identifier",
                  },
                ],
              },
            },
            ") ",
          ],
        },
      },
      {
        ref: "statement_block",
      },
    ],
  },
  finally_clause: {
    seq: [
      {
        ref: "kw_finally",
      },
      " ",
      {
        ref: "statement_block",
      },
    ],
  },
  return_statement: {
    seq: [
      {
        ref: "kw_return",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "csharp_expression",
            },
          ],
        },
      },
      ";",
    ],
  },
  break_statement: {
    seq: [
      {
        ref: "kw_break",
      },
      ";",
    ],
  },
  continue_statement: {
    seq: [
      {
        ref: "kw_continue",
      },
      ";",
    ],
  },
  throw_statement: {
    seq: [
      {
        ref: "kw_throw",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "csharp_expression",
            },
          ],
        },
      },
      ";",
    ],
  },
  expression_statement: {
    seq: [
      {
        ref: "csharp_expression",
      },
      ";",
    ],
  },
  statement_block: {
    alt: [
      {
        seq: [
          "{",
          {
            ref: "statement_list",
          },
          "}",
        ],
      },
      "{}",
      {
        ref: "csharp_statement",
      },
    ],
  },
  lambda_expression: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "csharp_expression",
          },
        ],
      },
      {
        seq: [
          "(",
          {
            ref: "lambda_parameters",
          },
          ") => ",
          {
            ref: "csharp_expression",
          },
        ],
      },
      {
        seq: [
          "(",
          {
            ref: "lambda_parameters",
          },
          ") => ",
          {
            ref: "statement_block",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          " => ",
          {
            ref: "statement_block",
          },
        ],
      },
    ],
  },
  lambda_parameters: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_type",
          },
          " ",
          {
            ref: "csharp_parameter_name",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "csharp_type",
                },
                " ",
                {
                  ref: "csharp_parameter_name",
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_parameter_name",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                ", ",
                {
                  ref: "csharp_parameter_name",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  conditional_expression: {
    seq: [
      {
        ref: "csharp_expression",
      },
      " ? ",
      {
        ref: "csharp_expression",
      },
      " : ",
      {
        ref: "csharp_expression",
      },
    ],
  },
  await_expression: {
    seq: [
      {
        ref: "kw_await",
      },
      " ",
      {
        ref: "csharp_expression",
      },
    ],
  },
  assignment_expression: {
    alt: [
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          " ",
          {
            ref: "assignment_operator",
          },
          " ",
          {
            ref: "csharp_expression",
          },
        ],
      },
      {
        seq: [
          {
            ref: "csharp_identifier",
          },
          ".",
          {
            ref: "csharp_property_name",
          },
          " ",
          {
            ref: "assignment_operator",
          },
          " ",
          {
            ref: "csharp_expression",
          },
        ],
      },
    ],
  },
  assignment_operator: {
    alt: ["=", "+=", "-=", "*=", "/=", "%="],
  },
  kw_using: "using",
  kw_var: "var",
  kw_new: "new",
  kw_readonly: "readonly",
  kw_if: "if",
  kw_else: "else",
  kw_for: "for",
  kw_foreach: "foreach",
  kw_in: "in",
  kw_while: "while",
  kw_switch: "switch",
  kw_case: "case",
  kw_default: "default",
  kw_break: "break",
  kw_continue: "continue",
  kw_return: "return",
  kw_try: "try",
  kw_catch: "catch",
  kw_finally: "finally",
  kw_throw: "throw",
  kw_await: "await",
  kw_async: "async",
  kw_decimal: "decimal",
  kw_short: "short",
  kw_uint: "uint",
  kw_ulong: "ulong",
  kw_ushort: "ushort",
} as Rules;
