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
        ref: "python_comment",
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
        f: 0.5,
        opt: {
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
        f: 0.5,
        opt: {
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
    alt: [
      {
        ref: "python_string_literal",
      },
      {
        ref: "python_number_literal",
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
      "i",
      "x",
      "_",
      "y",
      "v",
      "result",
      "out",
      "config",
      "inputs",
      "k",
      "output",
      "batch_size",
      "__all__",
      "value",
      "n",
      "j",
      "expected",
      "data",
      "outputs",
      "dtype",
      "s",
      "b",
      "a",
      "key",
      "res",
      "name",
      "op",
      "width",
      "img",
      "mask",
      "height",
      "B",
      "shape",
      "f",
      "c",
      "df",
      "h",
      "m",
      "w",
      "t",
      "index",
      "values",
      "d",
      "H",
      "input_shape",
      "root",
      "count",
      "actual",
      "W",
      "C",
    ],
  },
  python_function_name: {
    alt: [
      "__init__",
      "call",
      "get_config",
      "__repr__",
      "main",
      "build",
      "__call__",
      "from_config",
      "__getitem__",
      "__len__",
      "get",
      "__iter__",
      "dfs",
      "run",
      "__str__",
      "__eq__",
      "add",
      "test_correctness",
      "update",
      "create",
      "append",
      "__enter__",
      "__exit__",
      "load",
      "__getattr__",
      "pop",
      "constants",
      "wrapper",
      "__setitem__",
      "insert",
      "reverse",
      "preprocess_input",
      "__ne__",
      "__new__",
      "shape",
      "remove",
      "find",
      "identity",
      "serialize",
      "size",
      "copy",
      "floor",
      "reset_state",
      "func",
      "inverse_transform",
      "configure",
      "save",
      "update_state",
      "dtype",
      "inverse",
    ],
  },
  python_class_name: {
    alt: [
      "Node",
      "Graph",
      "TestSuite",
      "MyModel",
      "Create",
      "Cols",
      "Rows",
      "MyDense",
      "Attention",
      "Load",
      "Save",
      "TreeNode",
      "Dog",
      "Cat",
      "JDBC",
      "Constants",
      "Model",
      "Variable",
      "CustomModel",
      "ActivityRegularizationLayer",
    ],
  },
  python_string_value: {
    alt: [
      "",
      ".",
      "__main__",
      "float32",
      ")",
      "channels_last",
      "*",
      "int32",
      "tensorflow",
      ", ",
      "1",
      "name",
      "B",
      "int",
      "torch",
      "a",
      "valid",
      "zeros",
      "dtype",
      "channels_first",
      "2",
      "x",
      "/",
      "same",
      "constant",
      "int64",
      "_",
      "jax",
      "shape",
      "0",
      "^[a-z][a-z0-9_]*$",
      "^[0-9]+$",
      "^[A-Z]+$",
      "^([0-9a-f]+) (.*)$",
      ";",
      "\\n",
      "\\t",
      "\\r\\n",
      "C:\\\\",
    ],
  },
  python_number_literal: {
    alt: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "10",
      "6",
      "8",
      "0.5",
      "7",
      "9",
      "100",
      "32",
      "16",
      "20",
      "0.1",
      "12",
      "0.001",
      "0.2",
      "15",
      "11",
      "64",
      "0.0001",
      "0.01",
      "128",
      "256",
      "1000",
      "0.3",
      "24",
      "30",
      "13",
      "0.9",
      "50.0",
      "0.8",
      "255",
      "14",
      "0.25",
      "1e-06",
      "0.4",
      "512",
      "1024",
      "40",
      "1.5",
      "17",
      "25",
      "0.7",
      "200",
      "10000",
      "60",
      "1e-05",
    ],
  },
  python_comment: {
    alt: [
      "# type: ignore",
      "# TODO: fix!",
      "# TODO: fix?",
      "# ?",
      "# !",
      "#!/usr/bin/env python",
      "# noqa",
      "# -*- coding: utf-8 -*-",
      "# TODO: implement",
      "# ``H x W``",
      "# `1 x 1`",
      "# ;",
    ],
  },
} as Rules;
