export const Alt = 1;
export const Ctrl = 2;
export const Shift = 4;

type Handler = () => void;

type Hotkey =
  | readonly [code: string, handler: Handler]
  | readonly [code: string, modifiers: number, handler: Handler];

type KeyboardEventLike = {
  readonly key: string;
  readonly code: string;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  preventDefault(): void;
  stopPropagation(): void;
};

export const handleHotkeys = (
  ...hotkeys: readonly Hotkey[]
): ((ev: KeyboardEventLike) => void) => {
  return (ev: KeyboardEventLike): void => {
    for (const hotkey of hotkeys) {
      let code: string;
      let modifiers: number;
      let handler: Handler;
      switch (hotkey.length) {
        case 3:
          code = hotkey[0];
          modifiers = hotkey[1];
          handler = hotkey[2];
          break;
        case 2:
          code = hotkey[0];
          modifiers = 0;
          handler = hotkey[1];
          break;
        default:
          throw new TypeError();
      }
      if (
        ev.code === code &&
        ev.altKey === ((modifiers & Alt) !== 0) &&
        ev.ctrlKey === ((modifiers & Ctrl) !== 0) &&
        ev.shiftKey === ((modifiers & Shift) !== 0)
      ) {
        ev.preventDefault();
        ev.stopPropagation();
        handler();
      }
    }
  };
};
