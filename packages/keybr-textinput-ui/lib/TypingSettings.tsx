import { KeyboardOptions, useKeyboard } from "@keybr/keyboard";
import { Tasks } from "@keybr/lang";
import { Settings, useSettings } from "@keybr/settings";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  Feedback,
  Font,
  textDisplayProps,
  textInputProps,
  toTextDisplaySettings,
  WhitespaceStyle,
} from "@keybr/textinput";
import {
  makeSoundPlayer,
  PlaySounds,
  soundProps,
  SoundTheme,
} from "@keybr/textinput-sounds";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  Icon,
  IconButton,
  OptionList,
  RadioBox,
  Range,
} from "@keybr/widget";
import { mdiPlayCircleOutline, mdiStopCircleOutline } from "@mdi/js";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AnimatedText } from "./AnimatedText.tsx";
import * as styles from "./TypingSettings.module.less";

export function TypingSettings() {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "t_Typing_options",
          defaultMessage: "Typing options",
        })}
      >
        <Explainer>
          <Description>
            <FormattedMessage
              id="settings.typingAssists.description"
              defaultMessage="These are the typing assists which help your preserve your concentration and keep the flow by automatically correcting your errors."
            />
          </Description>
        </Explainer>
        <StopOnErrorProp />
        <ForgiveErrorsProp />
        <SpaceSkipsWordsProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "t_Text_appearance",
          defaultMessage: "Text appearance",
        })}
      >
        <ExampleText />
        <FontProp />
        <WhitespaceProp />
        <CursorShapeProp />
        <CursorMovementProp />
        <SoundsProp />
        <SoundsThemeProp />
      </FieldSet>
    </>
  );
}

function ExampleText() {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  return (
    <div className={styles.exampleText}>
      <AnimatedText
        settings={toTextDisplaySettings(settings)}
        text={keyboard.getExampleText()}
      />
    </div>
  );
}

function StopOnErrorProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "t_Stop_cursor_on_error",
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
        <Description>
          <FormattedMessage
            id="settings.stopCursorOnError.description"
            defaultMessage="If enabled, the text cursor stops advancing until the right key is pressed at the current position. If disabled, all errors will be accumulated in the text input field and must be cleared with the delete key."
          />
        </Description>
      </Explainer>
    </>
  );
}

function ForgiveErrorsProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "t_Forgive_errors:",
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
        <Description>
          <FormattedMessage
            id="settings.forgiveErrors.description"
            defaultMessage="If enabled, the text input field will forgive some kinds of errors by automatically fixing them. These are errors such as typing a wrong character or skipping a character."
          />
        </Description>
      </Explainer>
    </>
  );
}

function SpaceSkipsWordsProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "t_Space_skips_words",
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
        <Description>
          <FormattedMessage
            id="settings.spaceSkipsWords.description"
            defaultMessage="If enabled, pressing the space key in the middle of a word will skip the remaining characters of the word and position cursor at the beginning of the next word."
          />
        </Description>
      </Explainer>
    </>
  );
}

function FontProp() {
  const { settings, updateSettings } = useSettings();
  const { language } = KeyboardOptions.from(settings);
  const fonts = Font.select(language);
  const font = Font.find(fonts, settings.get(textDisplayProps.font));
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage id="t_Font:" defaultMessage="Font:" />
      </Field>
      <Field>
        <OptionList
          options={fonts.map((item) => ({
            value: item.id,
            name: <span style={item.cssProperties}>{item.name}</span>,
          }))}
          value={font.id}
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

function WhitespaceProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage id="t_Whitespace:" defaultMessage="Whitespace:" />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_ws_No_whitespace",
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
            id: "t_ws_Bar_whitespace",
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
            id: "t_ws_Bullet_whitespace",
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

function CursorShapeProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage id="t_Cursor_shape:" defaultMessage="Cursor shape:" />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_cur_Block_cursor",
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
            id: "t_cur_Box_cursor",
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
            id: "t_cur_Line_cursor",
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
            id: "t_cur_Underline_cursor",
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

function CursorMovementProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage
          id="t_Cursor_movement:"
          defaultMessage="Cursor movement:"
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_cur_Jumping_cursor",
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
            id: "t_cur_Smooth_cursor",
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

function SoundsProp() {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage id="t_Play_sounds:" defaultMessage="Play sounds:" />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_No_sounds:",
            defaultMessage: "No sounds",
          })}
          name="play-sounds"
          checked={settings.get(soundProps.playSounds) === PlaySounds.None}
          onSelect={() => {
            updateSettings(
              settings.set(soundProps.playSounds, PlaySounds.None),
            );
          }}
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_Error_sounds_only:",
            defaultMessage: "Error sounds only",
          })}
          name="play-sounds"
          checked={
            settings.get(soundProps.playSounds) === PlaySounds.ErrorsOnly
          }
          onChange={() => {
            updateSettings(
              settings.set(soundProps.playSounds, PlaySounds.ErrorsOnly),
            );
          }}
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_Key_sounds_only:",
            defaultMessage: "Key sounds only",
          })}
          name="play-sounds"
          checked={settings.get(soundProps.playSounds) === PlaySounds.KeysOnly}
          onChange={() => {
            updateSettings(
              settings.set(soundProps.playSounds, PlaySounds.KeysOnly),
            );
          }}
        />
      </Field>
      <Field>
        <RadioBox
          label={formatMessage({
            id: "t_All_sounds:",
            defaultMessage: "All sounds",
          })}
          name="play-sounds"
          checked={settings.get(soundProps.playSounds) === PlaySounds.All}
          onChange={() => {
            updateSettings(settings.set(soundProps.playSounds, PlaySounds.All));
          }}
        />
      </Field>
      <Field>
        <FormattedMessage id="t_Sound_volume:" defaultMessage="Volume:" />
      </Field>
      <Field>
        <Range
          min={0}
          max={100}
          step={1}
          value={Math.round(settings.get(soundProps.soundVolume) * 100)}
          onChange={(value) => {
            updateSettings(settings.set(soundProps.soundVolume, value / 100));
          }}
        />
      </Field>
    </FieldList>
  );
}

function SoundsThemeProp() {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field size={10}>
        <FormattedMessage id="t_Sound_theme:" defaultMessage="Sound theme:" />
      </Field>
      <Field>
        <OptionList
          options={SoundTheme.ALL.map((item) => ({
            value: item.id,
            name: item.name,
          }))}
          value={settings.get(soundProps.soundTheme).id}
          onSelect={(id) => {
            updateSettings(
              settings.set(soundProps.soundTheme, SoundTheme.ALL.get(id)),
            );
          }}
        />
      </Field>
      <Field>
        <SoundThemePreview />
      </Field>
    </FieldList>
  );
}

function SoundThemePreview() {
  const { settings } = useSettings();
  const soundVolume = settings.get(soundProps.soundVolume);
  const soundTheme = settings.get(soundProps.soundTheme);
  const player = useMemo(() => {
    if (process.env.NODE_ENV === "test") {
      // Do not load sound assets in tests.
      return () => {};
    }
    return makeSoundPlayer(
      new Settings()
        .set(soundProps.playSounds, PlaySounds.All)
        .set(soundProps.soundVolume, soundVolume)
        .set(soundProps.soundTheme, soundTheme),
    );
  }, [soundVolume, soundTheme]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const tasks = new Tasks();
    if (playing) {
      tasks.repeated(300, () => {
        player(Feedback.Succeeded);
      });
    }
    return () => {
      tasks.cancelAll();
    };
  }, [player, playing]);
  return (
    <IconButton
      icon={
        <Icon shape={playing ? mdiStopCircleOutline : mdiPlayCircleOutline} />
      }
      onClick={() => {
        setPlaying(!playing);
      }}
    />
  );
}
