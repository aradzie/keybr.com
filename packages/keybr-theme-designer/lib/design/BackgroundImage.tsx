import { Box, FieldSet } from "@keybr/widget";
import { useCustomTheme } from "../context/context.ts";
import { ImageInput } from "./ImageInput.tsx";

export function BackgroundImage() {
  const { theme, setTheme } = useCustomTheme();
  return (
    <FieldSet legend="Background Image">
      <Box alignItems="center" justifyContent="center">
        <ImageInput
          blob={theme.getImage("--background-image")}
          onChange={(blob) => {
            setTheme(theme.set("--background-image", blob));
          }}
        />
      </Box>
    </FieldSet>
  );
}
