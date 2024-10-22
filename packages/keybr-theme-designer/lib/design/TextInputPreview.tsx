import { useSettings } from "@keybr/settings";
import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  type LineList,
  toTextDisplaySettings,
} from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Box } from "@keybr/widget";

export function TextInputPreview() {
  const { settings } = useSettings();
  return (
    <Box alignItems="center" justifyContent="center">
      <StaticText
        settings={toTextDisplaySettings(settings)}
        lines={
          {
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
          } as LineList
        }
        cursor={true}
        size="X1"
      />
    </Box>
  );
}
