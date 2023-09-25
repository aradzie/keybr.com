import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
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
  const layouts = new Set(groups.keys());
  if (layouts.size === 0) {
    layouts.add(settings.layout);
  }
  const defaultLayout = () =>
    layouts.has(settings.layout) ? settings.layout : [...layouts][0];
  const [layout, setLayout] = useState(defaultLayout);
  const [textType, setTextType] = useState("letters");
  if (!layouts.has(layout)) {
    setLayout(defaultLayout());
  }
  const keyboard = loadKeyboard(layout, { full: false });
  const group = groups.get(layout);

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
            options={[...layouts].map((layout) => {
              return {
                value: String(layout),
                name: `${layout.name}`,
              };
            })}
            value={String(layout)}
            onSelect={(value) => {
              setLayout(Layout.ALL.get(value));
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
        <PhoneticModelLoader language={layout.language}>
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
