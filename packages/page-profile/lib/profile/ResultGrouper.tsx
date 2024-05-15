import { useCollator } from "@keybr/intl";
import {
  KeyboardContext,
  keyboardProps,
  Layout,
  loadKeyboard,
  useFormattedNames,
} from "@keybr/keyboard";
import { Letter } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import {
  type KeyStatsMap,
  makeKeyStatsMap,
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
  const layoutOptions = useLayoutOptions(resultsLayouts);
  const keyboard = loadKeyboard(selectedLayout);
  const group = groups.get(selectedLayout);

  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="profile.widget.groupSelector.label"
            defaultMessage="Show statistics for:"
          />
        </Field>
        <Field>
          <OptionList
            options={layoutOptions}
            value={selectedLayout.id}
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
                  defaultMessage: "Letters",
                }),
                value: "letters",
              },
              {
                name: formatMessage({
                  id: "characterClass.digits",
                  defaultMessage: "Digits",
                }),
                value: "digits",
              },
              {
                name: formatMessage({
                  id: "characterClass.punctuationCharacters",
                  defaultMessage: "Punctuation characters",
                }),
                value: "punctuators",
              },
              {
                name: formatMessage({
                  id: "characterClass.specialCharacters",
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
                  makeKeyStatsMap(
                    Letter.restrict(letters, keyboard.getCodePoints()),
                    group,
                  ),
                );
              case "digits":
                return children(makeKeyStatsMap(Letter.digits, group));
              case "punctuators":
                return children(makeKeyStatsMap(Letter.punctuators, group));
              case "specials":
                return children(makeKeyStatsMap(Letter.specials, group));
              default:
                throw new Error();
            }
          }}
        </PhoneticModelLoader>
      </KeyboardContext.Provider>
    </>
  );
}

function useLayoutOptions(layouts: Iterable<Layout>) {
  const { formatFullLayoutName } = useFormattedNames();
  const { compare } = useCollator();
  return [...layouts]
    .map((item) => ({
      value: item.id,
      name: formatFullLayoutName(item),
    }))
    .sort((a, b) => compare(a.name, b.name));
}
