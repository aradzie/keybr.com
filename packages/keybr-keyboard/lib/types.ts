export type KeyId = string;

export type CodePoint = number;

export type CodePointDict = {
  readonly [id: KeyId]: readonly [
    /** Character code produced by this key. */
    a?: CodePoint,
    /** Character code produced by this key with the Shift key. */
    b?: CodePoint,
    /** Character code produced by this key with the AltGr key. */
    c?: CodePoint,
    /** Character code produced by this key with the Shift and the AltGr keys. */
    d?: CodePoint,
  ];
};

export type GeometryDict = {
  readonly [id: KeyId]: readonly [
    /** Key X position. */
    x: number,
    /** Key Y position. */
    y: number,
    /** Key width. */
    w: number,
    /** Key height. */
    h: number,
    /** Key shape name, such as "key", "key-backspace", etc. */
    shape: string,
    /** Keyboard zone name. */
    zone?: string,
    /** Finger to type key with */
    finger?: string,
  ];
};

export type HasCodePoint = {
  readonly codePoint: CodePoint;
};
