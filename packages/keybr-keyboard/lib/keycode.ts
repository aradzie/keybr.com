export enum KeyCode {
  //
  // Writing System Keys
  //

  /** ` and ~ on a US keyboard. */
  Backquote,
  /** \ and | on a US keyboard. Found only on standard 101-key layouts. */
  Backslash,
  /** Labelled Delete on Macintosh keyboards. */
  Backspace,
  /** [ and { on a US keyboard. */
  BracketLeft,
  /** ] and } on a US keyboard. */
  BracketRight,
  /** , and < on a US keyboard. */
  Comma,
  /** 0 and ) on a US keyboard. */
  Digit0,
  /** 1 and ! on a US keyboard. */
  Digit1,
  /** 2 and @ on a US keyboard. */
  Digit2,
  /** 3 and # on a US keyboard. */
  Digit3,
  /** 4 and $ on a US keyboard. */
  Digit4,
  /** 5 and % on a US keyboard. */
  Digit5,
  /** 6 and ^ on a US keyboard. */
  Digit6,
  /** 7 and & on a US keyboard. */
  Digit7,
  /** 8 and * on a US keyboard. */
  Digit8,
  /** 9 and ( on a US keyboard. */
  Digit9,
  /** = and + on a US keyboard. */
  Equal,
  /** Located between the ShiftLeft and KeyZ keys. The \ and | key on a UK keyboard. */
  IntlBackslash,
  /** Located between the Quote and Enter keys on row E of the keyboard. The # and ~ key on a UK keyboard. */
  IntlHash,
  /** Located between the Slash and ShiftRight keys. The \ and ろ (ro) key on a Japanese keyboard. */
  IntlRo,
  /** Located between the Equal and Backspace keys. The ¥ (yen) key on a Japanese keyboard. The \ and / key on a Russian keyboard. */
  IntlYen,
  /** a on a US keyboard. Labelled q on an AZERTY (e.g., French) keyboard. */
  KeyA,
  /** b on a US keyboard. */
  KeyB,
  /** c on a US keyboard. */
  KeyC,
  /** d on a US keyboard. */
  KeyD,
  /** e on a US keyboard. */
  KeyE,
  /** f on a US keyboard. */
  KeyF,
  /** g on a US keyboard. */
  KeyG,
  /** h on a US keyboard. */
  KeyH,
  /** i on a US keyboard. */
  KeyI,
  /** j on a US keyboard. */
  KeyJ,
  /** k on a US keyboard. */
  KeyK,
  /** l on a US keyboard. */
  KeyL,
  /** m on a US keyboard. */
  KeyM,
  /** n on a US keyboard. */
  KeyN,
  /** o on a US keyboard. */
  KeyO,
  /** p on a US keyboard. */
  KeyP,
  /** q on a US keyboard. Labelled a on an AZERTY (e.g., French) keyboard. */
  KeyQ,
  /** r on a US keyboard. */
  KeyR,
  /** s on a US keyboard. */
  KeyS,
  /** t on a US keyboard. */
  KeyT,
  /** u on a US keyboard. */
  KeyU,
  /** v on a US keyboard. */
  KeyV,
  /** w on a US keyboard. Labelled z on an AZERTY (e.g., French) keyboard. */
  KeyW,
  /** x on a US keyboard. */
  KeyX,
  /** y on a US keyboard. Labelled z on a QWERTZ (e.g., German) keyboard. */
  KeyY,
  /** z on a US keyboard. Labelled w on an AZERTY (e.g., French) keyboard, and y on a QWERTZ (e.g., German) keyboard. */
  KeyZ,
  /** - and _ on a US keyboard. */
  Minus,
  /** . and > on a US keyboard. */
  Period,
  /** and " on a US keyboard. */
  Quote,
  /** ; and : on a US keyboard. */
  Semicolon,
  /** / and ? on a US keyboard. */
  Slash,

  //
  // Functional keys
  //

  /** Labelled Alt or Option. */
  AltLeft,
  /** Labelled Alt or Option. This is the AltGr key on many keyboard layouts. */
  AltRight,
  /** The Caps Lock key. */
  CapsLock,
  /** The application context menu key, which is typically found between the right OS key and the right Control key. */
  ContextMenu,
  /** The left Control key. */
  ControlLeft,
  /** The right Control key. */
  ControlRight,
  /** Labelled Enter and Return on Macintosh keyboards. */
  Enter,
  /** The Windows, ⌘, Command or other OS symbol key. */
  OSLeft,
  /** The Windows, ⌘, Command or other OS symbol key. */
  OSRight,
  /** The left Shift key. */
  ShiftLeft,
  /** The right Shift key. */
  ShiftRight,
  /** The space key. */
  Space,
  /** The tab key. */
  Tab,
  /** The 半角/全角 (Hankaku/Zenkaku) key */
  IntlHanZen,
  /** The 無変換 (Muhenkan) key found on Japanese keyboards to the left of the
   * Space key */
  IntlMuhenkan,
  /** The 変換 (Henkan) key found on Japanese keyboards to the right of the
   * Space key */
  IntlHenkan,
  /** The ひらがな・カタカナ (Hiragana/Katakana) key found on Japanese keyboards
   * to the right of the Henkan key */
  IntlHiraKata,
  /** The Menu key typically located to the left of the Right Shift key on
   * Japanese Keyboards. */
  IntlMenu,

  //
  // Control Pad Section
  //

  /** ? */
  Delete,
  /** ?  */
  End,
  /** ? */
  Home,
  /** Not present on Apple keyboards. */
  Insert,
  /** ? */
  PageDown,
  /** ? */
  PageUp,

  //
  // Arrow Pad Section
  //

  /** ? */
  ArrowDown,
  /** ? */
  ArrowLeft,
  /** ? */
  ArrowRight,
  /** ? */
  ArrowUp,

  //
  // Numpad Section
  //

  /** On the Mac, the 'NumLock' code should be used for the numpad 'Clear' key. */
  NumLock,
  /** 0/Insert on a keyboard; 0 on a phone or remote control */
  Numpad0,
  /** 1/End on a keyboard; 1 or 1/QZ on a phone or remote control */
  Numpad1,
  /** 2/ArrowDown on a keyboard; 2/ABC on a phone or remote control */
  Numpad2,
  /** 3/PageDown on a keyboard; 3/DEF on a phone or remote control */
  Numpad3,
  /** 4/ArrowLeft on a keyboard; 4/GHI on a phone or remote control */
  Numpad4,
  /** 5 on a keyboard; 5/JKL on a phone or remote control */
  Numpad5,
  /** 6/ArrowRight on a keyboard; 6/MNO on a phone or remote control */
  Numpad6,
  /** 7/Home on a keyboard; 7/PQRS or 7/PRS on a phone or remote control */
  Numpad7,
  /** 8/ArrowUp on a keyboard; 8/TUV on a phone or remote control */
  Numpad8,
  /** 9/PageUp on a keyboard; 9/WXYZ or 9/WXY on a phone or remote control */
  Numpad9,
  /** + */
  NumpadAdd,
  /** For use with numpads that have a 'Clear' key that is separate from the 'NumLock' key. On the Mac, the numpad 'Clear' key should always be encoded as 'NumLock'. */
  NumpadClear,
  /** , (thousands separator). For locales where the thousands separator is a '.' (e.g., Brazil), this key may generate a '.' */
  NumpadComma,
  /** . (decimal separator) and Delete. For locales where the decimal separator is ',' (e.g., Brazil), this key may generate a ','. */
  NumpadDecimal,
  /** / */
  NumpadDivide,
  /** ? */
  NumpadEnter,
  /** * on a keyboard. For use with numpads that provide mathematical operations (+, -, * and /). See 'NumpadStar' for the * key on phones and remote controls. */
  NumpadMultiply,
  /** - */
  NumpadSubtract,

  //
  // Function Section
  //

  /** ? */
  Escape,
  /** ? */
  F1,
  /** ? */
  F2,
  /** ? */
  F3,
  /** ? */
  F4,
  /** ? */
  F5,
  /** ? */
  F6,
  /** ? */
  F7,
  /** ? */
  F8,
  /** ? */
  F9,
  /** ? */
  F10,
  /** ? */
  F11,
  /** ? */
  F12,
  /** PrintScreen and SysReq */
  PrintScreen,
  /** ? */
  ScrollLock,
  /** Pause and Break */
  Pause,
}
