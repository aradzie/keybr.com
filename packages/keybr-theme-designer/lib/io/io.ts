import { type CustomTheme } from "@keybr/themes";
import {
  BlobReader,
  BlobWriter,
  configure,
  type Entry,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";
import { ImportState } from "./import-state.ts";
import { jsonToTheme, themeJson, themeToJson } from "./json.ts";

configure({ useWebWorkers: true });

export async function exportTheme(theme: CustomTheme): Promise<Blob> {
  const blob = new BlobWriter("application/zip");
  const zip = new ZipWriter(blob);
  await zip.add(themeJson, new TextReader(await themeToJson(theme)));
  await zip.close();
  return await blob.getData();
}

export async function importTheme(
  data: Blob,
): Promise<{ theme: CustomTheme; errors: Error[] }> {
  const state = new ImportState();
  await importTheme0(state, data);
  return { theme: state.theme, errors: state.errors };
}

export async function importTheme0(
  state: ImportState,
  data: Blob,
): Promise<void> {
  const zip = new ZipReader(new BlobReader(data));
  try {
    let entries: Entry[];
    try {
      entries = await zip.getEntries();
    } catch (err) {
      state.error(new TypeError("Corrupted theme file", { cause: err }));
      return;
    }
    const map = new Map<string, Entry>();
    for (const entry of entries) {
      if (entry.filename && entry.getData) {
        map.set(entry.filename, entry);
      }
    }
    await scanThemeEntries(state, map);
  } finally {
    await zip.close();
  }
}

async function scanThemeEntries(
  state: ImportState,
  map: Map<string, Entry>,
): Promise<void> {
  const themeData = map.get(themeJson) ?? null;
  if (themeData == null) {
    state.error(new TypeError("Theme data not found"));
    return;
  }
  await jsonToTheme(state, await themeData.getData!(new TextWriter()));
}
