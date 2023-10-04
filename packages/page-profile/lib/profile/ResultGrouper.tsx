import { KeyboardContext, keyboardProps, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { Letter } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import {
  digitsOnly,
  type KeyStatsMap,
  lettersOnly,
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
  const [textType, setTextType] = useState("letters");
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
            id="profile.control.groupSelectorLabel"
            description="List label."
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
              id: "textType.letters",
              description: "Label.",
              defaultMessage: "Letters",
            })}
            checked={textType === "letters"}
            onSelect={() => {
              setTextType("letters");
            }}
          />
        </Field>
        <Field>
          <RadioBox
            name="text-type"
            label={formatMessage({
              id: "textType.digits",
              description: "Label.",
              defaultMessage: "Digits",
            })}
            checked={textType === "digits"}
            onSelect={() => {
              setTextType("digits");
            }}
          />
        </Field>
      </FieldList>

      <KeyboardContext.Provider value={keyboard}>
        <PhoneticModelLoader language={selectedLayout.language}>
          {({ letters }) => {
            switch (textType) {
              case "letters":
                return children(
                  newKeyStatsMap(
                    Letter.restrict(letters, keyboard.codePoints()),
                    lettersOnly(group),
                  ),
                );
              case "digits":
                return children(
                  newKeyStatsMap(Letter.digits, digitsOnly(group)),
                );
              default:
                throw new Error();
            }
          }}
        </PhoneticModelLoader>
      </KeyboardContext.Provider>
    </>
  );
}
