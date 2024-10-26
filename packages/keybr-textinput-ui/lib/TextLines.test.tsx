import { Attr, textDisplaySettings } from "@keybr/textinput";
import { render } from "@testing-library/react";
import test from "ava";
import { TextLines } from "./TextLines.tsx";

test.serial("render chars", (t) => {
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

  t.is(r.container.textContent, "abcd");

  r.unmount();
});

test.serial("render chars with line template", (t) => {
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

  t.is(r.container.textContent, "[abcd]");

  r.unmount();
});
