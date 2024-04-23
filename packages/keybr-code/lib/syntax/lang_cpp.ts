// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "c_func",
  },
  start_fproto: {
    seq: [
      {
        ref: "c_func_proto",
      },
      ";",
    ],
  },
  start_stmt: {
    ref: "c_stmt",
  },
  c_func: {
    seq: [
      {
        ref: "c_func_proto",
      },
      " ",
      {
        ref: "c_func_body",
      },
    ],
  },
  c_func_proto: {
    seq: [
      {
        ref: "c_type",
      },
      " ",
      {
        ref: "c_func_id",
      },
      "(",
      {
        ref: "c_param_list",
      },
      ")",
    ],
  },
  c_type: {
    seq: [
      {
        alt: ["char", "int", "long", "short", "void"],
      },
      {
        f: 0.5,
        opt: {
          seq: [
            "*",
            {
              f: 0.5,
              opt: "*",
            },
          ],
        },
      },
    ],
  },
  c_param_list: {
    seq: [
      {
        ref: "c_param",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "c_param",
            },
            {
              f: 0.5,
              opt: {
                seq: [
                  ", ",
                  {
                    ref: "c_param",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  c_param: {
    seq: [
      {
        ref: "c_type",
      },
      " ",
      {
        f: 0.5,
        opt: "&",
      },
      {
        ref: "c_var_id",
      },
      {
        f: 0.5,
        opt: "[]",
      },
    ],
  },
  c_arg_list: {
    seq: [
      {
        ref: "c_arg",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            ", ",
            {
              ref: "c_arg",
            },
            {
              f: 0.5,
              opt: {
                seq: [
                  ", ",
                  {
                    ref: "c_arg",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  c_arg: {
    ref: "c_expr",
  },
  c_func_body: {
    seq: [
      "{ ",
      {
        ref: "c_stmt",
      },
      " }",
    ],
  },
  c_stmt: {
    alt: [
      {
        ref: "c_var_stmt",
      },
      {
        ref: "c_call_stmt",
      },
      {
        ref: "c_if_stmt",
      },
      {
        ref: "c_return_stmt",
      },
    ],
  },
  c_var_stmt: {
    seq: [
      {
        ref: "c_type",
      },
      " ",
      {
        ref: "c_var_id",
      },
      " = ",
      {
        ref: "c_expr",
      },
      ";",
    ],
  },
  c_call_stmt: {
    seq: [
      {
        ref: "c_func_id",
      },
      "(",
      {
        ref: "c_arg_list",
      },
      ");",
    ],
  },
  c_if_stmt: {
    seq: [
      "if (",
      {
        ref: "c_expr",
      },
      ") { ",
      {
        ref: "c_call_stmt",
      },
      " }",
    ],
  },
  c_return_stmt: {
    seq: [
      "return ",
      {
        ref: "c_expr",
      },
      ";",
    ],
  },
  c_expr: {
    alt: [
      {
        ref: "c_unary_exp",
      },
      {
        ref: "c_binary_exp",
      },
      {
        ref: "c_ternary_exp",
      },
    ],
  },
  c_unary_exp: {
    seq: [
      {
        alt: [
          {
            seq: [
              "(*",
              {
                ref: "c_var_id",
              },
              ")",
            ],
          },
          {
            ref: "c_var_id",
          },
        ],
      },
      {
        alt: [
          "--",
          "++",
          {
            seq: [
              "->",
              {
                ref: "c_var_id",
              },
            ],
          },
        ],
      },
    ],
  },
  c_binary_exp: {
    seq: [
      "(",
      {
        ref: "c_unary_exp",
      },
      ")",
      {
        alt: [
          {
            seq: [
              " + ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " - ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " * ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " / ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " | ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " & ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " << ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " >> ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " == ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " != ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " >= ",
              {
                ref: "c_var_id",
              },
            ],
          },
          {
            seq: [
              " <= ",
              {
                ref: "c_var_id",
              },
            ],
          },
        ],
      },
    ],
  },
  c_ternary_exp: {
    seq: [
      {
        ref: "c_unary_exp",
      },
      " ? ",
      {
        ref: "c_unary_exp",
      },
      " : ",
      {
        ref: "c_unary_exp",
      },
    ],
  },
  c_func_id: {
    seq: [
      {
        f: 0.5,
        opt: "std::",
      },
      {
        ref: "c_func_id_suffix",
      },
    ],
  },
  c_func_id_suffix: {
    alt: [
      "abort",
      "bsearch",
      "calloc",
      "exit",
      "fclose",
      "fflush",
      "fopen",
      "free",
      "malloc",
      "memcmp",
      "memcpy",
      "memmove",
      "memset",
      "printf",
      "qsort",
      "realloc",
      "strcat",
      "strcmp",
      "strcmp",
      "strcpy",
      "strlen",
      "strlen",
    ],
  },
  c_var_id: {
    alt: [
      {
        seq: [
          "a",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["b", "c", "d"],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "b",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["a", "c", "d"],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "c",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["a", "b", "d"],
                },
              ],
            },
          },
        ],
      },
      {
        seq: [
          "d",
          {
            f: 0.5,
            opt: {
              seq: [
                "_",
                {
                  alt: ["a", "b", "c"],
                },
              ],
            },
          },
        ],
      },
    ],
  },
} as Rules;
