import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { CheckBox, Field, FieldList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function TextManglingProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field>
        <CheckBox
          label={formatMessage({
            id: "settings.enableCapitalLettersLabel",
            description: "Checkbox label.",
            defaultMessage: "Enable capital letters",
          })}
          title={formatMessage({
            id: "settings.enableCapitalLettersTitle",
            description: "Checkbox title.",
            defaultMessage: "Add capital letters to the generated text.",
          })}
          checked={settings.get(lessonProps.capitals)}
          onChange={(value) => {
            updateSettings(settings.set(lessonProps.capitals, value));
          }}
        />
      </Field>
      <Field>
        <CheckBox
          label={formatMessage({
            id: "settings.enablePunctuationLabel",
            description: "Checkbox label.",
            defaultMessage: "Enable punctuation characters",
          })}
          title={formatMessage({
            id: "settings.enablePunctuationTitle",
            description: "Checkbox title.",
            defaultMessage: "Add punctuation characters to the generated text.",
          })}
          checked={settings.get(lessonProps.punctuators)}
          onChange={(value) => {
            updateSettings(settings.set(lessonProps.punctuators, value));
          }}
        />
      </Field>
    </FieldList>
  );
}
