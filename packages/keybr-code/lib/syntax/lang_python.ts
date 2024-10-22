// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "python_statement",
  },
  python_statement: {
    alt: [
      {
        ref: "python_function_definition",
      },
      {
        ref: "python_class_definition",
      },
      {
        ref: "python_assign",
      },
      {
        ref: "python_return",
      },
      {
        flag: "comments",
        inv: false,
        cond: {
          ref: "python_comment",
        },
      },
    ],
  },
  python_function_definition: {
    seq: [
      "def ",
      {
        ref: "python_function_name",
      },
      "(",
      {
        ref: "python_arguments",
      },
      ")",
      {
        flag: "types",
        inv: false,
        cond: {
          seq: [
            " -> ",
            {
              ref: "python_type",
            },
          ],
        },
      },
      ":",
    ],
  },
  python_class_definition: {
    seq: [
      "class ",
      {
        ref: "python_class_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            "(",
            {
              ref: "python_class_name",
            },
            ")",
          ],
        },
      },
      ":",
    ],
  },
  python_assign: {
    seq: [
      {
        ref: "python_variable_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            "[",
            {
              ref: "python_literal",
            },
            "]",
          ],
        },
      },
      " = ",
      {
        ref: "python_expression",
      },
    ],
  },
  python_return: {
    seq: [
      "return ",
      {
        ref: "python_expression",
      },
    ],
  },
  python_arguments: {
    seq: [
      {
        ref: "python_argument",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "python_argument",
            },
          ],
        },
      },
    ],
  },
  python_argument: {
    seq: [
      {
        ref: "python_variable_name",
      },
      {
        flag: "types",
        inv: false,
        cond: {
          seq: [
            ": ",
            {
              ref: "python_type",
            },
          ],
        },
      },
    ],
  },
  python_expression: {
    alt: [
      {
        ref: "python_literal",
      },
      {
        ref: "python_unary_operation",
      },
      {
        ref: "python_binary_operation",
      },
      {
        seq: [
          "(",
          {
            ref: "python_expression",
          },
          ")",
        ],
      },
      {
        ref: "python_list_definition",
      },
      {
        ref: "python_dict_definition",
      },
      {
        ref: "python_function_call",
      },
    ],
  },
  python_unary_operation: {
    alt: [
      {
        seq: [
          {
            ref: "python_expression",
          },
          " is ",
          {
            f: 0.5,
            opt: "not ",
          },
          "None",
        ],
      },
      {
        seq: [
          "not ",
          {
            ref: "python_expression",
          },
        ],
      },
      {
        seq: [
          "~",
          {
            ref: "python_expression",
          },
        ],
      },
    ],
  },
  python_binary_operation: {
    seq: [
      {
        ref: "python_expression",
      },
      " ",
      {
        ref: "python_binary_operator",
      },
      " ",
      {
        ref: "python_expression",
      },
    ],
  },
  python_function_call: {
    seq: [
      {
        ref: "python_function_name",
      },
      "(",
      {
        ref: "python_function_arg",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "python_function_arg",
            },
          ],
        },
      },
    ],
  },
  python_function_arg: {
    seq: [
      {
        ref: "python_variable_name",
      },
      "=",
      {
        ref: "python_expression",
      },
    ],
  },
  python_type: {
    alt: [
      {
        ref: "python_primitive_type",
      },
      {
        seq: [
          "list[",
          {
            ref: "python_primitive_type",
          },
          "]",
        ],
      },
      {
        seq: [
          "dict[",
          {
            ref: "python_primitive_type",
          },
          ", ",
          {
            ref: "python_primitive_type",
          },
          "]",
        ],
      },
      {
        seq: [
          "tuple[",
          {
            ref: "python_primitive_type",
          },
          ", ...]",
        ],
      },
      {
        seq: [
          {
            ref: "python_primitive_type",
          },
          " | ",
          {
            ref: "python_primitive_type",
          },
        ],
      },
    ],
  },
  python_primitive_type: {
    alt: [
      {
        ref: "python_class_name",
      },
      "int",
      "str",
      "bool",
      "float",
      "None",
    ],
  },
  python_binary_operator: {
    alt: [
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
      "in",
      "not in",
      "^",
    ],
  },
  python_list_definition: {
    seq: [
      "[",
      {
        ref: "python_expression",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "python_expression",
            },
          ],
        },
      },
      "]",
    ],
  },
  python_dict_definition: {
    seq: [
      "{",
      {
        ref: "python_dict_key_value_pair",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "python_dict_key_value_pair",
            },
          ],
        },
      },
      "}",
    ],
  },
  python_dict_key_value_pair: {
    seq: [
      {
        ref: "python_literal",
      },
      ": ",
      {
        ref: "python_expression",
      },
    ],
  },
  python_literal: {
    seq: [
      {
        flag: "numbers",
        inv: false,
        cond: {
          alt: [
            {
              ref: "python_string_literal",
            },
            {
              ref: "python_number_literal",
            },
          ],
        },
      },
      {
        flag: "numbers",
        inv: true,
        cond: {
          ref: "python_string_literal",
        },
      },
    ],
  },
  python_string_literal: {
    alt: [
      {
        seq: [
          '"',
          {
            ref: "python_string_value",
          },
          '"',
        ],
      },
      {
        seq: [
          "'",
          {
            ref: "python_string_value",
          },
          "'",
        ],
      },
      {
        seq: [
          '"""',
          {
            ref: "python_string_value",
          },
          '"""',
        ],
      },
      {
        seq: [
          "'''",
          {
            ref: "python_string_value",
          },
          "'''",
        ],
      },
    ],
  },
  python_variable_name: {
    alt: [
      "_",
      "a",
      "actual",
      "b",
      "c",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["initial", "new", "bad", "good"],
                },
                "_",
              ],
            },
          },
          "config",
        ],
      },
      "count",
      "d",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["initial", "new", "bad", "good", "user"],
                },
                "_",
              ],
            },
          },
          "data",
        ],
      },
      "df",
      "dtype",
      "expected",
      "f",
      {
        seq: [
          {
            f: 0.5,
            opt: "my_",
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["data", "config", "image"],
                },
                "_",
              ],
            },
          },
          "file",
        ],
      },
      "h",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max"],
                },
                "_",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["inner", "outer"],
                },
                "_",
              ],
            },
          },
          "height",
        ],
      },
      "i",
      "img",
      {
        seq: [
          {
            alt: ["first", "last", "prev", "next", "min", "max"],
          },
          "_index",
        ],
      },
      "input",
      {
        seq: [
          {
            alt: ["input", "output"],
          },
          "_shape",
        ],
      },
      "j",
      "k",
      {
        seq: [
          {
            alt: ["first", "last", "prev", "next"],
          },
          "_key",
        ],
      },
      {
        seq: [
          {
            alt: ["first", "last", "prev", "next", "min", "max"],
          },
          "_layer",
        ],
      },
      "m",
      "mask",
      "n",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["file", "dir", "entry"],
                },
                "_",
              ],
            },
          },
          "name",
        ],
      },
      {
        seq: [
          {
            alt: ["first", "last", "prev", "next"],
          },
          "_node",
        ],
      },
      "op",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["last", "saved"],
                },
                "_",
              ],
            },
          },
          {
            alt: ["out", "output"],
          },
        ],
      },
      "res",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max", "last"],
                },
                "_",
              ],
            },
          },
          "result",
        ],
      },
      "root",
      "s",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["data", "layer", "image"],
                },
                "_",
              ],
            },
          },
          "shape",
        ],
      },
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max"],
                },
                "_",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["inner", "outer"],
                },
                "_",
              ],
            },
          },
          "size",
        ],
      },
      "t",
      "u",
      "v",
      {
        seq: [
          {
            alt: ["first", "last", "prev", "next", "min", "max"],
          },
          "_value",
        ],
      },
      "w",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["min", "max"],
                },
                "_",
              ],
            },
          },
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["inner", "outer"],
                },
                "_",
              ],
            },
          },
          "width",
        ],
      },
      "x",
      "y",
      "z",
    ],
  },
  python_function_name: {
    alt: [
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
      "__setitem__",
      "__str__",
      "add",
      "append",
      "build",
      "call",
      "configure",
      "constants",
      {
        seq: [
          "copy",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["item", "node", "entry", "layer", "file", "config"],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "create",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["item", "node", "entry", "layer", "file", "config"],
                },
              ],
            },
          },
        ],
      },
      "dfs",
      "dtype",
      "exec",
      {
        seq: [
          "find",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["item", "node", "entry", "layer", "file", "config"],
                },
              ],
            },
          },
        ],
      },
      "floor",
      "from_config",
      {
        seq: [
          "get",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      "identity",
      {
        seq: [
          "init",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  f: 0.5,
                  opt: "pre",
                },
                "process_",
              ],
            },
          },
          {
            f: 0.5,
            opt: "_user",
          },
          "input",
        ],
      },
      {
        seq: [
          "insert",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["item", "node", "entry", "layer"],
                },
              ],
            },
          },
        ],
      },
      "inverse",
      "inverse_transform",
      {
        seq: [
          "load",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      "main",
      {
        seq: [
          "pop",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["item", "node", "entry", "layer"],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "read",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "remove",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      "reset_state",
      "reverse",
      "run",
      {
        seq: [
          "save",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      "serialize",
      "shape",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["file", "data", "image", "layer"],
                },
                "_",
              ],
            },
          },
          "size",
        ],
      },
      {
        seq: [
          "store",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "update",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          {
            f: 0.5,
            opt: {
              seq: [
                {
                  alt: ["function", "class"],
                },
                "_",
              ],
            },
          },
          "wrapper",
        ],
      },
    ],
  },
  python_class_name: {
    alt: [
      "ActivityRegularizationLayer",
      "Attention",
      "Cat",
      "Cols",
      "Command",
      "Constants",
      "Controller",
      "Dir",
      "Dog",
      "Entry",
      "File",
      "Graph",
      "Handle",
      "Item",
      "Layer",
      "List",
      "Load",
      {
        seq: [
          {
            f: 0.5,
            opt: {
              alt: ["Custom", "Example"],
            },
          },
          "Model",
        ],
      },
      {
        seq: [
          {
            f: 0.5,
            opt: {
              alt: ["Tree", "Graph", "List"],
            },
          },
          "Node",
        ],
      },
      "Rows",
      "Table",
      "TestSuite",
      "Tree",
      "Variable",
    ],
  },
  python_string_value: {
    alt: [
      ".",
      "abc",
      "channels_first",
      "channels_last",
      "constant",
      "dtype",
      "int",
      "jax",
      "name",
      "same",
      "shape",
      "tensorflow",
      "torch",
      "uvw",
      "valid",
      "x",
      "xyz",
      "zeros",
    ],
  },
  python_number_literal: {
    alt: [
      "1",
      "0.001",
      "0.01",
      "0.1",
      "0.2",
      "0.25",
      "0.3",
      "0.4",
      "0.5",
      "0.6",
      "0.7",
      "0.8",
      "0.9",
      "1.5",
      "10",
      "100",
      "1000",
      "1024",
      "11",
      "12",
      "128",
      "13",
      "14",
      "15",
      "16",
      "17",
      "1e-05",
      "1e-06",
      "2",
      "20",
      "200",
      "24",
      "25",
      "255",
      "256",
      "3",
      "30",
      "32",
      "4",
      "40",
      "5",
      "50.0",
      "512",
      "6",
      "60",
      "64",
      "7",
      "8",
      "9",
    ],
  },
  python_comment: {
    cls: "comment",
    span: {
      alt: [
        "# type: ignore",
        "# TODO: fix",
        "# TODO: implement",
        "#!/usr/bin/env python",
      ],
    },
  },
} as Rules;
