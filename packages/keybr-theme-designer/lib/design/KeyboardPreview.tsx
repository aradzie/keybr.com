import { useKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { useSettings } from "@keybr/settings";
import { ModifierState, useDepressedKeys } from "@keybr/textinput-events";
import { Box } from "@keybr/widget";

export function KeyboardPreview() {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys(settings, keyboard);
  return (
    <Box alignItems="center" justifyContent="center">
      <VirtualKeyboard keyboard={keyboard}>
        <KeyLayer
          depressedKeys={depressedKeys}
          toggledKeys={ModifierState.modifiers}
          showColors={true}
        />
      </VirtualKeyboard>
    </Box>
  );
}
