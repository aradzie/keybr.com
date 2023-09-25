export enum KeyModifier {
  None,
  Shift,
  Alt,
  ShiftAlt,
}

export namespace KeyModifier {
  const { None, Shift, Alt, ShiftAlt } = KeyModifier;

  export const of = ({
    shiftKey,
    altKey,
  }: {
    shiftKey: boolean;
    altKey: boolean;
  }): KeyModifier => {
    if (shiftKey) {
      if (altKey) {
        return ShiftAlt;
      } else {
        return Shift;
      }
    } else {
      if (altKey) {
        return Alt;
      } else {
        return None;
      }
    }
  };

  export const complexity = (modifier: KeyModifier): number => {
    switch (modifier) {
      case None:
        return 0;
      case Shift:
        return 1;
      case Alt:
        return 1;
      case ShiftAlt:
        return 2;
    }
  };

  export const usesShift = (modifier: KeyModifier): boolean => {
    switch (modifier) {
      case None:
        return false;
      case Shift:
        return true;
      case Alt:
        return false;
      case ShiftAlt:
        return true;
    }
  };

  export const usesAlt = (modifier: KeyModifier): boolean => {
    switch (modifier) {
      case None:
        return false;
      case Shift:
        return false;
      case Alt:
        return true;
      case ShiftAlt:
        return true;
    }
  };
}
