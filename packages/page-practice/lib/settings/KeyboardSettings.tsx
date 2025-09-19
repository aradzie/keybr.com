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
  ZoneMod,
} from "@keybr/keyboard";
import { KeyLayer, PointersLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { Tasks } from "@keybr/lang";
import { useSettings } from "@keybr/settings";
import { ModifierState, useDepressedKeys } from "@keybr/textinput-events";
import { type CodePoint } from "@keybr/unicode";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
} from "@keybr/widget";
import { memo, type ReactNode, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function KeyboardSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "t_Options",
          defaultMessage: "Options",
        })}
      >
        <LayoutProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "t_Preview",
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
  const {
    formatLanguageName, //
    formatLayoutName,
    formatFullLayoutName,
  } = useFormattedNames();
  const { compare } = useCollator();
  const { settings, updateSettings } = useSettings();
  const options = KeyboardOptions.from(settings);
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage id="t_Language:" defaultMessage="Language:" />
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
                  .withZones(options.zones)
                  .save(settings),
              );
            }}
          />
        </Field>
        <Field>
          <FormattedMessage id="t_Layout:" defaultMessage="Layout:" />
        </Field>
        <Field>
          <OptionList
            options={options.selectableLayouts().map((item) => ({
              value: item.id,
              name:
                item.language.id === options.language.id
                  ? formatLayoutName(item)
                  : formatFullLayoutName(item),
            }))}
            value={options.layout.id}
            onSelect={(id) => {
              updateSettings(
                options
                  .withLayout(Layout.ALL.get(id))
                  .withGeometry(options.geometry)
                  .withZones(options.zones)
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
              options.layout.emulate &&
              settings.get(keyboardProps.emulation) === Emulation.Forward
            }
            disabled={!options.layout.emulate}
            label={formatMessage({
              id: "t_Emulate_layout",
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
            defaultMessage="Keyboard emulation ignores the keyboard layout configured in your system and allows you to practice the selected keyboard regardless of how your system is configured. It is more convenient to keep the emulation option enabled. If the above option is disabled (greyed out), this means the layout cannot be emulated (mainly for layouts which use dead keys)."
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
              id: "t_Keyboard_hardware_emulates_",
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
          <FormattedMessage id="t_Geometry:" defaultMessage="Geometry:" />
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
                options
                  .withGeometry(Geometry.ALL.get(id))
                  .withZones(options.zones)
                  .save(settings),
              );
            }}
          />
        </Field>
        <Field>
          <FormattedMessage id="t_Zones:" defaultMessage="Zones:" />
        </Field>
        <Field>
          <OptionList
            options={options.selectableZones().map((item) => ({
              value: item.id,
              name: item.name,
            }))}
            value={options.zones.id}
            onSelect={(id) => {
              updateSettings(
                options.withZones(ZoneMod.ALL.get(id)).save(settings),
              );
            }}
          />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "t_Colored_keys",
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
              id: "t_Highlight_keys",
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
  const [suffix, setSuffix] = useState<CodePoint[]>([]);
  useEffect(() => {
    setIndex(0);
    setSuffix(keyboard.getExampleLetters());
  }, [keyboard]);
  useEffect(() => {
    const tasks = new Tasks();
    tasks.delayed(1000, () => {
      let newIndex = index + 1;
      if (newIndex >= suffix.length) {
        newIndex = 0;
      }
      setIndex(newIndex);
    });
    return () => {
      tasks.cancelAll();
    };
  }, [index, suffix]);
  return <PointersLayer suffix={suffix.slice(index)} delay={10} />;
});
