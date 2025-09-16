import { writeFile } from "node:fs/promises";
import { test } from "node:test";
import { equal, includes, isNotEmpty } from "rich-assert";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";

test("find layout", () => {
  equal(Layout.findLayout(""), null);
  equal(Layout.findLayout("xyz"), null);
  equal(Layout.findLayout("xy-yy"), null);

  equal(Layout.findLayout("en"), Layout.EN_US);
  equal(Layout.findLayout("en-US"), Layout.EN_US);
  equal(Layout.findLayout("en-XX"), Layout.EN_US);

  equal(Layout.findLayout("fr"), Layout.FR_FR);
  equal(Layout.findLayout("fr-FR"), Layout.FR_FR);
  equal(Layout.findLayout("fr-CA"), Layout.FR_CA);
  equal(Layout.findLayout("fr-XX"), Layout.FR_FR);
});

test("find layouts for all languages", () => {
  for (const language of Language.ALL) {
    const layouts = Layout.selectableLayouts(language);
    isNotEmpty(layouts);
    for (const layout of layouts) {
      equal(layout.language.script, language.script);
    }
    const layout = Layout.selectLayout(language);
    includes(layouts, layout);
    equal(layout.language.script, language.script);
  }
});

await makeIdAllocationReport();

async function makeIdAllocationReport() {
  const dnLanguage = new Intl.DisplayNames("en", { type: "language" });
  const dnRegion = new Intl.DisplayNames("en", { type: "region" });

  function formatLayoutName(layout: Layout): string {
    const languageName = dnLanguage.of(layout.language.id)!;
    const layoutName = layout.name.replaceAll(/\{[-A-Z]+\}/g, (id) => {
      return dnRegion.of(id.substring(1, id.length - 1))!;
    });
    return `${languageName}/${layoutName}`;
  }

  const lines = [];

  lines.push(`<!-- Generated file, do not edit. -->`);
  lines.push(``);
  lines.push(`# Layout Id Allocation List`);
  lines.push(``);

  const layouts = new Map<number, Layout>(
    Layout.ALL.map((layout) => [layout.xid, layout]),
  );

  let numAlloc = 0;
  let numFree = 0;

  for (let index = 0x10; index <= 0xff; index += 1) {
    const layout = layouts.get(index);
    const id = `0x${index.toString(16).padStart(2, "0")}`;
    if (layout != null) {
      lines.push(`- \`${id}\`: ${formatLayoutName(layout)}`);
      numAlloc += 1;
    } else {
      lines.push(`- \`${id}\`:`);
      numFree += 1;
    }
  }

  lines.push(``);
  lines.push(`${numAlloc} allocated identifiers`);
  lines.push(``);
  lines.push(`${numFree} free identifiers`);
  lines.push(``);

  await writeFile(
    `${import.meta.dirname}/layout-id.md`,
    lines.join("\n") + "\n",
  );
}
