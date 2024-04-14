import { useSettings } from "@keybr/settings";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { type Keyboard } from "./keyboard.ts";
import { loadKeyboard } from "./load.ts";
import { KeyboardOptions } from "./settings.ts";

export const KeyboardContext = createContext<Keyboard>(null!);

export function useKeyboard(): Keyboard {
  const value = useContext(KeyboardContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "KeyboardContext is missing"
        : undefined,
    );
  }
  return value;
}

export function KeyboardProvider({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const { settings } = useSettings();
  const keyboard = useMemo(
    () => loadKeyboard(KeyboardOptions.from(settings)),
    [settings],
  );
  return (
    <KeyboardContext.Provider value={keyboard}>
      {children}
    </KeyboardContext.Provider>
  );
}
