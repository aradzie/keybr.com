import type { RuleMap } from "./ast.ts";

export const lang_c: RuleMap = {
  start: { ref: "c_func" },
  c_func: {
    seq: [
      { ref: "c_type" },
      " ",
      { ref: "c_func_id" },
      "(",
      { ref: "c_param_list" },
      ") ",
      { ref: "c_func_body" },
    ],
  },
  c_type: {
    seq: [
      {
        alt: ["char", "int", "long", "short", "void"],
      },
      { f: 0.5, opt: { alt: ["*", "[]"] } },
    ],
  },
  c_param_list: { seq: [{ ref: "c_param" }, ", ", { ref: "c_param" }] },
  c_param: {
    seq: [{ ref: "c_type" }, " ", { ref: "c_var_id" }, { f: 0.5, opt: "[]" }],
  },
  c_arg_list: { seq: [{ ref: "c_arg" }, ", ", { ref: "c_arg" }] },
  c_arg: { ref: "c_expr" },
  c_func_body: { seq: ["{ ", { ref: "c_stmt" }, " }"] },
  c_stmt: {
    seq: [
      {
        alt: [
          { ref: "c_call_stmt" },
          { ref: "c_expr_stmt" },
          { ref: "c_if_stmt" },
          { ref: "c_return_stmt" },
        ],
      },
      ";",
    ],
  },
  c_call_stmt: { seq: [{ ref: "c_func_id" }, "(", { ref: "c_arg_list" }, ")"] },
  c_expr_stmt: { ref: "c_expr" },
  c_if_stmt: {
    seq: ["if (", { ref: "c_expr" }, ") { ", { ref: "c_call_stmt" }, " }"],
  },
  c_return_stmt: { seq: ["return ", { ref: "c_expr" }] },
  c_expr: {
    alt: [
      { seq: ['"', "abc", '"'] },
      { seq: ["'", "abc", "'"] },
      { seq: ["`", "abc", "`"] },
      { ref: "c_unary_exp" },
      { ref: "c_binary_exp" },
      { ref: "c_ternary_exp" },
    ],
  },
  c_unary_exp: {
    seq: [
      { ref: "c_var_id" },
      { alt: ["--", "++", { seq: ["->", { ref: "c_var_id" }] }] },
    ],
  },
  c_binary_exp: {
    seq: [
      { seq: ["(", { ref: "c_unary_exp" }, ")"] },
      {
        alt: [
          { seq: [" ", "+", " ", { ref: "c_var_id" }] },
          { seq: [" ", "-", " ", { ref: "c_var_id" }] },
          { seq: [" ", "*", " ", { ref: "c_var_id" }] },
          { seq: [" ", "/", " ", { ref: "c_var_id" }] },
          { seq: [" ", "|", " ", { ref: "c_var_id" }] },
          { seq: [" ", "&", " ", { ref: "c_var_id" }] },
          { seq: [" ", "==", " ", { ref: "c_var_id" }] },
          { seq: [" ", "!=", " ", { ref: "c_var_id" }] },
          { seq: [" ", ">=", " ", { ref: "c_var_id" }] },
          { seq: [" ", "<=", " ", { ref: "c_var_id" }] },
        ],
      },
    ],
  },
  c_ternary_exp: {
    seq: [
      { ref: "c_unary_exp" },
      " ? ",
      { ref: "c_unary_exp" },
      " : ",
      { ref: "c_unary_exp" },
    ],
  },
  c_func_id: {
    alt: [
      "abort",
      "bsearch",
      "calloc",
      "cos",
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
      "sin",
      "sqrt",
      "strcat",
      "strcmp",
      "strcmp",
      "strcpy",
      "strlen",
      "strlen",
      "tan",
    ],
  },
  c_var_id: {
    seq: [
      { alt: ["a", "b", "c", "d"] },
      { f: 0.5, opt: { seq: ["_", { alt: ["a", "b", "c", "d"] }] } },
    ],
  },
};
