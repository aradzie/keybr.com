import { test } from "node:test";
import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { deepEqual, like } from "rich-assert";
import { lightTheme } from "../themes/themes.ts";
import { ImportState } from "./import-state.ts";
import { exportTheme, importTheme0 } from "./io.ts";

test("export and import theme", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await exportTheme(lightTheme));

  // Assert.

  deepEqual(state.theme, lightTheme);
  deepEqual(state.errors, []);
});

test("import corrupted file", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, new Blob(["omg"]));

  // Assert.

  like(state.errors, [{ message: "Corrupted theme file" }]);
});

test("import empty file", async () => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await makeZip([]));

  // Assert.

  like(state.errors, [{ message: "Theme data not found" }]);
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
