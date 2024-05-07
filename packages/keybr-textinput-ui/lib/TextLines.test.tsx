import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  textDisplaySettings,
  toLine,
} from "@keybr/textinput";
import { render } from "@testing-library/react";
import test from "ava";
import { TextLines } from "./TextLines.tsx";

test.serial("render", (t) => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "abc xyz",
        lines: [
          {
            text: "abcd",
            chars: [
              { codePoint: /* a */ 0x0061, attrs: attrMiss },
              { codePoint: /* b */ 0x0062, attrs: attrHit },
              { codePoint: /* c */ 0x0063, attrs: attrCursor },
              { codePoint: /* d */ 0x0064, attrs: attrNormal },
            ],
          },
          toLine("xyz"),
          toLine("uvw"),
        ],
      }}
      cursor={false}
      focus={true}
    />,
  );

  t.is(r.container.textContent, "abcdxyzuvw");

  r.unmount();
});
