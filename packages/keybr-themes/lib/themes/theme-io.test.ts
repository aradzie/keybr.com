import test from "ava";
import { Color } from "./color.ts";
import { CustomTheme } from "./custom-theme.ts";
import { readTheme, storeTheme } from "./theme-io.ts";

global.FileReader = window.FileReader;
global.Blob = window.Blob;

test("store", async (t) => {
  // Arrange.

  const storage = new FakeStorage([
    ["keybr.theme[--accent]", "rgb(255,255,255)"],
  ]);

  const theme = new CustomTheme()
    .set("--primary", Color.parse("#ffffff"))
    .set("--secondary", Color.parse("#000000"))
    .set(
      "--background-image",
      new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
        type: "image/svg+xml",
      }),
    );

  // Act.

  const { error } = await storeTheme(theme, storage);

  // Assert.

  t.is(error, null);
  t.deepEqual(
    [...storage],
    [
      ["keybr.theme[--primary]", "rgb(255,255,255)"],
      ["keybr.theme[--secondary]", "rgb(0,0,0)"],
      [
        "keybr.theme[--background-image]",
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
      ],
    ],
  );
});

test("read", async (t) => {
  // Arrange.

  const storage = new FakeStorage([
    ["keybr.theme[--primary]", "rgb(255,255,255)"],
    ["keybr.theme[--secondary]", "rgb(0,0,0)"],
    [
      "keybr.theme[--background-image]",
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
    ],
  ]);

  // Act.

  const { theme, error } = await readTheme(storage);

  // Assert.

  t.is(error, null);
  t.deepEqual(theme.get("--primary"), Color.parse("#ffffff"));
  t.deepEqual(theme.get("--secondary"), Color.parse("#000000"));
  const blob = theme.get("--background-image") as Blob;
  t.is(blob.type, "image/svg+xml");
  t.is(await blob.text(), '<svg xmlns="http://www.w3.org/2000/svg"/>');
});

test("read and ignore invalid data", async (t) => {
  // Arrange.

  const storage = new FakeStorage([
    ["keybr.theme[--primary]", "omg"],
    ["keybr.theme[--secondary]", "omg"],
    ["keybr.theme[--background-image]", "omg"],
  ]);

  // Act.

  const { theme, error } = await readTheme(storage);

  // Assert.

  t.deepEqual([...storage], []);
  t.deepEqual([...theme], []);
  t.is(error?.errors.length, 3);
});

class FakeStorage implements Storage, Iterable<[string, string]> {
  readonly #data: Map<string, string>;

  constructor(items: Iterable<[string, string]> = []) {
    this.#data = new Map(items);
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.#data.entries();
  }

  key(index: number): string | null {
    throw new TypeError();
  }

  get length(): number {
    throw new TypeError();
  }

  clear(): void {
    this.#data.clear();
  }

  getItem(key: string): string | null {
    return this.#data.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.#data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#data.set(key, value);
  }
}
