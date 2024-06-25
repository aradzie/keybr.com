import { useCollator } from "@keybr/intl";
import {
  Emulation,
  Geometry,
  KeyboardOptions,
  keyboardProps,
  Language,
  Layout,
  useFormattedNames,
  useKeyboard,
} from "@keybr/keyboard";
import { KeyLayer, PointersLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { useSettings } from "@keybr/settings";
import { ModifierState, useDepressedKeys } from "@keybr/textinput-events";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
} from "@keybr/widget";
import { memo, type ReactNode, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function KeyboardSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.options.legend",
          defaultMessage: "Options",
        })}
      >
        <LayoutProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "settings.preview.legend",
          defaultMessage: "Preview",
        })}
      >
        <KeyboardPreview />
        <GeometryProp />
      </FieldSet>
    </>
  );
}

function LayoutProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { formatLanguageName, formatLayoutName } = useFormattedNames();
  const { compare } = useCollator();
  const { settings, updateSettings } = useSettings();
  const options = KeyboardOptions.from(settings);
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="keyboard.language.label"
            defaultMessage="Language:"
          />
        </Field>
        <Field>
          <OptionList
            options={options
              .selectableLanguages()
              .map((item) => ({
                value: item.id,
                name: formatLanguageName(item),
              }))
              .sort((a, b) => compare(a.name, b.name))}
            value={options.language.id}
            onSelect={(id) => {
              updateSettings(
                options
                  .withLanguage(Language.ALL.get(id))
                  .withGeometry(options.geometry)
                  .save(settings),
              );
            }}
          />
        </Field>
        <Field>
          <FormattedMessage
            id="keyboard.layout.label"
            defaultMessage="Layout:"
          />
        </Field>
        <Field>
          <OptionList
            options={options.selectableLayouts().map((item) => ({
              value: item.id,
              name: formatLayoutName(item),
            }))}
            value={options.layout.id}
            onSelect={(id) => {
              updateSettings(
                options
                  .withLayout(Layout.ALL.get(id))
                  .withGeometry(options.geometry)
                  .save(settings),
              );
            }}
          />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <CheckBox
            checked={
              settings.get(keyboardProps.emulation) === Emulation.Forward
            }
            disabled={!options.layout.emulate}
            label={formatMessage({
              id: "keyboard.emulation.forward.label",
              defaultMessage: "Emulate layout",
            })}
            onChange={(value) => {
              updateSettings(
                settings.set(
                  keyboardProps.emulation,
                  value ? Emulation.Forward : Emulation.None,
                ),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="keyboard.emulation.forward.description"
            defaultMessage="Keyboard emulation ignores the keyboard layout configured in your system and allows you to practice the selected keyboard regardless of how your system is configured. It is more convenient to keep the emulation option enabled."
          />
        </Description>
      </Explainer>
      <FieldList>
        <Field>
          <CheckBox
            checked={
              settings.get(keyboardProps.emulation) === Emulation.Reverse
            }
            disabled={!options.layout.emulate}
            label={formatMessage({
              id: "keyboard.emulation.reverse.label",
              defaultMessage: "Keyboard hardware emulates layout",
            })}
            onChange={(value) => {
              updateSettings(
                settings.set(
                  keyboardProps.emulation,
                  value ? Emulation.Reverse : Emulation.None,
                ),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="keyboard.emulation.reverse.description"
            defaultMessage="Use this option if you have a hardware layout switcher on your keyboard, and you see that incorrect keys are highlighted on the virtual keyboard."
          />
        </Description>
      </Explainer>
    </>
  );
}

function GeometryProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const options = KeyboardOptions.from(settings);
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="keyboard.geometry.label"
            defaultMessage="Geometry:"
          />
        </Field>
        <Field>
          <OptionList
            options={options.selectableGeometries().map((item) => ({
              value: item.id,
              name: item.name,
            }))}
            value={options.geometry.id}
            onSelect={(id) => {
              updateSettings(
                options.withGeometry(Geometry.ALL.get(id)).save(settings),
              );
            }}
          />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.keyboardColors.label",
              defaultMessage: "Colored keys",
            })}
            checked={settings.get(keyboardProps.colors)}
            onChange={(value) => {
              updateSettings(settings.set(keyboardProps.colors, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.keyboardColors.description"
            defaultMessage="Show color coding of the keyboard zones. Use this option to learn which finger to use to press a key."
          />
        </Description>
      </Explainer>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.keyboardPointers.label",
              defaultMessage: "Highlight keys",
            })}
            checked={settings.get(keyboardProps.pointers)}
            onChange={(value) => {
              updateSettings(settings.set(keyboardProps.pointers, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.keyboardPointers.description"
            defaultMessage="Highlight a key that must to be pressed next. Use this option to quickly find the position of a key if you don’t know the keyboard layout well."
          />
        </Description>
      </Explainer>
    </>
  );
}

const KeyboardPreview = memo(function KeyboardPreview(): ReactNode {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys(settings, keyboard);
  const colors = settings.get(keyboardProps.colors);
  const pointers = settings.get(keyboardProps.pointers);
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem">
      <KeyLayer
        depressedKeys={depressedKeys}
        toggledKeys={ModifierState.modifiers}
        showColors={colors}
      />
      {pointers && <PointersPreview />}
    </VirtualKeyboard>
  );
});

const PointersPreview = memo(function PointersPreview(): ReactNode {
  const keyboard = useKeyboard();
  const [index, setIndex] = useState(0);
  const suffix = useMemo(() => {
    setIndex(0);
    return keyboard.getExampleLetters();
  }, [keyboard]);
  useEffect(() => {
    const id = setTimeout(() => {
      let newIndex = index + 1;
      if (newIndex >= suffix.length) {
        newIndex = 0;
      }
      setIndex(newIndex);
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [suffix, index]);
  return <PointersLayer suffix={suffix.slice(index)} delay={10} />;
});
