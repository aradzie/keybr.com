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
  VirtualKeyboard,
} from "@keybr/keyboard-ui";
import { useSettings } from "@keybr/settings";
import { ModifierState } from "@keybr/textinput-events";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
  useWindowEvent,
} from "@keybr/widget";
import { type ReactNode, useState } from "react";
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
        Keyboard emulation ignores the keyboard layout configured in your system
        and allows you to practice the selected keyboard regardless of how your
        system is configured. In most cases it is safe to keep the emulation
        option enabled. Please note that we do not (yet) support
        &quot;smart&quot; keyboards which can do the layout switching in
        hardware or have custom profiles.
      </Explainer>
    </>
  );
}

function KeyboardPreview(): ReactNode {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys();
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem">
      <KeyLayer
        depressedKeys={depressedKeys}
        toggledKeys={ModifierState.modifiers}
        showColors={settings.get(keyboardProps.colors)}
      />
    </VirtualKeyboard>
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
