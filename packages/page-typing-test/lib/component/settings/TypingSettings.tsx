import { useSettings } from "@keybr/settings";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  textDisplayProps,
  textInputProps,
  toTextDisplaySettings,
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
import * as styles from "./TypingSettings.module.less";

export function TypingSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();

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
              checked={settings.get(textInputProps.stopOnError)}
              onChange={(value) => {
                updateSettings(settings.set(textInputProps.stopOnError, value));
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
              checked={settings.get(textInputProps.forgiveErrors)}
              onChange={(value) => {
                updateSettings(
                  settings.set(textInputProps.forgiveErrors, value),
                );
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
            settings={toTextDisplaySettings(settings)}
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
              checked={
                settings.get(textDisplayProps.whitespaceStyle) ===
                WhitespaceStyle.Space
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.whitespaceStyle,
                    WhitespaceStyle.Space,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Bar whitespace"
              name="whitespace-style"
              checked={
                settings.get(textDisplayProps.whitespaceStyle) ===
                WhitespaceStyle.Bar
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.whitespaceStyle,
                    WhitespaceStyle.Bar,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Bullet whitespace"
              name="whitespace-style"
              checked={
                settings.get(textDisplayProps.whitespaceStyle) ===
                WhitespaceStyle.Bullet
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.whitespaceStyle,
                    WhitespaceStyle.Bullet,
                  ),
                );
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
              checked={
                settings.get(textDisplayProps.caretShapeStyle) ===
                CaretShapeStyle.Block
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretShapeStyle,
                    CaretShapeStyle.Block,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Box cursor"
              name="cursor-shape-style"
              checked={
                settings.get(textDisplayProps.caretShapeStyle) ===
                CaretShapeStyle.Box
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretShapeStyle,
                    CaretShapeStyle.Box,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Line cursor"
              name="cursor-shape-style"
              checked={
                settings.get(textDisplayProps.caretShapeStyle) ===
                CaretShapeStyle.Line
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretShapeStyle,
                    CaretShapeStyle.Line,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Underline cursor"
              name="cursor-shape-style"
              checked={
                settings.get(textDisplayProps.caretShapeStyle) ===
                CaretShapeStyle.Underline
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretShapeStyle,
                    CaretShapeStyle.Underline,
                  ),
                );
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
                settings.get(textDisplayProps.caretMovementStyle) ===
                CaretMovementStyle.Jumping
              }
              onSelect={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretMovementStyle,
                    CaretMovementStyle.Jumping,
                  ),
                );
              }}
            />
          </Field>
          <Field>
            <RadioBox
              label="Smooth cursor"
              name="cursor-movement-style"
              checked={
                settings.get(textDisplayProps.caretMovementStyle) ===
                CaretMovementStyle.Smooth
              }
              onChange={() => {
                updateSettings(
                  settings.set(
                    textDisplayProps.caretMovementStyle,
                    CaretMovementStyle.Smooth,
                  ),
                );
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
              checked={settings.get(textDisplayProps.sounds)}
              onChange={(value) => {
                updateSettings(settings.set(textDisplayProps.sounds, value));
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>
    </>
  );
}
