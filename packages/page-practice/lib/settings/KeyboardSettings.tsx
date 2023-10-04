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
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  OptionList,
  useWindowEvent,
} from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

export function KeyboardSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const keyboard = useKeyboard();
  const depressedKeys = useDepressedKeys();
  const layout = settings.get(keyboardProps.layout);
  const emulate = settings.get(keyboardProps.emulate);

  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.optionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Options",
        })}
      >
        <FieldList>
          <Field>
            {formatMessage({
              id: "settings.selectLanguageLabel",
              description: "Dropdown label.",
              defaultMessage: "Language:",
            })}
          </Field>

          <Field>
            <OptionList
              options={Language.ALL.map((item) => ({
                value: item.id,
                name: formatMessage(languageName(item.id)),
              }))}
              title={formatMessage({
                id: "settings.selectLanguageTitle",
                description: "Dropdown title.",
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
            {formatMessage({
              id: "settings.selectLayoutLabel",
              description: "Dropdown label.",
              defaultMessage: "Layout:",
            })}
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
                id: "settings.selectLayoutTitle",
                description: "Dropdown title.",
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
                id: "settings.emulateLayoutLabel",
                description: "Checkbox label.",
                defaultMessage: "Emulate layout",
              })}
              title={formatMessage({
                id: "settings.emulateLayoutTitle",
                description: "Checkbox title.",
                defaultMessage:
                  "Emulate the selected layout when the standard layout is set in the system.",
              })}
              onChange={(value) => {
                updateSettings(settings.set(keyboardProps.emulate, value));
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "settings.previewLegend",
          description: "Fieldset legend.",
          defaultMessage: "Preview",
        })}
      >
        <VirtualKeyboard keyboard={keyboard}>
          <KeyLayer depressedKeys={depressedKeys} />
        </VirtualKeyboard>
      </FieldSet>
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
