import { images } from "@keybr/themes";
import { Box, LinkButton, Para } from "@keybr/widget";
import { useCustomTheme } from "./context.ts";
import { Group } from "./Group.tsx";
import { ImageInput } from "./input/ImageInput.tsx";

export function BackgroundImage() {
  const { theme, setTheme } = useCustomTheme();
  return (
    <Group title="Background Image">
      <Box alignItems="center" justifyContent="center">
        <ImageInput
          asset={theme.getImage("--background-image")}
          onChange={(asset) => {
            setTheme(theme.set("--background-image", asset));
          }}
        />
      </Box>
      <Para align="center">
        <LinkButton
          label="Clear"
          onClick={() => {
            setTheme(theme.delete("--background-image"));
          }}
        />
        {" or "}
        <LinkButton
          label="Chocolate"
          onClick={() => {
            setTheme(theme.set("--background-image", images.chocolate));
          }}
        />
        {", "}
        <LinkButton
          label="Coffee"
          onClick={() => {
            setTheme(theme.set("--background-image", images.coffee));
          }}
        />
        {", "}
        <LinkButton
          label="Garden"
          onClick={() => {
            setTheme(theme.set("--background-image", images.garden));
          }}
        />
      </Para>
    </Group>
  );
}
