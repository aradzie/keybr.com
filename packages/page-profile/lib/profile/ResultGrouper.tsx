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
import { Field, FieldList, OptionList, RadioBox } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ResultGrouper({
  children,
}: {
  readonly children: (keyStatsMap: KeyStatsMap) => ReactNode;
}): ReactNode {
  const enum CharClass {
    Letters,
    Digits,
    Punctuators,
    Specials,
  }
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
  const [charClass, setCharClass] = useState(CharClass.Letters);
  if (!resultsLayouts.has(selectedLayout)) {
    setSelectedLayout(defaultLayout());
  }
  const keyboard = loadKeyboard(selectedLayout, { full: false });
  const group = groups.get(selectedLayout);

  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="profile.control.groupSelector.label"
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
          <RadioBox
            name="text-type"
            label={formatMessage({
              id: "characterClass.letters",
              description: "Widget name.",
              defaultMessage: "Letters",
            })}
            checked={charClass === CharClass.Letters}
            onSelect={() => {
              setCharClass(CharClass.Letters);
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="text-type"
            label={formatMessage({
              id: "characterClass.digits",
              description: "Widget name.",
              defaultMessage: "Digits",
            })}
            checked={charClass === CharClass.Digits}
            onSelect={() => {
              setCharClass(CharClass.Digits);
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="text-type"
            label={formatMessage({
              id: "characterClass.punctuationCharacters",
              description: "Widget name.",
              defaultMessage: "Punctuation characters",
            })}
            checked={charClass === CharClass.Punctuators}
            onSelect={() => {
              setCharClass(CharClass.Punctuators);
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="text-type"
            label={formatMessage({
              id: "characterClass.specialCharacters",
              description: "Widget name.",
              defaultMessage: "Special characters",
            })}
            checked={charClass === CharClass.Specials}
            onSelect={() => {
              setCharClass(CharClass.Specials);
            }}
          />
        </Field>
      </FieldList>

      <KeyboardContext.Provider value={keyboard}>
        <PhoneticModelLoader language={selectedLayout.language}>
          {({ letters }) => {
            switch (charClass) {
              case CharClass.Letters:
                return children(
                  newKeyStatsMap(
                    Letter.restrict(letters, keyboard.codePoints()),
                    group,
                  ),
                );
              case CharClass.Digits:
                return children(newKeyStatsMap(Letter.digits, group));
              case CharClass.Punctuators:
                return children(newKeyStatsMap(Letter.punctuators, group));
              case CharClass.Specials:
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
