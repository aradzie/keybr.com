export class KeyModifier {
  static readonly None = new KeyModifier(/* shift= */ false, /* alt= */ false);
  static readonly Shift = new KeyModifier(/* shift= */ true, /* alt= */ false);
  static readonly Alt = new KeyModifier(/* shift= */ false, /* alt= */ true);
  static readonly ShiftAlt = new KeyModifier(
    /* shift= */ true,
    /* alt= */ true,
  );

  readonly shift: boolean;
  readonly alt: boolean;
  readonly complexity: number;

  private constructor(shift: boolean, alt: boolean) {
    this.shift = shift;
    this.alt = alt;
    this.complexity = complexityOf(shift, alt);
  }

  static readonly from = ({
    shiftKey,
    altKey,
  }: {
    readonly shiftKey: boolean;
    readonly altKey: boolean;
  }): KeyModifier => {
    if (shiftKey) {
      if (altKey) {
        return KeyModifier.ShiftAlt;
      } else {
        return KeyModifier.Shift;
      }
    } else {
      if (altKey) {
        return KeyModifier.Alt;
      } else {
        return KeyModifier.None;
      }
    }
  };
}

function complexityOf(shift: boolean, alt: boolean): number {
  if (shift && alt) {
    return 2;
  }
  if (shift || alt) {
    return 1;
  }
  return 0;
}
