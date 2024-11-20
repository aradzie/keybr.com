import { test } from "node:test";
import { Attr, textDisplaySettings } from "@keybr/textinput";
import { render } from "@testing-library/react";
import { equal } from "rich-assert";
import { TextLines } from "./TextLines.tsx";

test("render chars", () => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "abcd",
        lines: [
          {
            text: "abcd",
            chars: [
              { codePoint: /* "a" */ 0x0061, attrs: Attr.Miss },
              { codePoint: /* "b" */ 0x0062, attrs: Attr.Hit },
              { codePoint: /* "c" */ 0x0063, attrs: Attr.Cursor },
              { codePoint: /* "d" */ 0x0064, attrs: Attr.Normal },
            ],
          },
        ],
      }}
      cursor={false}
      focus={true}
    />,
  );

  equal(r.container.textContent, "abcd");

  r.unmount();
});

test("render chars with line template", () => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "abcd",
        lines: [
          {
            text: "abcd",
            chars: [
              { codePoint: /* "a" */ 0x0061, attrs: Attr.Miss },
              { codePoint: /* "b" */ 0x0062, attrs: Attr.Hit },
              { codePoint: /* "c" */ 0x0063, attrs: Attr.Cursor },
              { codePoint: /* "d" */ 0x0064, attrs: Attr.Normal },
            ],
          },
        ],
      }}
      cursor={false}
      focus={true}
      lineTemplate={({ children }) => <div>[{children}]</div>}
    />,
  );

  equal(r.container.textContent, "[abcd]");

  r.unmount();
});
