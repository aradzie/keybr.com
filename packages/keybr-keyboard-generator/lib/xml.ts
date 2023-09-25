import { readFileSync } from "node:fs";
import { type Element, xml2js } from "xml-js";

export function readXml(name: string): Element {
  return xml2js(readFileSync(name, "utf-8")) as Element;
}

export function walkTree(
  root: Element,
  enter: (stack: readonly Element[], path: string) => void,
): void {
  const stack: Element[] = [];

  const walk = (parent: Element) => {
    stack.push(parent);
    enter(stack, stack.map(({ name }) => name).join("/"));
    for (const element of parent.elements ?? []) {
      walk(element);
    }
    stack.pop();
  };

  walk(root);
}
