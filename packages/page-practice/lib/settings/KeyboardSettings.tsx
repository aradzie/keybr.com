import { languageName } from "@keybr/intl";
import { keyboardProps, useKeyboard } from "@keybr/keyboard";
import {
  addKey,
  deleteKey,
  KeyLayer,
  VirtualKeyboard,
} from "@keybr/keyboard-ui";
import { Language, Layout } from "@keybr/layout";
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
          description: "Header text.",
          defaultMessage: "Options",
        })}
      >
        <LayoutProp />
      </FieldSet>
      <FieldSet
        legend={formatMessage({
          id: "settings.preview.legend",
          description: "Header text.",
          defaultMessage: "Preview",
        })}
      >
        <KeyboardPreview />
      </FieldSet>
    </>
  );
}

function LayoutProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const layout = settings.get(keyboardProps.layout);
  const emulate = settings.get(keyboardProps.emulate);
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.selectLanguage.label"
            description="Widget name."
            defaultMessage="Language:"
          />
        </Field>
        <Field>
          <OptionList
            options={Language.ALL.map((item) => ({
              value: item.id,
              name: formatMessage(languageName(item.id)),
            }))}
            title={formatMessage({
              id: "settings.selectLanguage.description",
              description: "Widget description.",
              defaultMessage: "Select your spoken language.",
            })}
            value={layout.language.id}
            onSelect={(id) => {
              updateSettings(
                settings.set(
                  keyboardProps.layout,
                  Layout.ALL.find((item) => item.language.id === id),
                ),
              );
            }}
          />
        </Field>
        <Field>
          <FormattedMessage
            id="settings.selectLayout.label"
            description="Widget name."
            defaultMessage="Layout:"
          />
        </Field>
        <Field>
          <OptionList
            options={Layout.ALL.filter(
              (item) => item.language.id === layout.language.id,
            ).map((item) => ({
              value: item.id,
              name: item.name,
            }))}
            title={formatMessage({
              id: "settings.selectLayout.description",
              description: "Widget description.",
              defaultMessage:
                "Select the keyboard layout you wish to practice with. There may be many layouts available for each language.",
            })}
            value={layout.id}
            onSelect={(id) => {
              updateSettings(
                settings.set(keyboardProps.layout, Layout.ALL.get(id)),
              );
            }}
          />
        </Field>
        <Field>
          <CheckBox
            checked={emulate}
            disabled={!layout.emulate}
            label={formatMessage({
              id: "settings.emulateLayout.label",
              description: "Widget name.",
              defaultMessage: "Emulate layout",
            })}
            title={formatMessage({
              id: "settings.emulateLayout.description",
              description: "Widget description.",
              defaultMessage:
                "Emulate the selected layout when the standard layout is set in the system.",
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
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys();
  return (
    <>
      <VirtualKeyboard keyboard={keyboard} height="16rem">
        <KeyLayer
          depressedKeys={depressedKeys}
          toggledKeys={ModifierState.modifiers}
          showColors={settings.get(keyboardProps.colors)}
        />
      </VirtualKeyboard>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.keyboardFullView.label",
              description: "Widget name.",
              defaultMessage: "Full keyboard view",
            })}
            checked={settings.get(keyboardProps.full)}
            onChange={(value) => {
              updateSettings(settings.set(keyboardProps.full, value));
            }}
          />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.keyboardColors.label",
              description: "Widget name.",
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
