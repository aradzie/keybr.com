import { readFile } from "node:fs/promises";

export async function importStyles(fileName: string): Promise<string> {
  const content = await readFile(fileName, "utf-8");
  const names = new Set<string>();
  for (const item of content.matchAll(/[.#]([a-z][-_a-z0-9]*)/gi)) {
    names.add(item[1]);
  }
  return [...names]
    .map((name) => `export const ${toCamelCase(name)} = "${name}";\n`)
    .join("");
}

function toCamelCase(name: string): string {
  return name
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word;
      } else {
        return (
          word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
        );
      }
    })
    .join("");
}
