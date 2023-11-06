import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { CheckBox, Explainer, Field, FieldList } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function DoubleWordsProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.doubleWords.label"
            description="Widget name."
            defaultMessage="Double each word:"
          />
        </Field>
        <Field>
          <CheckBox
            checked={settings.get(lessonProps.doubleWords)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.doubleWords, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        Repeat each word two times. Type a word for the first time to develop
        your muscle memory. Typing the same word for the second time should be
        easier.
      </Explainer>
    </>
  );
}
