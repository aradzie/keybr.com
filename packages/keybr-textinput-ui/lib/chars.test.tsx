import { test } from "node:test";
import { Attr, textDisplaySettings } from "@keybr/textinput";
import { deepEqual } from "rich-assert";
import { renderChars } from "./chars.tsx";

test("render empty chars", () => {
  deepEqual(renderChars(textDisplaySettings, []), []);
});

test("render simple chars", () => {
  deepEqual(
    renderChars(textDisplaySettings, [
      { codePoint: /* "a" */ 0x0061, attrs: Attr.Hit },
      { codePoint: /* "b" */ 0x0062, attrs: Attr.Miss },
      { codePoint: /* "c" */ 0x0063, attrs: Attr.Hit },
      { codePoint: /* " " */ 0x0020, attrs: Attr.Hit },
      { codePoint: /* "x" */ 0x0078, attrs: Attr.Cursor },
      { codePoint: /* "y" */ 0x0079, attrs: Attr.Normal },
      { codePoint: /* "z" */ 0x007a, attrs: Attr.Normal },
    ]),
    [
      <span
        key={0}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        a
      </span>,
      <span
        key={1}
        className={undefined}
        style={{ color: "var(--textinput--miss__color)" }}
      >
        b
      </span>,
      <span
        key={2}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        c
      </span>,
      <span
        key={3}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        {"\uE000"}
      </span>,
      <span
        key={4}
        className="cursor"
        style={{ color: "var(--textinput__color)" }}
      >
        x
      </span>,
      <span
        key={5}
        className={undefined}
        style={{ color: "var(--textinput__color)" }}
      >
        yz
      </span>,
    ],
  );
});

test("render styled chars", () => {
  deepEqual(
    renderChars(textDisplaySettings, [
      { codePoint: /* "a" */ 0x0061, attrs: Attr.Hit, cls: "keyword" },
      { codePoint: /* "b" */ 0x0062, attrs: Attr.Miss, cls: "keyword" },
      { codePoint: /* "c" */ 0x0063, attrs: Attr.Hit, cls: "keyword" },
      { codePoint: /* " " */ 0x0020, attrs: Attr.Hit, cls: "keyword" },
      { codePoint: /* "x" */ 0x0078, attrs: Attr.Cursor, cls: "keyword" },
      { codePoint: /* "y" */ 0x0079, attrs: Attr.Normal, cls: "keyword" },
      { codePoint: /* "z" */ 0x007a, attrs: Attr.Normal, cls: "keyword" },
    ]),
    [
      <span
        key={0}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        a
      </span>,
      <span
        key={1}
        className={undefined}
        style={{ color: "var(--textinput--miss__color)" }}
      >
        b
      </span>,
      <span
        key={2}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        c
      </span>,
      <span
        key={3}
        className={undefined}
        style={{ color: "var(--textinput--hit__color)" }}
      >
        {"\uE000"}
      </span>,
      <span
        key={4}
        className="cursor"
        style={{ color: "var(--syntax-keyword)" }}
      >
        x
      </span>,
      <span
        key={5}
        className={undefined}
        style={{ color: "var(--syntax-keyword)" }}
      >
        yz
      </span>,
    ],
  );
});

test("render special chars", () => {
  deepEqual(
    renderChars(textDisplaySettings, [
      { codePoint: 0x0000, attrs: Attr.Normal },
      { codePoint: 0x0009, attrs: Attr.Normal },
      { codePoint: 0x000a, attrs: Attr.Normal },
      { codePoint: 0x0020, attrs: Attr.Normal },
    ]),
    [
      <span
        key={0}
        className={undefined}
        style={{ color: "var(--textinput--special__color)" }}
      >
        U+0000
      </span>,
      <span
        key={1}
        className={undefined}
        style={{ color: "var(--textinput--special__color)" }}
      >
        {"\uE002"}
      </span>,
      <span
        key={2}
        className={undefined}
        style={{ color: "var(--textinput--special__color)" }}
      >
        {"\uE003"}
      </span>,
      <span
        key={3}
        className={undefined}
        style={{ color: "var(--textinput--special__color)" }}
      >
        {"\uE000"}
      </span>,
    ],
  );
});
