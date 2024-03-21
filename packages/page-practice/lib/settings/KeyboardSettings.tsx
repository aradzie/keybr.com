import { useCollator } from "@keybr/intl";
import {
  Geometry,
  KeyboardOptions,
  keyboardProps,
  Language,
  Layout,
  useFormattedNames,
  useKeyboard,
} from "@keybr/keyboard";
import {
  addKey,
  deleteKey,
  KeyLayer,
  PointersLayer,
  VirtualKeyboard,
} from "@keybr/keyboard-ui";
import { useSettings } from "@keybr/settings";
import { ModifierState } from "@keybr/textinput-events";
import { type CodePoint } from "@keybr/unicode";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
  useWindowEvent,
} from "@keybr/widget";
import { type ReactNode, useEffect, useMemo, useState } from "react";
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
                options.withLanguage(Language.ALL.get(id)).save(settings),
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
                options.withLayout(Layout.ALL.get(id)).save(settings),
              );
            }}
          />
        </Field>
        <Field>
          <CheckBox
            checked={settings.get(keyboardProps.emulate)}
            disabled={!options.layout.emulate}
            label={formatMessage({
              id: "keyboard.emulate.label",
              defaultMessage: "Emulate layout",
            })}
            onChange={(value) => {
              updateSettings(settings.set(keyboardProps.emulate, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="keyboard.emulate.description"
          defaultMessage="Keyboard emulation ignores the keyboard layout configured in your system and allows you to practice the selected keyboard regardless of how your system is configured. It is more convenient to keep the emulation option enabled."
        />
      </Explainer>
    </>
  );
}

function KeyboardPreview(): ReactNode {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys();
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
}

function PointersPreview(): ReactNode {
  const keyboard = useKeyboard();
  const [index, setIndex] = useState(0);
  const suffix = useMemo(() => {
    setIndex(0);
    const codePoints = keyboard.codePoints();
    return getExampleText(keyboard.layout.language).filter((codePoint) =>
      codePoints.has(codePoint),
    );
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
        <FormattedMessage
          id="settings.keyboardColors.description"
          defaultMessage="Show color coding of the keyboard zones. Use this option to learn which finger to use to press a key."
        />
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
        <FormattedMessage
          id="settings.keyboardPointers.description"
          defaultMessage="Highlight a key that must to be pressed next. Use this option to quickly find the position of a key if you don't know the keyboard layout well."
        />
      </Explainer>
    </>
  );
}

function useDepressedKeys(): readonly string[] {
  const [depressedKeys, setDepressedKeys] = useState<readonly string[]>([]);
  useWindowEvent("keydown", (ev) => {
    setDepressedKeys(addKey(depressedKeys, ev.code));
  });
  useWindowEvent("keyup", (ev) => {
    setDepressedKeys(deleteKey(depressedKeys, ev.code));
  });
  return depressedKeys;
}

function getExampleText({ script }: Language): CodePoint[] {
  switch (script) {
    case "cyrillic":
      return [0x0430, 0x0431, 0x0432, 0x0433, 0x0434, 0x0435];
    case "greek":
      return [0x03b1, 0x03b2, 0x03b3, 0x03b4, 0x03b5, 0x03b6];
    case "hebrew":
      return [0x05d0, 0x05d1, 0x05d2, 0x05d3, 0x05d4, 0x05d5];
    case "latin":
      return [0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066];
  }
}
