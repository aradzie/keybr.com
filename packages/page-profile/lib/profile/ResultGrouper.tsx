import { KeyboardContext, keyboardProps, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { Letter } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import {
  type KeyStatsMap,
  newKeyStatsMap,
  ResultGroups,
  useResults,
} from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Field, FieldList, OptionList } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ResultGrouper({
  children,
}: {
  readonly children: (keyStatsMap: KeyStatsMap) => ReactNode;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const { results } = useResults();
  const groups = ResultGroups.byLayout(results);
  const resultsLayouts = new Set(groups.keys());
  const configuredLayout = settings.get(keyboardProps.layout);
  if (resultsLayouts.size === 0) {
    resultsLayouts.add(configuredLayout);
  }
  const defaultLayout = () =>
    resultsLayouts.has(configuredLayout)
      ? configuredLayout
      : [...resultsLayouts][0];
  const [selectedLayout, setSelectedLayout] = useState(defaultLayout);
  const [characterClass, setCharacterClass] = useState("letters");
  if (!resultsLayouts.has(selectedLayout)) {
    setSelectedLayout(defaultLayout());
  }
  const keyboard = loadKeyboard(selectedLayout);
  const group = groups.get(selectedLayout);

  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="profile.widget.groupSelector.label"
            description="Widget name."
            defaultMessage="Show statistics for:"
          />
        </Field>
        <Field>
          <OptionList
            options={[...resultsLayouts].map((layout) => {
              return {
                value: String(layout),
                name: `${layout.name}`,
              };
            })}
            value={String(selectedLayout)}
            onSelect={(value) => {
              setSelectedLayout(Layout.ALL.get(value));
            }}
          />
        </Field>
        <Field>
          <OptionList
            options={[
              {
                name: formatMessage({
                  id: "characterClass.letters",
                  description: "Widget name.",
                  defaultMessage: "Letters",
                }),
                value: "letters",
              },
              {
                name: formatMessage({
                  id: "characterClass.digits",
                  description: "Widget name.",
                  defaultMessage: "Digits",
                }),
                value: "digits",
              },
              {
                name: formatMessage({
                  id: "characterClass.punctuationCharacters",
                  description: "Widget name.",
                  defaultMessage: "Punctuation characters",
                }),
                value: "punctuators",
              },
              {
                name: formatMessage({
                  id: "characterClass.specialCharacters",
                  description: "Widget name.",
                  defaultMessage: "Special characters",
                }),
                value: "specials",
              },
            ]}
            value={characterClass}
            onSelect={(value) => {
              setCharacterClass(value);
            }}
          />
        </Field>
      </FieldList>

      <KeyboardContext.Provider value={keyboard}>
        <PhoneticModelLoader language={selectedLayout.language}>
          {({ letters }) => {
            switch (characterClass) {
              case "letters":
                return children(
                  newKeyStatsMap(
                    Letter.restrict(letters, keyboard.codePoints()),
                    group,
                  ),
                );
              case "digits":
                return children(newKeyStatsMap(Letter.digits, group));
              case "punctuators":
                return children(newKeyStatsMap(Letter.punctuators, group));
              case "specials":
                return children(newKeyStatsMap(Letter.specials, group));
              default:
                throw new Error();
            }
          }}
        </PhoneticModelLoader>
      </KeyboardContext.Provider>
    </>
  );
}
