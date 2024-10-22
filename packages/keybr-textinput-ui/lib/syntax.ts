import { Attr } from "@keybr/textinput";
import { syntaxStyleMap } from "@keybr/themes";
import { type CSSProperties } from "react";

export function getSyntaxStyle({
  attrs,
  cls,
}: {
  readonly attrs: number;
  readonly cls: string | null;
}): CSSProperties | undefined {
  if (attrs === Attr.Normal || attrs === Attr.Cursor) {
    if (cls) {
      return syntaxStyleMap[cls];
    }
  }
  return undefined;
}
