import { Box } from "@keybr/widget";
import { useCustomTheme } from "./context.ts";
import { Group } from "./Group.tsx";
import { ImageInput } from "./input/ImageInput.tsx";

export function BackgroundImage() {
  const { theme, setTheme } = useCustomTheme();
  return (
    <Group title="Background Image">
      <Box alignItems="center" justifyContent="center">
        <ImageInput
          blob={theme.getImage("--background-image")}
          onChange={(blob) => {
            setTheme(theme.set("--background-image", blob));
          }}
        />
      </Box>
    </Group>
  );
}
