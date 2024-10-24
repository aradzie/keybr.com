import { useSettings } from "@keybr/settings";
import { toChars, toTextDisplaySettings } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Box } from "@keybr/widget";

export function SyntaxPreview() {
  const { settings } = useSettings();
  return (
    <Box alignItems="center" justifyContent="center">
      <StaticText
        settings={toTextDisplaySettings(settings)}
        lines={{
          text: "abc",
          lines: [
            {
              text: "a",
              chars: toChars([{ text: `/** Comment */`, cls: "comment" }]),
            },
            {
              text: "b",
              chars: toChars([
                "println(",
                { text: `"String"`, cls: "string" },
                ");",
              ]),
            },
            {
              text: "c",
              chars: toChars([
                { text: `return`, cls: "keyword" },
                " ",
                { text: `3.14159`, cls: "number" },
                ";",
              ]),
            },
          ],
        }}
        cursor={true}
        size="X0"
      />
    </Box>
  );
}
