import { useCallback, useRef } from "react";
import { useWindowEvent } from "./use-window-event.ts";

type HotkeyItem = readonly [string, Handler];

type Handler = () => void;

type Hotkey = {
  readonly alt: boolean;
  readonly ctrl: boolean;
  readonly shift: boolean;
  readonly key: string;
};

export const useHotkeys = (...hotkeys: readonly HotkeyItem[]): void => {
  useWindowEvent("keydown", useHotkeysHandler(...hotkeys));
};

export const useHotkeysHandler = (...hotkeys: readonly HotkeyItem[]) => {
  const ref = useRef<[Hotkey, Handler][]>(null!);
  ref.current = hotkeys.map(mapHotkeys);
  return useCallback(
    (event: {
      readonly key: string;
      readonly code: string;
      readonly altKey: boolean;
      readonly ctrlKey: boolean;
      readonly shiftKey: boolean;
      readonly target: EventTarget | null;
      preventDefault(): void;
    }): void => {
      for (const [hotkey, handler] of ref.current) {
        if (
          (event.key === hotkey.key || event.code === hotkey.key) &&
          event.altKey === hotkey.alt &&
          event.ctrlKey === hotkey.ctrl &&
          event.shiftKey === hotkey.shift
        ) {
          event.preventDefault();
          handler();
        }
      }
    },
    [],
  );
};

const mapHotkeys = ([spec, handler]: HotkeyItem): [Hotkey, Handler] => {
  return [parseHotkey(spec), handler];
};

const hotkeyCache = new Map<string, Hotkey>();

const parseHotkey = (spec: string): Hotkey => {
  let hotkey = hotkeyCache.get(spec);
  if (hotkey == null) {
    const parsed = {
      alt: false,
      ctrl: false,
      shift: false,
      key: "",
    };
    const keys = spec.split("+");
    while (keys.length > 0) {
      const key = keys.shift()!;
      switch (key) {
        case "Alt":
          if (parsed.alt) {
            throw new TypeError(
              process.env.NODE_ENV !== "production"
                ? `Invalid hotkey [${spec}]`
                : undefined,
            );
          } else {
            parsed.alt = true;
          }
          break;
        case "Ctrl":
          if (parsed.ctrl) {
            throw new TypeError(
              process.env.NODE_ENV !== "production"
                ? `Invalid hotkey [${spec}]`
                : undefined,
            );
          } else {
            parsed.ctrl = true;
          }
          break;
        case "Shift":
          if (parsed.shift) {
            throw new TypeError(
              process.env.NODE_ENV !== "production"
                ? `Invalid hotkey [${spec}]`
                : undefined,
            );
          } else {
            parsed.shift = true;
          }
          break;
        default:
          if (keys.length === 0) {
            parsed.key = key;
          } else {
            throw new TypeError(
              process.env.NODE_ENV !== "production"
                ? `Invalid hotkey [${spec}]`
                : undefined,
            );
          }
          break;
      }
    }
    if (parsed.key === "") {
      throw new TypeError(
        process.env.NODE_ENV !== "production"
          ? `Invalid hotkey [${spec}]`
          : undefined,
      );
    }
    hotkeyCache.set(spec, (hotkey = parsed));
  }
  return hotkey;
};
