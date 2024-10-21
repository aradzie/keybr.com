import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  type LineList,
} from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Box } from "@keybr/widget";
import { useMemo } from "react";

export function TextInputPreview() {
  const lines = useMemo(() => {
    return {
      text: "abracadabra",
      lines: [
        {
          text: "abracadabra",
          chars: [
            { codePoint: /* a */ 0x0061, attrs: attrHit },
            { codePoint: /* b */ 0x0062, attrs: attrHit },
            { codePoint: /* r */ 0x0072, attrs: attrHit },
            { codePoint: /* a */ 0x0061, attrs: attrHit },
            { codePoint: /* c */ 0x0063, attrs: attrMiss },
            { codePoint: /* a */ 0x0061, attrs: attrNormal | attrCursor },
            { codePoint: /* d */ 0x0072, attrs: attrNormal },
            { codePoint: /* a */ 0x0061, attrs: attrNormal },
            { codePoint: /* b */ 0x0062, attrs: attrNormal },
            { codePoint: /* r */ 0x0072, attrs: attrNormal },
            { codePoint: /* a */ 0x0061, attrs: attrNormal },
          ],
        },
      ],
    } as LineList;
  }, []);
  return (
    <Box alignItems="center" justifyContent="center">
      <StaticText lines={lines} cursor={true} size="X1" />
    </Box>
  );
}
