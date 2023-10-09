import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  textDisplaySettings,
} from "@keybr/textinput";
import test from "ava";
import { renderChars } from "./chars.tsx";

test("render chars", (t) => {
  t.deepEqual(
    renderChars({
      settings: textDisplaySettings,
      chars: [],
    }),
    [],
  );

  const text = "abc xyz";

  t.deepEqual(
    renderChars({
      settings: textDisplaySettings,
      chars: [
        { codePoint: text.codePointAt(0)!, attrs: attrHit },
        { codePoint: text.codePointAt(1)!, attrs: attrMiss },
        { codePoint: text.codePointAt(2)!, attrs: attrHit },
        { codePoint: text.codePointAt(3)!, attrs: attrHit },
        { codePoint: text.codePointAt(4)!, attrs: attrCursor },
        { codePoint: text.codePointAt(5)!, attrs: attrNormal },
        { codePoint: text.codePointAt(6)!, attrs: attrNormal },
      ],
    }),
    [
      <span key={0} className="chars chars_hit">
        a
      </span>,
      <span key={1} className="chars chars_miss">
        b
      </span>,
      <span key={2} className="chars chars_hit">
        c
      </span>,
      <span key={3} className="chars chars_hit">
        {"\u2E31"}
      </span>,
      <span key={4} className="chars chars_cursor">
        x
      </span>,
      <span key={5} className="chars chars_normal">
        yz
      </span>,
    ],
  );

  t.deepEqual(
    renderChars({
      settings: textDisplaySettings,
      chars: [
        { codePoint: 0x0000, attrs: attrNormal },
        { codePoint: 0x0001, attrs: attrNormal },
        { codePoint: 0x0002, attrs: attrNormal },
      ],
    }),
    [
      <span key={0} className="chars chars_normal">
        U+0000
      </span>,
      <span key={1} className="chars chars_normal">
        U+0001
      </span>,
      <span key={2} className="chars chars_normal">
        U+0002
      </span>,
    ],
  );
});
