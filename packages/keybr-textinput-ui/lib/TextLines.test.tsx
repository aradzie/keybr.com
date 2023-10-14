import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  textDisplaySettings,
  toLine,
} from "@keybr/textinput";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { TextLines } from "./TextLines.tsx";

test("render", (t) => {
  const testRenderer = TestRenderer.create(
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
          toLine("abc"),
          toLine("xyz"),
        ],
      }}
      cursor={false}
      focus={true}
    />,
  );

  t.snapshot(testRenderer.toJSON());
});
