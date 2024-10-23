import { useSettings } from "@keybr/settings";
import { singleLine, toTextDisplaySettings } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Box } from "@keybr/widget";

export function SyntaxPreview() {
  const { settings } = useSettings();
  return (
    <Box alignItems="center" justifyContent="center">
      <StaticText
        settings={toTextDisplaySettings(settings)}
        lines={singleLine([
          { text: "/** Comment */", cls: "comment" },
          " ",
          { text: "void", cls: "keyword" },
          " ",
          "hello()",
          " ",
          "{",
          " ",
          { text: "return", cls: "keyword" },
          " ",
          "println",
          "(",
          { text: `"Hello world!"`, cls: "string" },
          ",",
          " ",
          { text: `3.14159`, cls: "number" },
          ")",
          ";",
          " ",
          "}",
        ])}
        cursor={true}
        size="X0"
      />
    </Box>
  );
}
