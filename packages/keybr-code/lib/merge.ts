import { type Prod, type Rules } from "./ast.ts";

/**
 * Merges multiple grammar into one, from left to right, the later rules overwrite the former.
 */
export function merge(
  rulesList: readonly Rules[],
  onDuplicate: "throw" | "replace" = "replace",
): Rules {
  if (rulesList.length === 0) {
    throw new Error();
  }
  if (rulesList.length === 1) {
    return rulesList[0];
  }
  const map = new Map<string, Prod>();
  for (const rules of rulesList) {
    for (const [name, rule] of Object.entries(rules)) {
      if (onDuplicate === "throw" && map.has(name)) {
        throw new Error(`Duplicate rule "${name}"`);
      }
      map.set(name, rule);
    }
  }
  return Object.fromEntries(map);
}
