import {
  CaretMovementStyle,
  CaretShapeStyle,
  WhitespaceStyle,
} from "@keybr/textinput";
import { AnimatedText } from "@keybr/textinput-ui";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  HBox,
  Para,
  RadioBox,
  styleSizeWide,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { type SettingsEditorProps } from "./types.ts";
import * as styles from "./TypingSettings.module.less";

export function TypingSettings({
  settings,
  patchSettings,
}: SettingsEditorProps): ReactNode {
  const { formatMessage } = useIntl();
  const { textInput, textDisplay } = settings;
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.typingOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Typing Options",
        })}
      >
        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.stopCursorOnErrorLabel",
                description: "Checkbox label.",
                defaultMessage: "Stop the cursor when an error occurs.",
              })}
              checked={textInput.stopOnError}
              onChange={(value) => {
                patchSettings({
                  ...settings,
                  textInput: {
                    ...textInput,
                    stopOnError: value,
                  },
                });
              }}
            />
          </Field>
        </FieldList>

        <Para>
          {formatMessage({
            id: "settings.stopCursorOnErrorDescription",
            description: "Checkbox description.",
            defaultMessage:
              "If enabled, the text cursor stops advancing until the right key is pressed at the current position. If disabled, all errors will be accumulated in the text input field and must be cleared with the delete key.",
          })}
        </Para>

        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.forgiveErrorsLabel",
                description: "Checkbox label.",
                defaultMessage: "Forgive errors.",
              })}
              checked={textInput.forgiveErrors}
              onChange={(value) => {
                patchSettings({
                  ...settings,
                  textInput: {
                    ...textInput,
                    forgiveErrors: value,
                  },
                });
              }}
            />
          </Field>
        </FieldList>

        <Para>
          {formatMessage({
            id: "settings.forgiveErrorsDescription",
            description: "Checkbox description.",
            defaultMessage:
              "Enabling this option makes the text input field forgive some kinds of errors by automatically fixing them. These are errors such as typing a wrong character or skipping a character.",
          })}
        </Para>
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "settings.textAppearanceLegend",
          description: "Fieldset legend.",
          defaultMessage: "Text Appearance",
        })}
      >
        <HBox justifyContent="center" className={styles.demoText}>
          <AnimatedText
            settings={textDisplay}
            text="The quick brown fox jumps over the lazy dog."
          />
        </HBox>

        <FieldList>
          <Field className={styleSizeWide}>
            {formatMessage({
              id: "settings.whitespaceLabel",
              description: "Checkbox label.",
              defaultMessage: "Whitespace:",
            })}
          </Field>
          <Field>
            <RadioBox
              label="No whitespace"
              name="whitespace-style"
              checked={textDisplay.whitespaceStyle === WhitespaceStyle.Space}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    whitespaceStyle: WhitespaceStyle.Space,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Bar whitespace"
              name="whitespace-style"
              checked={textDisplay.whitespaceStyle === WhitespaceStyle.Bar}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    whitespaceStyle: WhitespaceStyle.Bar,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Bullet whitespace"
              name="whitespace-style"
              checked={textDisplay.whitespaceStyle === WhitespaceStyle.Bullet}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    whitespaceStyle: WhitespaceStyle.Bullet,
                  },
                });
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field className={styleSizeWide}>
            {formatMessage({
              id: "settings.cursorShapeLabel",
              description: "Checkbox label.",
              defaultMessage: "Cursor shape:",
            })}
          </Field>
          <Field>
            <RadioBox
              label="Block cursor"
              name="cursor-shape-style"
              checked={textDisplay.caretShapeStyle === CaretShapeStyle.Block}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretShapeStyle: CaretShapeStyle.Block,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Box cursor"
              name="cursor-shape-style"
              checked={textDisplay.caretShapeStyle === CaretShapeStyle.Box}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretShapeStyle: CaretShapeStyle.Box,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Line cursor"
              name="cursor-shape-style"
              checked={textDisplay.caretShapeStyle === CaretShapeStyle.Line}
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretShapeStyle: CaretShapeStyle.Line,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Underline cursor"
              name="cursor-shape-style"
              checked={
                textDisplay.caretShapeStyle === CaretShapeStyle.Underline
              }
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretShapeStyle: CaretShapeStyle.Underline,
                  },
                });
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field className={styleSizeWide}>
            {formatMessage({
              id: "settings.cursorMovementLabel",
              description: "Checkbox label.",
              defaultMessage: "Cursor movement:",
            })}
          </Field>
          <Field>
            <RadioBox
              label="Jumping cursor"
              name="cursor-movement-style"
              checked={
                textDisplay.caretMovementStyle === CaretMovementStyle.Jumping
              }
              onSelect={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretMovementStyle: CaretMovementStyle.Jumping,
                  },
                });
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Smooth cursor"
              name="cursor-movement-style"
              checked={
                textDisplay.caretMovementStyle === CaretMovementStyle.Smooth
              }
              onChange={() => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    caretMovementStyle: CaretMovementStyle.Smooth,
                  },
                });
              }}
            />
          </Field>
        </FieldList>

        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.enableSoundsLabel",
                description: "Checkbox label.",
                defaultMessage: "Enable sounds",
              })}
              title={formatMessage({
                id: "settings.enableSoundsTitle",
                description: "Checkbox description.",
                defaultMessage: "Make extra noise when typing and on errors.",
              })}
              checked={textDisplay.sounds}
              onChange={(value) => {
                patchSettings({
                  ...settings,
                  textDisplay: {
                    ...textDisplay,
                    sounds: value,
                  },
                });
              }}
              disabled={true}
            />
          </Field>
        </FieldList>
      </FieldSet>
    </>
  );
}
