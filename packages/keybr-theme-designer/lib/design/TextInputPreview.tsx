import { useSettings } from "@keybr/settings";
import { Attr, type LineList, toTextDisplaySettings } from "@keybr/textinput";
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
                  { codePoint: /* a */ 0x0061, attrs: Attr.Hit },
                  { codePoint: /* b */ 0x0062, attrs: Attr.Hit },
                  { codePoint: /* r */ 0x0072, attrs: Attr.Hit },
                  { codePoint: /* a */ 0x0061, attrs: Attr.Hit },
                  { codePoint: /* c */ 0x0063, attrs: Attr.Miss },
                  {
                    codePoint: /* a */ 0x0061,
                    attrs: Attr.Normal | Attr.Cursor,
                  },
                  { codePoint: /* d */ 0x0072, attrs: Attr.Normal },
                  { codePoint: /* a */ 0x0061, attrs: Attr.Normal },
                  { codePoint: /* b */ 0x0062, attrs: Attr.Normal },
                  { codePoint: /* r */ 0x0072, attrs: Attr.Normal },
                  { codePoint: /* a */ 0x0061, attrs: Attr.Normal },
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
