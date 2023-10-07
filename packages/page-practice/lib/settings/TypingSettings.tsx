import { useSettings } from "@keybr/settings";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  EnableSoundStyle,
  textDisplayProps,
  textInputProps,
  WhitespaceStyle,
} from "@keybr/textinput";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  Para,
  RadioBox,
  styleSizeWide,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ExampleText } from "./ExampleText.tsx";

export function TypingSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.typingOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Typing Options",
        })}
      >
        <StopOnErrorProp />
        <ForgiveErrorsProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "settings.textAppearanceLegend",
          description: "Fieldset legend.",
          defaultMessage: "Text Appearance",
        })}
      >
        <ExampleText />
        <WhitespaceProp />
        <CursorShapeProp />
        <CursorMovementProp />
        <SoundsProp />
      </FieldSet>
    </>
  );
}

function StopOnErrorProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.stopCursorOnErrorLabel",
              description: "Input field label.",
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
        <FormattedMessage
          id="settings.stopCursorOnErrorDescription"
          description="Description text."
          defaultMessage="If enabled, the text cursor stops advancing until the right key is pressed at the current position. If disabled, all errors will be accumulated in the text input field and must be cleared with the delete key."
        />
      </Para>
    </>
  );
}

function ForgiveErrorsProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.forgiveErrorsLabel",
              description: "Input field label.",
              defaultMessage: "Forgive errors.",
            })}
            checked={settings.get(textInputProps.forgiveErrors)}
            onChange={(value) => {
              updateSettings(settings.set(textInputProps.forgiveErrors, value));
            }}
          />
        </Field>
      </FieldList>
      <Para>
        <FormattedMessage
          id="settings.forgiveErrorsDescription"
          description="Description text."
          defaultMessage="Enabling this option makes the text input field forgive some kinds of errors by automatically fixing them. These are errors such as typing a wrong character or skipping a character."
        />
      </Para>
    </>
  );
}

function WhitespaceProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleSizeWide}>
        <FormattedMessage
          id="settings.whitespaceLabel"
          description="Input field label."
          defaultMessage="Whitespace:"
        />
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
  );
}

function CursorShapeProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleSizeWide}>
        <FormattedMessage
          id="settings.cursorShapeLabel"
          description="Input field label."
          defaultMessage="Cursor shape:"
        />
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
  );
}

function CursorMovementProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleSizeWide}>
        <FormattedMessage
          id="settings.cursorMovementLabel"
          description="Input field label."
          defaultMessage="Cursor movement:"
        />
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
  );
}

function SoundsProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleSizeWide}>
        <CheckBox
          label={formatMessage({
            id: "settings.enableSoundsLabel",
            description: "Input field label.",
            defaultMessage: "Enable sounds",
          })}
          checked={settings.get(textDisplayProps.sounds)}
          onChange={(value) => {
            updateSettings(settings.set(textDisplayProps.sounds, value));
          }}
        />
      </Field>

      <Field>
        <RadioBox
          label="All Sounds"
          name="enable-sound-style"
          checked={
            settings.get(textDisplayProps.enableSoundStyle) ===
            EnableSoundStyle.All
          }
          onChange={() => {
            updateSettings(
              settings.set(
                textDisplayProps.enableSoundStyle,
                EnableSoundStyle.All,
              ),
            );
          }}
        />
      </Field>

      <Field>
        <RadioBox
          label="Only Errors"
          name="enable-sounds-style"
          checked={
            settings.get(textDisplayProps.enableSoundStyle) ===
            EnableSoundStyle.Error
          }
          onChange={() => {
            updateSettings(
              settings.set(
                textDisplayProps.enableSoundStyle,
                EnableSoundStyle.Error,
              ),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}
