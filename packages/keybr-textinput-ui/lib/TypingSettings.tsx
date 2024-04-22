import { useKeyboard } from "@keybr/keyboard";
import { useSettings } from "@keybr/settings";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  Font,
  PlaySounds,
  textDisplayProps,
  textInputProps,
  toTextDisplaySettings,
  WhitespaceStyle,
} from "@keybr/textinput";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
  RadioBox,
  Range,
  styleWidth10,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AnimatedText } from "./AnimatedText.tsx";
import * as styles from "./TypingSettings.module.less";

export function TypingSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.typingOptions.legend",
          defaultMessage: "Typing Options",
        })}
      >
        <Explainer>
          <FormattedMessage
            id="settings.typingAssists.description"
            defaultMessage="These are the typing assists which help your preserve your concentration and keep the flow by automatically correcting your errors."
          />
        </Explainer>
        <StopOnErrorProp />
        <ForgiveErrorsProp />
        <SpaceSkipsWordsProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "settings.textAppearance.legend",
          defaultMessage: "Text Appearance",
        })}
      >
        <ExampleText />
        <FontProp />
        <WhitespaceProp />
        <CursorShapeProp />
        <CursorMovementProp />
        <SoundsProp />
      </FieldSet>
    </>
  );
}

function ExampleText(): ReactNode {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  return (
    <div className={styles.exampleText}>
      <AnimatedText
        settings={{
          ...toTextDisplaySettings(settings),
          language: keyboard.layout.language,
        }}
        text={keyboard.getExampleText()}
      />
    </div>
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
              id: "settings.stopCursorOnError.label",
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
          id="settings.stopCursorOnError.description"
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
              id: "settings.forgiveErrors.label",
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
          id="settings.forgiveErrors.description"
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
              id: "settings.spaceSkipsWords.label",
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
          id="settings.spaceSkipsWords.description"
          defaultMessage="If enabled, pressing the space key in the middle of a word will skip the remaining characters of the word and position cursor at the beginning of the next word."
        />
      </Explainer>
    </>
  );
}

function FontProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleWidth10}>
        <FormattedMessage id="settings.font.label" defaultMessage="Font:" />
      </Field>
      <Field>
        <OptionList
          options={Font.ALL.map((item) => ({
            value: item.id,
            name: <span style={item.cssProperties}>{item.name}</span>,
          }))}
          value={settings.get(textDisplayProps.font).id}
          onSelect={(id) => {
            updateSettings(
              settings.set(textDisplayProps.font, Font.ALL.get(id)),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}

function WhitespaceProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleWidth10}>
        <FormattedMessage
          id="settings.whitespace.label"
          defaultMessage="Whitespace:"
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "settings.whitespace.noWhitespaceValue",
            defaultMessage: "No whitespace",
          })}
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
          label={formatMessage({
            id: "settings.whitespace.barWhitespaceValue",
            defaultMessage: "Bar whitespace",
          })}
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
          label={formatMessage({
            id: "settings.whitespace.bulletWhitespaceValue",
            defaultMessage: "Bullet whitespace",
          })}
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
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleWidth10}>
        <FormattedMessage
          id="settings.cursorShape.label"
          defaultMessage="Cursor shape:"
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "settings.cursorShape.blockCursorValue",
            defaultMessage: "Block cursor",
          })}
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
          label={formatMessage({
            id: "settings.cursorShape.boxCursorValue",
            defaultMessage: "Box cursor",
          })}
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
          label={formatMessage({
            id: "settings.cursorShape.lineCursorValue",
            defaultMessage: "Line cursor",
          })}
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
          label={formatMessage({
            id: "settings.cursorShape.underlineCursorValue",
            defaultMessage: "Underline cursor",
          })}
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
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field className={styleWidth10}>
        <FormattedMessage
          id="settings.cursorMovement.label"
          defaultMessage="Cursor movement:"
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "settings.cursorMovement.jumpingCursorValue",
            defaultMessage: "Jumping cursor",
          })}
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
          label={formatMessage({
            id: "settings.cursorMovement.smoothCursorValue",
            defaultMessage: "Smooth cursor",
          })}
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
      <Field className={styleWidth10}>
        <FormattedMessage
          id="settings.playSounds.label"
          defaultMessage="Play sounds:"
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "settings.sounds.noSoundsValue",
            defaultMessage: "No Sounds",
          })}
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
          label={formatMessage({
            id: "settings.sounds.errorSoundsOnlyValue",
            defaultMessage: "Error Sounds Only",
          })}
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
          label={formatMessage({
            id: "settings.sounds.allSoundsValue",
            defaultMessage: "All Sounds",
          })}
          name="play-sounds"
          checked={settings.get(textDisplayProps.playSounds) === PlaySounds.All}
          onChange={() => {
            updateSettings(
              settings.set(textDisplayProps.playSounds, PlaySounds.All),
            );
          }}
        />
      </Field>
      <Field>
        <FormattedMessage
          id="settings.soundVolume.label"
          defaultMessage="Volume:"
        />
      </Field>
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
