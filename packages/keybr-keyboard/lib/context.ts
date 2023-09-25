import { createContext, useContext } from "react";
import { type Keyboard } from "./keyboard.ts";

export const KeyboardContext = createContext<Keyboard>(null!);

export function useKeyboard(): Keyboard {
  const value = useContext(KeyboardContext);
  if (value == null) {
    throw new Error();
  }
  return value;
}
