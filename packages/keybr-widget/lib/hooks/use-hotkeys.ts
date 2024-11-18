import { useCallback, useEffect, useRef } from "react";
import { useWindowEvent } from "./use-window-event.ts";

type HotkeyMap = Record<string, Handler>;
type Handler = (event: KeyEvent) => void;
type KeyEvent = {
  readonly key: string;
  readonly code: string;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  preventDefault(): void;
  stopPropagation(): void;
};
type Hotkey = {
  readonly alt: boolean;
  readonly ctrl: boolean;
  readonly meta: boolean;
  readonly shift: boolean;
  readonly key: string;
};

export const useHotkeys = (map: HotkeyMap): void => {
  useWindowEvent("keydown", useHotkeysHandler(map));
};

export const useHotkeysHandler = (map: HotkeyMap) => {
  const ref = useRef<[Hotkey, Handler][]>([]);
  useEffect(() => {
    ref.current = parseHotkeyMap(map);
  }, [map]);
  return useCallback((event: KeyEvent): void => {
    for (const [hotkey, handler] of ref.current) {
      if (
        (event.key === hotkey.key || event.code === hotkey.key) &&
        event.altKey === hotkey.alt &&
        event.ctrlKey === hotkey.ctrl &&
        event.metaKey === hotkey.meta &&
        event.shiftKey === hotkey.shift
      ) {
        event.preventDefault();
        event.stopPropagation();
        handler(event);
      }
    }
  }, []);
};

const parseHotkeyMap = (map: HotkeyMap): [Hotkey, Handler][] => {
  return Object.entries(map) //
    .map(([spec, handler]) => [parseHotkey(spec), handler]);
};

const hotkeyCache = new Map<string, Hotkey>();

const parseHotkey = (spec: string): Hotkey => {
  let hotkey = hotkeyCache.get(spec);
  if (hotkey == null) {
    const error = () => {
      throw new TypeError(
        process.env.NODE_ENV !== "production"
          ? `Invalid hotkey [${spec}]`
          : undefined,
      );
    };
    const parsed = {
      alt: false,
      ctrl: false,
      meta: false,
      shift: false,
      key: "",
    };
    const keys = spec.split("+");
    while (keys.length > 0) {
      const key = keys.shift()!;
      switch (key) {
        case "Alt":
          if (parsed.alt) {
            error();
          } else {
            parsed.alt = true;
          }
          break;
        case "Ctrl":
          if (parsed.ctrl) {
            error();
          } else {
            parsed.ctrl = true;
          }
          break;
        case "Meta":
          if (parsed.meta) {
            error();
          } else {
            parsed.meta = true;
          }
          break;
        case "Shift":
          if (parsed.shift) {
            error();
          } else {
            parsed.shift = true;
          }
          break;
        default:
          if (keys.length === 0) {
            parsed.key = key;
          } else {
            error();
          }
          break;
      }
    }
    if (parsed.key === "") {
      error();
    }
    hotkeyCache.set(spec, (hotkey = parsed));
  }
  return hotkey;
};
