import { lightTheme } from "@keybr/themes";
import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import test from "ava";
import { ImportState } from "./import-state.ts";
import { exportTheme, importTheme0 } from "./io.ts";

test("export and import theme", async (t) => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await exportTheme(lightTheme));

  // Assert.

  t.deepEqual(state.theme, lightTheme);
  t.deepEqual(state.errors, []);
});

test("import corrupted file", async (t) => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, new Blob(["omg"]));

  // Assert.

  t.deepEqual(state.errors, [new TypeError("Corrupted theme file")]);
});

test("import empty file", async (t) => {
  // Arrange.

  const state = new ImportState();

  // Act.

  await importTheme0(state, await makeZip([]));

  // Assert.

  t.deepEqual(state.errors, [new TypeError("Theme data not found")]);
});

async function makeZip(entries: [string, string][]): Promise<Blob> {
  const blob = new BlobWriter("application/zip");
  const zip = new ZipWriter(blob);
  for (const [name, value] of entries) {
    await zip.add(name, new TextReader(value));
  }
  await zip.close();
  return await blob.getData();
}
