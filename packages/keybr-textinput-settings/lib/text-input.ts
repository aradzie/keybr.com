/**
 * Text input settings.
 */
export type TextInputSettings = {
  /**
   * If enabled then text input stops advancing until the right key
   * at the cursor position is pressed, no delete key is used.
   * If disabled all errors will be accumulated in the garbage field
   * and must be cleared with the delete key.
   */
  readonly stopOnError: boolean;
  /**
   * Enabling this option makes text input forgive some kind of errors,
   * like typing a wrong character or skipping a character.
   */
  readonly forgiveErrors: boolean;
};

export const textInputSettings: TextInputSettings = {
  stopOnError: true,
  forgiveErrors: true,
};
