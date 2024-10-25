import { useSettings } from "@keybr/settings";
import { splitStyledText, toTextDisplaySettings } from "@keybr/textinput";
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
              chars: splitStyledText([
                { text: `/** Comment */`, cls: "comment" },
              ]),
            },
            {
              text: "b",
              chars: splitStyledText([
                "println(",
                { text: `"String"`, cls: "string" },
                ");",
              ]),
            },
            {
              text: "c",
              chars: splitStyledText([
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
