// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    ref: "html",
  },
  html: {
    seq: [
      {
        ref: "html_tag",
      },
      " ",
      {
        ref: "html_tag",
      },
      " ",
      {
        ref: "html_tag",
      },
    ],
  },
  html_tag: {
    alt: [
      {
        ref: "html_opening_tag",
      },
      {
        ref: "html_self_closing_tag",
      },
      {
        ref: "html_closing_tag",
      },
    ],
  },
  html_opening_tag: {
    seq: [
      "<",
      {
        ref: "html_ident",
      },
      {
        f: 0.5,
        opt: {
          ref: "html_attr_list",
        },
      },
      ">",
    ],
  },
  html_self_closing_tag: {
    seq: [
      "<",
      {
        ref: "html_ident",
      },
      {
        f: 0.5,
        opt: {
          ref: "html_attr_list",
        },
      },
      "/>",
    ],
  },
  html_closing_tag: {
    seq: [
      "</",
      {
        ref: "html_ident",
      },
      ">",
    ],
  },
  html_attr_list: {
    seq: [
      {
        ref: "html_attr",
      },
      {
        f: 0.5,
        opt: {
          ref: "html_attr",
        },
      },
    ],
  },
  html_attr: {
    seq: [
      " ",
      {
        ref: "html_attr_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            '="',
            {
              ref: "html_attr_value",
            },
            '"',
          ],
        },
      },
    ],
  },
  html_attr_name: {
    alt: ["class", "style", "color"],
  },
  html_attr_value: {
    alt: ["checked", "bold", "#fff", "&amp;"],
  },
  html_ident: {
    seq: [
      {
        f: 0.5,
        opt: {
          alt: ["ns:", "my-"],
        },
      },
      {
        alt: ["html", "body", "p", "div", "span", "em", "strong", "a"],
      },
    ],
  },
} as Rules;
