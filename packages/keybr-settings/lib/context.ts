import { createContext, useContext } from "react";
import { type Settings } from "./settings.ts";

export type SettingsContextProps = {
  readonly settings: Settings;
  readonly updateSettings: (newSettings: Settings) => void;
};

export const SettingsContext = createContext<SettingsContextProps>(null!);

export function useSettings(): SettingsContextProps {
  const value = useContext(SettingsContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "SettingsContext is missing"
        : undefined,
    );
  }
  return value;
}
