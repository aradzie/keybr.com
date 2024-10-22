import { Attr, textDisplaySettings } from "@keybr/textinput";
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
        { codePoint: text.codePointAt(0)!, attrs: Attr.Hit },
        { codePoint: text.codePointAt(1)!, attrs: Attr.Miss },
        { codePoint: text.codePointAt(2)!, attrs: Attr.Hit },
        { codePoint: text.codePointAt(3)!, attrs: Attr.Hit },
        { codePoint: text.codePointAt(4)!, attrs: Attr.Cursor },
        { codePoint: text.codePointAt(5)!, attrs: Attr.Normal },
        { codePoint: text.codePointAt(6)!, attrs: Attr.Normal },
      ],
    }),
    [
      <span key={0} className="hit">
        a
      </span>,
      <span key={1} className="miss">
        b
      </span>,
      <span key={2} className="hit">
        c
      </span>,
      <span key={3} className="hit">
        {"\uE000"}
      </span>,
      <span key={4} className="cursor">
        x
      </span>,
      <span key={5} className="normal">
        yz
      </span>,
    ],
  );

  t.deepEqual(
    renderChars({
      settings: textDisplaySettings,
      chars: [
        { codePoint: 0x0000, attrs: Attr.Normal },
        { codePoint: 0x0001, attrs: Attr.Normal },
        { codePoint: 0x0002, attrs: Attr.Normal },
      ],
    }),
    [
      <span key={0} className="normal">
        U+0000
      </span>,
      <span key={1} className="normal">
        U+0001
      </span>,
      <span key={2} className="normal">
        U+0002
      </span>,
    ],
  );
});
