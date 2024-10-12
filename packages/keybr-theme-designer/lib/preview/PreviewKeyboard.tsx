import { Layout, loadKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { Box, Figure } from "@keybr/widget";
import { useMemo } from "react";

export function PreviewKeyboard() {
  const keyboard = useMemo(() => loadKeyboard(Layout.EN_US), []);
  return (
    <Figure>
      <Box alignItems="center" justifyContent="center">
        <VirtualKeyboard keyboard={keyboard}>
          <KeyLayer showColors={true} />
        </VirtualKeyboard>
      </Box>
    </Figure>
  );
}
