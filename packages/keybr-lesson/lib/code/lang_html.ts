import type { RuleMap } from "./ast.ts";

export const lang_html: RuleMap = {
  start: { ref: "html" },
  html: {
    seq: [
      { ref: "html_tag" },
      " ",
      { ref: "html_tag" },
      " ",
      { ref: "html_tag" },
      " ",
      { ref: "html_tag" },
      " ",
      { ref: "html_tag" },
    ],
  },
  html_tag: {
    alt: [
      { ref: "html_opening_tag" },
      { ref: "html_self_closing_tag" },
      { ref: "html_closing_tag" },
    ],
  },
  html_opening_tag: {
    seq: [
      "<",
      { ref: "html_ident" },
      { f: 0.8, opt: { ref: "html_attr_list" } },
      ">",
    ],
  },
  html_self_closing_tag: {
    seq: [
      "<",
      { ref: "html_ident" },
      { f: 0.8, opt: { ref: "html_attr_list" } },
      "/>",
    ],
  },
  html_closing_tag: {
    seq: ["</", { ref: "html_ident" }, ">"],
  },
  html_attr_list: {
    ref: "html_attr",
  },
  html_attr: {
    seq: [
      " ",
      { ref: "html_attr_name" },
      { f: 0.9, opt: { seq: ["=", '"', { ref: "html_attr_value" }, '"'] } },
    ],
  },
  html_attr_name: { alt: ["class", "style", "color"] },
  html_attr_value: { alt: ["checked", "bold", "#fff", "&amp;"] },
  html_ident: {
    seq: [
      {
        alt: [
          { f: 0.5, opt: "ns:" },
          { f: 0.5, opt: "my-" },
        ],
      },
      { ref: "html_ident_suffix" },
    ],
  },
  html_ident_suffix: {
    alt: ["html", "body", "p", "div", "span", "em", "strong", "a"],
  },
};
