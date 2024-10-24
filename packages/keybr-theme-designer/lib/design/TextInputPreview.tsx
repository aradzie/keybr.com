import { useSettings } from "@keybr/settings";
import {
  Attr,
  type LineList,
  toChars,
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
            text: "abc",
            lines: [
              {
                text: "abc",
                chars: [
                  ...toChars("one", Attr.Hit),
                  ...toChars(" ", Attr.Hit),
                  ...toChars("two", Attr.Miss),
                  ...toChars(" ", Attr.Hit),
                  ...toChars("three", Attr.Garbage),
                  ...toChars(" ", Attr.Normal),
                  ...toChars(" ", Attr.Normal),
                  ...toChars(" ", Attr.Normal),
                  ...toChars("f", Attr.Normal),
                  ...toChars("o", Attr.Normal),
                  ...toChars("ur", Attr.Normal),
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
