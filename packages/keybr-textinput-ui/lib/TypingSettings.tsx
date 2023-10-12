import { useSettings } from "@keybr/settings";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  PlaySounds,
  textDisplayProps,
  textInputProps,
  WhitespaceStyle,
} from "@keybr/textinput";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  RadioBox,
  Range,
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
        <Explainer>
          <FormattedMessage
            id="settings.typingAssistsDescription"
            description="Description text."
            defaultMessage="These are the typing assists which help your preserve your concentration and keep the flow by automatically correcting your errors."
          />
        </Explainer>
        <StopOnErrorProp />
        <ForgiveErrorsProp />
        <SpaceSkipsWordsProp />
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
              defaultMessage: "Stop cursor on error",
            })}
            checked={settings.get(textInputProps.stopOnError)}
            onChange={(value) => {
              updateSettings(settings.set(textInputProps.stopOnError, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.stopCursorOnErrorDescription"
          description="Description text."
          defaultMessage="If enabled, the text cursor stops advancing until the right key is pressed at the current position. If disabled, all errors will be accumulated in the text input field and must be cleared with the delete key."
        />
      </Explainer>
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
              defaultMessage: "Forgive errors",
            })}
            checked={settings.get(textInputProps.forgiveErrors)}
            onChange={(value) => {
              updateSettings(settings.set(textInputProps.forgiveErrors, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.forgiveErrorsDescription"
          description="Description text."
          defaultMessage="If enabled, the text input field will forgive some kinds of errors by automatically fixing them. These are errors such as typing a wrong character or skipping a character."
        />
      </Explainer>
    </>
  );
}

function SpaceSkipsWordsProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.spaceSkipsWordsLabel",
              description: "Input field label.",
              defaultMessage: "Space skips words",
            })}
            checked={settings.get(textInputProps.spaceSkipsWords)}
            onChange={(value) => {
              updateSettings(
                settings.set(textInputProps.spaceSkipsWords, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.spaceSkipsWordsDescription"
          description="Description text."
          defaultMessage="If enabled, pressing the space key in the middle of a word will skip the remaining characters of the word and position cursor at the beginning of the next word."
        />
      </Explainer>
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
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleSizeWide}>
        <FormattedMessage
          id="settings.playSoundsLabel"
          description="Input field label."
          defaultMessage="Play sounds:"
        />
      </Field>
      <Field>
        <RadioBox
          label="No Sounds"
          name="play-sounds"
          checked={
            settings.get(textDisplayProps.playSounds) === PlaySounds.None
          }
          onSelect={() => {
            updateSettings(
              settings.set(textDisplayProps.playSounds, PlaySounds.None),
            );
          }}
        />
      </Field>
      <Field>
        <RadioBox
          label="Error Sounds Only"
          name="play-sounds"
          checked={
            settings.get(textDisplayProps.playSounds) === PlaySounds.ErrorsOnly
          }
          onChange={() => {
            updateSettings(
              settings.set(textDisplayProps.playSounds, PlaySounds.ErrorsOnly),
            );
          }}
        />
      </Field>
      <Field>
        <RadioBox
          label="All Sounds"
          name="play-sounds"
          checked={settings.get(textDisplayProps.playSounds) === PlaySounds.All}
          onChange={() => {
            updateSettings(
              settings.set(textDisplayProps.playSounds, PlaySounds.All),
            );
          }}
        />
      </Field>
      <Field>Volume:</Field>
      <Field>
        <Range
          min={0}
          max={100}
          step={1}
          value={Math.round(settings.get(textDisplayProps.soundVolume) * 100)}
          onChange={(value) => {
            updateSettings(
              settings.set(textDisplayProps.soundVolume, value / 100),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}
