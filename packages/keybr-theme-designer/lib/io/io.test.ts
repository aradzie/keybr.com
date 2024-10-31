import { test } from "node:test";
import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { assert } from "chai";
import { lightTheme } from "../themes/themes.ts";
import { ImportState } from "./import-state.ts";
import { exportTheme, importTheme0 } from "./io.ts";

test("export and import theme", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await exportTheme(lightTheme));

  // Assert.

  assert.deepStrictEqual(state.theme, lightTheme);
  assert.deepStrictEqual(state.errors, []);
});

test("import corrupted file", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, new Blob(["omg"]));

  // Assert.

  assert.deepStrictEqual(state.errors, [new TypeError("Corrupted theme file")]);
});

test("import empty file", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await makeZip([]));

  // Assert.

  assert.deepStrictEqual(state.errors, [new TypeError("Theme data not found")]);
});

async function makeZip(entries: [string, string][]) {
  const blob = new BlobWriter("application/zip");
  const zip = new ZipWriter(blob);
  for (const [name, value] of entries) {
    await zip.add(name, new TextReader(value));
  }
  await zip.close();
  return await blob.getData();
}
